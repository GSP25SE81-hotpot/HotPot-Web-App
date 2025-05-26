export const receiptStyles = `
  body {
    font-family: "Roboto", "Helvetica", sans-serif;
    margin: 0;
    padding: 10px;
    color: #333;
    font-size: 12px;
  }
  
  .receipt {
    max-width: 800px;
    margin: 0 auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 10px;
  }
  
  .logo {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 6px;
    color: #2c3e50;
  }
  
  .header h1 {
    color: #2c3e50;
    margin-bottom: 6px;
    font-size: 24px;
  }
  
  .header p {
    margin: 5px 0;
    color: #555;
  }
  
  .section {
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 12px;
  }
  
  .section h3 {
    color: #2c3e50;
    font-size: 16px;
    margin-bottom: 10px;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 3px;
  }
  
  .details {
    margin-bottom: 12px;
  }
  
  .row {
    display: flex;
    margin-bottom: 4px;
  }
  
  .label {
    font-weight: bold;
    width: 200px;
    color: #555;
  }
  
  .value {
    flex: 1;
  }
  
  .highlight {
    font-weight: bold;
    color: #2c3e50;
  }
  
  .items-table, .fees-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
  }
  
  .items-table th, .fees-table th {
    background-color: #f5f5f5;
    padding: 4px;
    text-align: left;
    font-weight: bold;
    border-bottom: 2px solid #ddd;
  }
  
  .items-table td, .fees-table td {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }
  
  .text-center {
    text-align: center;
  }
  
  .text-right {
    text-align: right;
  }
  
  .summary {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 5px;
  }
  
  .total-row {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 16px;
    color: #2c3e50;
  }
  
  .notes {
    margin-bottom: 20px;
    font-style: italic;
    color: #666;
  }
  
  .footer {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #777;
    border-top: 2px solid #f0f0f0;
    padding-top: 10px;
  }
  
  .small {
    font-size: 10px;
    color: #999;
    margin-top: 10px;
  }
  
  @media print {
    body {
      padding: 0;
      font-size: 12px;
    }
    
    .receipt {
      border: none;
      box-shadow: none;
      padding: 0;
    }
    
    .section h3 {
      font-size: 14px;
    }
    
    .total-row {
      font-size: 14px;
    }
  }
`;
