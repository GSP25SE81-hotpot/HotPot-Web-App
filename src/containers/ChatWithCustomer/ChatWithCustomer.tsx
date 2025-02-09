import { Circle, Send, Warning } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  List, // Changed: Use ListItemButton instead of ListItem
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  sender: "customer" | "staff";
  text: string;
  timestamp: Date;
}

interface CustomerChat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  lastActivity: Date;
  messages: Message[];
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const ChatWithCustomer: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [customerChats, setCustomerChats] = useState<CustomerChat[]>([
    {
      id: "1",
      name: "John Doe",
      avatar: "J",
      lastMessage: "Hey, I have an issue with my order!",
      unread: 2,
      lastActivity: new Date(),
      messages: [
        {
          sender: "customer",
          text: "Hey, I have an issue with my order!",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          sender: "staff",
          text: "Sure, let me check that for you.",
          timestamp: new Date(Date.now() - 1800000),
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
          sender: "customer",
          text: "When will my package arrive?",
          timestamp: new Date(Date.now() - 7200000),
        },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const handleSend = () => {
    if (input.trim() && selectedChat) {
      const newMessage: Message = {
        sender: "staff",
        text: input,
        timestamp: new Date(),
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
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEscalate = () => {
    alert("The issue has been escalated to higher support.");
  };

  const selectedCustomer = customerChats.find((c) => c.id === selectedChat);

  return (
    <Paper
      elevation={3}
      sx={{
        width: "80vw",
        height: "80vh",
        display: "flex",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 250,
          borderRight: "1px solid",
          borderColor: "divider",
          overflowY: "auto",
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: "bold" }}>
          Customer Chats
        </Typography>
        <List>
          {customerChats.map((chat) => (
            <ListItemButton
              key={chat.id}
              selected={selectedChat === chat.id}
              onClick={() => setSelectedChat(chat.id)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {chat.avatar}
                  </Avatar>
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={chat.name}
                secondary={chat.lastMessage}
                secondaryTypographyProps={{
                  noWrap: true,
                  color: "text.secondary",
                }}
                sx={{ pr: 1 }}
              />
              <Box sx={{ textAlign: "right", minWidth: 60 }}>
                <Typography variant="caption" color="textSecondary">
                  {new Date(chat.lastActivity).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                {chat.unread > 0 && (
                  <Circle
                    sx={{
                      fontSize: 12,
                      color: "primary.main",
                      mt: 0.5,
                    }}
                  />
                )}
              </Box>
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Right Chat Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedCustomer ? (
          <>
            {/* Chat Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                {selectedCustomer.avatar}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="500">
                  {selectedCustomer.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Online
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <List
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 2,
                bgcolor: "background.default",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              {selectedCustomer.messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "staff" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "70%",
                      p: "8px 12px",
                      borderRadius: 4,
                      bgcolor:
                        msg.sender === "staff" ? "primary.main" : "grey.100",
                      color:
                        msg.sender === "staff"
                          ? "common.white"
                          : "text.primary",
                      boxShadow: 1,
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        opacity: 0.7,
                        color:
                          msg.sender === "staff"
                            ? "common.white"
                            : "text.secondary",
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </List>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  placeholder="Type a message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "24px",
                      bgcolor: "background.paper",
                    },
                  }}
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
                >
                  <Send />
                </IconButton>
              </Box>
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
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">
              Select a chat to start messaging
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ChatWithCustomer;
