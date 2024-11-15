# Testing Documentation

## Overview
This document provides an overview of the testing strategy for presto web. The test suite is written using React Testing Library (`@testing-library/react`) with `vitest` as the testing framework.

## Test Components
The components covered by the test include:

1. **WelcomePage** - Login button and register button
2. **Sidebar** - Contains links (nagivate) to different sections like Settings, Dashboard, Logout, etc.
3. **DashboardBanner** - Contains the option to create a new presentation.
4. **DashboardPresentationList** - Displays the presentations card which include name, descirption, thumbnail.
5. **SettingsPage** - Allows navigation back to the dashboard.
6. **Header** - Contains Welcome message, search box, dark mode button

## UI Testing for pair (AdminSadPath) - The main different is we testing our bonus if our stuff work here, for example,
## the quick fix modal in presentation list can fix the name or description.

1. **Register and Redirect to Dashboard**
   - **Action**: Render `RegisterPage` and fill out the registration form.
   - **Verification**: Check that the token is set in `localStorage` and verify that the user is redirected to the `/dashboard` page.

2. **Navigate to Settings and Return to Dashboard**
   - **Action**: Render `SettingsPage` and simulate clicking on the "Settings" menu item in the sidebar.
   - **Verification**: Ensure that the user is redirected back to the dashboard after interacting with the settings.

3. **Create New Presentation**
   - **Action**: Render `DashboardBanner` and simulate clicking the "New Presentation" button.
   - **Verification**: Confirm that the user is redirected to the `/new-presentation` page for creating a new presentation.

4. **Edit an Existing Presentation**
   - **Action**: Render `DashboardPresentationList` and simulate editing the presentation by changing the name and description.
   - **Verification**: Confirm that the updated presentation details (`Updated Presentation Name` and `Updated Description`) are displayed after saving.

5. **Navigate to Recent Presentations**
   - **Action**: Render `Sidebar` and simulate clicking the "My Recent One" section.
   - **Verification**: Verify the redirection to the recent presentation using the expected route matching `/presentation/1/1`.

6. **Logout**
   - **Action**: Simulate clicking the "Logout" button in the `Sidebar`.
   - **Verification**: Confirm that the token is removed from `localStorage` and that the user is redirected to the login page (`/`).

## Mocking and Setup

- **`useNavigate` Mocking**: The `useNavigate` function from `react-router-dom` is mocked to track calls to navigation functions.
- **Local Storage Mocking**: `localStorage.setItem` and `localStorage.removeItem` are mocked to verify interaction with authentication tokens.
- **API Mocks**: The API calls (`register`, `sendDetail`) are mocked to ensure consistent test results and avoid actual server interaction.
- **JSDOM Errors**: `window.getComputedStyle` is mocked to prevent JSDOM-related errors when interacting with styled components.

## Summary of Important Aspects
- **Testing Actions and State Changes**: Actions like form submissions, button clicks, and state changes are handled using `fireEvent` and wrapped in `act()` to ensure all state changes are properly rendered.
- **Asynchronous Behavior**: Tests involving asynchronous behavior, such as navigation and API calls, use `waitFor()` to wait for the expected outcome.
- **Coverage**: The flow covers major functionalities of the admin dashboard, ensuring that core features like registration, presentation management, and navigation work as expected.
