document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");
  const emptyMessage = document.getElementById("emptyMessage");

  const totalTasks = document.getElementById("totalTasks");
  const completedTasks = document.getElementById("completedTasks");

  const filters = document.querySelectorAll(".filter");
  const quoteEl = document.getElementById("quote");

  const body = document.getElementById("body");


  const darkBtn = document.getElementById("darkmood");
  const lightBtn = document.getElementById("lightmood");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";


  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    const task = {
      id: Date.now(),
      text,
      completed: false,
      time: new Date().toLocaleString()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = "";
  });


  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTaskBtn.click();
  });


  function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "pending") return !task.completed;
      return true;
    });

    emptyMessage.classList.toggle("hidden", filteredTasks.length !== 0);

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center border p-2 mt-2";

      const textDiv = document.createElement("div");

      const taskText = document.createElement("p");
      taskText.textContent = task.text;
      if (task.completed) taskText.classList.add("line-through");

      const time = document.createElement("small");
      time.textContent = task.time;

      textDiv.appendChild(taskText);
      textDiv.appendChild(time);


      const btnDiv = document.createElement("div");
      btnDiv.className = "flex gap-2";

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "✔";
      completeBtn.addEventListener("click", () => toggleComplete(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      btnDiv.appendChild(completeBtn);
      btnDiv.appendChild(deleteBtn);

      li.appendChild(textDiv);
      li.appendChild(btnDiv);

      taskList.appendChild(li);
    });

    updateStats();
  }
  

  function updateStats() {
      const total = tasks.length;

      const completed = tasks.filter(task => task.completed).length;

  
      totalTasks.textContent = total;
      completedTasks.textContent = completed;
    }
    

  function toggleComplete(id) {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
  }


  function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  }


  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }


  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });


  async function fetchQuote() {
    try {
      quoteEl.textContent = "Loading...";
      const res = await fetch("https://api.adviceslip.com/advice?t=" + Date.now());
      const data = await res.json();
      quoteEl.textContent = `"${data.slip.advice}"`;
    } catch (error) {
      quoteEl.textContent = "⚠️ Failed to load quote.";
      console.error(error);
    }
  }


  quoteEl.addEventListener("click", fetchQuote);


  setInterval(fetchQuote, 20000);


  darkBtn.addEventListener("click", () => {
    body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");

    darkBtn.classList.add("hidden");
    lightBtn.classList.remove("hidden");
  });


  lightBtn.addEventListener("click", () => {
    body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");

    lightBtn.classList.add("hidden");
    darkBtn.classList.remove("hidden");
  });


  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    darkBtn.classList.add("hidden");
    lightBtn.classList.remove("hidden");
  } else {
    body.classList.remove("dark-mode");
    lightBtn.classList.add("hidden");
    darkBtn.classList.remove("hidden");
  }

  fetchQuote();
  renderTasks();

});