import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { User, Calendar, CheckCircle2, LogOut, Shield, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/react-app/context/AuthContext";
import { authFetch } from "@/react-app/lib/api";
import { useNavigate } from "react-router-dom";

type ProfileData = {
  username: string;
  createdAt: string;
  totalCheckIns: number;
  streak: number;
  avgMoodScore: number | null;
};

const moodFromScore = (s: number) => {
  if (s >= 4.5) return "Happy 😊";
  if (s >= 3.5) return "Good 🙂";
  if (s >= 2.5) return "Neutral 😐";
  if (s >= 1.5) return "Sad 😢";
  return "Stressed 😰";
};

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await authFetch("/api/profile");
        if (!r.ok) { setError("Could not load profile."); return; }
        const data = await r.json();
        setProfile(data);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground">Your account & stats</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-3xl text-white font-bold mb-3 shadow-lg shadow-primary/30">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <h3 className="text-xl font-bold text-foreground capitalize">{user?.username}</h3>
          <span className="mt-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">MindCare+ Member</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[1,2,3,4].map(i => <div key={i} className="h-20 bg-muted/30 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-muted/30 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold text-foreground">{profile?.totalCheckIns ?? 0}</p>
              <p className="text-xs text-muted-foreground">Total Check-ins</p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-4 text-center">
              <div className="flex items-center justify-center mb-1">
                <span className="text-xl">🔥</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{profile?.streak ?? 0}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-4 text-center col-span-2">
              <div className="flex items-center justify-center gap-1 text-emerald-500 mb-1">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-foreground">
                {profile?.avgMoodScore ? moodFromScore(profile.avgMoodScore) : "No data yet"}
              </p>
              <p className="text-xs text-muted-foreground">Avg Mood This Week</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-3 border-t border-border/50 text-sm">
          <span className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Member since
          </span>
          <span className="font-medium text-foreground">{joinedDate}</span>
        </div>
      </Card>

      {profile && profile.streak > 0 && (
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-200/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div>
              <p className="font-semibold text-foreground">
                {profile.streak === 1 ? "1-day streak — keep it going!" : `${profile.streak}-day streak — amazing!`}
              </p>
              <p className="text-xs text-muted-foreground">Check in tomorrow to extend your streak</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-card/80 border-2 border-border/50 rounded-2xl">
        <button onClick={handleLogout}
          className="w-full flex items-center justify-start gap-3 h-12 px-4 rounded-xl text-destructive hover:bg-destructive/10 transition-colors font-medium text-sm">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </Card>

      <Card className="p-5 bg-muted/30 border-2 border-border/30 rounded-2xl">
        <div className="flex gap-3">
          <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-1">Privacy & Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              MindCare+ is designed for general wellness tracking and self-reflection. It is not
              a substitute for professional mental health diagnosis or treatment. If you're struggling,
              please reach out to a qualified healthcare professional or counselor.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
