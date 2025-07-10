import { useState, useEffect } from 'react';
import { getBugs, createBug, updateBug, deleteBug } from '../services/bugService';

export const useBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await getBugs();
      setBugs(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBug = async (bugData) => {
    try {
      const newBug = await createBug(bugData);
      setBugs(prev => [...prev, newBug.data]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const modifyBug = async (id, bugData) => {
    try {
      const updatedBug = await updateBug(id, bugData);
      setBugs(prev => 
        prev.map(bug => bug._id === id ? updatedBug.data : bug)
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const removeBug = async (id) => {
    try {
      await deleteBug(id);
      setBugs(prev => prev.filter(bug => bug._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return {
    bugs,
    loading,
    error,
    addBug,
    modifyBug,
    removeBug,
    refreshBugs: fetchBugs
  };
};