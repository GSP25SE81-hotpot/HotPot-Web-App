// src/components/Chat/ChatWithCustomer.tsx
import { MoreVert, Send } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useTheme,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FixedSizeList as VirtualList } from "react-window";
import {
  AnimatedListItem,
  MessageBubble,
  StyledBadge,
  StyledInput,
  StyledPaper,
  TypingIndicator,
} from "../../components/manager/styles/ChatStyles"; // Extract styled components to a separate file
import useAuth from "../../hooks/useAuth";
import { useChatRealTime } from "../../hooks/useChatRealTime";
import { ChatMessageDto, ChatSessionDto } from "../../types/chat";

// Memoized Components
const ChatListItem = React.memo(
  ({
    chat,
    isSelected,
    onClick,
    unreadCount = 0,
  }: {
    chat: ChatSessionDto;
    isSelected: boolean;
    onClick: () => void;
    unreadCount?: number;
  }) => (
    <AnimatedListItem selected={isSelected} onClick={onClick}>
      <ListItemAvatar>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {chat.customerName?.charAt(0) || "C"}
          </Avatar>
        </StyledBadge>
      </ListItemAvatar>
      <ListItemText
        primary={chat.customerName || "Customer"}
        secondary={chat.topic || "No topic"}
        slotProps={{
          secondary: {
            noWrap: true,
            color: "text.secondary",
          },
        }}
      />
      <Box sx={{ textAlign: "right", minWidth: 60 }}>
        {unreadCount > 0 && (
          <Badge badgeContent={unreadCount} color="primary" sx={{ mb: 1 }} />
        )}
        <Typography variant="caption" color="text.secondary">
          {chat.updatedAt
            ? new Date(chat.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : new Date(chat.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
        </Typography>
      </Box>
    </AnimatedListItem>
  )
);

const MessageItem = React.memo(({ message }: { message: ChatMessageDto }) => {
  const { auth } = useAuth();
  const user = auth.user;
  const isStaff = message.senderUserId === user?.uid;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isStaff ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <MessageBubble isStaff={isStaff}>
        <Typography variant="body2">{message.message}</Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: isStaff ? "common.white" : "text.primary",
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {isStaff && (
            <Box
              component="span"
              sx={{ ml: 0.5, display: "flex", alignItems: "center" }}
            >
              {message.isRead ? (
                <span style={{ color: "#44b700" }}>✓✓</span>
              ) : (
                "✓"
              )}
            </Box>
          )}
        </Box>
      </MessageBubble>
    </Box>
  );
});

// Main Component
const ChatWithCustomer: React.FC = () => {
  const theme = useTheme();
  const { auth } = useAuth();
  const user = auth.user;
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat real-time service
  const {
    isConnected,
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
  } = useChatRealTime(user?.uid, "manager");

  // Memoized values
  const selectedChat = useMemo(
    () => chatSessions.find((c) => c.chatSessionId === selectedChatId),
    [chatSessions, selectedChatId]
  );

  const chatMessages = useMemo(
    () => (selectedChatId ? getSessionMessages(selectedChatId) : []),
    [selectedChatId, getSessionMessages]
  );

  const isTyping = useMemo(
    () => (selectedChatId ? isUserTyping(selectedChatId) : false),
    [selectedChatId, isUserTyping]
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
        (msg) => !msg.isRead && msg.receiverUserId === user?.uid
      ).length;

      counts.set(session.chatSessionId, unreadCount);
    });

    return counts;
  }, [chatSessions, getSessionMessages, user?.uid]);

  // Callbacks
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleChatSelect = useCallback(
    (chatId: number) => {
      setSelectedChatId(chatId);
      loadSessionMessages(chatId);

      // Mark unread messages as read
      const messages = getSessionMessages(chatId);
      messages.forEach((message) => {
        if (!message.isRead && message.receiverUserId === user?.uid) {
          markMessageAsRead(message.chatMessageId);
        }
      });
    },
    [loadSessionMessages, getSessionMessages, markMessageAsRead, user?.uid]
  );

  const handleSend = useCallback(() => {
    if (input.trim() && selectedChatId && selectedChat) {
      sendMessage(user?.uid, selectedChat.customerId, input, selectedChatId)
        .then((success) => {
          if (success) {
            setInput("");
          } else {
            setError("Failed to send message");
          }
        })
        .catch((err) => {
          setError("Failed to send message");
          console.error(err);
        });
    }
  }, [input, selectedChatId, selectedChat, sendMessage, user?.uid]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value);

      // Send typing indicator
      if (selectedChatId) {
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Send typing indicator
        sendTypingIndicator(selectedChatId, true);

        // Set timeout to stop typing indicator after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          sendTypingIndicator(selectedChatId, false);
        }, 3000);
      }
    },
    [selectedChatId, sendTypingIndicator]
  );

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleEndChat = useCallback(() => {
    if (selectedChatId) {
      endChatSession(selectedChatId)
        .then((success) => {
          if (success) {
            setSelectedChatId(null);
            handleMenuClose();
          } else {
            setError("Failed to end chat session");
          }
        })
        .catch((err) => {
          setError("Failed to end chat session");
          console.error(err);
        });
    }
  }, [selectedChatId, endChatSession, handleMenuClose]);

  // src/components/Chat/ChatWithCustomer.tsx (continued)
  const handleAssignManager = useCallback(
    (managerId: number) => {
      if (selectedChatId) {
        assignManagerToSession(selectedChatId, managerId)
          .then((success) => {
            if (success) {
              handleMenuClose();
            } else {
              setError("Failed to assign manager");
            }
          })
          .catch((err) => {
            setError("Failed to assign manager");
            console.error(err);
          });
      }
    },
    [selectedChatId, assignManagerToSession, handleMenuClose]
  );

  // Virtual list renderer for messages
  const renderMessage = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const message = chatMessages[index];
      return (
        <div style={style}>
          <MessageItem message={message} />
        </div>
      );
    },
    [chatMessages]
  );

  // Effects
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [selectedChatId, scrollToBottom, chatMessages]);

  // Mark messages as read when they are viewed
  useEffect(() => {
    if (selectedChatId) {
      chatMessages.forEach((message) => {
        if (!message.isRead && message.receiverUserId === user?.uid) {
          markMessageAsRead(message.chatMessageId);
        }
      });
    }
  }, [selectedChatId, chatMessages, markMessageAsRead, user?.uid]);

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
        <Typography>Loading chats...</Typography>
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
      <Box
        sx={{
          width: 280,
          borderRight: "1px solid",
          borderColor: "divider",
          overflowY: "auto",
          bgcolor: alpha(theme.palette.background.paper, 0.6),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Customer Chats
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
            variant="outlined"
            sx={{
              width: 120,
              "& .MuiOutlinedInput-root": {
                borderRadius: 20,
                height: 36,
              },
            }}
          />
        </Box>
        <List sx={{ flex: 1, py: 0 }}>
          {sortedChats.map((chat) => (
            <ChatListItem
              key={chat.chatSessionId}
              chat={chat}
              isSelected={selectedChatId === chat.chatSessionId}
              onClick={() => handleChatSelect(chat.chatSessionId)}
              unreadCount={unreadCounts.get(chat.chatSessionId) || 0}
            />
          ))}
        </List>
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {isConnected ? "Connected" : "Disconnected"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {chatSessions.length} active chats
          </Typography>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedChat ? (
          <>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                    {selectedChat.customerName?.charAt(0) || "C"}
                  </Avatar>
                </StyledBadge>
                <Box>
                  <Typography variant="subtitle1" fontWeight="500">
                    {selectedChat.customerName || "Customer"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {isTyping ? "Typing..." : "Online"}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={handleMenuOpen} aria-label="chat options">
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleEndChat}>End chat</MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  View customer profile
                </MenuItem>
                {!selectedChat.managerId && (
                  <MenuItem onClick={() => handleAssignManager(user?.uid)}>
                    Assign to me
                  </MenuItem>
                )}
                {selectedChat.managerId === user?.uid && (
                  <MenuItem onClick={() => handleAssignManager(0)}>
                    Unassign from me
                  </MenuItem>
                )}
              </Menu>
            </Box>

            {/* Messages */}
            <Box
              ref={chatContainerRef}
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                bgcolor: alpha(theme.palette.background.default, 0.6),
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography>Loading messages...</Typography>
                </Box>
              ) : chatMessages.length > 10 ? (
                <VirtualList
                  height={chatContainerRef.current?.clientHeight || 400}
                  width="100%"
                  itemCount={chatMessages.length}
                  itemSize={80} // Approximate height of a message
                >
                  {renderMessage}
                </VirtualList>
              ) : (
                <>
                  {chatMessages.map((msg) => (
                    <MessageItem key={msg.chatMessageId} message={msg} />
                  ))}
                  {isTyping && (
                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <TypingIndicator>
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </TypingIndicator>
                    </Box>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <StyledInput
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  placeholder="Type a message..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  aria-label="Message input"
                />
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim()}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                    "&.Mui-disabled": {
                      bgcolor: "action.disabledBackground",
                      color: "action.disabled",
                    },
                  }}
                  aria-label="Send message"
                >
                  <Send />
                </IconButton>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ borderRadius: "20px", textTransform: "none", mr: 1 }}
                  >
                    Quick Responses
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ borderRadius: "20px", textTransform: "none" }}
                  >
                    Attach File
                  </Button>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
              bgcolor: alpha(theme.palette.background.default, 0.6),
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Select a chat to start messaging
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 400, mb: 3 }}
            >
              Choose a customer conversation from the list on the left to view
              messages and respond.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 20, textTransform: "none", px: 3 }}
            >
              Start New Conversation
            </Button>
          </Box>
        )}
      </Box>
    </StyledPaper>
  );
};

export default React.memo(ChatWithCustomer);
