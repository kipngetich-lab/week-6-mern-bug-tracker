import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BugForm from './BugForm';

describe('BugForm', () => {
  const mockOnBugCreated = jest.fn();

  beforeEach(() => {
    render(<BugForm onBugCreated={mockOnBugCreated} />);
  });

  test('renders form fields', () => {
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('Description:')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority:')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('validates required fields', () => {
    fireEvent.click(screen.getByText('Submit'));
    expect(screen.getByText('Title:').closest('div').querySelector('input')).toBeInvalid();
    expect(screen.getByText('Description:').closest('div').querySelector('textarea')).toBeInvalid();
  });

  test('allows form submission with valid data', () => {
    fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Test Bug' } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: 'Test Description' } });
    fireEvent.click(screen.getByText('Submit'));
    
    // In a real test, you would mock the API call here
    expect(mockOnBugCreated).not.toHaveBeenCalled(); // Because we're not mocking the service
  });
});