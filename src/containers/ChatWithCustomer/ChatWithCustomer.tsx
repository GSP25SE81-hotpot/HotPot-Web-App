/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Chat/ChatWithCustomer.tsx
import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyledPaper } from "../../components/manager/styles/ChatStyles";
import useAuth from "../../hooks/useAuth";
import socketService from "../../api/Services/socketService";
import chatService from "../../api/Services/chatService";
import { ChatMessageDto, ChatSessionDto } from "../../types/chat";

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
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

    // Set up Socket.IO event listeners
    socketService.on("onChatAccepted", handleChatAccepted); // Changed from onChatTaken
    socketService.on("onReceiveMessage", handleReceiveMessage);
    socketService.on("onMessageRead", handleMessageRead);
    socketService.on("onChatEnded", handleChatEnded);

    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, [user?.id]);

  const handleChatAccepted = useCallback(
    (data: any) => {
      // If another manager took the chat, remove it from our list
      if (data.managerId !== user?.id) {
        setChatSessions((prev) =>
          prev.filter((session) => session.chatSessionId !== data.sessionId)
        );
      }
    },
    [user?.id]
  );

  const handleReceiveMessage = useCallback(
    (data: any) => {
      // Add message to the appropriate chat session
      setSessionMessages((prev) => {
        const sessionId = data.chatSessionId || selectedChatId;
        if (!sessionId) return prev;
        const messages = prev[sessionId] || [];
        // Check if we already have this message
        if (messages.some((msg) => msg.chatMessageId === data.messageId)) {
          return prev;
        }
        // Add new message
        const newMessages = [
          ...messages,
          {
            chatMessageId: data.messageId,
            senderUserId: data.senderId,
            senderName: data.senderName || "User",
            receiverUserId: data.receiverId,
            receiverName: data.receiverName || "User",
            message: data.message,
            isRead: false,
            createdAt: new Date(data.createdAt),
          },
        ];
        return {
          ...prev,
          [sessionId]: newMessages,
        };
      });
      // Mark message as read if it's for the selected chat
      if (selectedChatId && data.receiverId === user?.id) {
        markMessageAsRead(data.messageId);
      }
    },
    [selectedChatId, user?.id]
  );

  const handleMessageRead = useCallback((messageId: number) => {
    // Update message read status
    setSessionMessages((prev) => {
      const updated = { ...prev };
      // Find the message in all sessions
      Object.keys(updated).forEach((sessionIdStr) => {
        const sessionId = parseInt(sessionIdStr);
        updated[sessionId] = updated[sessionId].map((msg) =>
          msg.chatMessageId === messageId ? { ...msg, isRead: true } : msg
        );
      });
      return updated;
    });
  }, []);

  const handleChatEnded = useCallback(
    (sessionId: number) => {
      // Update chat session status
      setChatSessions((prev) =>
        prev.map((session) =>
          session.chatSessionId === sessionId
            ? { ...session, isActive: false }
            : session
        )
      );
      // If the ended chat is the selected one, clear selection
      if (selectedChatId === sessionId) {
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
          [sessionId]: response.data || [], // Add fallback to empty array
        }));
      }
      return true;
    } catch (err) {
      console.error(`Failed to load messages for session ${sessionId}:`, err);
      return false;
    }
  }, []);

  const sendMessage = useCallback(
    async (
      senderId: number,
      receiverId: number,
      message: string,
      _sessionId: number
    ) => {
      try {
        const response = await chatService.sendMessage(
          senderId,
          receiverId,
          message
        );
        if (response.success && response.data) {
          // The Socket.IO notification is handled in the chatService
          return true;
        }
        return false;
      } catch (err) {
        console.error("Failed to send message:", err);
        return false;
      }
    },
    []
  );

  const markMessageAsRead = useCallback(
    async (messageId: number) => {
      try {
        // Find the message to get the sender ID
        let senderId = 0;
        Object.values(sessionMessages).forEach((messages) => {
          const message = messages.find((m) => m.chatMessageId === messageId);
          if (message) {
            senderId = message.senderUserId;
          }
        });

        if (senderId) {
          await chatService.markMessageAsRead(messageId, senderId);
        }

        // Update local state
        setSessionMessages((prev) => {
          const updated = { ...prev };

          Object.keys(updated).forEach((sessionIdStr) => {
            const sessionId = parseInt(sessionIdStr);
            updated[sessionId] = updated[sessionId].map((msg) =>
              msg.chatMessageId === messageId ? { ...msg, isRead: true } : msg
            );
          });

          return updated;
        });

        return true;
      } catch (err) {
        console.error("Failed to mark message as read:", err);
        return false;
      }
    },
    [sessionMessages]
  );

  const endChatSession = useCallback(
    async (sessionId: number) => {
      try {
        const session = chatSessions.find((s) => s.chatSessionId === sessionId);
        if (!session) return false;

        const response = await chatService.endChatSession(
          sessionId,
          session.customerId,
          user?.id
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

  const acceptChat = useCallback(
    async (sessionId: number) => {
      try {
        const session = chatSessions.find((s) => s.chatSessionId === sessionId);
        if (!session || !user?.id) return false;

        const response = await chatService.assignManagerToSession(
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
        console.error("Failed to accept chat:", err);
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
      await socketService.disconnect();
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

  // Sort chats by last activity
  const sortedChats = useMemo(
    () =>
      [...chatSessions].sort((a, b) => {
        const dateA = a.updatedAt
          ? new Date(a.updatedAt)
          : new Date(a.createdAt);
        const dateB = b.updatedAt
          ? new Date(b.updatedAt)
          : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      }),
    [chatSessions]
  );

  // Calculate unread counts for each chat
  const unreadCounts = useMemo(() => {
    const counts = new Map<number, number>();
    chatSessions.forEach((session) => {
      const sessionMessages = getSessionMessages(session.chatSessionId);
      const unreadCount = sessionMessages.filter(
        (msg) => !msg.isRead && msg.receiverUserId === user?.id
      ).length;
      counts.set(session.chatSessionId, unreadCount);
    });
    return counts;
  }, [chatSessions, getSessionMessages, user?.id]);

  // Callbacks
  const handleChatSelect = useCallback(
    (chatId: number) => {
      setSelectedChatId(chatId);
      loadSessionMessages(chatId);
      // Mark unread messages as read
      const messages = getSessionMessages(chatId);
      messages.forEach((message) => {
        if (!message.isRead && message.receiverUserId === user?.id) {
          markMessageAsRead(message.chatMessageId);
        }
      });
    },
    [loadSessionMessages, getSessionMessages, markMessageAsRead, user?.id]
  );

  const handleSendMessage = useCallback(
    (message: string) => {
      if (selectedChatId && selectedChat && user?.id) {
        sendMessage(user.id, selectedChat.customerId, message, selectedChatId)
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

  const handleAssignManager = useCallback(
    (managerId: number) => {
      if (selectedChatId && managerId === user?.id) {
        acceptChat(selectedChatId)
          .then((success) => {
            if (!success) {
              setError("Failed to assign manager");
            }
          })
          .catch((err) => {
            setError("Failed to assign manager");
            console.error(err);
          });
      }
    },
    [selectedChatId, acceptChat, user?.id]
  );

  // Effects
  // Mark messages as read when they are viewed
  useEffect(() => {
    if (selectedChatId) {
      chatMessages.forEach((message) => {
        if (!message.isRead && message.receiverUserId === user?.id) {
          markMessageAsRead(message.chatMessageId);
        }
      });
    }
  }, [selectedChatId, chatMessages, markMessageAsRead, user?.id]);

  // Clean up typing indicator timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

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
          unreadCounts={unreadCounts}
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
              onAssignManager={handleAssignManager}
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
      <Box sx={{ position: "absolute", bottom: 10, right: 10 }}>
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
