import React, { useRef, useEffect, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { FixedSizeList as VirtualList } from "react-window";
import MessageItem from "./MessageItem";
import { ChatMessageDto } from "../../../types/chat";

interface MessageListProps {
  messages: ChatMessageDto[];
  loading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading }) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sort messages by creation time
  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && !loading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sortedMessages.length, loading]);

  // Render message in virtual list
  const renderMessage = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const message = sortedMessages[index];
    return (
      <div style={style}>
        <MessageItem message={message} />
      </div>
    );
  };

  return (
    <Box
      ref={chatContainerRef}
      className="messages-container"
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 3,
        bgcolor: (theme) => theme.palette.background.default,
        opacity: 0.9,
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
          <Typography>Đang tải tin nhắn...</Typography>
        </Box>
      ) : sortedMessages.length > 10 ? (
        <>
          <VirtualList
            height={chatContainerRef.current?.clientHeight || 400}
            width="100%"
            itemCount={sortedMessages.length}
            itemSize={100}
          >
            {renderMessage}
          </VirtualList>
          <div ref={messagesEndRef} />
        </>
      ) : sortedMessages.length > 0 ? (
        <>
          {sortedMessages.map((msg) => (
            <MessageItem key={msg.chatMessageId} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography color="text.secondary">Không có tin nhắn nào</Typography>
        </Box>
      )}
    </Box>
  );
};

export default React.memo(MessageList);
