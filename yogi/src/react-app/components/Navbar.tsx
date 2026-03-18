import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, User } from "lucide-react";
import { cn } from "@/react-app/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 sm:relative sm:border-t-0 sm:border-b">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around sm:justify-center sm:gap-8 py-2 sm:py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
