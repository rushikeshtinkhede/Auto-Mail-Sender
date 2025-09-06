import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

function App() {
  const [emails, setEmails] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const extractedEmails = parsedData
        .slice(1)
        .map((row) => row[0]?.toString().trim())
        .filter(Boolean);

      setEmails(extractedEmails);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendEmails = async () => {
    if (emails.length === 0) {
      alert("Please upload an Excel file with emails!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/send-emails", { emails });
      setMessage(response.data.message);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setMessage("Backend validation failed: " + error.response.data.message);
      } else {
        setMessage("Error sending emails!");
      }
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Email Sender Web App</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <br />
      <button onClick={sendEmails} style={{ marginTop: "10px" }}>
        Send Emails
      </button>

      <p>{message}</p>

      {emails.length > 0 && (
        <div>
          <h4>Extracted Emails:</h4>
          <ul>
            {emails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
