import React, { useState, useEffect } from 'react';
import { getBugs, updateBug, deleteBug } from '../../services/bugService';

const BugList = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const response = await getBugs();
        setBugs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBugs();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedBug = await updateBug(id, { status: newStatus });
      setBugs(bugs.map(bug => 
        bug._id === id ? updatedBug.data : bug
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBug(id);
      setBugs(bugs.filter(bug => bug._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bug-list">
      <h2>Bug List</h2>
      {bugs.length === 0 ? (
        <p>No bugs reported yet.</p>
      ) : (
        <ul>
          {bugs.map(bug => (
            <li key={bug._id} className={`bug-item ${bug.status}`}>
              <h3>{bug.title}</h3>
              <p>{bug.description}</p>
              <div>
                <span>Priority: {bug.priority}</span>
                <span>Status: 
                  <select
                    value={bug.status}
                    onChange={(e) => handleStatusChange(bug._id, e.target.value)}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </span>
                <button onClick={() => handleDelete(bug._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BugList;