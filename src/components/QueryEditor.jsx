import React from 'react';
import '../styles/QueryEditor.css';

function QueryEditor({ query, setQuery, executeQuery, saveQuery, clearQuery, loading }) {
  return (
    <div className="query-editor">
      <textarea
        className="query-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your SQL query here..."
        disabled={loading}
      />
      
      <div className="button-group">
        <button 
          className="execute-button" 
          onClick={executeQuery}
          disabled={loading || !query.trim()}
        >
          Execute
        </button>
        <button 
          className="save-button" 
          onClick={saveQuery}
          disabled={loading || !query.trim()}
        >
          Save
        </button>
        <button 
          className="clear-button" 
          onClick={clearQuery}
          disabled={loading}
        >
          Clear
        </button>
      </div>
      
      <div className="sample-queries">
        <h4>Sample Queries:</h4>
        <ul>
          <li onClick={() => setQuery("SELECT * FROM customers")}>SELECT * FROM customers</li>
          <li onClick={() => setQuery("SELECT name, email FROM customers WHERE country = 'USA'")}>
            SELECT name, email FROM customers WHERE country = 'USA'
          </li>
          <li onClick={() => setQuery("SELECT product, SUM(quantity) FROM orders GROUP BY product")}>
            SELECT product, SUM(quantity) FROM orders GROUP BY product
          </li>
        </ul>
      </div>
    </div>
  );
}

export default QueryEditor;