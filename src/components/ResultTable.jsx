import React from 'react';
import '../styles/ResultTable.css';

function ResultTable({ data, columns }) {
  return (
    <div className="result-table-container">
      <div className="result-meta">
        <span>{data.length} rows returned</span>
      </div>
      
      <div className="table-wrapper">
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultTable;