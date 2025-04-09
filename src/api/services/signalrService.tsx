// src/services/signalrService.ts
import * as signalR from "@microsoft/signalr";

// Define more specific callback types
export type HubCallback = (...args: unknown[]) => void;

class SignalRService {
  private hubConnections: Map<string, signalR.HubConnection> = new Map();
  private connectionPromises: Map<string, Promise<void>> = new Map();
  private reconnectPolicy = {
    nextRetryDelayInMilliseconds: (retryContext: signalR.RetryContext) => {
      // Implement exponential backoff with a max of 30 seconds
      const delay = Math.min(
        30000,
        1000 * Math.pow(2, retryContext.previousRetryCount)
      );
      return delay;
    },
  };
  /**
   * Get or create a hub connection
   * @param hubUrl The URL of the hub to connect to
   * @returns The hub connection
   */
  private getOrCreateHubConnection(
    hubUrl: string,
    token?: string
  ): signalR.HubConnection {
    if (!this.hubConnections.has(hubUrl)) {
      const apiBaseUrl = "https://hpty.vinhuser.one"; // Update with your API base URL
      // https://hpty.vinhuser.one
      // https://localhost:7163
      // Get the JWT token from the parameter or try to get it from localStorage
      const authToken = token || this.getAuthToken();

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${apiBaseUrl}${hubUrl}`, {
          accessTokenFactory: () => authToken || "",
        })
        .withAutomaticReconnect(this.reconnectPolicy)
        .configureLogging(signalR.LogLevel.Debug) // Keep Debug for troubleshooting
        .build();

      // Set up connection state change handlers
      connection.onreconnecting((error) => {
        console.log(`Connection to ${hubUrl} lost. Reconnecting...`, error);
      });

      connection.onreconnected((connectionId) => {
        console.log(
          `Connection to ${hubUrl} reestablished. ConnectionId: ${connectionId}`
        );
      });

      connection.onclose((error) => {
        console.log(`Connection to ${hubUrl} closed.`, error);
        // Log more details about the error
        if (error) {
          console.error("Connection closed due to error:", error);
        }
        // Remove from our maps when closed
        this.hubConnections.delete(hubUrl);
        this.connectionPromises.delete(hubUrl);
      });

      this.hubConnections.set(hubUrl, connection);
    }
    return this.hubConnections.get(hubUrl)!;
  }

  /**
   * Get the authentication token from localStorage
   * @returns The authentication token or null if not found
   */
  private getAuthToken(): string | null {
    try {
      // Try to get the token from userInfor in localStorage
      const userInfor = localStorage.getItem("userInfor");
      console.log("userInfor from localStorage:", userInfor);
      if (userInfor) {
        const parsedUserInfo = JSON.parse(userInfor);
        return parsedUserInfo.accessToken || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  /**
   * Start a connection to a hub
   * @param hubUrl The URL of the hub to connect to
   * @returns A promise that resolves when the connection is established
   */
  public async startConnection(hubUrl: string, token?: string): Promise<void> {
    // If we already have a promise for this connection, return it
    if (this.connectionPromises.has(hubUrl)) {
      return this.connectionPromises.get(hubUrl)!;
    }

    // Create a new promise for this connection
    const connectionPromise = new Promise<void>((resolve, reject) => {
      const connection = this.getOrCreateHubConnection(hubUrl, token);

      // If the connection is already connected, resolve immediately
      if (connection.state === signalR.HubConnectionState.Connected) {
        resolve();
        return;
      }

      // Start the connection
      connection
        .start()
        .then(() => {
          console.log(`Connected to ${hubUrl}`);
          resolve();
        })
        .catch((error) => {
          console.error(`Error connecting to ${hubUrl}:`, error);
          reject(error);
        });
    });

    // Store the promise so we can reuse it
    this.connectionPromises.set(hubUrl, connectionPromise);

    return connectionPromise;
  }

  /**
   * Stop a connection to a hub
   * @param hubUrl The URL of the hub to disconnect from
   */
  public async stopConnection(hubUrl: string): Promise<void> {
    if (this.hubConnections.has(hubUrl)) {
      const connection = this.hubConnections.get(hubUrl)!;
      await connection.stop();
      this.hubConnections.delete(hubUrl);
      this.connectionPromises.delete(hubUrl);
      console.log(`Disconnected from hub: ${hubUrl}`);
    }
  }

  /**
   * Stop all hub connections
   */
  public async stopAllConnections(): Promise<void> {
    const stopPromises = Array.from(this.hubConnections.entries()).map(
      async ([hubUrl, connection]) => {
        await connection.stop();
        console.log(`Disconnected from hub: ${hubUrl}`);
      }
    );

    await Promise.all(stopPromises);
    this.hubConnections.clear();
    this.connectionPromises.clear();
  }

  /**
   * Register a callback for a hub method with proper typing
   * @param hubUrl The URL of the hub
   * @param methodName The name of the method to listen for
   * @param callback The callback to invoke when the method is called
   */
  public on(hubUrl: string, methodName: string, callback: HubCallback): void {
    const connection = this.getOrCreateHubConnection(hubUrl);
    connection.on(methodName, (...args: unknown[]) => callback(...args));
  }

  /**
   * Remove a callback for a hub method
   * @param hubUrl The URL of the hub
   * @param methodName The name of the method
   * @param callback The callback to remove (optional - if not provided, all callbacks for the method are removed)
   */
  public off(hubUrl: string, methodName: string, callback?: HubCallback): void {
    if (this.hubConnections.has(hubUrl)) {
      const connection = this.hubConnections.get(hubUrl)!;
      if (callback) {
        connection.off(methodName, callback);
      } else {
        connection.off(methodName);
      }
    }
  }

  /**
   * Invoke a hub method
   * @param hubUrl The URL of the hub
   * @param methodName The name of the method to invoke
   * @param args The arguments to pass to the method
   * @returns A promise that resolves when the method completes
   */
  public async invoke(
    hubUrl: string,
    methodName: string,
    ...args: unknown[]
  ): Promise<void> {
    await this.ensureConnection(hubUrl);
    const connection = this.hubConnections.get(hubUrl)!;
    await connection.invoke(methodName, ...args);
  }

  /**
   * Invoke a hub method and get a result
   * @param hubUrl The URL of the hub
   * @param methodName The name of the method to invoke
   * @param args The arguments to pass to the method
   * @returns A promise that resolves with the result of the method
   */
  public async invokeWithResult<T>(
    hubUrl: string,
    methodName: string,
    ...args: unknown[]
  ): Promise<T> {
    await this.ensureConnection(hubUrl);
    const connection = this.hubConnections.get(hubUrl)!;
    return await connection.invoke<T>(methodName, ...args);
  }

  /**
   * Send a message to a hub method (fire and forget)
   * @param hubUrl The URL of the hub
   * @param methodName The name of the method to invoke
   * @param args The arguments to pass to the method
   */
  public async send(
    hubUrl: string,
    methodName: string,
    ...args: unknown[]
  ): Promise<void> {
    await this.ensureConnection(hubUrl);
    const connection = this.hubConnections.get(hubUrl)!;
    await connection.send(methodName, ...args);
  }

  /**
   * Ensure a connection to a hub is established
   * @param hubUrl The URL of the hub
   */
  public async ensureConnection(hubUrl: string): Promise<void> {
    if (
      !this.hubConnections.has(hubUrl) ||
      this.hubConnections.get(hubUrl)!.state !==
        signalR.HubConnectionState.Connected
    ) {
      await this.startConnection(hubUrl);
    }
  }

  /**
   * Register a user connection with a hub
   * @param hubUrl The URL of the hub
   * @param userId The user ID
   * @param userType The user type (e.g., 'manager', 'admin', 'customer')
   */
  public async registerConnection(
    hubUrl: string,
    userId: number,
    userType: string
  ): Promise<void> {
    await this.ensureConnection(hubUrl);

    try {
      if (
        hubUrl.includes("EquipmentCondition") ||
        hubUrl.includes("EquipmentStock")
      ) {
        if (userType.toLowerCase() === "admin") {
          await this.invoke(hubUrl, "RegisterAdminConnection", userId);
        }
      } else if (hubUrl.includes("Notification")) {
        await this.invoke(hubUrl, "JoinRoleGroup", userType);
        await this.invoke(hubUrl, "JoinUserSpecificGroup", userId.toString());
      } else {
        // For hubs that don't need registration, don't call anything
        console.log(`No registration needed for ${hubUrl}`);
      }
    } catch (error) {
      console.warn(`Registration for ${hubUrl} failed:`, error);
    }
  }

  /**
   * Get the connection state for a hub
   * @param hubUrl The URL of the hub
   * @returns The connection state
   */
  public getConnectionState(hubUrl: string): signalR.HubConnectionState {
    if (!this.hubConnections.has(hubUrl)) {
      return signalR.HubConnectionState.Disconnected;
    }
    return this.hubConnections.get(hubUrl)!.state;
  }
}

// Create a singleton instance
const signalRService = new SignalRService();
export default signalRService;
