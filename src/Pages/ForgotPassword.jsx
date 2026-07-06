import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

function ForgotPassword() {
  const [step, setStep] = useState("email"); // "email" | "reset" | "done"
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.get(`${API_URL}/Users`);
      const result = response.data;

      if (!result?.status || !Array.isArray(result.data)) {
        setError("Unable to reach the server. Please try again.");
        setSubmitting(false);
        return;
      }

      const match = result.data.find(
        (u) => u.email?.toLowerCase() === email.trim().toLowerCase()
      );

      if (!match) {
        // Don't reveal whether the email exists — generic message
        setError("If that email is registered, you can reset your password.");
        setSubmitting(false);
        return;
      }

      if (!match.isActive) {
        setError("This account is inactive. Contact an administrator.");
        setSubmitting(false);
        return;
      }

      setFoundUser(match);
      setStep("reset");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword.trim()) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.trim().length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = {
        ...foundUser,
        passwordHash: newPassword.trim(),
      };

      const response = await axios.put(
        `${API_URL}/Users/${foundUser.userId}`,
        updated
      );
      const result = response.data;

      if (!result?.status) {
        setError(result?.message || "Failed to reset password. Try again.");
        setSubmitting(false);
        return;
      }

      setStep("done");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-slate-200 dark:border-zinc-800 p-8">

        {/* Step 1 — Email lookup */}
        {step === "email" && (
          <>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Forgot password
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Enter your account email and we'll let you set a new password.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Checking..." : "Continue"}
              </button>
            </form>
          </>
        )}

        {/* Step 2 — New password */}
        {step === "reset" && (
          <>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Reset password
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Choose a new password for <span className="font-medium text-slate-700 dark:text-zinc-300">{email}</span>.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3">
                {error}
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">
                  New password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="Create a new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="Re-enter your new password"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving..." : "Reset password"}
              </button>
            </form>
          </>
        )}

        {/* Step 3 — Success */}
        {step === "done" && (
          <>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-6">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Password updated
            </h1>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="block w-full text-center rounded-2xl bg-blue-600 px-4 py-3 text-white font-semibold shadow hover:bg-blue-700 transition"
            >
              Go to sign in
            </Link>
          </>
        )}

        {/* Back link (steps 1 & 2 only) */}
        {step !== "done" && (
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
            Remember it?{" "}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;