import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [planners, setPlanners] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("az"); // or "za"
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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

  // Filter planners based on search term
  const filteredPlanners = planners.filter((planner) =>
    planner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    planner.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort planners based on sortOrder
  const sortedPlanners = [...filteredPlanners].sort((a, b) => {
    if (sortOrder === "az") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  useEffect(() => {
    fetchPlanners();
  }, []);

  return (
    <div className="dashboard">
      {/* Search and Sort Controls */}
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search planners..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="az">Sort A → Z</option>
          <option value="za">Sort Z → A</option>
        </select>
      </div>

      {/* Header and Logout Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>📋 Your Planners</h2>
        <button onClick={logout}>🚪 Logout</button>
      </div>

      {/* Form to Create a New Planner */}
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

      {/* Loading State */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        // If no planners are available
        <div>
          {sortedPlanners.length === 0 ? (
            <p>No planners available</p>
          ) : (
            <ul className="planner-list">
              {sortedPlanners.map((p) => (
                <li key={p._id}>
                  <Link to={`/planners/${p._id}/tasks`}>
                    <strong>{p.title}</strong> - {p.description}
                  </Link>
                  <button onClick={() => deletePlanner(p._id)} aria-label="Delete Planner">
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
