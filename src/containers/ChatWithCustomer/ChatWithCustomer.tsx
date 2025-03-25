import { MoreVert, Send, Warning } from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FixedSizeList as VirtualList } from "react-window";

// Types
interface Message {
  id: string;
  sender: "customer" | "staff";
  text: string;
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface CustomerChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  lastActivity: Date;
  messages: Message[];
  isTyping?: boolean;
}

// Styled Components
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: `0 12px 48px 0 ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isStaff",
})<{ isStaff?: boolean }>(({ theme, isStaff }) => ({
  maxWidth: "70%",
  padding: "12px 16px",
  borderRadius: isStaff ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
  background: isStaff
    ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
    : theme.palette.grey[100],
  boxShadow: `0 4px 12px ${alpha(
    isStaff ? theme.palette.primary.main : theme.palette.common.black,
    0.08
  )}`,
  color: isStaff ? "white" : "inherit",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: `0 6px 16px ${alpha(
      isStaff ? theme.palette.primary.main : theme.palette.common.black,
      0.12
    )}`,
  },
}));

const AnimatedListItem = styled(ListItemButton)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  borderRadius: 12,
  margin: "4px 8px",
  "&:hover": {
    transform: "translateX(4px)",
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.16),
    },
  },
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 30,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: "blur(8px)",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.12)}`,
    },
  },
}));

const TypingIndicator = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px 16px",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  width: "fit-content",
  marginTop: 8,
  "& .dot": {
    width: 8,
    height: 8,
    margin: "0 2px",
    borderRadius: "50%",
    backgroundColor: theme.palette.text.secondary,
    display: "inline-block",
    animation: "typing 1.4s infinite ease-in-out both",
  },
  "& .dot:nth-of-type(1)": {
    animationDelay: "0s",
  },
  "& .dot:nth-of-type(2)": {
    animationDelay: "0.2s",
  },
  "& .dot:nth-of-type(3)": {
    animationDelay: "0.4s",
  },
  "@keyframes typing": {
    "0%": {
      transform: "scale(1)",
      opacity: 0.7,
    },
    "50%": {
      transform: "scale(1.4)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1)",
      opacity: 0.7,
    },
  },
}));

// Memoized Components
const ChatListItem = React.memo(
  ({
    chat,
    isSelected,
    onClick,
  }: {
    chat: CustomerChat;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <AnimatedListItem selected={isSelected} onClick={onClick}>
      <ListItemAvatar>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar sx={{ bgcolor: "primary.main" }}>{chat.avatar}</Avatar>
        </StyledBadge>
      </ListItemAvatar>
      <ListItemText
        primary={chat.name}
        secondary={chat.lastMessage}
        slotProps={{
          secondary: {
            noWrap: true,
            color: "text.secondary",
          },
        }}
      />
      <Box sx={{ textAlign: "right", minWidth: 60 }}>
        <Typography variant="caption" color="text.secondary">
          {new Date(chat.lastActivity).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
        {chat.unread > 0 && (
          <Badge badgeContent={chat.unread} color="primary" sx={{ ml: 1 }} />
        )}
      </Box>
    </AnimatedListItem>
  )
);

const MessageItem = React.memo(({ message }: { message: Message }) => {
  const isStaff = message.sender === "staff";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isStaff ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <MessageBubble isStaff={isStaff}>
        <Typography variant="body2">{message.text}</Typography>
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
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          {isStaff && message.status && (
            <Box
              component="span"
              sx={{ ml: 0.5, display: "flex", alignItems: "center" }}
            >
              {message.status === "sent" && "✓"}
              {message.status === "delivered" && "✓✓"}
              {message.status === "read" && (
                <span style={{ color: "#44b700" }}>✓✓</span>
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
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customerChats, setCustomerChats] = useState<CustomerChat[]>([
    {
      id: "1",
      name: "John Doe",
      avatar: "J",
      lastMessage: "Hey, I have an issue with my order!",
      unread: 2,
      lastActivity: new Date(),
      isTyping: true,
      messages: [
        {
          id: "1-1",
          sender: "customer",
          text: "Hey, I have an issue with my order!",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "1-2",
          sender: "staff",
          text: "Sure, let me check that for you.",
          timestamp: new Date(Date.now() - 1800000),
          status: "read",
        },
      ],
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "J",
      lastMessage: "When will my package arrive?",
      unread: 0,
      lastActivity: new Date(Date.now() - 7200000),
      messages: [
        {
          id: "2-1",
          sender: "customer",
          text: "When will my package arrive?",
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    },
    {
      id: "3",
      name: "Alex Johnson",
      avatar: "A",
      lastMessage: "Thanks for your help!",
      unread: 1,
      lastActivity: new Date(Date.now() - 10800000),
      messages: [
        {
          id: "3-1",
          sender: "customer",
          text: "Do you have this product in blue?",
          timestamp: new Date(Date.now() - 14400000),
        },
        {
          id: "3-2",
          sender: "staff",
          text: "Yes, we do have it in blue. Would you like me to place an order for you?",
          timestamp: new Date(Date.now() - 12600000),
          status: "delivered",
        },
        {
          id: "3-3",
          sender: "customer",
          text: "That would be great!",
          timestamp: new Date(Date.now() - 10800000),
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Memoized values and callbacks
  const selectedCustomer = useMemo(
    () => customerChats.find((c) => c.id === selectedChat),
    [customerChats, selectedChat]
  );

  const handleChatSelect = useCallback((chatId: string) => {
    setSelectedChat(chatId);

    // Mark messages as read when selecting a chat
    setCustomerChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, unread: 0 } : chat
      )
    );
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = useCallback(() => {
    if (input.trim() && selectedChat) {
      const newMessage: Message = {
        id: `${selectedChat}-${Date.now()}`,
        sender: "staff",
        text: input,
        timestamp: new Date(),
        status: "sent",
      };

      setCustomerChats((chats) =>
        chats.map((chat) =>
          chat.id === selectedChat
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                lastMessage: input,
                lastActivity: new Date(),
              }
            : chat
        )
      );
      setInput("");

      // Simulate message delivery after 1 second
      setTimeout(() => {
        setCustomerChats((chats) =>
          chats.map((chat) =>
            chat.id === selectedChat
              ? {
                  ...chat,
                  messages: chat.messages.map((msg) =>
                    msg.id === newMessage.id
                      ? { ...msg, status: "delivered" }
                      : msg
                  ),
                }
              : chat
          )
        );

        // Simulate message read after 2 seconds
        setTimeout(() => {
          setCustomerChats((chats) =>
            chats.map((chat) =>
              chat.id === selectedChat
                ? {
                    ...chat,
                    messages: chat.messages.map((msg) =>
                      msg.id === newMessage.id
                        ? { ...msg, status: "read" }
                        : msg
                    ),
                    // Simulate customer typing after staff message
                    isTyping: true,
                  }
                : chat
            )
          );

          // Simulate customer response after typing
          setTimeout(() => {
            setCustomerChats((chats) =>
              chats.map((chat) =>
                chat.id === selectedChat
                  ? {
                      ...chat,
                      isTyping: false,
                      messages: [
                        ...chat.messages,
                        {
                          id: `${selectedChat}-${Date.now()}`,
                          sender: "customer",
                          text: "Thanks for the information!",
                          timestamp: new Date(),
                        },
                      ],
                      lastMessage: "Thanks for the information!",
                      lastActivity: new Date(),
                    }
                  : chat
              )
            );
          }, 3000);
        }, 2000);
      }, 1000);
    }
  }, [input, selectedChat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleEscalate = useCallback(() => {
    alert("The issue has been escalated to higher support.");
  }, []);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleClearChat = useCallback(() => {
    if (selectedChat) {
      setCustomerChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChat ? { ...chat, messages: [] } : chat
        )
      );
      handleMenuClose();
    }
  }, [selectedChat, handleMenuClose]);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [selectedChat, scrollToBottom, customerChats]);

  // Sort chats by last activity
  const sortedChats = useMemo(
    () =>
      [...customerChats].sort(
        (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
      ),
    [customerChats]
  );

  // Virtual list renderer for messages
  const renderMessage = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      if (!selectedCustomer) return null;
      const message = selectedCustomer.messages[index];

      return (
        <div style={style}>
          <MessageItem message={message} />
        </div>
      );
    },
    [selectedCustomer]
  );

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
              key={chat.id}
              chat={chat}
              isSelected={selectedChat === chat.id}
              onClick={() => handleChatSelect(chat.id)}
            />
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedCustomer ? (
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
                    {selectedCustomer.avatar}
                  </Avatar>
                </StyledBadge>
                <Box>
                  <Typography variant="subtitle1" fontWeight="500">
                    {selectedCustomer.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedCustomer.isTyping ? "Typing..." : "Online"}
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
                <MenuItem onClick={handleClearChat}>Clear chat</MenuItem>
                <MenuItem onClick={handleEscalate}>Escalate issue</MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  View customer profile
                </MenuItem>
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
              {selectedCustomer.messages.length > 10 ? (
                <VirtualList
                  height={chatContainerRef.current?.clientHeight || 400}
                  width="100%"
                  itemCount={selectedCustomer.messages.length}
                  itemSize={80} // Approximate height of a message
                >
                  {renderMessage}
                </VirtualList>
              ) : (
                <>
                  {selectedCustomer.messages.map((msg) => (
                    <MessageItem key={msg.id} message={msg} />
                  ))}
                  {selectedCustomer.isTyping && (
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
                  onChange={(e) => setInput(e.target.value)}
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
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Warning />}
                  onClick={handleEscalate}
                  size="small"
                  sx={{ borderRadius: "20px", textTransform: "none" }}
                >
                  Escalate Issue
                </Button>
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
