document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");
  let tasks = [];
  let filter = "All";
  let isLoggedIn = false;
  let username = "";

  function renderLogin() {
    app.innerHTML = `
      <div class="container">
        <h1>Login</h1>
        <input type="text" id="usernameInput" placeholder="Enter your username" />
        <input type="password" id="passwordInput" placeholder="Enter your password" />
        <button onclick="login()">Sign In</button>
      </div>
    `;
  }

  window.login = function () {
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");
    if (usernameInput.value.trim() && passwordInput.value.trim()) {
      username = usernameInput.value.trim();
      isLoggedIn = true;
      renderApp();
    } else {
      alert("Please enter both username and password.");
    }
  }

  function renderApp() {
    const filteredTasks = tasks.filter(task => {
      if (filter === "Completed") return task.completed;
      if (filter === "Incomplete") return !task.completed;
      return true;
    });

    app.innerHTML = `
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1>Task Manager</h1>
            <p>Welcome back, ${username}</p>
          </div>
          <div>
            <button onclick="downloadCSV()">Download CSV</button>
            <button onclick="logout()">Logout</button>
          </div>
        </div>

        <input type="text" id="taskInput" placeholder="Add a new task..." />
        <select id="taskStatus">
          <option value="Incomplete">Incomplete</option>
          <option value="Completed">Completed</option>
        </select>
        <button onclick="addTask()">Add Task</button>

        <div class="filters">
          ${["All", "Incomplete", "Completed"].map(f => `
            <button class="${f === filter ? 'active' : ''}" onclick="setFilter('${f}')">${f}</button>
          `).join('')}
        </div>

        <div id="taskList">
          ${filteredTasks.map(task => `
            <div class="task ${task.completed ? 'completed' : ''}">
              <span onclick="toggleTask(${task.id})">${task.text}</span>
              <span>
                ${new Date(task.createdAt).toLocaleDateString()} - ${task.completed ? 'Completed' : 'Incomplete'}
                <button onclick="deleteTask(${task.id})">Delete</button>
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  window.addTask = function () {
    const input = document.getElementById("taskInput");
    const status = document.getElementById("taskStatus").value;
    if (input.value.trim()) {
      tasks.push({
        id: Date.now(),
        text: input.value.trim(),
        completed: status === "Completed",
        createdAt: new Date().toISOString(),
        completedAt: status === "Completed" ? new Date().toISOString() : null
      });
      input.value = "";
      renderApp();
    }
  }

  window.toggleTask = function (id) {
    tasks = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    renderApp();
  }

  window.deleteTask = function (id) {
    tasks = tasks.filter(t => t.id !== id);
    renderApp();
  }

  window.setFilter = function (f) {
    filter = f;
    renderApp();
  }

  window.logout = function () {
    isLoggedIn = false;
    username = "";
    tasks = [];
    renderLogin();
  }

  window.downloadCSV = function () {
    if (tasks.length === 0) return alert("No tasks to download");

    const headers = ["ID", "Task", "Status", "Created Date", "Completed Date"];
    const rows = tasks.map(t => [
      t.id,
      `"${t.text.replace(/"/g, '""')}"`,
      t.completed ? "Completed" : "Incomplete",
      new Date(t.createdAt).toLocaleString(),
      t.completedAt ? new Date(t.completedAt).toLocaleString() : ""
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${username}_tasks_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }

  renderLogin();
});
