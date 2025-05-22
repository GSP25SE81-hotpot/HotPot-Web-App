/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

class SocketIOService {
  private socket: Socket | null = null;
  private callbacks: Record<string, (...args: any[]) => void> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // Initialize and connect to Socket.IO server
  public connect(
    serverUrl: string = "https://chat-server-production-9950.up.railway.app/"
  ): void {
    if (this.socket) {
      return; // Already connected
    }

    console.log(`Attempting to connect to Socket.IO server at ${serverUrl}`);

    // Configure Socket.IO with settings that match the server
    this.socket = io(serverUrl, {
      transports: ["websocket"], // Match server's transport setting
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 10000,
      withCredentials: true, // Enable credentials for CORS
    });

    // Listen for connection events
    this.socket.on("connection", () => {
      console.log("Connected to Socket.IO server with ID:", this.socket?.id);
      this.reconnectAttempts = 0;

      // Send heartbeat periodically
      setInterval(() => {
        if (this.socket?.connected) {
          this.socket.emit("heartbeat");
        }
      }, 20000); // Every 20 seconds
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`Disconnected from Socket.IO server: ${reason}`);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error(
          `Failed to connect after ${this.maxReconnectAttempts} attempts. Stopping reconnection.`
        );
        this.socket?.disconnect();
      }
    });

    this.socket.on("error", (error: any) => {
      console.error("Socket.IO error:", error);
    });

    // Set up event listeners
    this.setupEventListeners();
  }

  // Authenticate user with Socket.IO server - call immediately after connection
  public authenticate(userId: number, role: string): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }

    console.log(`Authenticating user ${userId} with role ${role}`);

    // Send authentication data
    this.socket.emit("authenticate", {
      userId: userId.toString(), // Convert to string to match server expectations
      role,
    });
  }

  // Set up event listeners for incoming Socket.IO events
  private setupEventListeners(): void {
    if (!this.socket) return;

    // New chat request from customer
    this.socket.on("newChat", (data: any) => {
      console.log("Received newChat event:", data);
      if (this.callbacks["onNewChat"]) {
        this.callbacks["onNewChat"](data);
      }
    });

    // Chat accepted event
    this.socket.on("chatAccepted", (data: any) => {
      console.log("Received chatAccepted event:", data);
      if (this.callbacks["onChatAccepted"]) {
        this.callbacks["onChatAccepted"](data);
      }
    });

    // New message received
    this.socket.on("newMessage", (data: any) => {
      console.log("Received newMessage event:", data);
      if (this.callbacks["onNewMessage"]) {
        this.callbacks["onNewMessage"](data);
      }
    });

    // Chat ended
    this.socket.on("chatEnded", (data: any) => {
      console.log("Received chatEnded event:", data);
      if (this.callbacks["onChatEnded"]) {
        this.callbacks["onChatEnded"](data);
      }
    });
  }

  // Register callback for Socket.IO events
  public on(event: string, callback: (...args: any[]) => void): void {
    this.callbacks[event] = callback;
  }

  // Check if socket is connected
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Join a chat as manager
  public joinChat(
    sessionId: number,
    managerId: number,
    managerName: string,
    customerId: number
  ): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }

    console.log(`Joining chat ${sessionId} as manager ${managerId}`);
    this.socket.emit("chatAccepted", {
      sessionId,
      managerId: managerId.toString(), // Convert to string to match server expectations
      managerName,
      customerId: customerId.toString(), // Convert to string to match server expectations
    });
  }

  // Send a message
  public sendMessage(
    messageId: number,
    senderId: number,
    receiverId: number,
    content: string
  ): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }

    console.log(
      `Sending message from ${senderId} to ${receiverId}: ${content}`
    );
    this.socket.emit("newMessage", {
      messageId,
      senderId: senderId.toString(), // Convert to string to match server expectations
      receiverId: receiverId.toString(), // Convert to string to match server expectations
      content,
      timestamp: new Date().toISOString(),
    });
  }

  // End a chat session
  public endChat(
    sessionId: number,
    customerId: number,
    managerId: number
  ): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }

    console.log(`Ending chat ${sessionId}`);
    this.socket.emit("chatEnded", {
      sessionId,
      customerId: customerId.toString(), // Convert to string to match server expectations
      managerId: managerId.toString(), // Convert to string to match server expectations
    });
  }

  // Force reconnect
  public reconnect(): void {
    this.disconnect();
    setTimeout(() => {
      this.connect();
    }, 1000);
  }

  // Disconnect from Socket.IO server
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.callbacks = {};
      this.reconnectAttempts = 0;
    }
  }
}

// Create a singleton instance
const socketService = new SocketIOService();
export default socketService;
