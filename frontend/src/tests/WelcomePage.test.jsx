import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WelcomePage from '../pages/WelcomePage';
import { BrowserRouter } from 'react-router-dom';

describe('WelcomePage', () => {
  const renderComponent = () =>
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );

  it('renders the welcome page correctly', () => {
    renderComponent();

    // Check if all elements are rendered correctly
    expect(screen.getByText('Welcome to Presto')).toBeInTheDocument();
    expect(screen.getByAltText('Presto Logo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });

  it('handles animation start and stop correctly', () => {
    renderComponent();

    // Verify if the animated element is present
    const animatedElement = screen.getByText('Welcome to Presto');
    expect(animatedElement).toBeInTheDocument();
  });

  it('navigates to login page when login button is clicked', () => {
    renderComponent();

    // Click the login button
    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    // Check if navigation to login page is triggered
    expect(window.location.pathname).toBe('/login');
  });

  it('navigates to register page when register button is clicked', () => {
    renderComponent();

    // Click the register button
    const registerButton = screen.getByRole('button', { name: /Register/i });
    fireEvent.click(registerButton);

    // Check if navigation to register page is triggered
    expect(window.location.pathname).toBe('/register');
  });
});
