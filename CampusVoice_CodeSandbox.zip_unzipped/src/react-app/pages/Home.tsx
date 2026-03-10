import { useState } from "react";

export default function Home() {

  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [category,setCategory]=useState("");
  const [location,setLocation]=useState("");

  const submitIssue = async (e:any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/complaints",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
        title,
        description,
        category,
        location
      })
    });

    const data = await res.json();
    alert("Complaint ID: "+data.complaintId);
  };

  const categories = [
    "Infrastructure",
    "Technology",
    "Utilities",
    "Safety",
    "Sanitation",
    "Other"
  ];

  return (
    <div style={{
      minHeight:"100vh",
      background:"#f6f7fb",
      padding:"30px",
      fontFamily:"Arial"
    }}>

      <div style={{
        maxWidth:"800px",
        margin:"auto",
        background:"white",
        padding:"30px",
        borderRadius:"10px",
        boxShadow:"0 5px 20px rgba(0,0,0,0.08)"
      }}>

        <h1 style={{fontSize:"30px",marginBottom:"20px"}}>
          CampusVoice
        </h1>

        <p style={{marginBottom:"25px",color:"#555"}}>
          Report campus issues anonymously
        </p>

        <form onSubmit={submitIssue}>

          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(3,1fr)",
            gap:"10px",
            marginBottom:"20px"
          }}>

            {categories.map(cat=>(
              <button
                type="button"
                key={cat}
                onClick={()=>setCategory(cat)}
                style={{
                  padding:"10px",
                  border:"1px solid #ddd",
                  borderRadius:"6px",
                  background: category===cat ? "#2563eb" : "white",
                  color: category===cat ? "white" : "black",
                  cursor:"pointer"
                }}
              >
                {cat}
              </button>
            ))}

          </div>

          <input
            placeholder="Location"
            value={location}
            onChange={e=>setLocation(e.target.value)}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px",
              border:"1px solid #ddd",
              borderRadius:"6px"
            }}
          />

          <input
            placeholder="Issue title"
            value={title}
            onChange={e=>setTitle(e.target.value)}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px",
              border:"1px solid #ddd",
              borderRadius:"6px"
            }}
          />

          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={e=>setDescription(e.target.value)}
            rows="4"
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"20px",
              border:"1px solid #ddd",
              borderRadius:"6px"
            }}
          />

          <button
            style={{
              width:"100%",
              padding:"12px",
              background:"#2563eb",
              color:"white",
              border:"none",
              borderRadius:"6px",
              cursor:"pointer",
              fontWeight:"bold"
            }}
          >
            Submit Issue
          </button>

        </form>

      </div>

    </div>
  );
}
