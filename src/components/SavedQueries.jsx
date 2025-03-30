import React, { useState } from 'react';
import '../styles/SavedQueries.css';

function SavedQueries({ queries, loadQuery, setSavedQueries }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQueries = queries.filter(query =>
    query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    query.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteQuery = (index, e) => {
    e.stopPropagation();
    setSavedQueries(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="saved-queries">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search saved queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredQueries.length === 0 ? (
        <p className="empty-saved">No saved queries found</p>
      ) : (
        <ul className="saved-list">
          {filteredQueries.map((query, index) => (
            <li key={index} onClick={() => loadQuery(query.query)}>
              <div className="query-header">
                <span className="query-name">{query.name}</span>
                <button 
                  className="delete-button" 
                  onClick={(e) => deleteQuery(index, e)}
                >
                  Delete
                </button>
              </div>
              <div className="query-text">{query.query}</div>
              <div className="query-time">{new Date(query.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SavedQueries;