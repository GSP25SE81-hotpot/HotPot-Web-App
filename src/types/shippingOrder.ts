interface ShippingOrderItem {
    orderDetailId: number;
    itemName: string;
    itemType: string;
    quantity: number;
    isRental: boolean;
    rentalStartDate: string;
    expectedReturnDate: string;
  }
  
 export interface ShippingOrder {
    shippingOrderId: number;
    orderID: number;
    deliveryTime: string;
    deliveryNotes: string;
    isDelivered: boolean;
    deliveryAddress: string;
    customerName: string;
    customerPhone: string;
    orderStatus: string;
    totalPrice: number;
    items: ShippingOrderItem[];
  }