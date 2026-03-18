import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthUser {
  username: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mindcareToken");
    const username = localStorage.getItem("mindcareUser");
    if (token && username) setUser({ token, username });
    setIsLoading(false);
  }, []);

  const login = (username: string, token: string) => {
    localStorage.setItem("mindcareToken", token);
    localStorage.setItem("mindcareUser", username);
    setUser({ username, token });
  };

  const logout = () => {
    localStorage.removeItem("mindcareToken");
    localStorage.removeItem("mindcareUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
