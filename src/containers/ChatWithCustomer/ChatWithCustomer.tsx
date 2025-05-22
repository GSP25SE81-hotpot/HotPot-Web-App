/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Chat/ChatWithCustomer.tsx
import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyledPaper } from "../../components/manager/styles/ChatStyles";
import useAuth from "../../hooks/useAuth";
import socketService from "../../api/Services/socketService";
import chatService from "../../api/Services/chatService";
import {
  ChatMessageDto,
  ChatSessionDto,
  NewChatEvent,
  NewMessageEvent,
} from "../../types/chat";

// Import extracted components
import ChatHeader from "./ChatHeader/ChatHeader";
import ChatInput from "./ChatInput/ChatInput";
import ChatList from "./ChatList/ChatList";
import MessageList from "./ChatMessage/MessageList";
import ConnectionStatus from "./Services/ConnectionStatus";
import DebugPanel from "./Services/DebugPanel";
import EmptyChatState from "./Services/EmptyChatState";

const ChatWithCustomer: React.FC = () => {
  const { auth } = useAuth();
  const user = auth.user;
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSessionDto[]>([]);
  const [sessionMessages, setSessionMessages] = useState<
    Record<number, ChatMessageDto[]>
  >({});

  // Initialize Socket.IO connection
  useEffect(() => {
    const initializeSocketConnection = async () => {
      try {
        setLoading(true);
        // Connect to Socket.IO server
        socketService.connect();

        // Authenticate with Socket.IO
        if (user?.id) {
          socketService.authenticate(user.id, "Manager");
          setIsConnected(true);
        }

        // Load active chat sessions
        await refreshSessions();
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to chat service"
        );
        setLoading(false);
      }
    };

    initializeSocketConnection();

    // Set up Socket.IO event listeners with the CORRECT event names
    chatService.onNewChat(handleNewChat);
    chatService.onNewMessage(handleNewMessage);
    chatService.onChatEnded(handleChatEnded);

    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, [user?.id]);

  // Handle new chat request
  const handleNewChat = useCallback((data: NewChatEvent) => {
    // Add new chat to the list
    setChatSessions((prev) => {
      // Check if we already have this chat
      if (prev.some((chat) => chat.chatSessionId === data.sessionId)) {
        return prev;
      }

      // Add new chat
      return [
        ...prev,
        {
          chatSessionId: data.sessionId,
          customerId: data.customerId,
          customerName: data.customerName,
          isActive: true,
          topic: data.topic,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  // Handle new message
  // Handle new message
  const handleNewMessage = useCallback(
    (data: NewMessageEvent) => {
      // We need to determine which session this message belongs to
      // Since we don't have sessionId in the event, we'll need to find it based on sender/receiver

      // Find the chat session this message belongs to
      const relevantSession = chatSessions.find(
        (session) =>
          (session.customerId === data.senderId ||
            session.customerId === data.receiverId) &&
          (session.managerId === data.senderId ||
            session.managerId === data.receiverId)
      );

      if (!relevantSession) {
        console.warn("Received message for unknown session", data);
        return;
      }

      const sessionId = relevantSession.chatSessionId;

      // Add message to the appropriate chat session
      setSessionMessages((prev) => {
        const messages = prev[sessionId] || [];

        // Check if we already have this message
        if (messages.some((msg) => msg.chatMessageId === data.messageId)) {
          return prev;
        }

        // Find sender and receiver names from our session data
        let senderName = "Unknown";
        let receiverName = "Unknown";

        if (data.senderId === relevantSession.customerId) {
          senderName = relevantSession.customerName || "Customer";
          receiverName = relevantSession.managerName || "Manager";
        } else {
          senderName = relevantSession.managerName || "Manager";
          receiverName = relevantSession.customerName || "Customer";
        }

        // Add new message
        const newMessages = [
          ...messages,
          {
            chatMessageId: data.messageId,
            senderUserId: data.senderId,
            senderName: senderName,
            receiverUserId: data.receiverId,
            receiverName: receiverName,
            message: data.content,
            createdAt: data.timestamp || new Date().toISOString(),
          },
        ];

        return {
          ...prev,
          [sessionId]: newMessages,
        };
      });
    },
    [chatSessions]
  );

  // Handle chat ended
  const handleChatEnded = useCallback(
    (data: any) => {
      console.log("Chat ended event received:", data);

      // Update chat session status
      setChatSessions((prev) => {
        console.log("Updating chat sessions after chat ended");
        return prev.map((session) => {
          if (session.chatSessionId === data.sessionId) {
            console.log(`Marking session ${data.sessionId} as inactive`);
            return { ...session, isActive: false };
          }
          return session;
        });
      });

      // If the ended chat is the selected one, clear selection
      if (selectedChatId === data.sessionId) {
        console.log(`Clearing selected chat ${data.sessionId}`);
        setSelectedChatId(null);
      }
    },
    [selectedChatId]
  );

  // API functions
  const refreshSessions = useCallback(async () => {
    try {
      const response = await chatService.getActiveSessions();
      if (response.success && response.data) {
        setChatSessions(response.data);

        // Load messages for each session
        response.data.forEach((session) => {
          loadSessionMessages(session.chatSessionId);
        });
      }
      return true;
    } catch (err) {
      console.error("Failed to refresh sessions:", err);
      setError("Failed to load chat sessions");
      return false;
    }
  }, []);

  const loadSessionMessages = useCallback(async (sessionId: number) => {
    try {
      const response = await chatService.getSessionMessages(sessionId);
      if (response.success && response.data) {
        setSessionMessages((prev) => ({
          ...prev,
          [sessionId]: response.data || [],
        }));
      }
      return true;
    } catch (err) {
      console.error(`Failed to load messages for session ${sessionId}:`, err);
      return false;
    }
  }, []);

  const sendMessage = useCallback(
    async (senderId: number, receiverId: number, message: string) => {
      try {
        const response = await chatService.sendMessage(
          senderId,
          receiverId,
          message
        );

        return response.success;
      } catch (err) {
        console.error("Failed to send message:", err);
        return false;
      }
    },
    []
  );

  const endChatSession = useCallback(
    async (sessionId: number) => {
      try {
        const session = chatSessions.find((s) => s.chatSessionId === sessionId);
        if (!session) return false;

        const response = await chatService.endChatSession(
          sessionId,
          session.customerId,
          user?.id || 0
        );

        if (response.success) {
          // Update local state
          setChatSessions((prev) =>
            prev.map((s) =>
              s.chatSessionId === sessionId ? { ...s, isActive: false } : s
            )
          );

          // Clear selection if this was the selected chat
          if (selectedChatId === sessionId) {
            setSelectedChatId(null);
          }
          return true;
        }
        return false;
      } catch (err) {
        console.error("Failed to end chat session:", err);
        return false;
      }
    },
    [chatSessions, selectedChatId, user?.id]
  );

  const joinChat = useCallback(
    async (sessionId: number) => {
      try {
        const session = chatSessions.find((s) => s.chatSessionId === sessionId);
        if (!session || !user?.id) return false;

        const response = await chatService.joinChatSession(
          sessionId,
          user.id,
          user.name || "Manager",
          session.customerId
        );

        if (response.success && response.data) {
          // Update local state
          setChatSessions((prev) =>
            prev.map((s) =>
              s.chatSessionId === sessionId
                ? {
                    ...s,
                    managerId: user.id,
                    managerName: user.name || "Manager",
                  }
                : s
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error("Failed to join chat:", err);
        return false;
      }
    },
    [chatSessions, user]
  );

  // Helper functions
  const getSessionMessages = useCallback(
    (sessionId: number) => {
      return sessionMessages[sessionId] || [];
    },
    [sessionMessages]
  );

  // Reconnect function
  const handleReconnect = useCallback(async () => {
    setError(null);
    try {
      socketService.disconnect();
      socketService.connect();
      if (user?.id) {
        socketService.authenticate(user.id, "Manager");
        setIsConnected(true);
      }
      await refreshSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reconnect to chat service"
      );
    }
  }, [refreshSessions, user?.id]);

  // Memoized values
  const selectedChat = useMemo(
    () => chatSessions.find((c) => c.chatSessionId === selectedChatId),
    [chatSessions, selectedChatId]
  );

  const chatMessages = useMemo(
    () => (selectedChatId ? getSessionMessages(selectedChatId) : []),
    [selectedChatId, getSessionMessages]
  );

  // Sort chats by creation time (since updatedAt is removed)
  const sortedChats = useMemo(
    () =>
      [...chatSessions].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      }),
    [chatSessions]
  );

  // Callbacks
  const handleChatSelect = useCallback(
    (chatId: number) => {
      setSelectedChatId(chatId);
      loadSessionMessages(chatId);
    },
    [loadSessionMessages]
  );

  const handleSendMessage = useCallback(
    (message: string) => {
      if (selectedChatId && selectedChat && user?.id) {
        sendMessage(user.id, selectedChat.customerId, message)
          .then((success) => {
            if (!success) {
              setError("Failed to send message");
            }
          })
          .catch((err) => {
            setError("Failed to send message");
            console.error(err);
          });
      }
    },
    [selectedChatId, selectedChat, sendMessage, user?.id]
  );

  const handleEndChat = useCallback(() => {
    if (selectedChatId) {
      endChatSession(selectedChatId)
        .then((success) => {
          if (!success) {
            setError("Failed to end chat session");
          }
        })
        .catch((err) => {
          setError("Failed to end chat session");
          console.error(err);
        });
    }
  }, [selectedChatId, endChatSession]);

  const handleJoinChat = useCallback(
    (managerId: number) => {
      if (selectedChatId && managerId === user?.id) {
        joinChat(selectedChatId)
          .then((success) => {
            if (!success) {
              setError("Failed to join chat");
            }
          })
          .catch((err) => {
            setError("Failed to join chat");
            console.error(err);
          });
      }
    },
    [selectedChatId, joinChat, user?.id]
  );

  // Loading and error states
  if (loading && chatSessions.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Đang tải cuộc trò chuyện...</Typography>
      </Box>
    );
  }

  if (error && chatSessions.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <StyledPaper
      elevation={3}
      sx={{
        width: "80vw",
        height: "80vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar */}
      <Box sx={{ display: "flex", flexDirection: "column", width: 280 }}>
        <ChatList
          chatSessions={sortedChats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
        />
        <ConnectionStatus
          isConnected={isConnected}
          chatSessionsCount={chatSessions.length}
          onReconnect={handleReconnect}
        />
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <ChatHeader
              selectedChat={selectedChat}
              onEndChat={handleEndChat}
              onJoinChat={handleJoinChat}
              currentUserId={user?.id}
            />
            <MessageList messages={chatMessages} loading={loading} />
            <ChatInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <EmptyChatState />
        )}
      </Box>

      {/* Debug Panel */}
      {showDebug && (
        <DebugPanel
          isConnected={isConnected}
          userId={user?.id}
          chatSessionsCount={chatSessions.length}
          selectedChatId={selectedChatId}
          error={error}
          accessToken={auth.accessToken}
          onClose={() => setShowDebug(false)}
        />
      )}

      {/* Debug Toggle Button */}
      <Box sx={{ position: "absolute", bottom: 25, right: 10 }}>
        <IconButton
          size="small"
          onClick={() => setShowDebug(!showDebug)}
          sx={{ opacity: 0.3, "&:hover": { opacity: 1 } }}
        >
          <span role="img" aria-label="debug">
            🐞
          </span>
        </IconButton>
      </Box>
    </StyledPaper>
  );
};

export default React.memo(ChatWithCustomer);
