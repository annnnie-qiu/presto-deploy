import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardBanner from '../components/DashboardBanner';

describe('DashboardBanner Component', () => {
  let mockOnCreate;

  beforeEach(() => {
    mockOnCreate = vi.fn();
  });

  // Test to check if banner renders properly
  it('renders banner stuff correctly', () => {
    render(<DashboardBanner darkMode={false} onCreate={mockOnCreate} />);

    expect(screen.getByText('Create your new presentations')).toBeInTheDocument();
    expect(screen.getByText('Prestro makes everthing happen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new presentation/i })).toBeInTheDocument();
  });
})