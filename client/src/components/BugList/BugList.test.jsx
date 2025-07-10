import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BugList from './BugList';

// Mock the bug service
jest.mock('../../services/bugService', () => ({
  getBugs: jest.fn(),
  updateBug: jest.fn(),
  deleteBug: jest.fn()
}));

describe('BugList', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Test Bug 1',
      description: 'Description 1',
      priority: 'medium',
      status: 'open'
    },
    {
      _id: '2',
      title: 'Test Bug 2',
      description: 'Description 2',
      priority: 'high',
      status: 'in-progress'
    }
  ];

  beforeEach(() => {
    require('../../services/bugService').getBugs.mockResolvedValue({
      data: mockBugs
    });
    require('../../services/bugService').updateBug.mockImplementation((id, data) => 
      Promise.resolve({ data: { ...mockBugs.find(b => b._id === id), ...data } })
    );
    require('../../services/bugService').deleteBug.mockResolvedValue({});
  });

  test('renders loading state initially', () => {
    render(<BugList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders bug list after loading', async () => {
    render(<BugList />);
    expect(await screen.findByText('Test Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
  });

  test('allows status change', async () => {
    render(<BugList />);
    const select = await screen.findByDisplayValue('open');
    fireEvent.change(select, { target: { value: 'resolved' } });
    expect(require('../../services/bugService').updateBug).toHaveBeenCalledWith('1', { status: 'resolved' });
  });

  test('allows bug deletion', async () => {
    render(<BugList />);
    const deleteButtons = await screen.findAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(require('../../services/bugService').deleteBug).toHaveBeenCalledWith('1');
  });
});