import { useState } from "react";
import Header from "@/react-app/components/Header";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/react-app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import {
  Building2,
  Wifi,
  Lightbulb,
  Shield,
  Trash2,
  HelpCircle,
  CheckCircle,
  Copy,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router";

const issueCategories = [
  { value: "infrastructure", label: "Infrastructure", icon: Building2, description: "Buildings, roads, classrooms" },
  { value: "technology", label: "Technology", icon: Wifi, description: "Internet, computers, projectors" },
  { value: "utilities", label: "Utilities", icon: Lightbulb, description: "Electricity, water, HVAC" },
  { value: "safety", label: "Safety & Security", icon: Shield, description: "Security concerns, hazards" },
  { value: "sanitation", label: "Sanitation", icon: Trash2, description: "Cleanliness, waste management" },
  { value: "other", label: "Other", icon: HelpCircle, description: "General complaints" },
];

export default function Home() {
  const [formData, setFormData] = useState({
    category: "",
    location: "",
    title: "",
    description: "",
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      const data = await response.json();
      setSubmittedId(data.complaintId);
    } catch {
      setError("Failed to submit your complaint. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedId) {
      navigator.clipboard.writeText(submittedId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    setFormData({ category: "", location: "", title: "", description: "" });
    setSubmittedId(null);
    setError("");
  };

  if (submittedId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Issue Reported Successfully!</h2>
              <p className="text-muted-foreground mb-6">
                Your complaint has been submitted. Save your tracking ID to monitor its progress.
              </p>
              
              <div className="bg-muted rounded-xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Your Complaint ID</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-mono font-bold text-primary tracking-wider">
                    {submittedId}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-card border border-border hover:bg-accent transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    ) : (
                      <Copy className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={`/track?id=${submittedId}`}>
                  <Button className="w-full sm:w-auto">
                    Track Your Issue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={resetForm}>
                  Report Another Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Report Campus Issues <span className="text-primary">Anonymously</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Help improve our campus by reporting issues. No registration required. 
              Track your complaint with a unique ID.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="text-xl">Submit a New Issue</CardTitle>
            <CardDescription>
              Describe the problem you've encountered. All submissions are anonymous.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              {/* Category Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Issue Category</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {issueCategories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <p className={`font-medium text-sm ${isSelected ? "text-foreground" : "text-foreground"}`}>
                          {cat.label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) => setFormData({ ...formData, location: value })}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select campus location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-building">Main Building</SelectItem>
                    <SelectItem value="library">Library</SelectItem>
                    <SelectItem value="science-block">Science Block</SelectItem>
                    <SelectItem value="cafeteria">Cafeteria</SelectItem>
                    <SelectItem value="sports-complex">Sports Complex</SelectItem>
                    <SelectItem value="dormitory">Dormitory</SelectItem>
                    <SelectItem value="parking">Parking Area</SelectItem>
                    <SelectItem value="outdoor">Outdoor/Campus Grounds</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Issue Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide as much detail as possible about the issue..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!formData.category || !formData.location || !formData.title || !formData.description || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Issue Report"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">100% Anonymous</h3>
            <p className="text-sm text-muted-foreground">
              No personal information required. Your privacy is protected.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Real-time Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Track your complaint status using your unique ID.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Direct to Admin</h3>
            <p className="text-sm text-muted-foreground">
              Issues are sent directly to campus administration.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
