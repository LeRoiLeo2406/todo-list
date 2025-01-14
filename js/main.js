// ========================
// Sélection des éléments
// ========================
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskDateInput = document.getElementById("task-date");
const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

// ========================
// Gestion des tâches
// ========================

// Ajouter une tâche
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const taskDate = taskDateInput.value;

  if (taskText === "") {
    showNotification("Veuillez entrer une tâche valide !");
    return;
  }

  // Crée et ajoute la tâche
  createTask(taskText, false, taskDate);

  // Réinitialise les champs
  taskInput.value = "";
  taskDateInput.value = "";

  // Met à jour les compteurs, sauvegarde et notification
  updateCounter();
  saveTasks();
  toggleEmptyMessage();
  showNotification("Tâche ajoutée avec succès !");
});

// Créer une tâche
function createTask(taskText, completed = false, dueDate = "") {
  const taskItem = document.createElement("li");
  taskItem.innerHTML = `
    <div class="task-content">
      <span class="task-text">${taskText}</span>
      ${dueDate ? `<small class="due-date">Échéance : ${dueDate}</small>` : ""}
    </div>
    <div class="task-buttons">
      <button class="complete-btn"><i class="fas fa-check"></i></button>
      <button class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>
  `;

  if (completed) {
    taskItem.classList.add("completed");
  }

  if (document.body.classList.contains("dark-mode")) {
    taskItem.classList.add("dark-mode");
  }

  // Gestion des événements des boutons
  taskItem.querySelector(".complete-btn").addEventListener("click", () => {
    taskItem.classList.toggle("completed");
    updateCounter();
    saveTasks();
    showNotification("Tâche marquée comme terminée !");
  });

  taskItem.querySelector(".delete-btn").addEventListener("click", () => {
    taskItem.classList.add("deleting");
    setTimeout(() => {
      taskItem.remove();
      updateCounter();
      saveTasks();
      toggleEmptyMessage();
      showNotification("Tâche supprimée avec succès !");
    }, 300);
  });

  // Ajoute la tâche à la liste
  taskList.appendChild(taskItem);
}

// ========================
// Gestion des filtres
// ========================
document.getElementById("filter-all").addEventListener("click", () => {
  document.querySelectorAll("#task-list li").forEach(task => {
    task.style.display = "flex";
  });
});

document.getElementById("filter-completed").addEventListener("click", () => {
  document.querySelectorAll("#task-list li").forEach(task => {
    task.style.display = task.classList.contains("completed") ? "flex" : "none";
  });
});

document.getElementById("filter-pending").addEventListener("click", () => {
  document.querySelectorAll("#task-list li").forEach(task => {
    task.style.display = task.classList.contains("completed") ? "none" : "flex";
  });
});

// ========================
// Notifications
// ========================
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// ========================
// Compteurs et messages
// ========================
function updateCounter() {
  const totalTasks = document.querySelectorAll("#task-list li").length;
  const completedTasks = document.querySelectorAll("#task-list li.completed").length;

  document.getElementById("total-tasks").textContent = totalTasks;
  document.getElementById("completed-tasks").textContent = completedTasks;
}

function toggleEmptyMessage() {
  const emptyMessage = document.getElementById("empty-message");
  const hasTasks = document.querySelectorAll("#task-list li").length > 0;
  emptyMessage.style.display = hasTasks ? "none" : "block";
}

// ========================
// Sauvegarde et chargement
// ========================
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(taskItem => {
    tasks.push({
      text: taskItem.querySelector(".task-text").textContent,
      completed: taskItem.classList.contains("completed"),
      dueDate: taskItem.querySelector(".due-date")?.textContent.replace("Échéance : ", "") || ""
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTask(task.text, task.completed, task.dueDate);
  });

  updateCounter();
  toggleEmptyMessage();
}

// ========================
// Mode sombre
// ========================
toggleDarkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector("header").classList.toggle("dark-mode");
  document.querySelector("footer").classList.toggle("dark-mode");
  document.querySelector("section").classList.toggle("dark-mode");
  document.querySelectorAll("#task-list li").forEach(task => task.classList.toggle("dark-mode"));
  document.querySelectorAll("#filters button").forEach(filter => filter.classList.toggle("dark-mode"));

  // Change l'icône
  const icon = toggleDarkModeBtn.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }

  // Sauvegarde la préférence
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
});

window.addEventListener("DOMContentLoaded", () => {
  const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
  const icon = toggleDarkModeBtn.querySelector("i");

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    document.querySelector("header").classList.add("dark-mode");
    document.querySelector("footer").classList.add("dark-mode");
    document.querySelector("section").classList.add("dark-mode");
    document.querySelectorAll("#task-list li").forEach(task => task.classList.add("dark-mode"));
    document.querySelectorAll("#filters button").forEach(filter => filter.classList.add("dark-mode"));

    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
});

// ========================
// Chargement initial
// ========================
window.addEventListener("DOMContentLoaded", loadTasks);
