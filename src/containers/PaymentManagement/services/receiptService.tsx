// src/services/receiptService.ts
import { PaymentReceiptDto } from "../../../types/staffPayment";
import { formatCurrency, formatDate } from "../../../utils/formatters";

export const printReceipt = (receipt: PaymentReceiptDto): void => {
  const receiptWindow = window.open("", "_blank");
  if (!receiptWindow) return;

  const html = `
    <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; }
          .header { text-align: center; margin-bottom: 20px; }
          .details { margin-bottom: 20px; }
          .row { display: flex; margin-bottom: 10px; }
          .label { font-weight: bold; width: 200px; }
          .value { flex: 1; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1>Payment Receipt</h1>
            <p>Receipt #: ${receipt.receiptId}</p>
            <p>Date: ${formatDate(receipt.paymentDate)}</p>
          </div>
          <div class="details">
            <div class="row">
              <div class="label">Transaction Code:</div>
              <div class="value">${receipt.transactionCode}</div>
            </div>
            <div class="row">
              // src/services/receiptService.ts (continued)
              <div class="value">${receipt.customerName}</div>
            </div>
            <div class="row">
              <div class="label">Customer Phone:</div>
              <div class="value">${receipt.customerPhone}</div>
            </div>
            <div class="row">
              <div class="label">Order ID:</div>
              <div class="value">${receipt.orderId}</div>
            </div>
            <div class="row">
              <div class="label">Payment Method:</div>
              <div class="value">${receipt.paymentMethod}</div>
            </div>
            <div class="row">
              <div class="label">Amount:</div>
              <div class="value">${formatCurrency(receipt.amount)}</div>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for your business!</p>
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
