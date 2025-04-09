interface OrderDetail {
    orderDetailId: number;
    quantity: number;
    volumeWeight: number;
    unit: string;
    unitPrice: number;
    itemName: string;
    itemType: string;
    itemId: number;
    orderId: number;
  }
  
export interface AssignOrderType {
    orderId: number;
    address: string;
    notes: string;
    totalPrice: number;
    status: string;
    userID: number;
    userName: string;
    userPhone: string;
    createdAt: string;
    updatedAt: string;
    orderDetails: OrderDetail[];
  }