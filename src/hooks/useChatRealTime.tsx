// src/hooks/useChatRealTime.ts
import { useState, useEffect, useCallback } from "react";
import chatRealTimeService from "../api/Services/chatRealTimeService";
import { ChatMessageDto, ChatSessionDto } from "../types/chat";

export const useChatRealTime = (userId: number, userType: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<Map<number, ChatMessageDto[]>>(
    new Map()
  );
  const [typingStatus, setTypingStatus] = useState<Map<number, boolean>>(
    new Map()
  );
  const [chatSessions, setChatSessions] = useState<ChatSessionDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize connection
  // In useChatRealTime.tsx
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

        console.log(
          `Attempting to connect to chat hub as ${userType} with ID ${userId}`
        );
        await chatRealTimeService.initializeConnection(userId, userType);
        setIsConnected(true);
        setError(null);

        // Load active sessions
        const response = await chatRealTimeService.getActiveSessions();
        if (response.success && response.data) {
          setChatSessions(response.data);
        }
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect to chat service")
        );
        setLoading(false);
      }
    };

    // Only connect if userId is valid
    if (userId && !isNaN(userId)) {
      connect();
    } else {
      setError(new Error("Invalid user ID. Please provide a valid user ID."));
      setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      chatRealTimeService.disconnect();
    };
  }, [userId, userType]);

  // Register message handler
  useEffect(() => {
    const handleNewMessage = (message: ChatMessageDto) => {
      setMessages((prevMessages) => {
        // Find the session ID for this message
        const sessionId = chatSessions.find(
          (session) =>
            session.customerId === message.senderUserId ||
            session.customerId === message.receiverUserId
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

  // Register typing indicator handler
  useEffect(() => {
    const handleTypingIndicator = (sessionId: number, isTyping: boolean) => {
      setTypingStatus((prev) => {
        const newStatus = new Map(prev);
        newStatus.set(sessionId, isTyping);
        return newStatus;
      });
    };

    chatRealTimeService.onTypingIndicator(handleTypingIndicator);

    return () => {
      chatRealTimeService.offTypingIndicator(handleTypingIndicator);
    };
  }, []);

  // Register status change handler
  useEffect(() => {
    const handleStatusChange = (status: string, sessionId: number) => {
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
              ? { ...session, isActive: true }
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
        const messageData = response.data; // Create a local variable that TypeScript knows won't change
        setMessages((prev) => {
          const newMessages = new Map(prev);
          newMessages.set(sessionId, messageData);
          return newMessages;
        });
      }

      setLoading(false);
    } catch (err) {
      console.error("Error loading session messages:", err);
      setLoading(false);
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
  const markMessageAsRead = useCallback(async (messageId: number) => {
    try {
      await chatRealTimeService.markMessageAsReadRealTime(messageId);

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
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    async (sessionId: number, isTyping: boolean) => {
      try {
        await chatRealTimeService.sendTypingIndicator(sessionId, isTyping);
        return true;
      } catch (err) {
        console.error("Error sending typing indicator:", err);
        return false;
      }
    },
    []
  );

  // End chat session
  const endChatSession = useCallback(async (sessionId: number) => {
    try {
      const response = await chatRealTimeService.endChatSessionRealTime(
        sessionId
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
  }, []);

  // Assign manager to session
  const assignManagerToSession = useCallback(
    async (sessionId: number, managerId: number) => {
      try {
        const response = await chatRealTimeService.assignManagerToSession(
          sessionId,
          managerId
        );

        if (response.success && response.data) {
          // Create a local variable to help TypeScript understand the flow
          const sessionData = response.data;

          // Update session in local state
          setChatSessions((prev) =>
            prev.map((session) =>
              session.chatSessionId === sessionId ? sessionData : session
            )
          );

          return true;
        }

        return false;
      } catch (err) {
        console.error("Error assigning manager to session:", err);
        return false;
      }
    },
    []
  );

  // Get messages for a session
  const getSessionMessages = useCallback(
    (sessionId: number) => {
      return messages.get(sessionId) || [];
    },
    [messages]
  );

  // Check if user is typing in a session
  const isUserTyping = useCallback(
    (sessionId: number) => {
      return typingStatus.get(sessionId) || false;
    },
    [typingStatus]
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
    isUserTyping,
    sendMessage,
    markMessageAsRead,
    sendTypingIndicator,
    endChatSession,
    assignManagerToSession,
    loadSessionMessages,
    refreshSessions,
  };
};
