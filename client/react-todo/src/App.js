import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({}); // Per-task comment state

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`);
    setTasks(res.data);
  };

  // Fetch comments for a task
  const fetchComments = async (taskId) => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/comments/task/${taskId}`
    );
    setComments((prev) => ({ ...prev, [taskId]: res.data }));
  };

  // Add new task
  const handleAddTask = async () => {
    if (!taskTitle) return;
    await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, { title: taskTitle });
    setTaskTitle("");
    fetchTasks();
  };

  // Update task
  const handleUpdateTask = async (task) => {
    const newTitle = prompt("Edit task title:", task.title);
    if (!newTitle) return;
    await axios.put(`${process.env.REACT_APP_API_URL}/api/tasks/${task.id}`, {
      title: newTitle,
    });
    fetchTasks();
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${id}`);
    fetchTasks();
  };

  // Add comment for a task
  const handleAddComment = async (taskId) => {
    const comment = newComments[taskId];
    if (!comment) return;

    await axios.post(`${process.env.REACT_APP_API_URL}/api/comments`, {
      task_id: taskId,
      content: comment,
    });

    setNewComments((prev) => ({ ...prev, [taskId]: "" }));
    fetchComments(taskId);
  };

  // Delete a comment
  const handleDeleteComment = async (commentId, taskId) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/${commentId}`);
    fetchComments(taskId);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        To-Do List
      </h2>

      {/* Task Input */}
      <div className="flex gap-2 mb-6">
        <input
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="New Task"
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-6">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-50 p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center">
              <strong className="text-lg">{task.title}</strong>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdateTask(task)}
                  className="text-sm text-yellow-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-4">
              <button
                onClick={() => fetchComments(task.id)}
                className="text-blue-500 text-sm hover:underline"
              >
                Show Comments
              </button>

              <ul className="mt-2 space-y-1 pl-4 list-disc">
                {(comments[task.id] || []).map((comment) => (
                  <li
                    key={comment.id}
                    className="flex justify-between items-center text-gray-700"
                  >
                    {comment.content}
                    <button
                      onClick={() => handleDeleteComment(comment.id, task.id)}
                      className="text-xs text-red-500 hover:underline ml-2"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>

              {/* Add Comment Input */}
              <div className="mt-2 flex gap-2">
                <input
                  value={newComments[task.id] || ""}
                  onChange={(e) =>
                    setNewComments((prev) => ({
                      ...prev,
                      [task.id]: e.target.value,
                    }))
                  }
                  placeholder="Add Comment"
                  className="flex-1 px-3 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                  onClick={() => handleAddComment(task.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                >
                  Add
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
