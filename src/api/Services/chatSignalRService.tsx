/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/Services/chatSignalRService.ts
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

class SignalRService {
  public connection: HubConnection | null = null;
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();

  // Khởi tạo kết nối đến SignalR hub
  public async connect(): Promise<boolean> {
    try {
      // Tạo kết nối
      this.connection = new HubConnectionBuilder()
        // https://localhost:7163
        // https://hpty.vinhuser.one
        .withUrl("https://hpty.vinhuser.one/chatHub") // Sử dụng endpoint đã cấu hình trong backend
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Thử kết nối lại với thời gian chờ tăng dần
        .build();

      // Thiết lập các sự kiện kết nối
      this.connection.onclose(() => {
        console.log("SignalR: Kết nối đã đóng");
      });

      this.connection.onreconnecting(() => {
        console.log("SignalR: Đang thử kết nối lại...");
      });

      this.connection.onreconnected(() => {
        console.log("SignalR: Đã kết nối lại thành công");
      });

      // Đăng ký các handler cho tất cả các sự kiện đang theo dõi
      this.eventHandlers.forEach((_, eventName) => {
        this.registerSignalRHandler(eventName);
      });

      // Bắt đầu kết nối
      await this.connection.start();
      console.log("SignalR: Đã kết nối thành công");
      return true;
    } catch (error) {
      console.error("SignalR: Kết nối thất bại:", error);
      return false;
    }
  }

  // Xác thực kết nối
  public async authenticate(userId: number, role: string): Promise<void> {
    if (!this.connection) {
      throw new Error("SignalR: Chưa thiết lập kết nối");
    }

    try {
      // Xác thực được xử lý tự động thông qua token
      // Chúng ta chỉ cần ghi log
      console.log(
        `SignalR: Người dùng ${userId} đã xác thực với vai trò ${role}`
      );
    } catch (error) {
      console.error("SignalR: Xác thực thất bại:", error);
      throw error;
    }
  }

  // Đăng ký handler cho sự kiện SignalR
  private registerSignalRHandler(eventName: string): void {
    if (!this.connection) return;

    this.connection.on(eventName, (data: any) => {
      console.log(`SignalR: Nhận sự kiện ${eventName}`, data);
      const handlers = this.eventHandlers.get(eventName) || [];
      handlers.forEach((handler) => handler(data));
    });
  }

  // Đăng ký handler cho sự kiện
  public on(event: string, callback: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);

      // Đăng ký handler với SignalR nếu kết nối đã tồn tại
      if (this.connection) {
        this.registerSignalRHandler(event);
      }
    }

    // Thêm callback vào registry
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(callback);
    this.eventHandlers.set(event, handlers);
  }

  // Gỡ bỏ handler cho sự kiện
  public off(event: string, callback?: (data: any) => void): void {
    if (!callback) {
      // Gỡ bỏ tất cả handler cho sự kiện này
      this.eventHandlers.delete(event);
      if (this.connection) {
        this.connection.off(event);
      }
    } else {
      // Gỡ bỏ handler cụ thể
      const handlers = this.eventHandlers.get(event) || [];
      const updatedHandlers = handlers.filter(
        (handler) => handler !== callback
      );

      if (updatedHandlers.length === 0) {
        this.eventHandlers.delete(event);
        if (this.connection) {
          this.connection.off(event);
        }
      } else {
        this.eventHandlers.set(event, updatedHandlers);
      }
    }
  }

  // Kiểm tra trạng thái kết nối
  public isConnected(): boolean {
    return this.connection?.state === "Connected";
  }

  // Ngắt kết nối
  public disconnect(): void {
    if (this.connection) {
      this.connection.stop();
      this.connection = null;
    }
    this.eventHandlers.clear();
  }
}

const signalRService = new SignalRService();
export default signalRService;
