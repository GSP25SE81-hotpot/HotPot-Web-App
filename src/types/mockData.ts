import {
  ProofOfDeliveryDto,
  ShippingListDto,
  ProofOfDeliveryResponse,
} from "../types/proofOfDelivery";

// Mock shipping order details
export const mockShippingDetail: ShippingListDto = {
  shippingOrderId: 123,
  orderID: 456,
  deliveryTime: "2025-03-12T10:30:00.000Z",
  deliveryNotes: "Please leave at the front door if no one answers",
  isDelivered: false,
  deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
  customerName: "John Smith",
  customerPhone: "(555) 123-4567",
  orderStatus: "Processing",
  totalPrice: 89.99,
  items: [
    {
      orderDetailId: 1001,
      itemName: "Hotpot Base - Spicy",
      itemType: "Hotpot",
      quantity: 1,
    },
    {
      orderDetailId: 1002,
      itemName: "Beef Slices",
      itemType: "Ingredient",
      quantity: 2,
    },
    {
      orderDetailId: 1003,
      itemName: "Tofu",
      itemType: "Ingredient",
      quantity: 1,
    },
    {
      orderDetailId: 1004,
      itemName: "Chopsticks",
      itemType: "Utensil",
      quantity: 4,
    },
  ],
};

// Mock existing proof of delivery (when available)
export const mockExistingProof: ProofOfDeliveryDto = {
  shippingOrderId: 123,
  base64Image:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // A tiny red dot image
  imageType: "image/png",
  base64Signature:
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", // A tiny red dot image
  deliveryNotes: "Customer was very satisfied with the delivery",
  proofTimestamp: "2025-03-12T11:45:00.000Z",
};

// Mock API response for shipping detail
export const mockShippingDetailResponse = {
  success: true,
  message: "Shipping detail retrieved successfully",
  data: mockShippingDetail,
  errors: null,
};

// Mock API response for proof of delivery
export const mockProofOfDeliveryResponse = {
  success: true,
  message: "Proof of delivery retrieved successfully",
  data: mockExistingProof,
  errors: null,
};

// Mock API response for saving proof of delivery
export const mockSaveProofResponse = {
  success: true,
  message: "Proof of delivery saved successfully",
  data: {
    shippingOrderId: 123,
    isDelivered: true,
    deliveryTime: "2025-03-12T11:45:00.000Z",
    proofTimestamp: "2025-03-12T11:45:00.000Z",
    deliveryNotes: "Customer was very satisfied with the delivery",
    hasProofImage: true,
    hasSignature: true,
  } as ProofOfDeliveryResponse,
  errors: null,
};
