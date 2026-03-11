import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  createdAt: string;
};

export default function AdminPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error("Error loading complaints");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      loadComplaints();
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {loading && <p>Loading complaints...</p>}

        {!loading &&
          complaints.map((c) => (
            <Card key={c.id} className="mb-4">
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-3">{c.description}</p>

                <p className="text-sm mb-2">
                  <b>Category:</b> {c.category}
                </p>

                <p className="text-sm mb-2">
                  <b>Location:</b> {c.location}
                </p>

                <p className="text-sm mb-4">
                  <b>Status:</b> {c.status}
                </p>

                <div className="flex gap-2">
                  <Button onClick={() => updateStatus(c.id, "pending")}>
                    Pending
                  </Button>

                  <Button onClick={() => updateStatus(c.id, "in-progress")}>
                    In Progress
                  </Button>

                  <Button onClick={() => updateStatus(c.id, "resolved")}>
                    Resolved
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </main>
    </div>
  );
}