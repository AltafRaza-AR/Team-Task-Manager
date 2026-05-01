import { useState, useEffect } from "react";
import axios from "axios";
import { getUserRoleFromToken } from "../utils/auth";
import { API_BASE_URL } from "../config/api";

const TaskBoard = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [subtaskTitles, setSubtaskTitles] = useState({});
  const token = sessionStorage.getItem("token");
  const isAdmin = getUserRoleFromToken(token) === "Admin";

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/tasks/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks", err);
      }
    };

    loadTasks();
  }, [projectId, token]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/tasks/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const addMainTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API_BASE_URL}/api/tasks/main`,
        { title: taskTitle, project: projectId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTaskTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task", err);
      alert("Error adding task");
    }
  };

  const addSubtask = async (e, parentTaskId) => {
    e.preventDefault();
    const subtaskTitle = subtaskTitles[parentTaskId] || "";

    if (!subtaskTitle.trim()) {
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/tasks/subtask`,
        {
          title: subtaskTitle,
          project: projectId,
          parentTask: parentTaskId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSubtaskTitles((current) => ({ ...current, [parentTaskId]: "" }));
      fetchTasks();
    } catch (err) {
      console.error("Error adding subtask", err);
      alert("Error adding subtask");
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task", err);
      alert("You are not authorized to update this task");
    }
  };

  const deleteTask = async (taskId, hasSubtasks = false) => {
    const confirmationMessage = hasSubtasks
      ? "Delete this task and all of its subtasks?"
      : "Delete this task?";

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
      alert("Only admins can delete tasks");
    }
  };

  return (
    <section className="task-board">
      <div className="task-board__header">
        <div>
          <span className="panel__eyebrow">Task board</span>
          <h4>Tasks</h4>
        </div>
        <p>Main tasks are admin-only; any signed-in user can add subtasks.</p>
      </div>

      {isAdmin && (
        <form className="stack-form stack-form--inline" onSubmit={addMainTask}>
          <input
            className="field field--small"
            placeholder="New main task"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <button className="btn btn--primary btn--compact" type="submit">
            Add Main Task
          </button>
        </form>
      )}

      <div className="task-list">
        {tasks
          .filter((task) => !task.parentTask)
          .map((mainTask) => {
            const subtasks = tasks.filter(
              (task) => task.parentTask?._id === mainTask._id,
            );

            return (
              <article key={mainTask._id} className="task-group">
                <div className="task-group__header">
                  <div>
                    <h5>
                      {mainTask.title}
                      <span
                        className={`status-pill status-pill--${mainTask.status.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {mainTask.status}
                      </span>
                    </h5>
                    {mainTask.assignedTo?.name && (
                      <p className="task-group__meta">
                        Assigned to {mainTask.assignedTo.name}
                      </p>
                    )}
                  </div>

                  <div className="task-group__actions">
                    <select
                      className="field field--small"
                      value={mainTask.status}
                      onChange={(e) =>
                        updateStatus(mainTask._id, e.target.value)
                      }
                    >
                      <option value="To-Do">To-Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn--danger btn--compact"
                        onClick={() =>
                          deleteTask(mainTask._id, subtasks.length > 0)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="subtask-panel">
                  <div className="subtask-panel__heading">
                    <span>Subtasks</span>
                    <strong>{subtasks.length}</strong>
                  </div>

                  {subtasks.length > 0 ? (
                    <ul className="subtask-list">
                      {subtasks.map((subtask) => (
                        <li key={subtask._id} className="subtask-item">
                          <div className="subtask-item__body">
                            <span
                              className={
                                subtask.status === "Done"
                                  ? "task-title task-title--done"
                                  : "task-title"
                              }
                            >
                              {subtask.title}
                            </span>
                            <span
                              className={`status-pill status-pill--${subtask.status.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {subtask.status}
                            </span>
                          </div>

                          <div className="subtask-item__actions">
                            <select
                              className="field field--small"
                              value={subtask.status}
                              onChange={(e) =>
                                updateStatus(subtask._id, e.target.value)
                              }
                            >
                              <option value="To-Do">To-Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                            </select>
                            {isAdmin && (
                              <button
                                type="button"
                                className="btn btn--danger btn--compact"
                                onClick={() => deleteTask(subtask._id, false)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-inline">No subtasks yet.</div>
                  )}

                  <form
                    className="stack-form stack-form--inline subtask-form"
                    onSubmit={(e) => addSubtask(e, mainTask._id)}
                  >
                    <input
                      className="field field--small"
                      placeholder="Add a subtask"
                      value={subtaskTitles[mainTask._id] || ""}
                      onChange={(e) =>
                        setSubtaskTitles((current) => ({
                          ...current,
                          [mainTask._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="btn btn--primary btn--compact"
                      type="submit"
                    >
                      Add Subtask
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
};

export default TaskBoard;
