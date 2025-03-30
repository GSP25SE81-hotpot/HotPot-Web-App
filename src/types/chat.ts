export interface CreateChatSessionRequest {
  customerId: number;
  topic: string;
}

export interface AssignManagerRequest {
  managerId: number;
}

export interface SendMessageRequest {
  senderId: number;
  receiverId: number;
  message: string;
}

export interface MarkAsReadRequest {
  userId: number;
}

export interface ChatSessionDto {
  chatSessionId: number;
  customerId: number;
  customerName: string;
  managerId?: number;
  managerName?: string;
  isActive: boolean;
  topic: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ChatMessageDto {
  chatMessageId: number;
  senderUserId: number;
  senderName: string;
  receiverUserId: number;
  receiverName: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface ChatSessionDetailDto extends ChatSessionDto {
  messages: ChatMessageDto[];
}

export interface UnreadMessageCountDto {
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
}
