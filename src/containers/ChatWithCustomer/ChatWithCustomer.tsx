import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const ChatWithCustomer = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { sender: "Staff", text: input }]);
      setInput("");
    }
  };

  const handleEscalate = () => {
    // Logic to escalate the issue
    alert("The issue has been escalated to higher support.");
  };

  return (
    <Box
      sx={{
        width: "400px",
        height: "500px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Chat with Customer
      </Typography>
      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          mb: 2,
          border: "1px solid #eee",
          borderRadius: "8px",
          padding: 1,
        }}
      >
        {messages.map((msg, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                msg.sender === "Staff" ? "flex-end" : "flex-start",
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                padding: "8px 12px",
                borderRadius: "12px",
                backgroundColor: msg.sender === "Staff" ? "#e0f7fa" : "#f1f8e9",
              }}
            >
              {msg.text}
            </Box>
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSend}>
          Send
        </Button>
      </Box>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ mt: 2 }}
        onClick={handleEscalate}
      >
        Escalate
      </Button>
    </Box>
  );
};

export default ChatWithCustomer;
