// src/services/receiptService.ts
import { PaymentReceiptDto } from "../../../types/staffPayment";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { receiptStyles } from "./receiptTemplate.styles";

export const printReceipt = (receipt: PaymentReceiptDto): void => {
  const receiptWindow = window.open("", "_blank");
  if (!receiptWindow) return;

  const html = `
    <html>
    <head>
      <title>Biên lai thanh toán</title>
      <style>${receiptStyles}</style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1>Biên lai thanh toán</h1>
          <p>Biên lai #: ${receipt.receiptId}</p>
          <p>Ngày: ${formatDate(receipt.paymentDate)}</p>
        </div>
        
        <div class="details">
          <div class="row">
            <div class="label">Mã giao dịch:</div>
            <div class="value">${receipt.transactionCode}</div>
          </div>
          
          <div class="row">
            <div class="label">Tên khách hàng:</div>
            <div class="value">${receipt.customerName}</div>
          </div>
          
          <div class="row">
            <div class="label">Số điện thoại khách hàng:</div>
            <div class="value">${receipt.customerPhone}</div>
          </div>
          
          <div class="row">
            <div class="label">Mã đơn hàng:</div>
            <div class="value">${receipt.orderId}</div>
          </div>
          
          <div class="row">
            <div class="label">Phương thức thanh toán:</div>
            <div class="value">${receipt.paymentMethod}</div>
          </div>
          
          <div class="row">
            <div class="label">Số tiền:</div>
            <div class="value">${formatCurrency(receipt.amount)}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  receiptWindow.document.open();
  receiptWindow.document.write(html);
  receiptWindow.document.close();
  receiptWindow.print();
};
