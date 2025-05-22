import React from "react";
import { Box, Typography, alpha, useTheme } from "@mui/material";

const EmptyChatState: React.FC = () => {
  const theme = useTheme();
  return (
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
        Chọn cuộc trò chuyện để bắt đầu nhắn tin
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ maxWidth: 400, mb: 3 }}
      >
        Hãy chọn một cuộc hội thoại với khách hàng từ danh sách bên trái để xem
        tin nhắn và phản hồi.
      </Typography>
    </Box>
  );
};

export default React.memo(EmptyChatState);
