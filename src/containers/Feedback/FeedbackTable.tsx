import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

interface Feedback {
  id: number;
  name: string;
  email: string;
  feedback: string;
  date: string;
}

const feedbackData: Feedback[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    feedback: "Great product!",
    date: "2025-01-20",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    feedback: "Could be improved.",
    date: "2025-01-21",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.j@example.com",
    feedback: "Loved it!",
    date: "2025-01-22",
  },
];

const FeedbackTable: React.FC = () => {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Feedback Table
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackData.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{feedback.id}</TableCell>
                <TableCell>{feedback.name}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.feedback}</TableCell>
                <TableCell>{feedback.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FeedbackTable;
