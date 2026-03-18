import { useEffect, useState } from "react";
import { Card } from "@/react-app/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Flame, Moon, BookOpen, AlertCircle } from "lucide-react";
import { authFetch } from "@/react-app/lib/api";

type Entry = {
  id: number; mood: string; stressLevel: string;
  hoursSlept: number; studyHours: number; date: string;
};

const moodScore: Record<string, number> = { happy: 5, good: 4, neutral: 3, sad: 2, stressed: 1 };
const moodColors: Record<string, string> = {
  happy: "bg-emerald-400", good: "bg-lime-400",
  neutral: "bg-amber-400", sad: "bg-blue-400", stressed: "bg-rose-400",
};
const moodEmoji: Record<string, string> = { happy: "😊", good: "🙂", neutral: "😐", sad: "😢", stressed: "😰" };
const moodLabels: Record<string, string> = { happy: "Happy", good: "Good", neutral: "Neutral", sad: "Sad", stressed: "Stressed" };

function getAvgMoodLabel(score: number) {
  if (score >= 4.5) return "Happy 😊";
  if (score >= 3.5) return "Good 🙂";
  if (score >= 2.5) return "Neutral 😐";
  if (score >= 1.5) return "Sad 😢";
  return "Stressed 😰";
}

export default function Analytics() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const r = await authFetch("/api/checkins");
        if (!r.ok) { setError("Could not load data."); return; }
        const data = await r.json();
        setEntries(Array.isArray(data) ? data : []);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
    </div>
  );

  const today = new Date();
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const entry = entries.find(e => e.date === dateStr);
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: dateStr,
      mood: entry?.mood ?? null,
      score: entry ? moodScore[entry.mood] ?? 3 : null,
    };
  });

  const hasData = entries.length > 0;
  const avgScore = hasData ? entries.slice(0, 7).reduce((s, e) => s + (moodScore[e.mood] ?? 3), 0) / Math.min(entries.length, 7) : null;
  const avgSleep = hasData ? (entries.slice(0, 7).reduce((s, e) => s + e.hoursSlept, 0) / Math.min(entries.length, 7)).toFixed(1) : null;
  const avgStudy = hasData ? (entries.slice(0, 7).reduce((s, e) => s + e.studyHours, 0) / Math.min(entries.length, 7)).toFixed(1) : null;

  const moodFreq: Record<string, number> = {};
  entries.forEach(e => { moodFreq[e.mood] = (moodFreq[e.mood] || 0) + 1; });
  const topMood = Object.entries(moodFreq).sort((a, b) => b[1] - a[1])[0]?.[0];

  const stressFreq: Record<string, number> = { low: 0, medium: 0, high: 0 };
  entries.forEach(e => { stressFreq[e.stressLevel] = (stressFreq[e.stressLevel] || 0) + 1; });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mood Analytics</h2>
          <p className="text-sm text-muted-foreground">Track your emotional patterns</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!hasData ? (
        <Card className="p-10 text-center bg-card/80 border-2 border-border/50 rounded-3xl">
          <p className="text-4xl mb-3">📊</p>
          <h3 className="font-bold text-foreground mb-1">No data yet</h3>
          <p className="text-sm text-muted-foreground">Complete your first daily check-in to see your analytics here!</p>
        </Card>
      ) : (
        <>
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-3xl shadow-xl shadow-primary/5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Last 7 Days
              </h3>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">{entries.length} total check-ins</span>
            </div>
            <div className="h-44 flex items-end justify-between gap-2 mb-3">
              {weekData.map((item) => (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full h-36 bg-muted/30 rounded-2xl relative overflow-hidden">
                    {item.score ? (
                      <div className={`absolute bottom-0 left-0 right-0 rounded-2xl transition-all duration-700 ${moodColors[item.mood!]}`}
                        style={{ height: `${(item.score / 5) * 100}%` }} />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground/40 text-lg">—</span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
                  {item.mood && <span className="text-sm">{moodEmoji[item.mood]}</span>}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-center pt-3 border-t border-border/50">
              {["happy","good","neutral","sad","stressed"].map(m => (
                <div key={m} className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${moodColors[m]}`} />
                  <span className="text-xs text-muted-foreground">{moodLabels[m]}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: TrendingUp, bg: "bg-emerald-100", iconColor: "text-emerald-600", value: avgScore ? getAvgMoodLabel(avgScore) : "—", label: "Avg Mood (7d)" },
              { icon: Flame, bg: "bg-amber-100", iconColor: "text-amber-500", value: topMood ? `${moodEmoji[topMood]} ${moodLabels[topMood]}` : "—", label: "Most Common" },
              { icon: Moon, bg: "bg-indigo-100", iconColor: "text-indigo-500", value: avgSleep ? `${avgSleep}h` : "—", label: "Avg Sleep (7d)" },
              { icon: BookOpen, bg: "bg-blue-100", iconColor: "text-blue-500", value: avgStudy ? `${avgStudy}h` : "—", label: "Avg Study (7d)" },
            ].map(({ icon: Icon, bg, iconColor, value, label }) => (
              <Card key={label} className="p-4 bg-card/80 border-2 border-border/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-5 bg-card/80 border-2 border-border/50 rounded-2xl">
            <h4 className="font-semibold text-foreground mb-4">Stress Level Breakdown</h4>
            <div className="space-y-3">
              {[
                { key: "low", label: "Low 🌿", color: "bg-emerald-400" },
                { key: "medium", label: "Medium 🌊", color: "bg-amber-400" },
                { key: "high", label: "High 🔥", color: "bg-rose-400" },
              ].map(({ key, label, color }) => {
                const count = stressFreq[key] || 0;
                const pct = entries.length ? Math.round((count / entries.length) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground">{count} days ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-primary/10 to-accent/30 border-2 border-primary/20 rounded-2xl">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Personal Insight</h4>
                <p className="text-sm text-muted-foreground">
                  {avgSleep && parseFloat(avgSleep) < 6
                    ? "You're averaging less than 6 hours of sleep. Better rest often leads to better mood — try to sleep a bit earlier tonight! 🌙"
                    : avgScore && avgScore < 3
                    ? "Your mood has been on the lower side lately. Remember: reaching out to someone you trust can make a big difference. 💙"
                    : "You're doing well! Keep up the consistent check-ins — self-awareness is the first step to well-being. 🌿"}
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
