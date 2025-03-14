import { StaffDto, StaffAvailabilityStatus } from "../types/staff";

// Format date for display
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

// Get available actions based on request status
export const getAvailableActions = (status: string) => {
  switch (status) {
    case "Pending":
      return { canReview: true, canAssign: false, canComplete: false };
    case "Approved":
      return { canReview: false, canAssign: true, canComplete: false };
    case "InProgress":
    case "In Progress":
      return { canReview: false, canAssign: false, canComplete: true };
    default:
      return { canReview: false, canAssign: false, canComplete: false };
  }
};

// Get staff availability status with reason
export const getStaffAvailabilityStatus = (
  staffMember: StaffDto | undefined
): StaffAvailabilityStatus => {
  if (!staffMember) {
    return { available: false, reason: "Staff not found" };
  }

  // If staff has no shipping orders array, they're available
  if (!staffMember.shippingOrders) {
    return { available: true, reason: "Available" };
  }

  // Check if staff has fewer than 5 active orders (this is a simplified example)
  const activeOrderCount = staffMember.shippingOrders.length;

  if (activeOrderCount >= 5) {
    return { available: false, reason: "Too many active orders" };
  }

  // Check if staff is working today (based on workDays)
  // This is a simplified example - you might want to implement more complex logic
  // For example, workDays could be a bitmask where each bit represents a day of the week
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const isWorkingToday = (staffMember.workDays & (1 << today)) !== 0;

  if (!isWorkingToday) {
    return { available: false, reason: "Not scheduled to work today" };
  }

  return { available: true, reason: "Available" };
};

// Simplified version that just returns boolean
export const isStaffAvailable = (
  staffId: number,
  staffList: StaffDto[]
): boolean => {
  const staffMember = staffList.find((s) => s.staffId === staffId);
  return getStaffAvailabilityStatus(staffMember).available;
};

// Get staff workload for display
export const getStaffWorkload = (
  staffId: number,
  staffList: StaffDto[]
): string => {
  const staffMember = staffList.find((s) => s.staffId === staffId);

  if (!staffMember) return "Unknown";

  if (!staffMember.shippingOrders) return "No active orders";

  return `${staffMember.shippingOrders.length} active orders`;
};

// Get staff display name
export const getStaffDisplayName = (
  staffId: number | null,
  staffList: StaffDto[]
): string => {
  if (staffId === null) return "Not assigned";

  const staffMember = staffList.find((s) => s.staffId === staffId);
  return staffMember ? staffMember.user.name : "Unknown Staff";
};
