import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardPresentationList from '../components/DashboardPresentationList';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/toastUtils';
import { getDetail } from '../../utils/API/Send_ReceiveDetail/send_receiveDetail';

// Mocking the modules needed
vi.mock('../../utils/toastUtils', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

vi.mock('../../utils/API/Send_ReceiveDetail/send_receiveDetail', () => ({
  getDetail: vi.fn(),
  sendDetail: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('DashboardPresentationList Component', () => {
  const mockNavigate = vi.fn();
  const presentationsMock = [
    { id: '1', name: 'Presentation 1', description: 'Description 1', numSlides: 5 },
    { id: '2', name: 'Presentation 2', description: 'Description 2', numSlides: 10 },
  ];

  // Set up before each test
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  // Render the DashboardPresentationList component
  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <DashboardPresentationList {...props} />
      </BrowserRouter>
    );

  // Test to check if the presentation list renders correctly
  it('renders presentation list correctly', async () => {
    renderComponent({ presentations: presentationsMock });

    await waitFor(() => {
      expect(screen.getByText('Your Presentation List')).toBeInTheDocument();
      expect(screen.getByText('Presentation 1')).toBeInTheDocument();
      expect(screen.getByText('Presentation 2')).toBeInTheDocument();
    });
  });

  // Test to check if no presentations message is shown
  it('shows no presentations message when there are no presentations', async () => {
    renderComponent({ presentations: [] });

    await waitFor(() => {
      expect(screen.getByText('No presentations available. Create a new one!')).toBeInTheDocument();
    });
  });

  // Test to check navigation to a specific presentation
  it('navigates to a specific presentation when a card is clicked', async () => {
    renderComponent({ presentations: presentationsMock });

    const presentationCard = screen.getByText('Presentation 1');
    fireEvent.click(presentationCard);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/presentation/1');
    });
  });

  // Test to check if edit modal is displayed when edit button is clicked
  it('opens edit modal when edit button is clicked', async () => {
    renderComponent({ presentations: presentationsMock });

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Modify the name or description?')).toBeInTheDocument();
    });
  });

  // Test to check if presentation is updated successfully
  it('updates presentation details successfully', async () => {
    getDetail.mockResolvedValue({ store: { presentations: presentationsMock } });
    renderComponent({ presentations: presentationsMock, refetchPresentations: vi.fn() });

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Modify the name or description?')).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('Enter presentation name');
    fireEvent.change(nameInput, { target: { value: 'Updated Presentation 1' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(showSuccessToast).toHaveBeenCalledWith('Presentation updated successfully!');
    });
  });

  // Test to check if error toast is shown when trying to update with an empty name
  it('shows error toast when trying to update with an empty name', async () => {
    renderComponent({ presentations: presentationsMock, refetchPresentations: vi.fn() });

    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Modify the name or description?')).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('Enter presentation name');
    fireEvent.change(nameInput, { target: { value: '' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith('Presentation name cannot be empty.');
    });
  });
});
