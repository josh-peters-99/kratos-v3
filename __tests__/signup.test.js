import '@testing-library/jest-dom'
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUp from "@/app/auth/signup/page"; // Adjust path if needed

global.fetch = jest.fn(); // Mock fetch globally

describe("SignUp Page", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("renders the sign-up form correctly", () => {
    render(<SignUp />);

    expect(screen.getByRole("heading", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("submits form and shows success alert when API request succeeds", async () => {
    fetch.mockResolvedValueOnce({ ok: true }); // Mock successful response
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert

    render(<SignUp />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), "testuser");
    await userEvent.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i), "password456");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/signup", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
          password: "password456",
        }),
      }));
      expect(window.alert).toHaveBeenCalledWith("Signup successful. You can now sign in.");
    });
  });

  it("shows failure alert when API request fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false }); // Mock failed response
    jest.spyOn(window, "alert").mockImplementation(() => {}); // Mock alert

    render(<SignUp />);

    await userEvent.type(screen.getByPlaceholderText(/username/i), "testuser");
    await userEvent.type(screen.getByPlaceholderText(/email/i), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith("Signup failed.");
    });
  });
});
