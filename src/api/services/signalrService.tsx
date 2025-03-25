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
  private getOrCreateHubConnection(hubUrl: string): signalR.HubConnection {
    if (!this.hubConnections.has(hubUrl)) {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect(this.reconnectPolicy)
        .configureLogging(signalR.LogLevel.Information)
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
        // Remove from our maps when closed
        this.hubConnections.delete(hubUrl);
        this.connectionPromises.delete(hubUrl);
      });

      this.hubConnections.set(hubUrl, connection);
    }

    return this.hubConnections.get(hubUrl)!;
  }

  /**
   * Start a connection to a hub
   * @param hubUrl The URL of the hub to connect to
   * @returns A promise that resolves when the connection is established
   */
  public async startConnection(hubUrl: string): Promise<void> {
    // If we already have a connection promise for this hub, return it
    if (this.connectionPromises.has(hubUrl)) {
      return this.connectionPromises.get(hubUrl)!;
    }

    const connection = this.getOrCreateHubConnection(hubUrl);

    // Create a new connection promise
    const connectionPromise = connection
      .start()
      .then(() => {
        console.log(`Connected to hub: ${hubUrl}`);
      })
      .catch((err) => {
        console.error(`Error connecting to hub ${hubUrl}:`, err);
        this.connectionPromises.delete(hubUrl);
        throw err;
      });

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
  private async ensureConnection(hubUrl: string): Promise<void> {
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
  public async registerUserConnection(
    hubUrl: string,
    userId: number,
    userType: string
  ): Promise<void> {
    await this.ensureConnection(hubUrl);
    await this.invoke(hubUrl, "RegisterConnection", userId, userType);
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
