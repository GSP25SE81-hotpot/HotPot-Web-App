/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

class SocketIOService {
  private socket: Socket | null = null;
  private callbacks: Record<string, (...args: any[]) => void> = {};

  // Initialize and connect to Socket.IO server
  public connect(
    serverUrl: string = "https://chat-server-4l1g.onrender.com"
  ): void {
    if (this.socket) {
      return; // Already connected
    }
    this.socket = io(serverUrl);
    this.socket.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    this.socket.on("error", (error: any) => {
      console.error("Socket.IO error:", error);
    });
    // Set up event listeners
    this.setupEventListeners();
  }

  // Authenticate user with Socket.IO server
  public authenticate(userId: number, role: string): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }
    this.socket.emit("authenticate", { userId, role });
  }

  // Set up event listeners for incoming Socket.IO events
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Chat accepted (for managers to know when another manager accepts a chat)
    this.socket.on("chatAccepted", (data: any) => {
      if (this.callbacks["onChatAccepted"]) {
        this.callbacks["onChatAccepted"](data);
      }
    });

    // Receive message
    this.socket.on("receiveMessage", (data: any) => {
      if (this.callbacks["onReceiveMessage"]) {
        this.callbacks["onReceiveMessage"](data);
      }
    });

    // Message read
    this.socket.on("messageRead", (messageId: number) => {
      if (this.callbacks["onMessageRead"]) {
        this.callbacks["onMessageRead"](messageId);
      }
    });

    // Chat ended
    this.socket.on("chatEnded", (sessionId: number) => {
      if (this.callbacks["onChatEnded"]) {
        this.callbacks["onChatEnded"](sessionId);
      }
    });
  }

  // Register callback for Socket.IO events
  public on(event: string, callback: (...args: any[]) => void): void {
    this.callbacks[event] = callback;
  }

  // Accept a chat (manager)
  public acceptChat(
    sessionId: number,
    managerId: number,
    managerName: string,
    customerId: number
  ): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }
    this.socket.emit("acceptChat", {
      sessionId,
      managerId,
      managerName,
      customerId,
    });
  }

  // Send a message
  public sendMessage(
    messageId: number,
    senderId: number,
    receiverId: number,
    message: string
  ): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }
    this.socket.emit("sendMessage", {
      messageId,
      senderId,
      receiverId,
      message,
      createdAt: new Date().toISOString(),
    });
  }

  // Mark a message as read
  public markMessageAsRead(messageId: number, senderId: number): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }
    this.socket.emit("markMessageRead", {
      messageId,
      senderId,
    });
  }

  // End a chat session
  public endChat(
    sessionId: number,
    customerId: number,
    managerId?: number | null
  ): void {
    if (!this.socket) {
      console.error("Socket not connected. Call connect() first.");
      return;
    }
    this.socket.emit("endChat", {
      sessionId,
      customerId,
      managerId,
    });
  }

  // Disconnect from Socket.IO server
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.callbacks = {};
    }
  }
}

// Create a singleton instance
const socketService = new SocketIOService();
export default socketService;
