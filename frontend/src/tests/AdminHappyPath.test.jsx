import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import Sidebar from '../components/Sidebar';
import DashboardBanner from '../components/DashboardBanner';
import DashboardPresentationList from '../components/DashboardPresentationList';
import PresentationPage from '../pages/PresentationPage'
import * as api from '../../utils/API/Login_Register/login_register';
import * as presentationApi from '../../utils/API/Send_ReceiveDetail/send_receiveDetail';
import { useNavigate } from 'react-router-dom';

vi.mock('../../utils/API/Login_Register/login_register', () => ({
  login: vi.fn(),
  register: vi.fn(),
}));

vi.mock('../../utils/API/Send_ReceiveDetail/send_receiveDetail', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getDetail: vi.fn().mockResolvedValue({ store: { presentations: [] } }),
    sendDetail: vi.fn().mockResolvedValue({ success: true }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock localStorage with spies to track calls to setItem and removeItem
const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
const removeItemSpy = vi.spyOn(Storage.prototype, 'removeItem');

// Mock window.getComputedStyle to prevent JSDOM errors
window.getComputedStyle = vi.fn(() => ({
  getPropertyValue: vi.fn(),
}));

describe('Admin Register Flow', () => {
  it('Registers successfully and redirects to dashboard', async () => {
    // Mock the register API call to return a valid token
    api.register.mockResolvedValue({ token: 'mocked-token' });

    // Mock useNavigate
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Render the register page
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Fill out and submit the register form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Admin User' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for localStorage.setItem to be called with the token
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('token', 'mocked-token');
    });

    // Verify redirection to the dashboard after registration
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});

describe('Admin Logout Flow', () => {
  it('Logs out successfully and redirects to login page', async () => {
    // Mock useNavigate
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Simulate a logged-in state by setting a token in localStorage
    setItemSpy.mockImplementation(() => {});
    setItemSpy('token', 'mocked-token');

    // Render the sidebar component that contains the logout button
    render(
      <BrowserRouter>
        <Sidebar darkMode={false} presentations={[]} />
      </BrowserRouter>
    );

    // Simulate clicking the logout button
    fireEvent.click(screen.getByRole('menuitem', { name: /Logout/i }));

    // Wait for localStorage.removeItem to be called with the token key
    await waitFor(() => {
      expect(removeItemSpy).toHaveBeenCalledWith('token');
    });

    // Verify redirection to the login page after logout
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});

describe('Admin Register, Create and Update Presentation Flow', () => {
  it('Registers, creates a new presentation, and updates it successfully', async () => {
    // Mock the register API call to return a valid token
    api.register.mockResolvedValue({ token: 'mocked-token' });

    // Mock useNavigate
    const mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Render the register page
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    // Fill out and submit the register form
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@example.com' } });
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Admin User' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    // Wait for localStorage.setItem to be called with the token
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('token', 'mocked-token');
    });

    // Verify redirection to the dashboard after registration
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    // Render the dashboard banner component that contains the create button
    render(
      <BrowserRouter>
        <DashboardBanner darkMode={false} onCreate={() => mockNavigate('/new-presentation')} />
      </BrowserRouter>
    );

    // Simulate clicking the 'New presentation' button
    fireEvent.click(screen.getByRole('button', { name: /New presentation/i }));

    // Verify redirection to the new presentation page
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/new-presentation');
    });

    // Render the dashboard presentation list component to update the presentation
    render(
      <BrowserRouter>
        <DashboardPresentationList presentations={[{ id: 1, name: 'Test Presentation', thumbnail: '', description: '' }]} refetchPresentations={vi.fn()} />
      </BrowserRouter>
    );

    // Simulate clicking the edit button to update the presentation
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    // Update the name and description in the modal
    fireEvent.change(screen.getByPlaceholderText('Enter presentation name'), { target: { value: 'Updated Presentation Name' } });
    fireEvent.change(screen.getByPlaceholderText('Enter presentation description'), { target: { value: 'Updated Description' } });

    // Mock API response for updating the presentation
    presentationApi.sendDetail.mockResolvedValue({ success: true });

    // Simulate clicking the save button
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    // Verify that the presentation name and description have been updated
    await waitFor(() => {
      expect(screen.getByDisplayValue('Updated Presentation Name')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Updated Description')).toBeInTheDocument();
    });
  });
});

// describe('Create and Update Presentation Flow', () => {
//   it('Registers, creates a new presentation, updates it, and deletes a slide successfully', async () => {
//     // Mock the register API call to return a valid token
//     api.register.mockResolvedValue({ token: 'mocked-token' });

//     // Mock useNavigate
//     const mockNavigate = vi.fn();
//     useNavigate.mockReturnValue(mockNavigate);

//     // Render the register page
//     render(
//       <BrowserRouter>
//         <RegisterPage />
//       </BrowserRouter>
//     );

//     // Fill out and submit the register form
//     fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@example.com' } });
//     fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Admin User' } });
//     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
//     fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });
//     fireEvent.click(screen.getByRole('button', { name: /Register/i }));

//     // Wait for localStorage.setItem to be called with the token
//     await waitFor(() => {
//       expect(setItemSpy).toHaveBeenCalledWith('token', 'mocked-token');
//     });

//     // Verify redirection to the dashboard after registration
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
//     });

//     // Render the dashboard banner component that contains the create button
//     render(
//       <BrowserRouter>
//         <DashboardBanner darkMode={false} onCreate={() => mockNavigate('/new-presentation')} />
//       </BrowserRouter>
//     );

//     // Simulate clicking the 'New presentation' button
//     fireEvent.click(screen.getByRole('button', { name: /New presentation/i }));

//     // Verify redirection to the new presentation page
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/new-presentation');
//     });

//     // Render the dashboard presentation list component to update the presentation
//     render(
//       <BrowserRouter>
//         <DashboardPresentationList presentations={[{ id: 1, name: 'Test Presentation', thumbnail: '', description: '' }]} refetchPresentations={vi.fn()} />
//       </BrowserRouter>
//     );

//     // Simulate clicking the edit button to update the presentation
//     fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

//     // Update the name and description in the modal
//     fireEvent.change(screen.getByPlaceholderText('Enter presentation name'), { target: { value: 'Updated Presentation Name' } });
//     fireEvent.change(screen.getByPlaceholderText('Enter presentation description'), { target: { value: 'Updated Description' } });

//     // Mock API response for updating the presentation
//     presentationApi.sendDetail.mockResolvedValue({ success: true });

//     // Simulate clicking the save button
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /Save/i }));
//     });

//     // Verify that the presentation name and description have been updated
//     await waitFor(() => {
//       expect(screen.getByDisplayValue('Updated Presentation Name')).toBeInTheDocument();
//       expect(screen.getByDisplayValue('Updated Description')).toBeInTheDocument();
//     });

//     // Render the presentation page to delete a slide from the presentation
//     render(
//       <BrowserRouter>
//         <PresentationPage presentationId={1} />
//       </BrowserRouter>
//     );

//     // Mock API response for getting updated presentation details
//     presentationApi.getDetail.mockResolvedValue({ store: { presentations: [{ id: 1, name: 'Updated Presentation Name', slides: [{ slideId: 1 }] }] } });

//     // Simulate deleting a slide
//     await act(async () => {
//       fireEvent.click(screen.getByRole('button', { name: /delete/i }));
//     });

//     // Mock API call to update the store after deleting a slide
//     await presentationApi.sendDetail.mockResolvedValue({ success: true });

//     // Verify redirection to the dashboard after deleting the slide
//     await waitFor(() => {
//       expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
//     });
//   });
// });
