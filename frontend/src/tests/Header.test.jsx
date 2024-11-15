import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomHeader from '../components/Header';

describe('CustomHeader Component', () => {
  let mockToggleDarkMode;

  // Set up before each test
  beforeEach(() => {
    mockToggleDarkMode = vi.fn();
  });

  // Test to check if header renders properly (welcome message, darkmode button, search box)
  it('renders header details correctly', () => {
    render(<CustomHeader darkMode={false} toggleDarkMode={mockToggleDarkMode} />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  // Test to check if dark mode toggle button works
  it('calls toggleDarkMode function when dark mode button is clicked', () => {
    render(<CustomHeader darkMode={false} toggleDarkMode={mockToggleDarkMode} />);

    const darkModeButton = screen.getByRole('button');
    fireEvent.click(darkModeButton);

    expect(mockToggleDarkMode).toHaveBeenCalled();
  });

  // Test to check if dark mode icon changes when dark mode is active
  it('displays correct icon when dark mode is active', () => {
    render(<CustomHeader darkMode={true} toggleDarkMode={mockToggleDarkMode} />);

    const sunIcon = screen.getByRole('button').querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
    expect(sunIcon).toMatchInlineSnapshot(`
      <svg
        fill="currentColor"
        height="1em"
        stroke="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"
        />
      </svg>
    `); // Check if FaSun icon is displayed
  });

  // Test to check if header renders correct icon when dark mode is inactive
  it('displays correct icon when dark mode is inactive', () => {
    render(<CustomHeader darkMode={false} toggleDarkMode={mockToggleDarkMode} />);

    const moonIcon = screen.getByRole('button').querySelector('svg');
    expect(moonIcon).toBeInTheDocument();
    expect(moonIcon).toMatchInlineSnapshot(`
      <svg
        fill="currentColor"
        height="1em"
        stroke="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"
        />
      </svg>
    `) // Check if FaMoon icon is displayed
  });

  // Test to ensure that clicking the button toggles dark mode correctly
  it('toggles dark mode icon correctly when button is clicked', () => {
    const { rerender } = render(<CustomHeader darkMode={false} toggleDarkMode={mockToggleDarkMode} />);

    let darkModeButton = screen.getByRole('button');
    fireEvent.click(darkModeButton);
    expect(mockToggleDarkMode).toHaveBeenCalled();

    rerender(<CustomHeader darkMode={true} toggleDarkMode={mockToggleDarkMode} />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });

  // Test to ensure that clicking the button toggles light mode correctly
  it('toggles light mode icon correctly when button is clicked', () => {
    const { rerender } = render(<CustomHeader darkMode={true} toggleDarkMode={mockToggleDarkMode} />);

    let lightModeButton = screen.getByRole('button');
    fireEvent.click(lightModeButton);
    expect(mockToggleDarkMode).toHaveBeenCalled();

    rerender(<CustomHeader darkMode={false} toggleDarkMode={mockToggleDarkMode} />);
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });
});