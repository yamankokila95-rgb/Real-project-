import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/react-app/context/AuthContext";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    document.body.style.fontFamily = "'Nunito', system-ui, sans-serif";
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-5 sm:py-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-xl">💚</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">MindCare+</h1>
              <p className="text-xs text-muted-foreground">Your safe space to reflect</p>
            </div>
          </div>
          {/* Username badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <span className="text-xs font-medium text-primary">{user.username}</span>
            </div>
          )}
        </div>
      </header>

      {/* Desktop nav */}
      <div className="hidden sm:block relative z-10">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="relative z-10 px-4 pb-28 sm:pb-10 pt-2">
        <div className="max-w-2xl mx-auto">{children}</div>
      </main>

      {/* Mobile nav */}
      <div className="sm:hidden">
        <Navbar />
      </div>
    </div>
  );
}
