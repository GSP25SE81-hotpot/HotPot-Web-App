export interface ProofOfDeliveryRequest {
  base64Image?: string;
  imageType?: string;
  base64Signature?: string;
  deliveryNotes?: string;
}

export interface ProofOfDeliveryFormRequest {
  proofImage?: File;
  base64Signature?: string;
  deliveryNotes?: string;
}

export interface ProofOfDeliveryResponse {
  shippingOrderId: number;
  isDelivered: boolean;
  deliveryTime: string;
  proofTimestamp: string;
  deliveryNotes?: string;
  hasProofImage: boolean;
  hasSignature: boolean;
}

export interface ProofOfDeliveryDto {
  shippingOrderId: number;
  base64Image?: string;
  imageType?: string;
  base64Signature?: string;
  deliveryNotes?: string;
  proofTimestamp?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface ApiErrorResponse {
  status: string;
  message: string;
}

export interface ShippingItemDto {
  orderDetailId: number;
  itemName: string;
  itemType: string;
  quantity: number;
}

export interface ShippingListDto {
  shippingOrderId: number;
  orderID: number;
  deliveryTime?: string;
  deliveryNotes?: string;
  isDelivered: boolean;
  deliveryAddress: string;
  customerName: string;
  customerPhone: string;
  orderStatus: string;
  totalPrice: number;
  items: ShippingItemDto[];
}
