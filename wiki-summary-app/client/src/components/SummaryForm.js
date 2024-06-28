import React, { useState } from "react";
import axios from "axios";

const SummaryForm = () => {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/summarize", {
        url,
      });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError("An error occurred while fetching the summary.");
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Wikipedia Page Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="url">Wikipedia Page URL:</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit">Summarize</button>
      </form>
      {error && <p>{error}</p>}
      {result && (
        <div>
          <h2>Summary</h2>
          <p>
            <strong>Bankruptcy:</strong> {result.hasBankruptcy ? "Yes" : "No"}
          </p>
          <p>
            <strong>Fraud:</strong> {result.hasFraud ? "Yes" : "No"}
          </p>
          <h3>Content Summary</h3>
          <p>{result.summary.text}</p>
        </div>
      )}
    </div>
  );
};

export default SummaryForm;
