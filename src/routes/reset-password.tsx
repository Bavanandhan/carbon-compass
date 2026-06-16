import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password · CarbonTwin AI" },
      { name: "description", content: "Choose a new password for your CarbonTwin AI account." },
    ],
  }),
  component: ResetPasswordPage,
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    if (password !== confirm) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: parsed.data });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-carbon-50 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-carbon-200 bg-white p-8 shadow-sm"
        noValidate
      >
        <h1 className="text-2xl font-bold text-carbon-900">Choose a new password</h1>
        <p className="mt-1 text-sm text-carbon-500">
          Enter and confirm a new password for your account.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-carbon-700">
              New password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-carbon-200 bg-white px-3 py-2 text-sm text-carbon-900 focus:border-forest-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-carbon-700">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-carbon-200 bg-white px-3 py-2 text-sm text-carbon-900 focus:border-forest-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-forest-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
    </main>
  );
}
