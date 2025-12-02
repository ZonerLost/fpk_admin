import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "../../shared/inputs/TextField";
import Button from "../../shared/inputs/Button";
import { cn } from "../../shared/utils/cn";
import { useAuth } from "../../context/AuthContext";


type Props = {
  onForgotPassword: () => void;
};

const LoginFormCard: React.FC<Props> = ({ onForgotPassword }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const from = (location.state as any)?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsSubmitting(true);

      // 🔓 FAKE SIGN-IN / SIGN-UP (no backend yet)
      // You can replace this later with a real API call.
      login({
        token: "dummy-token", // fake token
        user: {
          email,
          name: "",
        },
        remember,
      });

      // Go back to the page user tried to access (or /)
      navigate(from, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-[32px] border border-yellow-500/40 bg-[#061d12] p-6",
        "shadow-[0_0_60px_rgba(0,0,0,0.7)]"
      )}
    >

      <div className="flex items-center justify-center">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/10 overflow-hidden">
    <img
      src="/images/logo.png"
      alt="GDS logo"
      className="h-8 w-8 object-contain"
    />
  </div>
</div>


      <div className="mt-4 text-center">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-50 md:text-2xl">
          Admin Login
        </h2>
        <p className="mt-1 text-xs text-slate-300 md:text-sm">
          Welcome back. Please sign in to your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email / Username */}
        <div>
          <TextField
            label="Email / Username"
            placeholder="Enter your email or username"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-full border-amber-700/40 bg-[#141008] px-4 py-3"
          />
        </div>

                {/* Password + toggle */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <TextField
                label="Password"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-full border-amber-700/40 bg-[#141008] px-4 py-3"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="mt-6 text-xs font-medium text-amber-300 hover:text-amber-200 md:text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>


        {/* Remember + forgot */}
        <div className="flex flex-col items-start justify-between gap-2 text-xs text-slate-300 md:flex-row md:items-center md:text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border border-white/30 bg-black/30"
            />
            <span>Remember this device</span>
          </label>

          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-medium text-amber-300 hover:text-amber-200 md:text-sm"
          >
            Forgot password?
          </button>
        </div>

        <Button
  type="submit"
  variant="primary"
  disabled={isSubmitting || !email || !password}
  className={cn(
    "mt-2 w-full rounded-full bg-amber-400 py-2.5 text-sm font-semibold",
    // ⬇️ softer shadow
    "text-black shadow-[0_0_14px_rgba(250,204,21,0.25)] hover:bg-amber-300"
  )}
>
  {isSubmitting ? "Signing in..." : "Sign in"}
</Button>


        <p className="mt-3 text-center text-[11px] text-slate-500 md:text-xs">
          You must be an authorized staff member to access this console.
        </p>
      </form>
    </div>
  );
};

export default LoginFormCard;
