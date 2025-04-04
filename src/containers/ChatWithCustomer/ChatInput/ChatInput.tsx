// src/components/Chat/components/ChatInput/ChatInput.tsx
import { Send } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { StyledInput } from "../../../components/manager/styles/ChatStyles";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void; // Make it optional if not always needed
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping }) => {
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
    // Notify parent component that user is typing
    if (onTyping) {
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Notify typing
      onTyping();
      // Set timeout to stop typing indication after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        // You might want to notify parent that typing stopped
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup timeout on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
      // Clear typing indication when sending
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
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

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) => theme.palette.background.paper,
        opacity: 0.8,
        backdropFilter: "blur(8px)",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <StyledInput
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          aria-label="Ô nhập tin nhắn"
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
          aria-label="Gửi tin nhắn"
        >
          <Send />
        </IconButton>
      </Box>
    </Box>
  );
};

export default React.memo(ChatInput);
