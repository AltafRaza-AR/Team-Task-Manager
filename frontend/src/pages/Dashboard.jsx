import { useState, useEffect } from "react";
import TaskBoard from "../components/TaskBoard";
import axios from "axios";
import { getUserRoleFromToken } from "../utils/auth";
import { API_BASE_URL } from "../config/api";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("token");
  const isAdmin = getUserRoleFromToken(token) === "Admin";

  // Load projects as soon as the page opens
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      }
    };

    loadProjects();
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/projects`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setName("");
      setDescription("");
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error("Error creating project", error);
      alert("Only Admins can create projects!");
    }
  };
  const deleteProject = async (projectId) => {
    // Adding a quick confirmation so Admins don't delete by accident!
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProjects(); // Refresh the list so the deleted project disappears
    } catch (err) {
      console.error("Error deleting project", err);
      alert("Error deleting project. Only Admins can do this.");
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <span className="eyebrow">Team Task Manager</span>
          <h1>Project Dashboard</h1>
          <p>
            Organize project work, delegate subtasks, and keep progress visible
            across the team.
          </p>
        </div>

        <div className="dashboard-hero__stats">
          <div className="stat-card">
            <span className="stat-card__label">Projects</span>
            <strong>{projects.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-card__label">Mode</span>
            <strong>{isAdmin ? "Admin" : "Member"}</strong>
          </div>
        </div>
      </section>

      {isAdmin ? (
        <section className="panel panel--accent dashboard-form-panel">
          <div className="panel__heading">
            <div>
              <span className="panel__eyebrow">Create project</span>
              <h2>New Project</h2>
            </div>
            <p>Only admins can create project containers.</p>
          </div>

          <form
            className="stack-form stack-form--split"
            onSubmit={createProject}
          >
            <input
              className="field"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="field"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button className="btn btn--primary" type="submit">
              Create Project
            </button>
          </form>
        </section>
      ) : (
        <section className="panel panel--muted">
          <div className="panel__heading">
            <div>
              <span className="panel__eyebrow">Access</span>
              <h2>Project creation is restricted</h2>
            </div>
            <p>You can still add subtasks and update task status.</p>
          </div>
        </section>
      )}

      <section className="dashboard-section">
        <div className="section-header">
          <div>
            <span className="panel__eyebrow">Workspace</span>
            <h2>All Projects</h2>
          </div>
          <p>
            Each project contains a task board with admin-only main tasks and
            team subtasks.
          </p>
        </div>

        {projects.length > 0 ? (
          <div className="project-grid">
            {projects.map((proj) => (
              <article key={proj._id} className="project-card">
                <div className="project-card__header">
                  <div>
                    <h3>{proj.name}</h3>
                    <p>{proj.description || "No description provided."}</p>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      className="btn btn--danger btn--compact"
                      onClick={() => deleteProject(proj._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <div className="project-card__meta">
                  <span>Created by</span>
                  <strong>{proj.createdBy?.name || "Unknown"}</strong>
                </div>

                <TaskBoard projectId={proj._id} />
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Create the first project to start organizing tasks.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
