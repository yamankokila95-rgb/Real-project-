import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (hasExchanged.current) return;
    hasExchanged.current = true;

    exchangeCodeForSessionToken()
      .then(() => {
        navigate("/admin");
      })
      .catch((error) => {
        console.error("Auth error:", error);
        navigate("/admin");
      });
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground mt-4">Signing you in...</p>
      </div>
    </div>
  );
}
