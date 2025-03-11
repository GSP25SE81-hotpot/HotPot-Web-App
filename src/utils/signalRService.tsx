import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startSignalRConnection = async (token: string) => {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/equipmentHub", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("SignalR Connected");
    return connection;
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
    throw err;
  }
};

export const stopSignalRConnection = async () => {
  if (connection) {
    await connection.stop();
    connection = null;
    console.log("SignalR Disconnected");
  }
};

export const getSignalRConnection = () => {
  return connection;
};
