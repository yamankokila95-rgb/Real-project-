import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (email === "admin@campus.com" && password === "admin123") {
      localStorage.setItem("admin", "true");

      navigate("/admin");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-md mx-auto py-20 px-4">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-xl font-bold mb-4">Admin Login</h1>

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
