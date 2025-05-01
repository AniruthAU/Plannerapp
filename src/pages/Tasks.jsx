import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tasks = () => {
  const { id } = useParams(); // planner ID
  const { token } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/api/tasks?planner=${id}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
          validateStatus: () => true,
        }
      );
      setTasks(res.data.tasks);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const createTask = async () => {
    try {
      if (!title || !dueDate) return alert("Title and due date are required.");
      if (new Date(dueDate) < new Date()) {
        return alert("Due date cannot be in the past.");
      }

      const payload = {
        title,
        description,
        dueDate,
        planner: id,
        ...(status && { status }),
        ...(assignedTo && { assignedTo }),
      };

      await axios.post("http://localhost:4000/api/tasks", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("✅ Task created!");
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedTo("");
      setStatus("");
      fetchTasks();
    } catch (err) {
      console.error("❌ Error creating task", err);
      if (err.response?.status === 401) {
        alert("Unauthorized! Please log in again.");
      } else {
        toast.error("❌ Failed to create task.");
      }
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("🗑️ Task deleted");
      if (tasks.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchTasks();
      }
    } catch (err) {
      console.error("❌ Error deleting task", err);
      if (err.response?.status === 401) {
        alert("Unauthorized! Please log in again.");
      } else {
        toast.error("❌ Failed to delete task.");
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id, token, page]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <nav
        style={{
          background: "#f4f4f4",
          padding: "1rem",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: "bold" }}>📝 Planner Tasks</span>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#007bff",
            fontWeight: "bold",
          }}
        >
          ⬅ Back to Dashboard
        </Link>
      </nav>

      <div style={{ padding: "2rem" }}>
        <h2>📌 Tasks for Planner</h2>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="New task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <textarea
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ verticalAlign: "top", marginRight: "0.5rem" }}
          />
          <input
            type="text"
            placeholder="Assign to"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ marginRight: "0.5rem" }}
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={createTask} disabled={!title || !dueDate || loading}>
            ➕ Add Task
          </button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task._id} style={{ marginBottom: "1rem" }}>
                <strong>{task.title}</strong> (Due:{" "}
                {new Date(task.dueDate).toLocaleDateString()})
                <br />
                {task.description && <small>{task.description}</small>}
                <br />
                {task.assignedTo && (
                  <span>
                    <em>Assigned to:</em> {task.assignedTo}
                    <br />
                  </span>
                )}
                {task.status && (
                  <span>
                    <em>Status:</em> {task.status}
                    <br />
                  </span>
                )}
                <button onClick={() => deleteTask(task._id)}>🗑️ Delete</button>
              </li>
            ))}
          </ul>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            style={{ marginRight: "1rem" }}
          >
            ⬅ Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            style={{ marginLeft: "1rem" }}
          >
            Next ➡
          </button>
        </div>
      </div>
    </>
  );
};

export default Tasks;
