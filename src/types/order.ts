
interface User {
    userId: number;
    name: string;
    phoneNumber: string;
    email: string;
  }
  
  interface OrderItem {
    orderDetailId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    itemType: string;
    itemName: string;
    imageUrl: string;
    itemId: number;
  }
  
  interface Discount {
    discountId: number;
    title: string;
    description: string;
    percent: number;
    discountAmount: number;
  }
  
  interface Payment {
    paymentId: number;
    type: string;
    status: string;
    amount: number;
    createdAt: string;
  }
  
 export interface IOrder {
    orderId: number;
    address: string;
    notes: string;
    totalPrice: number;
    ingredientsDeposit: number;
    hotpotDeposit: number;
    totalDeposit: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    items: OrderItem[];
    discount: Discount;
    payment: Payment;
  }