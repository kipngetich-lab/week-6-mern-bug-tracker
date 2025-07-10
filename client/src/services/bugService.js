const API_URL = '/api/v1/bugs';

export const getBugs = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch bugs');
  }
  return await response.json();
};

export const createBug = async (bugData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bugData),
  });
  if (!response.ok) {
    throw new Error('Failed to create bug');
  }
  return await response.json();
};

export const updateBug = async (id, bugData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bugData),
  });
  if (!response.ok) {
    throw new Error('Failed to update bug');
  }
  return await response.json();
};

export const deleteBug = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete bug');
  }
  return await response.json();
};