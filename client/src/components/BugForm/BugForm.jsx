import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createBug } from '../../services/bugService';

const BugForm = ({ onBugCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const newBug = await createBug(formData);
      onBugCreated(newBug);
      setFormData({
        title: '',
        description: '',
        priority: 'medium'
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bug-form">
      <h2>Report a Bug</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

BugForm.propTypes = {
  onBugCreated: PropTypes.func.isRequired
};

export default BugForm;