// Types for chat functionality (manager-focused)

// Request types
export interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  message: string;
}

// Response types
export interface ChatSessionDto {
  chatSessionId: number;
  customerId: number;
  customerName: string;
  managerId?: number;
  managerName?: string;
  isActive: boolean;
  topic: string;
  createdAt: string; // ISO date string
}

export interface ChatMessageDto {
  chatMessageId: number;
  senderUserId: number;
  senderName: string;
  receiverUserId: number;
  receiverName: string;
  message: string;
  createdAt: string; // ISO date string
}

export interface ChatSessionDetailDto extends ChatSessionDto {
  messages: ChatMessageDto[];
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}

// Socket event data types
export interface NewChatEvent {
  sessionId: number;
  customerId: number;
  customerName: string;
  topic: string;
}

export interface ChatAcceptedEvent {
  sessionId: number;
  managerId: number;
  managerName: string;
  customerId: number;
}

export interface NewMessageEvent {
  messageId: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
}

export interface ChatEndedEvent {
  sessionId: number;
  customerId: number;
  managerId?: number;
}
