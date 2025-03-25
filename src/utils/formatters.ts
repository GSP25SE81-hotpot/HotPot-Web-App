import { format, differenceInDays } from "date-fns";

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy");
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getDaysOverdue = (expectedDate: string): number => {
  const today = new Date();
  const expected = new Date(expectedDate);
  return differenceInDays(today, expected);
};
