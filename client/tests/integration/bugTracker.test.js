import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../../src/App';
import { useBugs } from '../../src/hooks/useBugs';
import * as bugService from '../../src/services/bugService';

// Mock the useBugs hook
jest.mock('../../src/hooks/useBugs');

// Mock the bug service
jest.mock('../../src/services/bugService');

describe('Bug Tracker Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Test Bug 1',
      description: 'Description 1',
      status: 'open',
      priority: 'medium'
    },
    {
      _id: '2',
      title: 'Test Bug 2',
      description: 'Description 2',
      status: 'in-progress',
      priority: 'high'
    }
  ];

  beforeEach(() => {
    // Mock useBugs implementation
    useBugs.mockReturnValue({
      bugs: mockBugs,
      loading: false,
      error: null,
      addBug: jest.fn().mockImplementation((bug) => 
        Promise.resolve({ success: true, data: { ...bug, _id: '3' } })
      ),
      modifyBug: jest.fn().mockResolvedValue({ success: true }),
      removeBug: jest.fn().mockResolvedValue({ success: true })
    });

    // Mock service implementations
    bugService.getBugs.mockResolvedValue({ data: mockBugs });
    bugService.createBug.mockImplementation((bug) => 
      Promise.resolve({ data: { ...bug, _id: '3' } })
    );
    bugService.updateBug.mockImplementation((id, data) => 
      Promise.resolve({ data: { ...mockBugs.find(b => b._id === id), ...data } })
    );
    bugService.deleteBug.mockResolvedValue({});
  });

  test('renders bug list and form', async () => {
    render(<App />);
    
    // Check if bugs are rendered
    expect(await screen.findByText('Test Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    
    // Check if form is rendered
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('can create a new bug', async () => {
    render(<App />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title:'), {
      target: { value: 'New Bug' }
    });
    fireEvent.change(screen.getByLabelText('Description:'), {
      target: { value: 'New description' }
    });
    fireEvent.change(screen.getByLabelText('Priority:'), {
      target: { value: 'high' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit'));
    
    // Verify the service was called
    await waitFor(() => {
      expect(bugService.createBug).toHaveBeenCalledWith({
        title: 'New Bug',
        description: 'New description',
        priority: 'high'
      });
    });
  });

  test('can update bug status', async () => {
    render(<App />);
    
    // Find the first bug's status dropdown
    const statusSelects = await screen.findAllByRole('combobox');
    fireEvent.change(statusSelects[0], { target: { value: 'resolved' } });
    
    // Verify the service was called
    await waitFor(() => {
      expect(bugService.updateBug).toHaveBeenCalledWith('1', { status: 'resolved' });
    });
  });

  test('can delete a bug', async () => {
    render(<App />);
    
    // Find the first delete button
    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Verify the service was called
    await waitFor(() => {
      expect(bugService.deleteBug).toHaveBeenCalledWith('1');
    });
  });

  test('shows loading state', async () => {
    // Override the mock to show loading
    useBugs.mockReturnValueOnce({
      bugs: [],
      loading: true,
      error: null,
      addBug: jest.fn(),
      modifyBug: jest.fn(),
      removeBug: jest.fn()
    });
    
    render(<App />);
    expect(screen.getByText('Loading bugs...')).toBeInTheDocument();
  });

  test('shows error state', async () => {
    // Override the mock to show error
    useBugs.mockReturnValueOnce({
      bugs: [],
      loading: false,
      error: 'Failed to fetch bugs',
      addBug: jest.fn(),
      modifyBug: jest.fn(),
      removeBug: jest.fn()
    });
    
    render(<App />);
    expect(screen.getByText('Error: Failed to fetch bugs')).toBeInTheDocument();
  });
});