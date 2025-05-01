// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";

const Dashboard = () => {
  const { token, logout } = useAuth();
  const [planners, setPlanners] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchPlanners = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/planners", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlanners(res.data);
    } catch (err) {
      console.error("❌ Error fetching planners", err);
      toast.error("Failed to fetch planners");
    }
  };

  const createPlanner = async () => {
    if (!title.trim() || !dueDate) {
      toast.warning("Title and due date are required.");
      return;
    }

    if (new Date(dueDate) < new Date(new Date().toDateString())) {
      toast.warning("Due date cannot be in the past.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4000/api/planners",
        { title, description, dueDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchPlanners();
      toast.success("Planner created successfully");
    } catch (err) {
      console.error("❌ Error creating planner", err);
      toast.error("Failed to create planner");
    }
  };

  const deletePlanner = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/planners/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPlanners();
      toast.success("Planner deleted");
    } catch (err) {
      console.error("❌ Error deleting planner", err);
      toast.error("Failed to delete planner");
    }
  };

  useEffect(() => {
    fetchPlanners();
  }, []);

  const isButtonDisabled = !(title.trim() && description.trim() && dueDate);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📋 Your Planners</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="create-form">
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
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button 
          onClick={createPlanner}
          disabled={isButtonDisabled}
          className={isButtonDisabled ? 'btn-disabled' : 'btn-active'}
        >
          Create
        </button>
      </div>

      <table className="planner-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {planners.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/planners/${p._id}/tasks`}>{p.title}</Link>
              </td>
              <td>{p.description}</td>
              <td>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "—"}</td>
              <td>{new Date(p.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => deletePlanner(p._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Dashboard;
