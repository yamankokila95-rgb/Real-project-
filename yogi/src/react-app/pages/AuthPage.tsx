import { useState } from "react";
import { useAuth } from "@/react-app/context/AuthContext";
import { Eye, EyeOff, Sparkles, Leaf } from "lucide-react";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      login(data.username, data.token);
    } catch {
      setError("Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setError(""); setUsername(""); setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-48 h-48 bg-primary/8 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30 mb-4">
            <span className="text-3xl">💚</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">MindCare+</h1>
          <p className="text-sm text-muted-foreground mt-1">Your safe space to reflect</p>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5 p-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            {mode === "login" ? "Welcome back 👋" : "Create account ✨"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "login" ? "Sign in to continue your journey" : "Start tracking your well-being today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1.5">Username</label>
              <input
                type="text"
                placeholder="e.g. alex_student"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-foreground/80 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "At least 6 characters" : "Your password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "New to MindCare+?" : "Already have an account?"}
              <button onClick={switchMode} className="ml-1.5 text-primary font-semibold hover:underline">
                {mode === "login" ? "Create account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-2 justify-center mt-6 text-xs text-muted-foreground">
          <Leaf className="w-3.5 h-3.5 text-primary/60" />
          <span>No email required · Anonymous & private</span>
        </div>
      </div>
    </div>
  );
}
