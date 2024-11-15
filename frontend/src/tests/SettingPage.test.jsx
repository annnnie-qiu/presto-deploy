import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import SettingPage from '../pages/SettingPage';
import * as presentationApi from '../../utils/API/Send_ReceiveDetail/send_receiveDetail';

// Mocking the modules needed
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

vi.mock('../../utils/API/Send_ReceiveDetail/send_receiveDetail', () => ({
  getDetail: vi.fn(),
}));

vi.mock('../../utils/toastUtils', () => ({
  showErrorToast: vi.fn(),
}));

// Mock console.log to suppress output during tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  console.log.mockRestore();
});

describe('SettingPage Component', () => {
  const mockNavigate = vi.fn();
  const mockLocation = { pathname: '/settings' };

  // Set up before each test
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useLocation.mockReturnValue(mockLocation);

    // Mock the localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key],
        setItem: (key, value) => {
          store[key] = value;
        },
        clear: () => {
          store = {};
        },
      };
    })();

    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  // Render the SettingPage component
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <SettingPage />
      </BrowserRouter>
    );

  it('shows and hides the form when clicking the button', async () => {
    // Mock the API response
    presentationApi.getDetail.mockResolvedValue({
      store: {
        username: 'admin',
        password: 'password',
        presentations: [],
      },
    });

    // Set a token in localStorage
    localStorage.setItem('token', 'mocked-token');

    // Render the SettingPage component
    renderComponent();

    // Click on the button to show the form
    fireEvent.click(screen.getByRole('button', { name: /check here to motifiy your setting/i }));

    // Wait for the form to be visible
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    // Click the button again to hide the form
    fireEvent.click(screen.getByRole('button', { name: /check here to motifiy your setting/i }));

    // Wait for the form to be hidden
    await waitFor(() => {
      expect(screen.queryByLabelText('Username')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Password')).not.toBeInTheDocument();
    });
  });

  it('navigates to the dashboard when clicking the Dashboard button in the sidebar', async () => {
    // Mock the API response
    presentationApi.getDetail.mockResolvedValue({
      store: {
        presentations: [{ id: 1, name: 'Test Presentation' }],
      },
    });

    // Set a token in localStorage
    localStorage.setItem('token', 'mocked-token');

    // Render the SettingPage component
    renderComponent();

    // Click the Dashboard button
    const dashboardButton = screen.getByText('Dashboard');
    fireEvent.click(dashboardButton);

    // Wait for the navigation to happen
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
