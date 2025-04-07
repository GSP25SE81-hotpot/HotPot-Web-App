// src/services/hubConnectionService.ts
import signalRService from "./signalrService";

// Singleton hub connections with proper typing
const hubConnections: {
  chatHub: boolean | null;
  notificationHub: boolean | null;
} = {
  chatHub: null,
  notificationHub: null,
};

export const ensureHubConnection = async (hubUrl: string): Promise<void> => {
  const hubKey = hubUrl.replace("/", "") as keyof typeof hubConnections;

  if (!hubConnections[hubKey]) {
    await signalRService.startConnection(hubUrl);
    await signalRService.registerUserConnection(hubUrl);
    hubConnections[hubKey] = true;
  }
};

export const disconnectHubs = async (): Promise<void> => {
  await signalRService.stopAllConnections();
  Object.keys(hubConnections).forEach((key) => {
    hubConnections[key as keyof typeof hubConnections] = null;
  });
};
