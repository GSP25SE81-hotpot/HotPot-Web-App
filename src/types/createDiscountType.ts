export type CreateDiscountType = {
  title: string;
  description: string;
  discountPercentage: number;
  date: string;
  duration: string | null | undefined;
  pointCost: number;
};
