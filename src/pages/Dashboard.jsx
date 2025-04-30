import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [planners, setPlanners] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch all planners
  const fetchPlanners = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/planners", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlanners(res.data);
    } catch (err) {
      console.error("❌ Error fetching planners", err);
    }
  };

  // Create a new planner
  const createPlanner = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/planners",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTitle("");
      setDescription("");
      fetchPlanners(); // Refresh list
    } catch (err) {
      console.error("❌ Error creating planner", err);
    }
  };

  // Delete a planner
  const deletePlanner = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/planners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPlanners(); // Refresh list
    } catch (err) {
      console.error("❌ Error deleting planner", err);
    }
  };

  useEffect(() => {
    fetchPlanners();
  }, []);

  return (
    <div className="dashboard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📋 Your Planners</h2>
        <button onClick={logout}>🚪 Logout</button>
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createPlanner}>Create</button>
      </div>

      <ul className="planner-list">
        {planners.map((p) => (
          <li key={p._id}>
            <Link to={`/planners/${p._id}/tasks`}>
              <strong>{p.title}</strong> - {p.description}
            </Link>
            <button onClick={() => deletePlanner(p._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
