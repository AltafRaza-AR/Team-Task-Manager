import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskBoard from "../components/TaskBoard";
import axios from "axios";
import { getUserRoleFromToken } from "../utils/auth";
import { API_BASE_URL } from "../config/api";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const token = localStorage.getItem("token");
  const isAdmin = getUserRoleFromToken(token) === "Admin";
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "0",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          animation: slideIn 0.5s ease-out;
        }
        .dashboard-header h2 {
          margin: 0;
          font-size: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logout-btn {
          padding: 10px 24px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
        }
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .dashboard-hero {
          background: white;
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .dashboard-hero h1 {
          font-size: 36px;
          color: #1a202c;
          margin: 16px 0 12px 0;
        }
        .dashboard-hero p {
          color: #718096;
          font-size: 15px;
          margin: 0;
          line-height: 1.6;
        }
        .stat-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }
        .stat-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px;
          border-radius: 12px;
          color: white;
        }
        .stat-card__label {
          display: block;
          font-size: 13px;
          opacity: 1;
          margin-bottom: 8px;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 500;
        }
        .stat-card strong {
          display: block;
          font-size: 32px;
        }
        .create-project-section {
          background: white;
          border-radius: 16px;
          padding: 40px;
          margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .create-project-section h2 {
          font-size: 24px;
          color: #1a202c;
          margin: 0 0 12px 0;
        }
        .create-project-section p {
          color: #718096;
          margin: 0 0 24px 0;
          font-size: 14px;
        }
        .project-form {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 16px;
          align-items: end;
        }
        .project-form input {
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .project-form input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .project-form button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .project-form button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        .projects-section {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .projects-section h2 {
          font-size: 24px;
          color: #1a202c;
          margin: 0 0 12px 0;
        }
        .projects-section p {
          color: #718096;
          margin: 0 0 30px 0;
          font-size: 14px;
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .project-card {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }
        .project-card:hover {
          border-color: #667eea;
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
          transform: translateY(-4px);
        }
        .project-card h3 {
          font-size: 18px;
          color: #1a202c;
          margin: 0 0 8px 0;
        }
        .project-card p {
          color: #718096;
          font-size: 13px;
          margin: 0 0 16px 0;
        }
        .project-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .delete-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.3s ease;
        }
        .delete-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 15px rgba(245, 87, 108, 0.3);
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }
        .empty-state h3 {
          font-size: 22px;
          color: #1a202c;
          margin: 0 0 8px 0;
        }
        .empty-state p {
          color: #718096;
          font-size: 14px;
          margin: 0;
        }
        .restricted-section {
          background: white;
          border: 2px solid #667eea;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .restricted-section h2 {
          font-size: 20px;
          color: #1a202c;
          margin: 0 0 8px 0;
        }
        .restricted-section p {
          color: #2d3748;
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }
        .logout-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .logout-modal-content {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logout-modal-content h3 {
          font-size: 24px;
          color: #1a202c;
          margin: 0 0 12px 0;
        }
        .logout-modal-content p {
          color: #718096;
          margin: 0 0 32px 0;
          font-size: 15px;
          line-height: 1.5;
        }
        .logout-modal-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        .logout-modal-btn {
          padding: 12px 28px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .logout-modal-btn-yes {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
        }
        .logout-modal-btn-yes:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 87, 108, 0.3);
        }
        .logout-modal-btn-no {
          background: #e2e8f0;
          color: #1a202c;
        }
        .logout-modal-btn-no:hover {
          background: #cbd5e0;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="dashboard-header">
        <h2>📊 Team Task Manager</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-hero">
          <h1>Welcome to Your Workspace</h1>
          <p>
            Organize project work, delegate subtasks, and keep progress visible
            across the team.
          </p>

          <div className="stat-cards">
            <div className="stat-card">
              <span className="stat-card__label">Total Projects</span>
              <strong>{projects.length}</strong>
            </div>
            <div className="stat-card">
              <span className="stat-card__label">Your Role</span>
              <strong>{isAdmin ? "👑 Admin" : "👤 Member"}</strong>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="create-project-section">
            <h2>Create New Project</h2>
            <p>Start a new project to organize tasks across your team</p>

            <form className="project-form" onSubmit={createProject}>
              <input
                type="text"
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <button type="submit">Create</button>
            </form>
          </div>
        ) : (
          <div className="restricted-section">
            <h2>Project Creation Restricted</h2>
            <p>
              Only admins can create projects. You can add subtasks and update
              task status on existing projects.
            </p>
          </div>
        )}

        <div className="projects-section">
          <h2>All Projects</h2>
          <p>
            Each project contains tasks with admin-only main tasks and team
            subtasks
          </p>

          {projects.length > 0 ? (
            <div className="project-grid">
              {projects.map((proj) => (
                <article key={proj._id} className="project-card">
                  <div className="project-card__header">
                    <div style={{ flex: 1 }}>
                      <h3>{proj.name}</h3>
                      <p>{proj.description || "No description provided."}</p>
                    </div>
                    {isAdmin && (
                      <button
                        className="delete-btn"
                        onClick={() => deleteProject(proj._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#718096",
                      marginBottom: "16px",
                    }}
                  >
                    <strong>Created by:</strong>{" "}
                    {proj.createdBy?.name || "Unknown"}
                  </div>

                  <TaskBoard projectId={proj._id} />
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No Projects Yet</h3>
              <p>
                {isAdmin
                  ? "Create your first project to get started!"
                  : "Wait for an admin to create a project."}
              </p>
            </div>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <h3>Confirm Logout</h3>
            <p>
              Are you sure you want to logout? You'll need to sign in again to
              access your projects.
            </p>
            <div className="logout-modal-buttons">
              <button
                className="logout-modal-btn logout-modal-btn-yes"
                onClick={confirmLogout}
              >
                Yes, Logout
              </button>
              <button
                className="logout-modal-btn logout-modal-btn-no"
                onClick={cancelLogout}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
