import React from 'react';
import '../styles/QueryHistory.css';

function QueryHistory({ history, loadQuery }) {
  return (
    <div className="query-history">
      <h3>Recent Queries</h3>
      
      {history.length === 0 ? (
        <p className="empty-history">No queries in history</p>
      ) : (
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={index} onClick={() => loadQuery(item.query)}>
              <div className="query-text">{item.query}</div>
              <div className="query-time">{new Date(item.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QueryHistory;