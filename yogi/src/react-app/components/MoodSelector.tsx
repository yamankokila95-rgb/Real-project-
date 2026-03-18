import { cn } from "@/react-app/lib/utils";

export type MoodType = "happy" | "good" | "neutral" | "sad" | "stressed";

interface MoodOption {
  value: MoodType;
  emoji: string;
  label: string;
  color: string;
  bgColor: string;
}

const moods: MoodOption[] = [
  { value: "happy", emoji: "😊", label: "Happy", color: "text-emerald-600", bgColor: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
  { value: "good", emoji: "🙂", label: "Good", color: "text-lime-600", bgColor: "bg-lime-50 hover:bg-lime-100 border-lime-200" },
  { value: "neutral", emoji: "😐", label: "Neutral", color: "text-amber-600", bgColor: "bg-amber-50 hover:bg-amber-100 border-amber-200" },
  { value: "sad", emoji: "😢", label: "Sad", color: "text-blue-600", bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { value: "stressed", emoji: "😰", label: "Stressed", color: "text-rose-600", bgColor: "bg-rose-50 hover:bg-rose-100 border-rose-200" },
];

interface MoodSelectorProps {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export default function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          onClick={() => onSelect(mood.value)}
          className={cn(
            "flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl border-2 transition-all duration-200",
            mood.bgColor,
            selected === mood.value
              ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md"
              : "opacity-80 hover:opacity-100"
          )}
        >
          <span className="text-2xl sm:text-3xl">{mood.emoji}</span>
          <span className={cn("text-xs sm:text-sm font-medium", mood.color)}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export { moods };
