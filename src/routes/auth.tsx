import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in · CarbonTwin AI" },
      {
        name: "description",
        content: "Sign in or create your CarbonTwin AI account to track and reduce your carbon footprint.",
      },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already signed in, bounce to home
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailParsed = emailSchema.safeParse(email);
    if (!emailParsed.success) return toast.error(emailParsed.error.issues[0].message);

    setLoading(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(emailParsed.data, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Reset link sent — check your inbox.");
        setMode("signin");
        return;
      }

      const passwordParsed = passwordSchema.safeParse(password);
      if (!passwordParsed.success) return toast.error(passwordParsed.error.issues[0].message);

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: emailParsed.data,
          password: passwordParsed.data,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created — you can sign in now.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailParsed.data,
          password: passwordParsed.data,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/" });
    } finally {
      setLoading(false);
    }
  };

  const heading =
    mode === "signin" ? "Sign in" : mode === "signup" ? "Create your account" : "Reset password";

  return (
    <main className="flex min-h-dvh items-center justify-center bg-carbon-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-carbon-200 bg-white p-8 shadow-sm">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-semibold text-carbon-800"
          aria-label="CarbonTwin AI home"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-600 text-sm font-bold text-white"
            aria-hidden="true"
          >
            CT
          </span>
          CarbonTwin <span className="text-forest-600">AI</span>
        </Link>

        <h1 className="mt-6 text-2xl font-bold text-carbon-900">{heading}</h1>
        <p className="mt-1 text-sm text-carbon-500">
          {mode === "forgot"
            ? "Enter your email and we'll send you a reset link."
            : "Track and reduce your carbon footprint."}
        </p>

        {mode !== "forgot" && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-carbon-200 bg-white px-4 py-2.5 text-sm font-medium text-carbon-800 transition hover:bg-carbon-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 disabled:opacity-50"
              aria-label="Continue with Google"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
                <path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.45.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.95l3.66-2.84Z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.1 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
              </svg>
              Continue with Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-carbon-400">
              <div className="h-px flex-1 bg-carbon-200" />
              or
              <div className="h-px flex-1 bg-carbon-200" />
            </div>
          </>
        )}

        <form onSubmit={handleEmail} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-carbon-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-carbon-200 bg-white px-3 py-2 text-sm text-carbon-900 focus:border-forest-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
            />
          </div>
          {mode !== "forgot" && (
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-carbon-700">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs font-medium text-forest-600 hover:text-forest-700 focus:outline-none focus-visible:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-carbon-200 bg-white px-3 py-2 text-sm text-carbon-900 focus:border-forest-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 disabled:opacity-50"
          >
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-carbon-500">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="font-medium text-forest-600 hover:text-forest-700 focus:outline-none focus-visible:underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="font-medium text-forest-600 hover:text-forest-700 focus:outline-none focus-visible:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
