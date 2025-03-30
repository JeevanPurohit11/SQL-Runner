import React, { useState, useEffect } from 'react';
import QueryEditor from './components/QueryEditor';
import ResultTable from './components/ResultTable';
import QueryHistory from './components/QueryHistory';
import SavedQueries from './components/SavedQueries';
import ThemeToggle from './components/ThemeToggle';
import FileUpload from './components/FileUpload';
import QuerySelector from './components/QuerySelector';
import './styles/App.css';
import './styles/Theme.css';

const PREDEFINED_QUERIES = [
  {
    name: "Get All Customers",
    query: "SELECT * FROM customers",
    description: "Retrieves all customer records"
  },
  {
    name: "Get Recent Orders",
    query: "SELECT * FROM orders ORDER BY order_date DESC LIMIT 10",
    description: "Shows the 10 most recent orders"
  },
  {
    name: "Get Products by Category",
    query: "SELECT product_id, name, category, price FROM products ORDER BY category",
    description: "Lists products grouped by category"
  },
  {
    name: "Get Order Details",
    query: "SELECT o.order_id, c.name, o.order_date, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id",
    description: "Shows order details with customer names"
  },
  {
    name: "Get Out of Stock Items",
    query: "SELECT product_id, name, stock FROM products WHERE stock <= 0",
    description: "Lists products that are out of stock"
  }
];

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);
  const [activeTab, setActiveTab] = useState('editor');
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedQueries = localStorage.getItem('savedQueries');
    if (storedQueries) {
      setSavedQueries(JSON.parse(storedQueries));
    }

    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme) {
      setDarkMode(JSON.parse(storedTheme));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
  }, [savedQueries]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const executeQuery = () => {
    if (!query.trim()) return;
    
    setLoading(true);
    
  
    setTimeout(() => {
      const mockResults = generateMockResult(query);
      setResult(mockResults);
      setCurrentPage(1); 
      setHistory(prev => [{ query, timestamp: new Date().toISOString() }, ...prev.slice(0, 9)]);
      
      setLoading(false);
    }, 500);
  };

  const saveQuery = () => {
    if (!query.trim()) return;
    
    const queryName = prompt('Enter a name for this query:');
    if (queryName) {
      setSavedQueries(prev => [...prev, { name: queryName, query, timestamp: new Date().toISOString() }]);
    }
  };

  const loadQuery = (selectedQuery) => {
    setQuery(selectedQuery);
    setActiveTab('editor');
  };

  const clearQuery = () => {
    setQuery('');
    setResult(null);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleFileUpload = (data) => {
    setUploadedData(data);
    setActiveTab('editor');
  };

  const handlePagination = (direction) => {
    if (direction === 'next') {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev') {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    }
  };

  const getPaginatedData = () => {
    if (!result?.data) return null;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: result.data.slice(startIndex, endIndex),
      columns: result.columns,
      totalItems: result.data.length,
      totalPages: Math.ceil(result.data.length / itemsPerPage),
      currentPage
    };
  };

  const paginatedData = getPaginatedData();

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <h1>SQL Query Runner</h1>
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      </header>
      
      <div className="app-container">
        <div className="sidebar">
          <div className="tabs">
            <button 
              className={activeTab === 'editor' ? 'active' : ''}
              onClick={() => setActiveTab('editor')}
            >
              Query Editor
            </button>
            <button 
              className={activeTab === 'saved' ? 'active' : ''}
              onClick={() => setActiveTab('saved')}
            >
              Saved Queries
            </button>
            <button 
              className={activeTab === 'history' ? 'active' : ''}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
            <button 
              className={activeTab === 'upload' ? 'active' : ''}
              onClick={() => setActiveTab('upload')}
            >
              Upload CSV
            </button>
          </div>
          
          {activeTab === 'editor' && (
            <>
              <QuerySelector 
                predefinedQueries={PREDEFINED_QUERIES}
                onSelectQuery={(selectedQuery) => {
                  setQuery(selectedQuery);
                  executeQuery();
                }}
              />
              <QueryEditor 
                query={query} 
                setQuery={setQuery} 
                executeQuery={executeQuery} 
                saveQuery={saveQuery} 
                clearQuery={clearQuery}
                loading={loading}
              />
            </>
          )}
          
          {activeTab === 'saved' && (
            <SavedQueries 
              queries={savedQueries} 
              loadQuery={loadQuery} 
              setSavedQueries={setSavedQueries}
            />
          )}
          
          {activeTab === 'history' && (
            <QueryHistory 
              history={history} 
              loadQuery={loadQuery}
            />
          )}

          {activeTab === 'upload' && (
            <FileUpload onFileUpload={handleFileUpload} />
          )}
        </div>
        
        <div className="main-content">
          {loading ? (
            <div className="loading-spinner">Executing query...</div>
          ) : paginatedData ? (
            <>
              <ResultTable 
                data={paginatedData.data} 
                columns={paginatedData.columns} 
              />
              <div className="pagination-controls">
                <button 
                  onClick={() => handlePagination('prev')}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {paginatedData.totalPages} 
                  (Showing {paginatedData.data.length} of {paginatedData.totalItems} items)
                </span>
                <button 
                  onClick={() => handlePagination('next')}
                  disabled={currentPage === paginatedData.totalPages}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              {uploadedData ? (
                <>
                  <p>CSV data loaded successfully!</p>
                  <p>Run a query to see results here</p>
                </>
              ) : (
                <p>Run a query to see results here</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function generateMockResult(query) {
  
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('select') && lowerQuery.includes('customers')) {
    return {
      columns: ['id', 'name', 'email', 'country', 'subscription_date'],
      data: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        country: ['USA', 'Canada', 'UK', 'Australia', 'Germany'][Math.floor(Math.random() * 5)],
        subscription_date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      }))
    };
  } else if (lowerQuery.includes('select') && (lowerQuery.includes('orders') || lowerQuery.includes('order_date'))) {
    return {
      columns: ['order_id', 'customer_id', 'product', 'quantity', 'price', 'order_date'],
      data: Array.from({ length: 25 }, (_, i) => ({
        order_id: 1000 + i + 1,
        customer_id: Math.floor(Math.random() * 10) + 1,
        product: ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headphones'][Math.floor(Math.random() * 7)],
        quantity: Math.floor(Math.random() * 5) + 1,
        price: [999.99, 699.99, 349.99, 249.99, 49.99, 29.99, 99.99][Math.floor(Math.random() * 7)],
        order_date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      }))
    };
  } else if (lowerQuery.includes('select') && (lowerQuery.includes('products') || lowerQuery.includes('category'))) {
    return {
      columns: ['product_id', 'name', 'category', 'price', 'stock'],
      data: Array.from({ length: 25 }, (_, i) => ({
        product_id: i + 1,
        name: `Product ${i + 1}`,
        category: ['Electronics', 'Accessories', 'Furniture', 'Clothing', 'Food'][Math.floor(Math.random() * 5)],
        price: (Math.random() * 1000 + 10).toFixed(2),
        stock: Math.floor(Math.random() * 100)
      }))
    };
  } else if (lowerQuery.includes('select') && lowerQuery.includes('out of stock')) {
    return {
      columns: ['product_id', 'name', 'stock'],
      data: [
        { product_id: 17, name: 'Alice Mutton', stock: 0 },
        { product_id: 29, name: 'Thüringer Rostbratwurst', stock: 0 },
        { product_id: 53, name: 'Perth Pasties', stock: 0 }
      ]
    };
  } else {
    // Default mock result
    return {
      columns: ['id', 'name', 'value', 'created_at'],
      data: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: (i + 1) * 100,
        created_at: `2023-01-${String(i + 1).padStart(2, '0')}`
      }))
    };
  }
}

export default App;