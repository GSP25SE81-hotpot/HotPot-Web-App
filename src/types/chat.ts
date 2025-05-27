// types/chat.ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface SendMessageRequest {
  chatSessionId: number;
  message: string;
}

export interface ChatSessionDto {
  chatSessionId: number;
  customerId: number;
  customerName: string;
  managerId?: number;
  managerName?: string;
  isActive: boolean;
  topic?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ChatSessionDetailDto extends ChatSessionDto {
  messages: ChatMessageDto[];
}

export interface ChatMessageDto {
  chatMessageId: number;
  senderUserId: number;
  senderName: string;
  receiverUserId: number;
  receiverName: string;
  chatSessionId: number;
  message: string;
  createdAt: string;
  isBroadcast: boolean;
}
