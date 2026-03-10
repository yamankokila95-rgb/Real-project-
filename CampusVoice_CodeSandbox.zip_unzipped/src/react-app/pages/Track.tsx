import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

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

const statusConfig: any = {
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

function formatDate(dateString: string) {
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

  const handleSearch = async () => {
    const id = trackingId || searchParams.get("id");
    if (!id) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();

      const found = data.find((c: any) => c.id === id);

      if (!found) {
        setError("Complaint not found");
        setComplaint(null);
      } else {
        setComplaint(found);
      }

      setSearched(true);
    } catch (err) {
      setError("Error fetching complaint");
    }

    setLoading(false);
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      handleSearch();
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-10">
        {/* SEARCH */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                placeholder="Enter Complaint ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />

              <Button type="submit">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-10">
            <Loader2 className="animate-spin mx-auto mb-2" />
            <p>Loading complaint...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <Card>
            <CardContent className="text-center py-10">
              <AlertCircle className="mx-auto mb-3" />
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {/* RESULT */}
        {!loading && complaint && (
          <Card>
            {/* STATUS BAR */}
            <div
              className={`h-2 ${
                complaint.status === "pending"
                  ? "bg-amber-500"
                  : complaint.status === "in-progress"
                  ? "bg-blue-500"
                  : "bg-emerald-500"
              }`}
            />

            <CardHeader>
              <CardTitle>{complaint.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <p>{complaint.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2 items-center">
                  <Building2 size={16} />
                  <span>
                    {categoryLabels[complaint.category] || complaint.category}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <MapPin size={16} />
                  <span>
                    {locationLabels[complaint.location] || complaint.location}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <Calendar size={16} />
                  <span>{formatDate(complaint.createdAt)}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <Clock size={16} />
                  <span>{statusConfig[complaint.status].label}</span>
                </div>
              </div>

              {complaint.admin_notes && (
                <div className="border p-3 rounded">
                  <strong>Admin Notes</strong>
                  <p>{complaint.admin_notes}</p>
                </div>
              )}

              <div className="p-3 rounded bg-primary/5">
                {statusConfig[complaint.status].description}
              </div>
            </CardContent>
          </Card>
        )}

        {!searched && (
          <p className="text-center text-muted-foreground">
            Enter your complaint ID to track status
          </p>
        )}
      </main>
    </div>
  );
}
