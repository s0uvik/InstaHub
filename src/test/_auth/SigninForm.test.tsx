import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import SigninForm from '@/_auth/forms/SigninForm';

// Mock the hooks and context
vi.mock('@/lib/react-query/queriesAndMutations', () => ({
  useSignInAccount: () => ({
    mutateAsync: vi.fn(() => Promise.resolve({ $id: 'user123' })),
    isPending: false
  }),
  useCreateAnonymousSession: () => ({
    mutateAsync: vi.fn(() => Promise.resolve(true)),
    isPending: false
  })
}));

vi.mock('@/context/AuthContext', () => ({
  useUserContext: () => ({
    checkAuthUser: vi.fn(() => Promise.resolve(true))
  })
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock
  };
});

describe('SigninForm', () => {
  const renderSigninForm = () => {
    render(
      <BrowserRouter>
        <SigninForm />
      </BrowserRouter>
    );
  };

  it('should render signin form elements', () => {
    renderSigninForm();

    // Check for form elements
    expect(screen.getByText(/Login to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByText(/try instahub as a guest/i)).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    renderSigninForm();
    const user = userEvent.setup();

    // Submit empty form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should handle email input', async () => {
    renderSigninForm();
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should handle password input', async () => {
    renderSigninForm();
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('should handle form submission with valid data', async () => {
    renderSigninForm();
    const user = userEvent.setup();

    // Fill in form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Submit form
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Wait for form submission to complete
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should handle guest login', async () => {
    renderSigninForm();
    const user = userEvent.setup();
    const guestButton = screen.getByText(/Try InstaHub as a Guest/i);
    await user.click(guestButton);

    // Wait for guest login to complete
    await waitFor(() => {
      expect(guestButton).toBeInTheDocument();
    });
  });

  it('should navigate to / after successful login', async () => {  
    renderSigninForm();
  
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/');
    });
  });
  

});
