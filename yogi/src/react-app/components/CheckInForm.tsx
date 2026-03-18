import { useState } from "react";
import { Label } from "@/react-app/components/ui/label";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Button } from "@/react-app/components/ui/button";
import { Slider } from "@/react-app/components/ui/slider";
import MoodSelector, { MoodType } from "./MoodSelector";
import { Moon, BookOpen, Sparkles } from "lucide-react";

interface CheckInData {
  mood: MoodType;
  stressLevel: "low" | "medium" | "high";
  hoursSlept: number;
  studyHours: number;
  notes: string;
}

interface CheckInFormProps {
  onSubmit: (data: CheckInData) => void;
}

export default function CheckInForm({ onSubmit }: CheckInFormProps) {
  const [mood, setMood] = useState<MoodType | null>(null);
  const [stressLevel, setStressLevel] = useState<"low" | "medium" | "high">("low");
  const [hoursSlept, setHoursSlept] = useState(7);
  const [studyHours, setStudyHours] = useState(4);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;
    onSubmit({ mood, stressLevel, hoursSlept, studyHours, notes });
  };

  const stressLevels = [
    { value: "low", label: "Low", emoji: "🌿", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    { value: "medium", label: "Medium", emoji: "🌊", color: "bg-amber-100 text-amber-700 border-amber-300" },
    { value: "high", label: "High", emoji: "🔥", color: "bg-rose-100 text-rose-700 border-rose-300" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Mood Selection */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-foreground/90">
          How are you feeling today?
        </Label>
        <MoodSelector selected={mood} onSelect={setMood} />
      </div>

      {/* Stress Level */}
      <div className="space-y-4">
        <Label className="text-base font-medium text-foreground/80">
          Stress Level
        </Label>
        <div className="flex gap-3">
          {stressLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setStressLevel(level.value)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                stressLevel === level.value
                  ? `${level.color} ring-2 ring-offset-2 ring-primary/30`
                  : "bg-muted/50 border-border hover:bg-muted"
              }`}
            >
              <span>{level.emoji}</span>
              <span className="font-medium text-sm">{level.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sleep Hours */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium text-foreground/80 flex items-center gap-2">
            <Moon className="w-4 h-4" />
            Hours of Sleep
          </Label>
          <span className="text-2xl font-bold text-primary">{hoursSlept}h</span>
        </div>
        <Slider
          value={[hoursSlept]}
          onValueChange={([value]) => setHoursSlept(value)}
          min={0}
          max={12}
          step={0.5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </div>

      {/* Study Hours */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium text-foreground/80 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Study Hours
          </Label>
          <span className="text-2xl font-bold text-primary">{studyHours}h</span>
        </div>
        <Slider
          value={[studyHours]}
          onValueChange={([value]) => setStudyHours(value)}
          min={0}
          max={12}
          step={0.5}
          className="py-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-3">
        <Label className="text-base font-medium text-foreground/80">
          Notes (optional)
        </Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything else you'd like to share about how you're feeling today?"
          className="min-h-[100px] resize-none rounded-xl border-2 focus:border-primary/50"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!mood}
        className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        Complete Check-In
      </Button>
    </form>
  );
}

export type { CheckInData };
