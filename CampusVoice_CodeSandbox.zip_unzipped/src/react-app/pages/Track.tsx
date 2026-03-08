import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import Header from "@/react-app/components/Header";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/react-app/components/ui/card";
import {
  Search,
  Clock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import type { Complaint } from "@/shared/types";

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    description: "Your issue is awaiting review by the administration.",
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Loader2,
    description: "The administration is actively working on your issue.",
  },
  resolved: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    description: "Your issue has been resolved.",
  },
};

const categoryLabels: Record<string, string> = {
  infrastructure: "Infrastructure",
  technology: "Technology",
  utilities: "Utilities",
  safety: "Safety & Security",
  sanitation: "Sanitation",
  other: "Other",
};

const locationLabels: Record<string, string> = {
  "main-building": "Main Building",
  library: "Library",
  "science-block": "Science Block",
  cafeteria: "Cafeteria",
  "sports-complex": "Sports Complex",
  dormitory: "Dormitory",
  parking: "Parking Area",
  outdoor: "Outdoor/Campus Grounds",
  other: "Other",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Track() {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("id") || "");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setTrackingId(idFromUrl);
      handleSearch(idFromUrl);
    }
  }, [searchParams]);

  const handleSearch = async (id?: string) => {
    const searchId = id || trackingId;
    if (!searchId.trim()) return;

    setLoading(true);
    setSearched(true);
    setError("");

    try {
      const response = await fetch(`/api/complaints/${encodeURIComponent(searchId)}`);
      
      if (response.status === 404) {
        setComplaint(null);
      } else if (!response.ok) {
        throw new Error("Failed to fetch complaint");
      } else {
        const data = await response.json();
        setComplaint(data);
      }
    } catch {
      setError("An error occurred while searching. Please try again.");
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Track Your <span className="text-primary">Complaint</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your complaint ID to check the current status and any updates from the administration.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        {/* Search Form */}
        <Card className="shadow-lg border-border mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="trackingId" className="sr-only">Complaint ID</Label>
                <Input
                  id="trackingId"
                  placeholder="Enter your Complaint ID (e.g., CV-ABC123)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="h-12 text-lg font-mono"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                <Search className="w-5 h-5 mr-2" />
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-3">Looking up your complaint...</p>
          </div>
        )}

        {!loading && error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center py-12">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Error</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && searched && !complaint && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center py-12">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Complaint Not Found</h3>
              <p className="text-muted-foreground">
                No complaint found with ID "<span className="font-mono">{trackingId}</span>".
                <br />Please check the ID and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && complaint && (
          <div className="space-y-6">
            {/* Status Card */}
            <Card className="shadow-lg border-border overflow-hidden">
              <div className={`h-2 ${
                complaint.status === "pending" ? "bg-amber-500" :
                complaint.status === "in-progress" ? "bg-blue-500" :
                "bg-emerald-500"
              }`} />
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-mono mb-1">{complaint.complaint_id}</p>
                    <CardTitle className="text-xl">{complaint.title}</CardTitle>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig[complaint.status].color}`}>
                    {(() => {
                      const Icon = statusConfig[complaint.status].icon;
                      return <Icon className={`w-4 h-4 ${complaint.status === "in-progress" ? "animate-spin" : ""}`} />;
                    })()}
                    <span className="font-medium text-sm">{statusConfig[complaint.status].label}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-foreground">{complaint.description}</p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-medium text-foreground">{categoryLabels[complaint.category] || complaint.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{locationLabels[complaint.location] || complaint.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium text-foreground">{formatDate(complaint.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-foreground">{formatDate(complaint.updated_at)}</p>
                    </div>
                  </div>
                </div>

                {complaint.admin_notes && (
                  <div className="bg-muted rounded-xl p-4 border border-border">
                    <p className="text-sm font-medium text-foreground mb-1">Admin Notes</p>
                    <p className="text-sm text-muted-foreground">{complaint.admin_notes}</p>
                  </div>
                )}

                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-primary font-medium">
                    {statusConfig[complaint.status].description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Help Text */}
        {!searched && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Enter your complaint ID above to see the current status.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
