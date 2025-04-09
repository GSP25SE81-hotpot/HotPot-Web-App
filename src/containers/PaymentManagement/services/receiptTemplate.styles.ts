export const receiptStyles = `
  body {
    font-family: "Roboto", "Helvetica", sans-serif;
    margin: 0;
    padding: 20px;
    color: #333;
  }

  .receipt {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 20px;
  }

  .header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 24px;
  }

  .header p {
    margin: 5px 0;
    color: #555;
  }

  .details {
    margin-bottom: 30px;
  }

  .row {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px solid #f9f9f9;
    padding-bottom: 5px;
  }

  .label {
    font-weight: bold;
    width: 200px;
    color: #555;
  }

  .value {
    flex: 1;
  }

  .footer {
    margin-top: 40px;
    text-align: center;
    font-size: 14px;
    color: #777;
    border-top: 2px solid #f0f0f0;
    padding-top: 20px;
  }
`;
