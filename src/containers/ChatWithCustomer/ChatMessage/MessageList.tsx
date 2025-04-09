// src/components/Chat/components/ChatMessages/MessageList.tsx
import React, { useRef } from "react";
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

  // Hiển thị tin nhắn dạng danh sách ảo
  const renderMessage = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const message = messages[index];
    return (
      <div style={style}>
        <MessageItem message={message} />
      </div>
    );
  };

  return (
    <Box
      ref={chatContainerRef}
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 3,
        bgcolor: (theme) => theme.palette.background.default,
        opacity: 0.6,
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
      ) : messages.length > 10 ? (
        <VirtualList
          height={chatContainerRef.current?.clientHeight || 400}
          width="100%"
          itemCount={messages.length}
          itemSize={80} // Chiều cao xấp xỉ mỗi tin nhắn
        >
          {renderMessage}
        </VirtualList>
      ) : (
        <>
          {messages.map((msg) => (
            <MessageItem key={msg.chatMessageId} message={msg} />
          ))}
        </>
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default React.memo(MessageList);
