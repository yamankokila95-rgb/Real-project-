import { useState, useEffect } from "react";
import { Card } from "@/react-app/components/ui/card";
import CheckInForm, { CheckInData } from "@/react-app/components/CheckInForm";
import MotivationalMessage from "@/react-app/components/MotivationalMessage";
import { MoodType } from "@/react-app/components/MoodSelector";
import { Leaf, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/react-app/context/AuthContext";
import { authFetch } from "@/react-app/lib/api";

const moodEmoji: Record<MoodType, string> = {
  happy: "😊", good: "🙂", neutral: "😐", sad: "😢", stressed: "😰"
};

export default function Dashboard() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submittedMood, setSubmittedMood] = useState<MoodType | null>(null);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [todayEntry, setTodayEntry] = useState<any>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [apiError, setApiError] = useState("");

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const getGreeting = () => {
    const h = today.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    // BUG FIX: wrapped in try/catch so a failed API call can never crash the page
    const checkToday = async () => {
      try {
        const r = await authFetch("/api/checkins/today");
        // Handle non-OK responses gracefully (401, 500, etc.)
        if (!r.ok) {
          setCheckingStatus(false);
          return;
        }
        const data = await r.json();
        if (data.checkedIn) {
          setAlreadyCheckedIn(true);
          setTodayEntry(data.entry);
        }
      } catch (err) {
        // Network error — backend might not be running yet, just show the form
        console.error("Could not reach backend:", err);
        setApiError("Could not connect to server. Make sure the backend is running.");
      } finally {
        setCheckingStatus(false);
      }
    };
    checkToday();
  }, []);

  const handleSubmit = async (data: CheckInData) => {
    setSubmitError("");
    try {
      const res = await authFetch("/api/checkins", {
        method: "POST",
        body: JSON.stringify(data),
      });
      // BUG FIX: safe JSON parse — don't crash if response isn't JSON
      let json: any = {};
      try { json = await res.json(); } catch { /* empty */ }
      if (!res.ok) { setSubmitError(json.error || "Failed to save. Please try again."); return; }
      setSubmittedMood(data.mood);
      setSubmitted(true);
    } catch {
      setSubmitError("Network error. Is the backend running?");
    }
  };

  if (checkingStatus) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Welcome Card */}
      <Card className="p-6 bg-gradient-to-br from-card to-accent/20 border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              {getGreeting()}, <span className="text-primary capitalize">{user?.username}</span>! 👋
            </h2>
            <p className="text-muted-foreground text-sm">
              {alreadyCheckedIn ? "You've already checked in today. Great job! 🌟" : "Take a moment to check in with yourself today."}
            </p>
          </div>
          <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary">
            <Leaf className="w-7 h-7" />
          </div>
        </div>
      </Card>

      {/* Backend connection error — show a warning but don't crash */}
      {apiError && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{apiError}</p>
        </div>
      )}

      {/* Already checked in today — show today's entry */}
      {alreadyCheckedIn && todayEntry && !submitted && (
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Today's Check-in</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(todayEntry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 rounded-2xl p-4 text-center">
              <p className="text-3xl mb-1">{moodEmoji[todayEntry.mood as MoodType]}</p>
              <p className="text-sm font-semibold capitalize text-foreground">{todayEntry.mood}</p>
              <p className="text-xs text-muted-foreground">Mood</p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground mb-1 capitalize">{todayEntry.stressLevel}</p>
              <p className="text-xs text-muted-foreground">Stress Level</p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-primary mb-1">{todayEntry.hoursSlept}h</p>
              <p className="text-xs text-muted-foreground">Sleep</p>
            </div>
            <div className="bg-muted/30 rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-primary mb-1">{todayEntry.studyHours}h</p>
              <p className="text-xs text-muted-foreground">Study</p>
            </div>
          </div>
          {todayEntry.notes && (
            <div className="mt-3 p-3 bg-muted/20 rounded-xl">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Notes</p>
              <p className="text-sm text-foreground">{todayEntry.notes}</p>
            </div>
          )}
          <p className="text-xs text-center text-muted-foreground mt-4">Come back tomorrow for your next check-in 🌙</p>
        </Card>
      )}

      {/* Check-in form */}
      {!alreadyCheckedIn && (
        <Card className="p-6 sm:p-8 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
          {submitted && submittedMood ? (
            <MotivationalMessage mood={submittedMood} onNewCheckIn={() => { setSubmitted(false); setAlreadyCheckedIn(true); }} />
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground">Daily Check-In</h3>
                <p className="text-sm text-muted-foreground mt-1">Your responses are private and help you track your well-being over time.</p>
              </div>
              {submitError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">{submitError}</div>
              )}
              <CheckInForm onSubmit={handleSubmit} />
            </>
          )}
        </Card>
      )}
    </div>
  );
}
