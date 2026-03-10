import { useState } from "react";

export default function Home() {

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [category,setCategory] = useState("");
  const [location,setLocation] = useState("");

  const submitIssue = async (e:any) => {
    e.preventDefault();

    try{
      const res = await fetch("/api/complaints",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          title,
          description,
          category,
          location
        })
      });

      const data = await res.json();
      alert("Complaint ID: "+data.complaintId);

      setTitle("");
      setDescription("");

    }catch{
      alert("Submission failed");
    }
  };

  const categories = [
    {name:"Infrastructure",desc:"Buildings, roads"},
    {name:"Technology",desc:"Internet, computers"},
    {name:"Utilities",desc:"Electricity, water"},
    {name:"Safety",desc:"Security issues"},
    {name:"Sanitation",desc:"Waste management"},
    {name:"Other",desc:"General complaints"}
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xl">
            +
          </div>

          <h1 className="text-xl font-semibold">
            Campus<span className="text-emerald-500">Voice</span>
          </h1>
        </div>

        <div className="text-2xl">☰</div>

      </div>

      {/* Hero */}
      <div className="text-center mt-12 px-6">

        <h2 className="text-4xl font-bold text-gray-800">
          Report Campus Issues
          <span className="text-emerald-500"> Anonymously</span>
        </h2>

        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Help improve our campus by reporting issues.
          No registration required. Track your complaint with a unique ID.
        </p>

      </div>

      {/* Form Card */}
      <div className="max-w-xl mx-auto mt-10 bg-white rounded-xl shadow p-6">

        <h3 className="text-xl font-semibold mb-1">
          Submit a New Issue
        </h3>

        <p className="text-gray-500 mb-6">
          Describe the problem you've encountered.
        </p>

        {/* Categories */}

        <div className="grid grid-cols-2 gap-4 mb-6">

          {categories.map(cat=>(
            <button
              key={cat.name}
              type="button"
              onClick={()=>setCategory(cat.name)}
              className={`border rounded-lg p-4 text-left transition
              ${category===cat.name
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-200"}`}
            >
              <div className="font-semibold">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.desc}</div>
            </button>
          ))}

        </div>

        <form onSubmit={submitIssue} className="space-y-4">

          <input
            placeholder="Select campus location"
            value={location}
            onChange={e=>setLocation(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            placeholder="Brief summary of the issue"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Provide as much detail as possible"
            value={description}
            onChange={e=>setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded-lg p-3"
          />

          <button
            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold"
          >
            Submit Issue
          </button>

          <div className="text-center text-emerald-600 cursor-pointer">
            Track Complaint
          </div>

        </form>

      </div>

    </div>
  );
}
