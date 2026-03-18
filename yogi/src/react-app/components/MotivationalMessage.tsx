import { MoodType } from "./MoodSelector";
import { Heart, RefreshCw } from "lucide-react";
import { Button } from "@/react-app/components/ui/button";
import { useState } from "react";

interface Message {
  quote: string;
  tip: string;
}

const messagesByMood: Record<MoodType, Message[]> = {
  happy: [
    { quote: "Your joy is contagious! Keep spreading those positive vibes. ✨", tip: "Consider journaling about what made today great to remember it later." },
    { quote: "Happiness looks beautiful on you! Celebrate this moment. 🌟", tip: "Share your good mood with someone who might need it today." },
    { quote: "What a wonderful day to feel wonderful! 🌈", tip: "Take a photo or note to capture this happy moment." },
  ],
  good: [
    { quote: "You're doing great! Every good day is a step forward. 🌱", tip: "Keep up your current routine - it seems to be working well!" },
    { quote: "Feeling good is the foundation for great things. 💚", tip: "Notice what contributed to this good mood and do more of it." },
    { quote: "You're on the right track! Keep going. 🌿", tip: "Consider reaching out to a friend and share the good energy." },
  ],
  neutral: [
    { quote: "It's okay to have ordinary days - they're part of the journey. 🌤️", tip: "Try a 5-minute stretch or a short walk to energize yourself." },
    { quote: "Neutral days are like blank canvases - full of potential. 🎨", tip: "Listen to your favorite song or take a few deep breaths." },
    { quote: "Balance is beautiful. You're doing just fine. ⚖️", tip: "Small acts of self-care can turn an okay day into a good one." },
  ],
  sad: [
    { quote: "It's okay not to be okay. Your feelings are valid. 💙", tip: "Be gentle with yourself today. Consider talking to someone you trust." },
    { quote: "Even the darkest nights end with sunrise. Hang in there. 🌅", tip: "Try doing one small thing that usually brings you comfort." },
    { quote: "Sadness is temporary. You are stronger than you know. 💪", tip: "Remember: reaching out for help is a sign of strength, not weakness." },
  ],
  stressed: [
    { quote: "Take a deep breath. You've overcome challenges before. 🌊", tip: "Try the 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s." },
    { quote: "One step at a time. You don't have to solve everything today. 🐢", tip: "Break your tasks into smaller pieces and tackle one at a time." },
    { quote: "Stress is temporary. Your peace of mind is worth protecting. 🛡️", tip: "Take a 5-minute break to step outside or do some light stretching." },
  ],
};

interface MotivationalMessageProps {
  mood: MoodType;
  onNewCheckIn: () => void;
}

export default function MotivationalMessage({ mood, onNewCheckIn }: MotivationalMessageProps) {
  const messages = messagesByMood[mood];
  const [messageIndex, setMessageIndex] = useState(0);
  const currentMessage = messages[messageIndex];

  const handleNewMessage = () => {
    setMessageIndex((prev) => (prev + 1) % messages.length);
  };

  return (
    <div className="text-center space-y-6 py-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
        <Heart className="w-8 h-8" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Check-in Complete!</h3>
        <p className="text-muted-foreground">Thank you for taking time to reflect on your well-being.</p>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-accent/30 rounded-2xl p-6 space-y-4">
        <p className="text-xl font-medium text-foreground leading-relaxed">
          "{currentMessage.quote}"
        </p>
        <div className="pt-2 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">💡 Tip:</span> {currentMessage.tip}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-center pt-2">
        <Button
          variant="outline"
          onClick={handleNewMessage}
          className="rounded-xl"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Message
        </Button>
        <Button
          onClick={onNewCheckIn}
          className="rounded-xl"
        >
          Done
        </Button>
      </div>

      <p className="text-xs text-muted-foreground pt-4 max-w-md mx-auto">
        This app is for general wellness tracking only and is not intended for medical diagnosis. 
        If you're struggling, please reach out to a mental health professional.
      </p>
    </div>
  );
}
