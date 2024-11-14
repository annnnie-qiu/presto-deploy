import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  // Test to check if siderbar renders all items
  it('renders sidebar with all items', () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    expect(screen.getByAltText('Presto Logo')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('My Recent One')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Setting')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  // Test to check navigation to the dashboard
  it('navigates to dashboard when Dashboard button is clicked', () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // Test to check navigation to the latest presentation
  it('navigates to the latest presentation when My Recent One is clicked', () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    const myPresentationsButton = screen.getByText('My Recent One');
    fireEvent.click(myPresentationsButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/presentation/${presentationsMock[0].id}`);
  });

  // Test to check if error toast is shown when there are no presentations
  it('shows error toast when My Recent One is clicked with no presentations', () => {
    renderComponent({ darkMode: false, presentations: [] });

    const myPresentationsButton = screen.getByText('My Recent One');
    fireEvent.click(myPresentationsButton);

    expect(showErrorToast).toHaveBeenCalledWith('No presentations available.');
  });

  // No Profile now
  // Test to check navigation to the setting page
  // it('navigates to profile page when Profile button is clicked', () => {
  //   renderComponent({ darkMode: false, presentations: presentationsMock });

  //   const profileButton = screen.getByText('Profile');
  //   fireEvent.click(profileButton);

  //   expect(mockNavigate).toHaveBeenCalledWith('/profile');
  // });

  // No Setting now
  // Test to check logout functionality
  // it('navigates to settings page when Setting button is clicked', () => {
  //   renderComponent({ darkMode: false, presentations: presentationsMock });

  //   const settingButton = screen.getByText('Setting');
  //   fireEvent.click(settingButton);

  //   expect(mockNavigate).toHaveBeenCalledWith('/setting');
  // });

  // Test to check logout functionality
  it('logs out and navigates to home page when Logout button is clicked', () => {
    renderComponent({ darkMode: false, presentations: presentationsMock });

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});