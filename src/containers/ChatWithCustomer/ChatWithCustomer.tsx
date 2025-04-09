/* eslint-disable react-hooks/exhaustive-deps */
// src/components/Chat/ChatWithCustomer.tsx
import { Box, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import chatRealTimeService from "../../api/Services/chatRealTimeService";
import { StyledPaper } from "../../components/manager/styles/ChatStyles";
import useAuth from "../../hooks/useAuth";
import { useChatRealTime } from "../../hooks/useChatRealTime";

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
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Initialize chat real-time service
  const {
    isConnected,
    loading,
    chatSessions,
    getSessionMessages,
    sendMessage,
    markMessageAsRead,
    endChatSession,
    loadSessionMessages,
    acceptChat,
    refreshSessions,
  } = useChatRealTime(user?.id);

  // Add a reconnect function
  const handleReconnect = useCallback(async () => {
    setError(null);
    try {
      const token = auth.accessToken;
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        return;
      }
      await chatRealTimeService.disconnect();
      await chatRealTimeService.initializeConnection(token);
      await refreshSessions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reconnect to chat service"
      );
    }
  }, [refreshSessions, auth.accessToken]);

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
      if (selectedChatId && selectedChat) {
        sendMessage(user?.id, selectedChat.customerId, message, selectedChatId)
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
          if (success) {
            setSelectedChatId(null);
          } else {
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
        // Use acceptChat instead of assignManagerToSession
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
