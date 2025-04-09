// src/hooks/useChatRealTime.ts
import { useState, useEffect, useCallback } from "react";
import chatRealTimeService from "../api/Services/chatRealTimeService";
import { ChatMessageDto, ChatSessionDto } from "../types/chat";
import useAuth from "./useAuth";

export const useChatRealTime = (userId: number) => {
  const { auth } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<Map<number, ChatMessageDto[]>>(
    new Map()
  );
  const [chatSessions, setChatSessions] = useState<ChatSessionDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize connection
  useEffect(() => {
    const connect = async () => {
      try {
        setLoading(true);
        // Add validation for userId
        if (!userId || isNaN(userId)) {
          setError(
            new Error("Invalid user ID. Please provide a valid user ID.")
          );
          setLoading(false);
          return;
        }

        console.log(`Attempting to connect to chat hub with ID ${userId}`);

        // Get the token from auth
        const token = auth?.accessToken;
        if (!token) {
          setError(
            new Error("Authentication token not found. Please log in again.")
          );
          setLoading(false);
          return;
        }

        await chatRealTimeService.initializeConnection(token);
        setIsConnected(true);
        setError(null);

        console.log("Connection established, loading active sessions...");

        // Load active sessions
        try {
          const response = await chatRealTimeService.getActiveSessions();
          if (response.success && response.data) {
            console.log(`Loaded ${response.data.length} active sessions`);
            setChatSessions(response.data);

            // Log if there are no active sessions
            if (response.data.length === 0) {
              console.log(
                "Connected successfully, but there are no active chat sessions"
              );
            }
          } else {
            console.warn("No active sessions found or failed to load sessions");
          }
        } catch (sessionError) {
          console.error("Error loading active sessions:", sessionError);
        }
        setIsConnected(true);
        setLoading(false);
      } catch (err) {
        console.error("Failed to connect to chat service:", err);
        setIsConnected(false);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect to chat service")
        );
        setLoading(false);
      }
    };

    // Only connect if userId is valid and we have an auth token
    if (userId && !isNaN(userId) && auth?.accessToken) {
      connect();
    } else if (!auth?.accessToken) {
      setError(
        new Error("Authentication token not found. Please log in again.")
      );
      setLoading(false);
    } else if (!userId || isNaN(userId)) {
      setError(new Error("Invalid user ID. Please provide a valid user ID."));
      setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting from chat hub...");
      chatRealTimeService.disconnect();
    };
  }, [userId, auth?.accessToken]);

  // Register message handler
  useEffect(() => {
    const handleNewMessage = (message: ChatMessageDto) => {
      setMessages((prevMessages) => {
        // Find the session ID for this message
        const sessionId = chatSessions.find(
          (session) =>
            (session.customerId === message.senderUserId &&
              session.managerId === message.receiverUserId) ||
            (session.customerId === message.receiverUserId &&
              session.managerId === message.senderUserId)
        )?.chatSessionId;

        if (!sessionId) return prevMessages;

        // Create a new map to trigger re-render
        const newMessages = new Map(prevMessages);

        // Get existing messages for this session or create a new array
        const sessionMessages = newMessages.get(sessionId) || [];

        // Add the new message if it doesn't already exist
        if (
          !sessionMessages.some(
            (m) => m.chatMessageId === message.chatMessageId
          )
        ) {
          newMessages.set(sessionId, [...sessionMessages, message]);
        }

        return newMessages;
      });
    };

    chatRealTimeService.onMessage(handleNewMessage);

    return () => {
      chatRealTimeService.offMessage(handleNewMessage);
    };
  }, [chatSessions]);

  // src/hooks/useChatRealTime.ts (continued)

  // Register status change handler
  useEffect(() => {
    const handleStatusChange = (
      status: string,
      sessionId: number,
      managerId?: number,
      managerName?: string
    ) => {
      if (status === "ended") {
        // Remove ended session
        setChatSessions((prev) =>
          prev.filter((session) => session.chatSessionId !== sessionId)
        );
      } else if (status === "accepted") {
        // Update session status
        setChatSessions((prev) =>
          prev.map((session) =>
            session.chatSessionId === sessionId
              ? {
                  ...session,
                  isActive: true,
                  managerId: managerId || session.managerId,
                  managerName: managerName || session.managerName,
                }
              : session
          )
        );
      }
    };

    chatRealTimeService.onStatusChange(handleStatusChange);

    return () => {
      chatRealTimeService.offStatusChange(handleStatusChange);
    };
  }, []);

  // Register read receipt handler
  useEffect(() => {
    const handleMessageRead = (messageId: number) => {
      setMessages((prev) => {
        const newMessages = new Map(prev);
        // Update all sessions
        for (const [sessionId, sessionMessages] of newMessages.entries()) {
          const updatedMessages = sessionMessages.map((msg) =>
            msg.chatMessageId === messageId ? { ...msg, isRead: true } : msg
          );
          newMessages.set(sessionId, updatedMessages);
        }
        return newMessages;
      });
    };

    chatRealTimeService.onMessageRead(handleMessageRead);

    return () => {
      chatRealTimeService.offMessageRead(handleMessageRead);
    };
  }, []);

  // Load messages for a specific session
  const loadSessionMessages = useCallback(async (sessionId: number) => {
    try {
      setLoading(true);
      const response = await chatRealTimeService.getSessionMessages(sessionId);
      if (response.success && response.data) {
        const messageData = response.data;
        setMessages((prev) => {
          const newMessages = new Map(prev);
          newMessages.set(sessionId, messageData);
          return newMessages;
        });
      }
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error loading session messages:", err);
      setLoading(false);
      return false;
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(
    async (
      senderId: number,
      receiverId: number,
      message: string,
      sessionId: number
    ) => {
      try {
        const response = await chatRealTimeService.sendMessageRealTime(
          senderId,
          receiverId,
          message
        );

        if (response.success && response.data) {
          // Create a local variable to help TypeScript understand the flow
          const messageData = response.data;

          // Update local messages state
          setMessages((prev) => {
            const newMessages = new Map(prev);
            const sessionMessages = newMessages.get(sessionId) || [];
            newMessages.set(sessionId, [...sessionMessages, messageData]);
            return newMessages;
          });

          // Update session's updatedAt timestamp
          setChatSessions((prev) =>
            prev.map((session) =>
              session.chatSessionId === sessionId
                ? { ...session, updatedAt: new Date() }
                : session
            )
          );

          return true;
        }

        return false;
      } catch (err) {
        console.error("Error sending message:", err);
        return false;
      }
    },
    []
  );

  // Mark message as read
  const markMessageAsRead = useCallback(
    async (messageId: number) => {
      try {
        if (!userId) {
          throw new Error("User ID is required to mark a message as read");
        }

        await chatRealTimeService.markMessageAsReadRealTime(messageId, userId);

        // Update local state immediately for better UX
        setMessages((prev) => {
          const newMessages = new Map(prev);
          // Update all sessions
          for (const [sessionId, sessionMessages] of newMessages.entries()) {
            const updatedMessages = sessionMessages.map((msg) =>
              msg.chatMessageId === messageId ? { ...msg, isRead: true } : msg
            );
            newMessages.set(sessionId, updatedMessages);
          }
          return newMessages;
        });

        return true;
      } catch (err) {
        console.error("Error marking message as read:", err);
        return false;
      }
    },
    [userId]
  );

  // End chat session
  const endChatSession = useCallback(
    async (sessionId: number) => {
      try {
        if (!userId) {
          throw new Error("User ID is required to end a chat session");
        }

        const response = await chatRealTimeService.endChatSessionRealTime(
          sessionId,
          userId
        );

        if (response.success) {
          // Remove session from local state
          setChatSessions((prev) =>
            prev.filter((session) => session.chatSessionId !== sessionId)
          );

          return true;
        }

        return false;
      } catch (err) {
        console.error("Error ending chat session:", err);
        return false;
      }
    },
    [userId]
  );

  // Initiate a new chat session
  const initiateChat = useCallback(
    async (topic: string) => {
      try {
        if (!userId) {
          throw new Error("User ID is required to initiate a chat");
        }

        const response = await chatRealTimeService.initiateChatRealTime(
          userId,
          topic
        );

        if (response.success && response.data) {
          // Create a local variable with the correct type
          const newSession: ChatSessionDto = response.data;

          setChatSessions((prev) => [...prev, newSession]);
          return newSession.chatSessionId;
        }

        return null;
      } catch (err) {
        console.error("Error initiating chat:", err);
        return null;
      }
    },
    [userId]
  );

  // Accept a chat as a manager
  // Accept a chat as a manager
  const acceptChat = useCallback(
    async (sessionId: number) => {
      try {
        if (!userId) {
          throw new Error("User ID is required to accept a chat");
        }

        const response = await chatRealTimeService.acceptChatRealTime(
          sessionId,
          userId
        );

        if (response.success && response.data) {
          // Create a local variable with the correct type
          const updatedSession: ChatSessionDto = response.data;

          // Now TypeScript knows updatedSession is definitely a ChatSessionDto
          setChatSessions((prev) =>
            prev.map((session) =>
              session.chatSessionId === sessionId ? updatedSession : session
            )
          );

          return true;
        }

        return false;
      } catch (err) {
        console.error("Error accepting chat:", err);
        return false;
      }
    },
    [userId]
  );

  // Get messages for a session
  const getSessionMessages = useCallback(
    (sessionId: number) => {
      return messages.get(sessionId) || [];
    },
    [messages]
  );

  // Refresh sessions
  const refreshSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await chatRealTimeService.getActiveSessions();
      if (response.success && response.data) {
        setChatSessions(response.data);
      }
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error refreshing sessions:", err);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    isConnected,
    error,
    loading,
    chatSessions,
    getSessionMessages,
    sendMessage,
    markMessageAsRead,
    endChatSession,
    loadSessionMessages,
    refreshSessions,
    initiateChat,
    acceptChat,
  };
};
