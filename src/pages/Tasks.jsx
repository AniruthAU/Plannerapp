// src/pages/Tasks.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { id } = useParams(); // planner ID
  const { token, setToken } = useAuth(); // Token from context, ensure it's correctly set

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // Add dueDate state
  const [assignedTo, setAssignedTo] = useState(""); // Optional: Add assignedTo if needed
  const [status, setStatus] = useState(""); // Optional: Add status if needed

  // Fetch tasks for the planner ID
  const fetchTasks = async () => {
    try {
      if (!token) {
        throw new Error("No authorization token found");
      }

      console.log("Authorization Token: ", token); // Debugging line
      const res = await axios.get(`http://localhost:4000/api/tasks?planner=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized! Please log in again.");
        // Optionally, you can redirect to login page here:
        // window.location.href = "/login"; 
      }
    }
  };

  // Create a new task
  const createTask = async () => {
    try {
      if (!token) {
        throw new Error("No authorization token found");
      }

      const payload = {
        title,
        description,
        dueDate,
        planner: id,
      };

      if (status) payload.status = status;
      if (assignedTo) payload.assignedTo = assignedTo;

      await axios.post(
        "http://localhost:4000/api/tasks",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure 'Bearer ' is included
            "Content-Type": "application/json",
          },
        }
      );
      fetchTasks(); // Refresh the task list after creation
    } catch (err) {
      console.error("❌ Error creating task", err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized! Please log in again.");
        // Optionally, you can redirect to login page here:
        // window.location.href = "/login"; 
      }
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    try {
      if (!token) {
        throw new Error("No authorization token found");
      }

      await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // Refresh the task list after deletion
    } catch (err) {
      console.error("❌ Error deleting task", err);
      if (err.response && err.response.status === 401) {
        alert("Unauthorized! Please log in again.");
        // Optionally, you can redirect to login page here:
        // window.location.href = "/login"; 
      }
    }
  };

  // Fetch tasks when the component mounts or planner ID changes
  useEffect(() => {
    fetchTasks();
  }, [id, token]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📌 Tasks for Planner</h2>
      <input
        type="text"
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Task description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)} // Add an input for due date
      />
      {/* Optional: Add fields for status and assignedTo */}
      <button onClick={createTask} disabled={!title || !dueDate}>
        Add Task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title}{" "}
            <button onClick={() => deleteTask(task._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
