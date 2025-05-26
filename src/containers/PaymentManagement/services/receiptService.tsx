// src/services/receiptService.ts
import {
  PaymentReceiptDto,
  ReceiptItemDto,
  ReceiptRentalItemDto,
} from "../../../types/staffPayment";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { receiptStyles } from "./receiptTemplate.styles";

// Translation functions
const translatePaymentMethod = (method: string): string => {
  switch (method) {
    case "Cash":
      return "Tiền mặt";
    case "Online":
      return "Trực tuyến";
    default:
      return method;
  }
};

export const printReceipt = (receipt: PaymentReceiptDto): void => {
  const receiptWindow = window.open("", "_blank");
  if (!receiptWindow) return;

  // Translate payment method and order status
  const translatedPaymentMethod = translatePaymentMethod(receipt.paymentMethod);

  // Format the sold items section
  const soldItemsSection =
    receipt.soldItems && receipt.soldItems.length > 0
      ? `
      <div class="section">
        <h3>Sản phẩm</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.soldItems
              .map(
                (item: ReceiptItemDto) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.itemType}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">${formatCurrency(item.totalPrice)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      : "";

  // Format the rented items section
  const rentedItemsSection =
    receipt.rentedItems && receipt.rentedItems.length > 0
      ? `
      <div class="section">
        <h3>Sản phẩm thuê</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Ngày trả dự kiến</th>
              <th>Giá thuê</th>
            </tr>
          </thead>
          <tbody>
            ${receipt.rentedItems
              .map(
                (item: ReceiptRentalItemDto) => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td>${formatDate(item.expectedReturnDate)}</td>
                  <td class="text-right">${formatCurrency(
                    item.rentalPrice
                  )}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `
      : "";

  // Format additional fees section
  const additionalFeesSection =
    receipt.lateFee || receipt.damageFee
      ? `
      <div class="section">
        <h3>Phí phát sinh</h3>
        <table class="fees-table">
          <tbody>
            ${
              receipt.lateFee
                ? `
                <tr>
                  <td>Phí trả muộn:</td>
                  <td class="text-right">${formatCurrency(receipt.lateFee)}</td>
                </tr>
              `
                : ""
            }
            ${
              receipt.damageFee
                ? `
                <tr>
                  <td>Phí hư hỏng:</td>
                  <td class="text-right">${formatCurrency(
                    receipt.damageFee
                  )}</td>
                </tr>
              `
                : ""
            }
          </tbody>
        </table>
      </div>
    `
      : "";

  const html = `
    <html>
      <head>
        <title>Biên lai thanh toán #${receipt.receiptId}</title>
        <style>${receiptStyles}</style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="logo">HPTY</div>
            <h1>Biên lai thanh toán</h1>
            <p class="receipt-id">Biên lai #: ${receipt.receiptId}</p>
            <p class="receipt-date">Ngày: ${formatDate(receipt.paymentDate)}</p>
          </div>
          
          <div class="section">
            <h3>Thông tin thanh toán</h3>
            <div class="details">
              <div class="row">
                <div class="label">Mã giao dịch:</div>
                <div class="value">${receipt.transactionCode}</div>
              </div>
              <div class="row">
                <div class="label">Phương thức thanh toán:</div>
                <div class="value">${translatedPaymentMethod}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Thông tin khách hàng</h3>
            <div class="details">
              <div class="row">
                <div class="label">Tên khách hàng:</div>
                <div class="value">${receipt.customerName}</div>
              </div>
              <div class="row">
                <div class="label">Số điện thoại:</div>
                <div class="value">${receipt.customerPhone}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Thông tin đơn hàng</h3>
            <div class="details">
              <div class="row">
                <div class="label">Mã đơn hàng:</div>
                <div class="value">${receipt.orderCode}</div>
              </div>
              <div class="row">
                <div class="label">Địa chỉ giao hàng:</div>
                <div class="value">${receipt.deliveryAddress}</div>
              </div>
            </div>
          </div>
          
          ${soldItemsSection}
          ${rentedItemsSection}
          ${additionalFeesSection}
          
          <div class="summary">
            <div class="total-row">
              <div class="total-label">Tổng thanh toán:</div>
              <div class="total-value">${formatCurrency(
                receipt.totalAmount
              )}</div>
            </div>
          </div>
          
          <div class="notes">
            ${
              receipt.notes
                ? `<p><strong>Ghi chú:</strong> ${receipt.notes}</p>`
                : ""
            }
          </div>
          
          <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p class="small">Ngày in: ${formatDate(
              new Date().toISOString()
            )}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  receiptWindow.document.open();
  receiptWindow.document.write(html);
  receiptWindow.document.close();

  // Add a slight delay before printing to ensure the content is fully loaded
  setTimeout(() => {
    receiptWindow.print();
  }, 500);
};
