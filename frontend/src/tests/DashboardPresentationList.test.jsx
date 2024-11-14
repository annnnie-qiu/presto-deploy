import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DashboardPresentationList from '../components/DashboardPresentationList';
import { BrowserRouter } from 'react-router-dom';

// Mock getComputedStyle to avoid JSDOM errors
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    // Mocking the return value for getComputedStyle
    getPropertyValue: () => '',
  }),
});

// Render the DashboardPresentationList component
const renderComponent = (props = {}) =>
  render(
    <BrowserRouter>
      <DashboardPresentationList {...props} />
    </BrowserRouter>
  );

describe('DashboardPresentationList Component', () => {
  const presentationsMock = [
    { id: '1', name: 'Presentation 1', description: 'Description 1', numSlides: 5 },
    { id: '2', name: 'Presentation 2', description: 'Description 2', numSlides: 10 },
  ];

  // Set up before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    await act(async () => {
      const presentationCard = screen.getByText('Presentation 1');
      fireEvent.click(presentationCard);
    });

    await waitFor(() => {
      // Check if the page contains content related to the clicked presentation
      expect(screen.getByText('Slides: 5')).toBeInTheDocument();
    });
  });

  // Test to check if edit modal is displayed when edit button is clicked
  it('opens edit modal when edit button is clicked', async () => {
    renderComponent({ presentations: presentationsMock });

    await act(async () => {
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      fireEvent.click(editButton);
    });

    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Modify the name or description'))).toBeInTheDocument();
    });
  });
});
