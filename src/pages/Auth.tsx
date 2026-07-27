import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  displayName: z.string().trim().max(100).optional(),
});

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(params.get("mode") === "signup" ? "signup" : "signin");
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const next = params.get("next") ?? "/shop";

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => (fieldErrors[i.path[0] as string] = i.message));
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: form.displayName || form.email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast({ title: "Account created", description: "You're all set — happy planting!" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Authentication failed", description: message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      return;
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl bg-card p-8 shadow-lg"
      >
        <button onClick={() => navigate("/")} className="mb-6 font-heading text-2xl font-bold text-foreground">
          GreenAura
        </button>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to shop and track your orders." : "Join GreenAura to start your collection."}
        </p>

        <button
          onClick={handleGoogle}
          className="mb-6 w-full rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Continue with Google
        </button>

        <div className="mb-6 flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-foreground">Name</label>
              <input
                id="displayName"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to GreenAura?" : "Already have an account?"}{" "}
          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
      </motion.div>
    </main>
  );
};

export default Auth;
