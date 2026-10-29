
import { useState } from "react";
import axios from "axios";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (token: string) => void;
}

interface LoginResponse {
  token?: string | null;
  role?: string | null;
  user?: {
    role?: string | null;
    userRole?: string | null;
  } | null;
}

function Login({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginProps) {
  const API_URL = "https://localhost:7084/api/Auth/login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post<LoginResponse>(
        API_URL,
        {
          email,
          password,
        }
      );

      const data = response.data;
      const token = data?.token;

      // A valid token is required. A role is optional.
      if (!token || typeof token !== "string" || !token.trim()) {
        setError("Login response did not contain a valid token.");
        return;
      }

      // Read the role whether it is returned at the root
      // or inside the user object.
      const rawRole =
        data?.role ??
        data?.user?.role ??
        data?.user?.userRole;

      const normalizedRole =
        typeof rawRole === "string"
          ? rawRole.trim().toLowerCase()
          : "";

      // Save the token.
      localStorage.setItem("token", token);

      // Remove stale roles first so an old role cannot
      // accidentally display management icons.
      localStorage.removeItem("role");
      localStorage.removeItem("userRole");

      // Save the role only when a valid non-empty role exists.
      if (normalizedRole) {
        localStorage.setItem("role", normalizedRole);
        localStorage.setItem("userRole", normalizedRole);
      }

      // Notify components that authentication has changed.
      window.dispatchEvent(new Event("authChanged"));

      // Notify the parent component after successful login.
      onLoginSuccess?.(token);

      // Clear the form.
      setEmail("");
      setPassword("");
      setShowPassword(false);

      // Close the login popup.
      onClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message ??
          err.response?.data?.title;

        setError(
          typeof message === "string"
            ? message
            : "Invalid email or password. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onMouseDown={onClose}>
      <div
        className="login-modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button
          type="button"
          className="login-close"
          onClick={onClose}
          aria-label="Close login"
        >
          <X size={22} />
        </button>

        <div className="login-icon">
          <Lock size={28} />
        </div>

        <h2 id="login-title">Welcome Back!</h2>

        <p className="login-subtitle">
          Sign in to continue to your account.
        </p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-email">Email Address</label>

            <div className="login-input-wrapper">
              <Mail size={19} />

              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrapper">
              <Lock size={19} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          Secure login powered by your account.
        </p>
      </div>

      <style>{`
        .login-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(5px);
        }

        .login-modal {
          position: relative;
          width: 100%;
          max-width: 420px;
          max-height: 90vh;
          overflow-y: auto;
          box-sizing: border-box;
          padding: 35px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
          font-family: Arial, sans-serif;
          animation: loginPopupIn 0.22s ease-out;
        }

        @keyframes loginPopupIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .login-close {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          color: #475569;
          cursor: pointer;
        }

        .login-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 62px;
          height: 62px;
          margin: 0 auto 18px;
          border-radius: 18px;
          background: #e0e7ff;
          color: #3730a3;
        }

        .login-modal h2 {
          margin: 0;
          text-align: center;
          color: #172554;
          font-size: 27px;
        }

        .login-subtitle {
          margin: 10px 0 25px;
          color: #64748b;
          text-align: center;
          font-size: 14px;
          line-height: 1.5;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 19px;
        }

        .login-field label {
          color: #334155;
          font-size: 14px;
          font-weight: 600;
        }

        .login-input-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
          padding: 0 12px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          color: #64748b;
          transition: border-color 0.2s;
        }

        .login-input-wrapper:focus-within {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .login-input-wrapper input {
          width: 100%;
          min-width: 0;
          padding: 13px 0;
          border: none;
          outline: none;
          background: transparent;
          color: #0f172a;
          font-size: 14px;
        }

        .login-password-toggle {
          display: flex;
          align-items: center;
          border: none;
          background: transparent;
          color: #64748b;
          cursor: pointer;
        }

        .login-submit {
          width: 100%;
          margin-top: 5px;
          padding: 14px;
          border: none;
          border-radius: 9px;
          background: #4338ca;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-submit:hover {
          background: #3730a3;
        }

        .login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-error {
          margin-bottom: 18px;
          padding: 11px;
          border-radius: 8px;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .login-footer {
          margin: 22px 0 0;
          color: #94a3b8;
          text-align: center;
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .login-modal {
            padding: 28px 22px;
            border-radius: 16px;
          }

          .login-modal h2 {
            font-size: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-modal {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
