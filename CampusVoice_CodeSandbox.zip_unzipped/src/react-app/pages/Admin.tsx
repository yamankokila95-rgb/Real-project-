import { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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
  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === "Submitted").length;
  const inProgress = complaints.filter(
    (c) => c.status === "in-progress"
  ).length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;
  const chartData = [
    { name: "Submitted", value: submitted },
    { name: "In Progress", value: inProgress },
    { name: "Resolved", value: resolved },
  ];

  const COLORS = ["#facc15", "#3b82f6", "#10b981"];

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
      await fetch(`/api/admin/complaints/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="text-2xl font-bold">{submitted}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold">{inProgress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{resolved}</p>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Complaint Status Distribution
            </h2>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {loading && <p>Loading complaints...</p>}

        {!loading && complaints.length === 0 && <p>No complaints found</p>}

        {!loading &&
          complaints.map((c) => (
            <Card key={c.id} className="mb-5 shadow-lg border rounded-2xl">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  {c.title}

                  <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                    {c.status}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-3">{c.description}</p>

                <p className="text-sm mb-1">
                  <b>Category:</b> {c.category}
                </p>

                <p className="text-sm mb-1">
                  <b>Location:</b> {c.location}
                </p>

                <p className="text-sm mb-4">
                  <b>Status:</b> {c.status}
                </p>

                <div className="flex gap-3 flex-wrap">
                  <Button onClick={() => updateStatus(c.id, "Submitted")}>
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
