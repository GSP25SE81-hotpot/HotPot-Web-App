/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

class SocketIOService {
  private socket: Socket | null = null;
  private callbacks: Record<string, (...args: any[]) => void> = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;
  private connectionPromise: Promise<boolean> | null = null;

  // Initialize and connect to Socket.IO server
  public connect(
    serverUrl: string = "https://chat-server-production-9950.up.railway.app/"
  ): Promise<boolean> {
    // Return existing promise if already connecting
    if (this.isConnecting && this.connectionPromise) {
      return this.connectionPromise;
    }

    // Return true if already connected
    if (this.socket?.connected) {
      return Promise.resolve(true);
    }

    this.isConnecting = true;
    console.log(`Attempting to connect to Socket.IO server at ${serverUrl}`);

    // Create new connection promise
    this.connectionPromise = new Promise<boolean>((resolve, reject) => {
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
      this.socket.on("connect", () => {
        console.log("Connected to Socket.IO server with ID:", this.socket?.id);
        this.reconnectAttempts = 0;
        this.isConnecting = false;

        // Set up event listeners after successful connection
        this.setupEventListeners();

        // Send heartbeat periodically
        setInterval(() => {
          if (this.socket?.connected) {
            this.socket.emit("heartbeat");
          }
        }, 20000); // Every 20 seconds

        resolve(true);
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
          this.isConnecting = false;
          reject(
            new Error(
              `Failed to connect after ${this.maxReconnectAttempts} attempts`
            )
          );
        }
      });

      this.socket.on("error", (error: any) => {
        console.error("Socket.IO error:", error);
      });

      // Set a connection timeout
      setTimeout(() => {
        if (this.isConnecting) {
          this.isConnecting = false;
          reject(new Error("Connection timeout after 10 seconds"));
        }
      }, 10000);
    });

    return this.connectionPromise;
  }

  // Authenticate user with Socket.IO server - call immediately after connection
  public async authenticate(userId: number, role: string): Promise<void> {
    // Make sure we're connected first
    if (!this.socket?.connected) {
      await this.connect();
    }

    console.log(`Authenticating user ${userId} with role ${role}`);

    // Send authentication data
    this.socket?.emit("authenticate", {
      userId: userId.toString(), // Convert to string to match server expectations
      role,
    });
  }

  // Set up event listeners for incoming Socket.IO events
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Clear any existing listeners to prevent duplicates
    this.socket.off("newChat");
    this.socket.off("chatAccepted");
    this.socket.off("newMessage");
    this.socket.off("chatEnded");

    // New chat request from customer
    this.socket.on("newChat", (data: any) => {
      console.log("Received newChat event:", data);
      if (this.callbacks["newChat"]) {
        this.callbacks["newChat"](data);
      }
    });

    // Chat accepted event
    this.socket.on("chatAccepted", (data: any) => {
      console.log("Received chatAccepted event:", data);
      if (this.callbacks["chatAccepted"]) {
        this.callbacks["chatAccepted"](data);
      }
    });

    // New message received
    this.socket.on("newMessage", (data: any) => {
      console.log("Received newMessage event:", data);
      if (this.callbacks["newMessage"]) {
        this.callbacks["newMessage"](data);
      }
    });

    // Chat ended
    this.socket.on("chatEnded", (data: any) => {
      console.log("Received chatEnded event:", data);
      if (this.callbacks["chatEnded"]) {
        this.callbacks["chatEnded"](data);
      }
    });
  }

  // Register callback for Socket.IO events
  public on(event: string, callback: (...args: any[]) => void): void {
    this.callbacks[event] = callback;

    // If we're already connected, make sure the listener is set up
    if (this.socket?.connected) {
      // Re-setup event listeners to ensure this new callback is registered
      this.setupEventListeners();
    }
  }

  // Check if socket is connected
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Join a chat as manager
  public async joinChat(
    sessionId: number,
    managerId: number,
    managerName: string,
    customerId: number
  ): Promise<void> {
    // Make sure we're connected first
    if (!this.socket?.connected) {
      await this.connect();
    }

    console.log(`Joining chat ${sessionId} as manager ${managerId}`);
    this.socket?.emit("chatAccepted", {
      sessionId,
      managerId: managerId.toString(),
      managerName,
      customerId: customerId.toString(),
    });
  }

  // Send a message
  public async sendMessage(
    messageId: number,
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<void> {
    // Make sure we're connected first
    if (!this.socket?.connected) {
      await this.connect();
    }

    console.log(
      `Sending message from ${senderId} to ${receiverId}: ${content}`
    );
    this.socket?.emit("newMessage", {
      messageId,
      senderId: senderId.toString(),
      receiverId: receiverId.toString(),
      content,
      timestamp: new Date().toISOString(),
    });
  }

  // End a chat session
  public async endChat(
    sessionId: number,
    customerId: number,
    managerId: number
  ): Promise<void> {
    // Make sure we're connected first
    if (!this.socket?.connected) {
      await this.connect();
    }

    console.log(`Ending chat ${sessionId}`);
    this.socket?.emit("chatEnded", {
      sessionId,
      customerId: customerId.toString(),
      managerId: managerId.toString(),
    });
  }

  // Force reconnect
  public async reconnect(): Promise<boolean> {
    this.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return this.connect();
  }

  // Disconnect from Socket.IO server
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.callbacks = {};
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.connectionPromise = null;
    }
  }
}

// Create a singleton instance
const socketService = new SocketIOService();
export default socketService;
