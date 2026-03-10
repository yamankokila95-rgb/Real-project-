import { useState } from "react";
import { Building2, Wifi, Zap, Shield, Trash2, HelpCircle } from "lucide-react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("Main Building");
  const [menuOpen, setMenuOpen] = useState(false);

  const submitIssue = async (e: any) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
        }),
      });

      const data = await res.json();

      alert(`Complaint ID: ${data.id || data.complaint?.id}`);

      setTitle("");
      setDescription("");
    } catch {
      alert("Submission failed");
    }
  };

  const categories = [
    { name: "Infrastructure", desc: "Buildings, roads", icon: Building2 },
    { name: "Technology", desc: "Internet, computers", icon: Wifi },
    { name: "Utilities", desc: "Electricity, water", icon: Zap },
    { name: "Safety", desc: "Security issues", icon: Shield },
    { name: "Sanitation", desc: "Waste management", icon: Trash2 },
    { name: "Other", desc: "General complaints", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}

      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
            +
          </div>

          <h1 className="text-xl font-semibold">
            Campus<span className="text-emerald-500">Voice</span>
          </h1>
        </div>

        <div
          className="text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>

      {menuOpen && (
        <div className="bg-white shadow p-4 space-y-3">
          <div
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer"
          >
            Report Issue
          </div>

          <div
            onClick={() => (window.location.href = "/track")}
            className="cursor-pointer"
          >
            Track Status
          </div>

          <div
            onClick={() => (window.location.href = "/admin")}
            className="cursor-pointer"
          >
            Admin
          </div>
        </div>
      )}

      {/* Hero */}

      <div className="text-center mt-10 px-6">
        <h2 className="text-4xl font-bold text-gray-800">
          Report Campus Issues
          <span className="text-emerald-500"> Anonymously</span>
        </h2>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Help improve our campus by reporting issues. Track your complaint with
          a unique ID.
        </p>
      </div>

      {/* Form */}

      <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Submit a New Issue</h3>

        <p className="text-gray-500 mb-6">
          Describe the problem you've encountered.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={
                  "border rounded-lg p-4 text-left flex gap-3 items-start " +
                  (category === cat.name
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200")
                }
              >
                <Icon size={22} />

                <div>
                  <div className="font-semibold">{cat.name}</div>

                  <div className="text-sm text-gray-500">{cat.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={submitIssue} className="space-y-4">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Main Building</option>
            <option>Library</option>
            <option>Science Block</option>
            <option>Cafeteria</option>
            <option>Sports Complex</option>
            <option>Dormitory</option>
            <option>Parking Area</option>
            <option>Outdoor/Campus Grounds</option>
            <option>Other</option>
          </select>

          <input
            placeholder="Brief summary of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Provide as much detail as possible about the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg p-3"
          />

          <button className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold">
            Submit Issue Report
          </button>

          <div className="text-center text-emerald-600 cursor-pointer">
            Track Complaint
          </div>
        </form>
      </div>
    </div>
  );
}
