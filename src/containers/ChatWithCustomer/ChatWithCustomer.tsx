/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Chat/ChatWithCustomer.tsx
import React, { useCallback, useEffect, useState, useRef } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import chatService from "../../api/Services/chatService";
import { ChatMessageDto, ChatSessionDto } from "../../types/chat";
// Import components
import ChatHeader from "./ChatHeader/ChatHeader";
import ChatInput from "./ChatInput/ChatInput";
import ChatList from "./ChatList/ChatList";
import MessageList from "./ChatMessage/MessageList";

const ChatWithCustomer: React.FC = () => {
  const { auth } = useAuth();
  const user = auth.user;

  // Refs for tracking state
  const reconnecting = useRef(false);
  const initialized = useRef(false);
  const loadingSessionsRef = useRef(false);

  // State
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSessionDto[]>([]);
  const [messages, setMessages] = useState<Record<number, ChatMessageDto[]>>(
    {}
  );
  const [unreadChats, setUnreadChats] = useState<Set<number>>(new Set());

  // Get the selected chat
  const selectedChat = chatSessions.find(
    (chat) => chat.chatSessionId === selectedChatId
  );
  const selectedChatMessages = selectedChatId
    ? messages[selectedChatId] || []
    : [];

  // Load chat sessions with debounce protection
  const loadChatSessions = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (loadingSessionsRef.current) return false;

    loadingSessionsRef.current = true;
    try {
      // Get active sessions
      const response = await chatService.getUserSessions(true);
      if (response.success && response.data) {
        setChatSessions(response.data);
      }

      // Get unassigned sessions
      const unassignedResponse = await chatService.getUnassignedSessions();
      if (unassignedResponse.success && unassignedResponse.data) {
        setChatSessions((prev) => {
          const existingIds = new Set(prev.map((s) => s.chatSessionId));
          const newSessions = unassignedResponse.data!.filter(
            (s) => !existingIds.has(s.chatSessionId)
          );
          return [...prev, ...newSessions];
        });
      }

      loadingSessionsRef.current = false;
      return true;
    } catch (err) {
      console.error("Không thể tải danh sách cuộc trò chuyện:", err);
      setError("Không thể tải danh sách cuộc trò chuyện");
      loadingSessionsRef.current = false;
      return false;
    }
  }, []);

  // Load messages for a specific chat session
  const loadMessagesForSession = useCallback(
    async (sessionId: number) => {
      // Skip if we already have messages for this session
      if (messages[sessionId] && messages[sessionId].length > 0) return;

      try {
        const msgResponse = await chatService.getSessionMessages(sessionId);
        if (msgResponse.success && msgResponse.data) {
          setMessages((prev) => ({
            ...prev,
            [sessionId]: msgResponse.data || [],
          }));
        }
      } catch (err) {
        console.error(
          `Không thể tải tin nhắn cho cuộc trò chuyện ${sessionId}:`,
          err
        );
      }
    },
    [messages]
  );

  // Handle chat selection
  const handleSelectChat = useCallback(
    (chatId: number) => {
      setSelectedChatId(chatId);

      // Load messages for this chat if needed
      loadMessagesForSession(chatId);

      // Remove from unread chats
      setUnreadChats((prev) => {
        const newSet = new Set(prev);
        newSet.delete(chatId);
        return newSet;
      });
    },
    [loadMessagesForSession]
  );

  // Send a message
  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!selectedChatId || !message.trim()) return;

      // Create a temporary message
      const tempId = -Date.now();
      const tempMessage: ChatMessageDto = {
        chatMessageId: tempId,
        chatSessionId: selectedChatId,
        senderUserId: user?.id || 0,
        senderName: user?.name || "Bạn",
        receiverUserId: selectedChat?.customerId || 0,
        receiverName: selectedChat?.customerName || "Khách hàng",
        message: message,
        createdAt: new Date().toISOString(),
        isBroadcast: false,
      };

      // Add to UI immediately
      setMessages((prev) => ({
        ...prev,
        [selectedChatId]: [...(prev[selectedChatId] || []), tempMessage],
      }));

      try {
        // Send to server
        const response = await chatService.sendMessage(selectedChatId, message);
        if (response.success && response.data) {
          // Replace temp message with real one
          setMessages((prev) => {
            const currentMessages = prev[selectedChatId] || [];
            return {
              ...prev,
              [selectedChatId]: currentMessages.map((msg) =>
                msg.chatMessageId === tempId ? response.data! : msg
              ),
            };
          });
        }
      } catch (error) {
        console.error("Gửi tin nhắn thất bại:", error);
        // Mark message as failed
        setMessages((prev) => {
          const currentMessages = prev[selectedChatId] || [];
          return {
            ...prev,
            [selectedChatId]: currentMessages.map((msg) =>
              msg.chatMessageId === tempId ? { ...msg, failed: true } : msg
            ),
          };
        });
      }
    },
    [selectedChatId, selectedChat, user]
  );

  // Join a chat as manager
  const handleJoinChat = useCallback(
    async (sessionId: number) => {
      try {
        const response = await chatService.joinChatSession(sessionId);
        if (response.success && response.data) {
          // Update the chat in our list
          setChatSessions((prev) =>
            prev.map((chat) =>
              chat.chatSessionId === sessionId
                ? {
                    ...chat,
                    managerId: user?.id,
                    managerName: user?.name || "Bạn",
                  }
                : chat
            )
          );
          return true;
        }
        return false;
      } catch (error) {
        console.error("Tham gia cuộc trò chuyện thất bại:", error);
        return false;
      }
    },
    [user]
  );

  // End a chat session
  const handleEndChat = useCallback(async () => {
    if (!selectedChatId) return;

    try {
      const response = await chatService.endChatSession(selectedChatId);
      if (response.success) {
        // Update the chat in our list
        setChatSessions((prev) =>
          prev.map((chat) =>
            chat.chatSessionId === selectedChatId
              ? { ...chat, isActive: false }
              : chat
          )
        );
        // Clear selection
        setSelectedChatId(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Kết thúc cuộc trò chuyện thất bại:", error);
      return false;
    }
  }, [selectedChatId]);

  // SignalR event handlers - memoized with minimal dependencies
  const handleNewChat = useCallback((data: any) => {
    console.log("Nhận cuộc trò chuyện mới:", data);

    // Add to our list if it's not already there
    setChatSessions((prev) => {
      if (prev.some((chat) => chat.chatSessionId === data.chatSessionId)) {
        return prev;
      }

      const newChat = {
        chatSessionId: data.chatSessionId,
        customerId: data.customerId,
        customerName: data.customerName,
        isActive: true,
        topic: data.topic,
        createdAt: new Date().toISOString(),
      };

      return [...prev, newChat];
    });

    // Mark as unread
    setUnreadChats((prev) => {
      const newSet = new Set(prev);
      newSet.add(data.chatSessionId);
      return newSet;
    });
  }, []);

  const handleNewMessage = useCallback(
    (data: any) => {
      console.log("Nhận tin nhắn mới:", data);

      const sessionId = data.sessionId;

      // Add to our messages
      setMessages((prev) => {
        const currentMessages = prev[sessionId] || [];

        // Skip if we already have this message
        if (
          currentMessages.some((msg) => msg.chatMessageId === data.messageId)
        ) {
          return prev;
        }

        // Create message object
        const newMessage: ChatMessageDto = {
          chatMessageId: data.messageId,
          chatSessionId: sessionId,
          senderUserId: data.senderId,
          senderName: data.senderName || "Không xác định",
          receiverUserId: data.receiverId || 0,
          receiverName: data.receiverName || "Quản lý",
          message: data.content,
          createdAt: data.timestamp || new Date().toISOString(),
          isBroadcast: data.isBroadcast || false,
        };

        return {
          ...prev,
          [sessionId]: [...currentMessages, newMessage],
        };
      });

      // Mark as unread if it's not the currently selected chat
      setUnreadChats((prev) => {
        if (sessionId === selectedChatId) return prev;

        const newSet = new Set(prev);
        newSet.add(sessionId);
        return newSet;
      });
    },
    [selectedChatId]
  );

  const handleChatAccepted = useCallback((data: any) => {
    console.log("Cuộc trò chuyện được chấp nhận:", data);

    // Update the chat in our list
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.chatSessionId === data.chatSessionId
          ? {
              ...chat,
              managerId: data.managerId,
              managerName: data.managerName,
            }
          : chat
      )
    );
  }, []);

  const handleChatEnded = useCallback((data: any) => {
    console.log("Cuộc trò chuyện kết thúc:", data);

    // Update the chat in our list
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.chatSessionId === data.sessionId
          ? { ...chat, isActive: false }
          : chat
      )
    );

    // Clear selection if it was the selected chat
    setSelectedChatId((current) =>
      current === data.sessionId ? null : current
    );
  }, []);

  // Load messages for selected chat
  useEffect(() => {
    if (selectedChatId) {
      loadMessagesForSession(selectedChatId);
    }
  }, [selectedChatId, loadMessagesForSession]);

  // Register SignalR event handlers - only once
  useEffect(() => {
    // Set up event handlers
    chatService.onNewChat(handleNewChat);
    chatService.onNewMessage(handleNewMessage);
    chatService.onChatAccepted(handleChatAccepted);
    chatService.onChatEnded(handleChatEnded);
    chatService.onNewBroadcastMessage(handleNewMessage);

    // Clean up event handlers on unmount
    return () => {
      chatService.off("newChatSession");
      chatService.off("newMessage");
      chatService.off("chatAccepted");
      chatService.off("chatEnded");
      chatService.off("newBroadcastMessage");
    };
  }, [handleNewChat, handleNewMessage, handleChatAccepted, handleChatEnded]);

  // Initialize chat service - only once
  useEffect(() => {
    const initChat = async () => {
      if (initialized.current) return;

      setLoading(true);
      try {
        if (user?.id) {
          initialized.current = true;

          // Connect to SignalR
          const connected = await chatService.initialize(user.id, "Manager");
          setIsConnected(connected);

          if (connected) {
            // Load initial data
            await loadChatSessions();
          } else {
            setError("Không thể kết nối đến dịch vụ trò chuyện");
          }
        }
      } catch (err) {
        setError("Không thể khởi tạo dịch vụ trò chuyện");
        console.error(err);
      }
      setLoading(false);
    };

    // Initialize only once
    initChat();

    // Connection check interval with proper cooldown
    const intervalId = setInterval(() => {
      const connected = chatService.isSocketConnected();
      setIsConnected(connected);

      // Only try to reconnect if we're not already trying and user is logged in
      if (!connected && user?.id && !reconnecting.current) {
        reconnecting.current = true;
        console.log("Attempting to reconnect...");

        chatService.initialize(user.id, "Manager").then((success) => {
          reconnecting.current = false;
          if (success) {
            console.log("Đã kết nối lại thành công");
            // Reload data after reconnection
            loadChatSessions();
          }
        });
      }
    }, 15000); // Check every 15 seconds instead of 5

    // Proper cleanup
    return () => {
      clearInterval(intervalId);
      chatService.disconnect();
      initialized.current = false;
    };
  }, [user?.id, loadChatSessions]);

  // Trạng thái đang tải
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Đang tải cuộc trò chuyện...</Typography>
      </Box>
    );
  }

  // Trạng thái lỗi
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        width: "80vw",
        height: "80vh",
        display: "flex",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Danh sách trò chuyện */}
      <Box sx={{ width: 280, borderRight: "1px solid rgba(0, 0, 0, 0.12)" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}>
          <Typography variant="h6">Cuộc trò chuyện</Typography>
        </Box>
        <ChatList
          chats={chatSessions}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          unreadChats={unreadChats}
        />
        <Box
          sx={{
            p: 1,
            borderTop: "1px solid rgba(0, 0, 0, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            color={isConnected ? "success.main" : "error.main"}
          >
            {isConnected ? "Đã kết nối" : "Mất kết nối"}
          </Typography>
          <Typography variant="caption">
            {chatSessions.length} cuộc trò chuyện
          </Typography>
        </Box>
      </Box>

      {/* Khu vực trò chuyện */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            <ChatHeader
              chat={selectedChat}
              onEndChat={handleEndChat}
              onJoinChat={() => handleJoinChat(selectedChat.chatSessionId)}
              isManager={Number(selectedChat.managerId) === Number(user?.id)}
              canJoin={!selectedChat.managerId && selectedChat.isActive}
            />
            <MessageList
              messages={selectedChatMessages}
              currentUserId={user?.id}
            />
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={
                !selectedChat.isActive ||
                !selectedChat.managerId ||
                Number(selectedChat.managerId) !== Number(user?.id)
              }
            />
            {(!selectedChat.isActive ||
              !selectedChat.managerId ||
              Number(selectedChat.managerId) !== Number(user?.id)) && (
              <Box sx={{ p: 1, bgcolor: "background.paper" }}>
                <Typography
                  variant="caption"
                  color="error"
                  align="center"
                  sx={{ display: "block" }}
                >
                  {!selectedChat.isActive
                    ? "Cuộc trò chuyện này đã kết thúc."
                    : !selectedChat.managerId
                    ? "Bạn cần tham gia cuộc trò chuyện này trước khi gửi tin nhắn."
                    : "Bạn không phải là người quản lý được phân công cho cuộc trò chuyện này."}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              p: 3,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Chọn một cuộc trò chuyện để bắt đầu
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Chọn một cuộc trò chuyện từ danh sách bên trái để xem và trả lời
              tin nhắn.
              {unreadChats.size > 0 && (
                <Box
                  component="span"
                  sx={{
                    display: "block",
                    mt: 1,
                    fontWeight: "bold",
                    color: "warning.main",
                  }}
                >
                  Bạn có {unreadChats.size} cuộc trò chuyện chưa đọc.
                </Box>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default React.memo(ChatWithCustomer);
