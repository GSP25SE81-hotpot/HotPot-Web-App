import { StaffAvailabilityStatus, StaffAvailabilityDto } from "../types/staff";

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
  staffMember: StaffAvailabilityDto | undefined
): StaffAvailabilityStatus => {
  if (!staffMember) {
    return { available: false, reason: "Staff not found" };
  }

  // Use the isAvailable property directly from the backend
  if (staffMember.isAvailable) {
    return { available: true, reason: "Available" };
  } else {
    return { available: false, reason: "Not available" };
  }
};

// Simplified version that just returns boolean
export const isStaffAvailable = (
  staffId: number,
  staffList: StaffAvailabilityDto[]
): boolean => {
  const staffMember = staffList.find((s) => s.id === staffId);
  return getStaffAvailabilityStatus(staffMember).available;
};

// Get staff display name
export const getStaffDisplayName = (
  staffId: number | null,
  staffList: StaffAvailabilityDto[]
): string => {
  if (staffId === null) return "Not assigned";

  const staffMember = staffList.find((s) => s.id === staffId);
  return staffMember ? staffMember.name : "Unknown Staff";
};
