// src/utils/excelExport.ts
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { OrderHistoryDto } from "../types/orderHistory";
import { translateOrderStatus, translateItemType } from "./formatOrder";
import { formatDate, formatCurrency } from "./formatters";

export const exportOrdersToExcel = async (
  orders: OrderHistoryDto[],
  fileName: string = "order-history.xlsx"
) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Lịch Sử Đơn Hàng");

  // Add headers
  worksheet.columns = [
    { header: "Mã Đơn Hàng", key: "orderCode", width: 15 },
    { header: "Khách Hàng", key: "customerName", width: 25 },
    { header: "Trạng Thái", key: "status", width: 15 },
    { header: "Tổng Tiền", key: "totalPrice", width: 15 },
    { header: "Ngày Tạo", key: "createdAt", width: 20 },
    { header: "Địa Chỉ", key: "address", width: 30 },
    { header: "Ghi Chú", key: "notes", width: 30 },
    { header: "Cập Nhật Lần Cuối", key: "updatedAt", width: 20 },
    { header: "Số Lượng Mặt Hàng", key: "itemCount", width: 15 },
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true, size: 12 };
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data rows
  orders.forEach((order) => {
    worksheet.addRow({
      orderCode: order.orderCode,
      customerName: order.customerName || "Không có tên khách hàng",
      status: translateOrderStatus(order.status),
      totalPrice: formatCurrency(order.totalPrice),
      createdAt: formatDate(order.createdAt.toString()),
      address: order.address,
      notes: order.notes || "Không có ghi chú",
      updatedAt: order.updatedAt
        ? formatDate(order.updatedAt.toString())
        : "Chưa cập nhật",
      itemCount: order.items.length,
    });
  });

  // Add a second worksheet for order details
  const detailsWorksheet = workbook.addWorksheet("Chi Tiết Đơn Hàng");

  // Add headers for details
  detailsWorksheet.columns = [
    { header: "Mã Đơn Hàng", key: "orderCode", width: 15 },
    { header: "Tên Mặt Hàng", key: "itemName", width: 30 },
    { header: "Loại", key: "itemType", width: 15 },
    { header: "Số Lượng", key: "quantity", width: 10 },
    { header: "Giá", key: "price", width: 15 },
    { header: "Cho Thuê", key: "isRental", width: 10 },
    { header: "Ngày Bắt Đầu Thuê", key: "rentalStartDate", width: 20 },
    { header: "Ngày Trả Dự Kiến", key: "expectedReturnDate", width: 20 },
    { header: "Ngày Trả Thực Tế", key: "actualReturnDate", width: 20 },
    { header: "Phí Trễ Hạn", key: "lateFee", width: 15 },
    { header: "Phí Hư Hỏng", key: "damageFee", width: 15 },
  ];

  // Style the header row
  detailsWorksheet.getRow(1).font = { bold: true, size: 12 };
  detailsWorksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E0E0" },
  };

  // Add data rows for details
  orders.forEach((order) => {
    order.items.forEach((item) => {
      detailsWorksheet.addRow({
        orderCode: order.orderCode,
        itemName: item.itemName,
        itemType: translateItemType(item.itemType),
        quantity: item.quantity,
        price: formatCurrency(item.price),
        isRental: item.isRental ? "Có" : "Không",
        rentalStartDate: item.rentalStartDate
          ? formatDate(item.rentalStartDate.toString())
          : "",
        expectedReturnDate: item.expectedReturnDate
          ? formatDate(item.expectedReturnDate.toString())
          : "",
        actualReturnDate: item.actualReturnDate
          ? formatDate(item.actualReturnDate.toString())
          : "",
        lateFee: item.lateFee ? formatCurrency(item.lateFee) : "",
        damageFee: item.damageFee ? formatCurrency(item.damageFee) : "",
      });
    });
  });

  // Generate the Excel file
  const buffer = await workbook.xlsx.writeBuffer();

  // Save the file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};
