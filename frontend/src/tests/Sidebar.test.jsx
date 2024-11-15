import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from '../components/Sidebar';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { showErrorToast } from '../../utils/toastUtils';

// Mocking the modules needed
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('../../utils/toastUtils', () => ({
  showErrorToast: vi.fn(),
}));

describe('Sidebar Component', () => {
  const mockNavigate = vi.fn();
  const mockLocation = { pathname: '/dashboard' };
  const presentationsMock = [{ id: '123' }];

  // Set up before each test
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);
  });

  // Render the Sidebar component
  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <Sidebar {...props} />
      </BrowserRouter>
    );

  // Test to check if sidebar renders all items
  it('renders sidebar with all items', async () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    await waitFor(() => {
      expect(screen.getByAltText('Presto Logo')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('My Recent One')).toBeInTheDocument();
      expect(screen.getByText('Setting')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  // Test to check navigation to the dashboard
  it('navigates to dashboard when Dashboard button is clicked', async () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  // Test to check navigation to the latest presentation
  it('navigates to the latest presentation when My Recent One is clicked', async () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    const myPresentationsButton = screen.getByText('My Recent One');
    fireEvent.click(myPresentationsButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/presentation/${presentationsMock[0].id}`);
    });
  });

  // Test to check if error toast is shown when there are no presentations
  it('shows error toast when My Recent One is clicked with no presentations', async () => {
    renderComponent({ darkMode: false, presentations: [] });

    const myPresentationsButton = screen.getByText('My Recent One');
    fireEvent.click(myPresentationsButton);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('No presentations available.');
    });
  });

  // Test to check logout functionality
  it('logs out and navigates to home page when Logout button is clicked', async () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
