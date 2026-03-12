import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../components/ui/card";

import {
  Search,
  Loader2,
  Clock,
  Building2,
  MapPin,
  Calendar
} from "lucide-react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
};

const statusConfig: any = {
  Submitted: {
    label: "Submitted",
    color: "bg-amber-100 text-amber-700",
    description: "Your complaint has been submitted and is awaiting review."
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    description: "Administration is working on your issue."
  },
  resolved: {
    label: "Resolved",
    color: "bg-emerald-100 text-emerald-700",
    description: "Your issue has been resolved."
  }
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function Track() {
  const [searchParams] = useSearchParams();

  const [trackingId, setTrackingId] = useState(
    searchParams.get("id") || ""
  );

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!trackingId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/complaints/${trackingId}`);

      if (!res.ok) {
        throw new Error("Complaint not found");
      }

      const data = await res.json();
      setComplaint(data);
    } catch (err) {
      setError("Complaint not found");
      setComplaint(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setTrackingId(id);
      setTimeout(() => {
        handleSearch();
      }, 200);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-20">

        {/* SEARCH CARD */}

        <Card className="mb-8">
          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit}
              className="flex gap-3"
            >
              <Input
                placeholder="Enter Complaint ID"
                value={trackingId}
                onChange={(e) =>
                  setTrackingId(e.target.value)
                }
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
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* RESULT */}

        {!loading && complaint && (
          <Card className="shadow-xl border rounded-2xl">
            <CardHeader>
              <CardTitle className="flex justify-between">
                {complaint.title}

                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    statusConfig[complaint.status]?.color
                  }`}
                >
                  {statusConfig[complaint.status]?.label ||
                    complaint.status}
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* STATUS PROGRESS */}
<div className="flex items-center justify-between mb-4">

<div className="flex flex-col items-center">
<div className={`w-4 h-4 rounded-full ${
complaint.status === "Submitted" ||
complaint.status === "in-progress" ||
complaint.status === "resolved"
? "bg-green-500"
: "bg-gray-300"
}`} />
<p className="text-xs mt-1">Submitted</p>
</div>

<div className="flex flex-col items-center">
<div className={`w-4 h-4 rounded-full ${
complaint.status === "in-progress" ||
complaint.status === "resolved"
? "bg-green-500"
: "bg-gray-300"
}`} />
<p className="text-xs mt-1">In Progress</p>
</div>

<div className="flex flex-col items-center">
<div className={`w-4 h-4 rounded-full ${
complaint.status === "resolved"
? "bg-green-500"
: "bg-gray-300"
}`} />
<p className="text-xs mt-1">Resolved</p>
</div>

</div>

              <p className="text-gray-700">
                {complaint.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">

                <div className="flex gap-2 items-center">
                  <Building2 size={16} />
                  <span>{complaint.category}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <MapPin size={16} />
                  <span>{complaint.location}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <Calendar size={16} />
                  <span>{formatDate(complaint.createdAt)}</span>
                </div>

                <div className="flex gap-2 items-center">
                  <Clock size={16} />
                  <div className="flex items-center gap-2">
<span>ID: {complaint.id}</span>

<button
className="text-xs px-2 py-1 bg-gray-200 rounded"
onClick={() => navigator.clipboard.writeText(complaint.id)}
>
Copy
</button>

</div>
                </div>

              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                {statusConfig[complaint.status]?.description}
              </div>

            </CardContent>
          </Card>
        )}

        {!loading && !complaint && !error && (
          <p className="text-center text-muted-foreground">
            Enter your complaint ID to track status
          </p>
        )}

      </main>
    </div>
  );
}