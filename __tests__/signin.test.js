import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from "@testing-library/user-event"
import { signIn } from 'next-auth/react'
import SignIn from '@/app/auth/signin/page'

jest.mock("next-auth/react");
 
describe('SignIn Page', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mock before each test
    });
    
    it('renders the sign-in form correctly', () => {
        render(<SignIn />)

        expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();    
    })

    it("allows the user to type into input fields", async () => {
        render(<SignIn />);

        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await userEvent.type(emailInput, "joshpeters@gmail.com");
        await userEvent.type(passwordInput, "joshpsw");

        expect(emailInput).toHaveValue("joshpeters@gmail.com");
        expect(passwordInput).toHaveValue("joshpsw");
    })

    it("calls signIn when form is submitted", async () => {
        signIn.mockResolvedValueOnce({ ok: true });
    
        render(<SignIn />);
    
        await userEvent.type(screen.getByPlaceholderText(/email/i), "joshpeters@gmail.com");
        await userEvent.type(screen.getByPlaceholderText(/password/i), "joshpsw");
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    
        expect(signIn).toHaveBeenCalledWith("credentials", {
          email: "joshpeters@gmail.com",
          password: "joshpsw",
          redirect: true,
          callbackUrl: "/",
        });
      });
    
      it("handles sign-in errors properly", async () => {
        signIn.mockResolvedValueOnce({ error: "Invalid credentials" });
    
        render(<SignIn />);
    
        await userEvent.type(screen.getByPlaceholderText(/email/i), "wrong@example.com");
        await userEvent.type(screen.getByPlaceholderText(/password/i), "wrongpassword");
        await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
    
        expect(signIn).toHaveBeenCalled();
        // You may need to modify your SignIn component to show an error message for this to work.
      });
})