// src/components/Chat/MessageList.tsx
import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { ChatMessageDto } from "../../../types/chat";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessageDto[];
  currentUserId?: number;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.chatMessageId}
          message={message}
          isFromCurrentUser={
            Number(message.senderUserId) === Number(currentUserId)
          }
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default React.memo(MessageList);
