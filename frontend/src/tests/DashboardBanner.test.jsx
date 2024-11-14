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
    expect(screen.getByText('Prestro makes everything happen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new presentation/i })).toBeInTheDocument();
  });

  // Test to check if dark mode styles are applied correctly
  it('applies dark mode styles when darkMode is true', () => {
    render(<DashboardBanner darkMode={true} onCreate={mockOnCreate} />);

    const bannerCard = screen.getByText('Create your new presentations').closest('.ant-card');
    expect(bannerCard).toHaveStyle('background-color: #113536');
    expect(bannerCard).toHaveStyle('color: #f5f5f5');
  });

  // Test to check if light mode styles are applied correctly
  it('applies light mode styles when darkMode is false', () => {
    render(<DashboardBanner darkMode={false} onCreate={mockOnCreate} />);

    const bannerCard = screen.getByText('Create your new presentations').closest('.ant-card');
    expect(bannerCard).toHaveStyle('background-color: #fff');
    expect(bannerCard).toHaveStyle('color: #000');
  });
})