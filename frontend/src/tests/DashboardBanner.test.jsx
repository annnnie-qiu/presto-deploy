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

  // Test to check if create button works
  it('calls onCreate function when New presentation button is clicked', () => {
    render(<DashboardBanner darkMode={false} onCreate={mockOnCreate} />);

    const createButton = screen.getByRole('button', { name: /new presentation/i });
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalled();
  });

  // Test to check if responsive styles are applied correctly when window width changes
  it('applies responsive styles based on window width', () => {
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(<DashboardBanner darkMode={false} onCreate={mockOnCreate} />);

    const bannerCard = screen.getByText('Create your new presentations').closest('.ant-card');
    expect(bannerCard).toHaveStyle('height: auto');
    expect(bannerCard).toHaveStyle('padding: 15px');
  });

  // Test to check if button alignment changes based on window width
  it('aligns button to center when window width is less than or equal to 600', () => {
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));

    render(<DashboardBanner darkMode={false} onCreate={mockOnCreate} />);

    const createButton = screen.getByRole('button', { name: /new presentation/i });
    expect(createButton).toHaveStyle('align-self: center');
  });
})