import React, { useState } from 'react';

import '../styles/QuerySelector.css';

function QuerySelector({ predefinedQueries, onSelectQuery }) {
  const [selectedQuery, setSelectedQuery] = useState('');

  const handleQuerySelect = (e) => {
    const selectedIndex = e.target.selectedIndex - 1; 
    if (selectedIndex >= 0) {
      const query = predefinedQueries[selectedIndex].query;
      setSelectedQuery(query);
      onSelectQuery(query);
    }
  };

  return (
    <div className="query-selector">
      <h3>Predefined Queries</h3>
      <select 
        value={selectedQuery} 
        onChange={handleQuerySelect}
        className="query-dropdown"
      >
        <option value="">Select a predefined query...</option>
        {predefinedQueries.map((query, index) => (
          <option key={index} value={query.query}>
            {query.name} - {query.description}
          </option>
        ))}
      </select>
    </div>
  );
}

export default QuerySelector;