import React, { useState } from 'react';
import Papa from 'papaparse';
import '../styles/FileUpload.css';

function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a CSV file');
        setFile(null);
      }
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const columns = Object.keys(results.data[0]);
          onFileUpload({
            data: results.data,
            columns: columns,
            fileName: file.name
          });
        } else {
          setError('The CSV file is empty or could not be parsed');
        }
      },
      error: (error) => {
        setError('Error parsing CSV: ' + error.message);
      }
    });
  };

  return (
    <div className="file-upload">
      <h3>Upload CSV File</h3>
      <div className="upload-controls">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-button">
          Upload
        </button>
      </div>
      {file && (
        <div className="file-info">
          Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default FileUpload;