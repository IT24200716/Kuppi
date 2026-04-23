import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', price: '' });
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5001/api/items';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch items. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError('Name and price are required.');
      return;
    }
    try {
      await axios.post(API_URL, formData);
      setFormData({ name: '', description: '', price: '' });
      fetchItems();
    } catch (err) {
      setError('Failed to add item.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (err) {
      setError('Failed to delete item.');
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="app-header">
          <h1>Item Manager</h1>
          <p className="subtitle">Manage your inventory beautifully</p>
        </header>

        {error && <div className="error-banner">{error}</div>}

        <div className="content-grid">
          <div className="form-section">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit} className="item-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Wireless Mouse"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Item details..."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
              <button type="submit" className="submit-btn">
                Add Item
              </button>
            </form>
          </div>

          <div className="items-section">
            <h2>Current Inventory</h2>
            {loading ? (
              <div className="loading-state">Loading items...</div>
            ) : items.length === 0 ? (
              <div className="empty-state">No items found. Add some above!</div>
            ) : (
              <div className="items-list">
                {items.map((item) => (
                  <div key={item._id} className="item-card">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-desc">{item.description}</p>
                      <span className="item-price">${Number(item.price).toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="delete-btn"
                      aria-label="Delete item"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
