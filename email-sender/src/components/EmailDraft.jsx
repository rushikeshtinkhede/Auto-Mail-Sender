import React from "react";

const EmailDraft = ({ draft, setDraft }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Email Draft</label>
      <textarea
        className="form-control"
        rows="6"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      ></textarea>
    </div>
  );
};

export default EmailDraft;
