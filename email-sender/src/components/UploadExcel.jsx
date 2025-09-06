import React from "react";
import * as XLSX from "xlsx";

const UploadExcel = ({ setEmails }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // First column ke emails
      const emailsArray = data.map((row) => row[0]);
      setEmails(emailsArray);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="mb-3">
      <label className="form-label">Upload Excel File (Emails)</label>
      <input
        type="file"
        className="form-control"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default UploadExcel;
