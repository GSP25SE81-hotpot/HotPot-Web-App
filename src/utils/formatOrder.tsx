/* eslint-disable @typescript-eslint/no-explicit-any */
export const getColorForStatus = (status: any) => {
  switch (status) {
    case "Đã giao":
      return "#4caf50";
    case "Chờ xử lý":
      return "#ff9800";
    case "Đã hủy":
      return "#f44336";
    case "Đang xử lý":
      return "#2196f3";
    case "Đang giao":
      return "#9c27b0";
    case "Đang hoàn trả":
      return "#795548";
    case "Hoàn thành":
      return "#009688";
    default:
      return "#ccc";
  }
};

export const translateStatusToVietnamese = (status: any) => {
  switch (status) {
    case "Pending":
      return "Chờ xử lý";
    case "Delivered":
      return "Đã giao";
    case "Processing":
      return "Đang xử lý";
    case "Shipping":
      return "Đang giao";
    case "Cancelled":
    case "Canceled":
      return "Đã hủy";
    case "Returning":
      return "Đang hoàn trả";
    case "Completed":
      return "Hoàn thành";
    default:
      return status;
  }
};

export const translateMonthToVietnamese = (month: any) => {
  switch (month) {
    case "May":
      return "Tháng 5";
    case "June":
      return "Tháng 6";
    case "July":
      return "Tháng 7";
    case "August":
      return "Tháng 8";
    case "September":
      return "Tháng 9";
    case "October":
      return "Tháng 10";
    case "November":
      return "Tháng 11";
    case "December":
      return "Tháng 12";
    case "January":
      return "Tháng 1";
    case "February":
      return "Tháng 2";
    case "March":
      return "Tháng 3";
    case "April":
      return "Tháng 4";
    default:
      return month;
  }
};
