// chat-service.js
import * as signalR from "@microsoft/signalr";

export class ChatRealTimeService {
  constructor() {
    this.connection = null;
    this.userId = null;
    this.userRole = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = new Map();
  }

  async initialize(userId, userRole, baseUrl = "") {
    this.userId = userId;
    this.userRole = userRole;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}/chathub`, {
        accessTokenFactory: () => localStorage.getItem("auth_token"),
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) // Retry with increasing delays
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up connection event handlers
    this.connection.onreconnecting((error) => {
      console.log(`Connection lost. Attempting to reconnect: ${error}`);
      this.triggerEvent("connectionStateChanged", {
        state: "reconnecting",
        error,
      });
    });

    this.connection.onreconnected((connectionId) => {
      console.log(`Connection reestablished. ConnectionId: ${connectionId}`);
      this.triggerEvent("connectionStateChanged", {
        state: "connected",
        connectionId,
      });

      // Re-register user and rejoin groups after reconnection
      this.registerUser(this.userId, this.userRole);

      // Rejoin any active chat sessions
      const activeSessionId = localStorage.getItem("active_chat_session");
      if (activeSessionId) {
        this.joinChatSession(activeSessionId);
      }
    });

    this.connection.onclose((error) => {
      console.log(`Connection closed: ${error}`);
      this.triggerEvent("connectionStateChanged", {
        state: "disconnected",
        error,
      });
    });

    // Set up message handlers
    this.setupMessageHandlers();

    // Start the connection
    await this.start();
  }

  async start() {
    try {
      await this.connection.start();
      console.log("SignalR Connected.");
      this.reconnectAttempts = 0;
      this.triggerEvent("connectionStateChanged", { state: "connected" });

      // Register user after successful connection
      if (this.userId && this.userRole) {
        await this.registerUser(this.userId, this.userRole);
      }
    } catch (err) {
      console.error("SignalR Connection Error: ", err);
      this.reconnectAttempts++;

      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        const delay = Math.min(
          1000 * Math.pow(2, this.reconnectAttempts),
          30000
        );
        console.log(
          `Retrying connection in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
        );
        setTimeout(() => this.start(), delay);
      } else {
        console.error(
          "Maximum reconnection attempts reached. Please refresh the page."
        );
        this.triggerEvent("connectionStateChanged", {
          state: "failed",
          error: "Maximum reconnection attempts reached",
        });
      }
    }
  }

  setupMessageHandlers() {
    // New chat request (for managers)
    this.connection.on("ReceiveNewChatRequest", (session) => {
      this.triggerEvent("newChatRequest", session);
    });

    // Chat accepted (for customers)
    this.connection.on("ReceiveChatAccepted", (sessionInfo) => {
      this.triggerEvent("chatAccepted", sessionInfo);
    });

    // New message
    this.connection.on("ReceiveMessage", (message) => {
      this.triggerEvent("messageReceived", message);
    });

    // Message read confirmation
    this.connection.on(
      "ReceiveMessageReadConfirmation",
      (messageId, readerUserId) => {
        this.triggerEvent("messageRead", { messageId, readerUserId });
      }
    );

    // Chat ended
    this.connection.on(
      "ReceiveChatEnded",
      (sessionId, customerId, managerId) => {
        this.triggerEvent("chatEnded", { sessionId, customerId, managerId });
      }
    );

    // User joined session
    this.connection.on("UserJoinedSession", (sessionId, userName, userRole) => {
      this.triggerEvent("userJoinedSession", { sessionId, userName, userRole });
    });

    // User typing
    this.connection.on("UserTyping", (sessionId, userId, userName) => {
      this.triggerEvent("userTyping", { sessionId, userId, userName });
    });
  }

  // Register event listeners
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Remove event listener
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Trigger event
  triggerEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event handler:`, error);
        }
      });
    }
  }

  // Hub methods
  async registerUser(userId, userRole) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke(
          "RegisterUser",
          userId.toString(),
          userRole
        );
        console.log(`User registered: ${userId} (${userRole})`);
      } catch (error) {
        console.error("Error registering user:", error);
        throw error;
      }
    } else {
      console.warn("Cannot register user: connection not established");
    }
  }

  async joinChatSession(sessionId) {
    if (!sessionId) return;

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        const userName = localStorage.getItem("user_name") || "User";
        await this.connection.invoke(
          "JoinChatSessionGroup",
          sessionId,
          userName,
          this.userRole
        );
        console.log(`Joined chat session: ${sessionId}`);
        localStorage.setItem("active_chat_session", sessionId);
      } catch (error) {
        console.error("Error joining chat session:", error);
        throw error;
      }
    } else {
      console.warn("Cannot join chat session: connection not established");
    }
  }

  async leaveChatSession(sessionId) {
    if (!sessionId) return;

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("LeaveChatSessionGroup", sessionId);
        console.log(`Left chat session: ${sessionId}`);
        localStorage.removeItem("active_chat_session");
      } catch (error) {
        console.error("Error leaving chat session:", error);
        throw error;
      }
    }
  }

  async sendTypingIndicator(sessionId) {
    if (!sessionId) return;

    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        const userName = localStorage.getItem("user_name") || "User";
        await this.connection.invoke(
          "SendTypingIndicator",
          sessionId,
          this.userId,
          userName
        );
      } catch (error) {
        console.error("Error sending typing indicator:", error);
        // Non-critical error, don't throw
      }
    }
  }

  // Cleanup
  async disconnect() {
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log("SignalR Disconnected.");
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }
  }
}
