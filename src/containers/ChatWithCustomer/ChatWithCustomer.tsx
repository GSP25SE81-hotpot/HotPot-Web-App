import { Send, Warning } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  sender: string;
  text: string;
  timestamp: Date;
}

const ChatWithCustomer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        { sender: "Staff", text: input, timestamp: new Date() },
      ]);
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

  return (
    <Paper
      elevation={3}
      sx={{
        width: "400px",
        height: "500px",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: (theme) => theme.palette.primary.main,
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="500">
          Hỗ trợ khách hàng
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Trả lời thường trong vòng 5 phút
        </Typography>
      </Box>

      {/* Messages */}
      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((msg, index) => (
          <Fade in key={index}>
            <ListItem
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender === "Staff" ? "flex-end" : "flex-start",
                p: 0,
              }}
            >
              {msg.sender !== "Staff" && (
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    bgcolor: "primary.main",
                  }}
                >
                  C
                </Avatar>
              )}
              <Box
                sx={{
                  maxWidth: "70%",
                  p: "12px 16px",
                  borderRadius:
                    msg.sender === "Staff"
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                  bgcolor: msg.sender === "Staff" ? "primary.main" : "grey.100",
                  color: msg.sender === "Staff" ? "white" : "text.primary",
                  boxShadow: 1,
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </ListItem>
          </Fade>
        ))}
        <div ref={messagesEndRef} />
      </List>

      <Divider />

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown} // Updated to use onKeyDown
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
              "&:hover": {
                bgcolor: "primary.dark",
              },
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
          sx={{
            borderRadius: "20px",
            textTransform: "none",
          }}
        >
          Escalate Issue
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatWithCustomer;
