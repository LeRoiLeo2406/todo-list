// Sélection des éléments
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskDateInput = document.getElementById("task-date");

// Ajouter une tâche
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const taskDate = taskDateInput.value;
  if (taskText === "") {
    showNotification("Veuillez entrer une tâche valide !");
    return;
  }

  createTask(taskText, false, taskDate);

  taskInput.value = "";
  taskDateInput.value = "";

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

  taskList.appendChild(taskItem);
}

// Filtres des tâches
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

// Fonction pour afficher une notification
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Mettre à jour le compteur
function updateCounter() {
  const totalTasks = document.querySelectorAll("#task-list li").length;
  const completedTasks = document.querySelectorAll("#task-list li.completed").length;

  document.getElementById("total-tasks").textContent = totalTasks;
  document.getElementById("completed-tasks").textContent = completedTasks;
}

// Sauvegarder les tâches dans LocalStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach(taskItem => {
    tasks.push({
      text: taskItem.querySelector("span").textContent,
      completed: taskItem.classList.contains("completed"),
      dueDate: taskItem.querySelector(".due-date")?.textContent.replace("Échéance : ", "") || ""
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Charger les tâches depuis LocalStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTask(task.text, task.completed, task.dueDate);
  });

  updateCounter();
  toggleEmptyMessage();
}

// Afficher ou masquer le message si la liste est vide
function toggleEmptyMessage() {
  const emptyMessage = document.getElementById("empty-message");
  const hasTasks = document.querySelectorAll("#task-list li").length > 0;
  emptyMessage.style.display = hasTasks ? "none" : "block";
}

// Charger les tâches au démarrage
window.addEventListener("DOMContentLoaded", loadTasks);


const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

toggleDarkModeBtn.addEventListener("click", () => {
  // Activer ou désactiver le mode sombre
  document.body.classList.toggle("dark-mode");
  document.querySelector("header").classList.toggle("dark-mode");
  document.querySelector("footer").classList.toggle("dark-mode");
  document.querySelector("section").classList.toggle("dark-mode");
  document.querySelectorAll("#task-list li").forEach(task => task.classList.toggle("dark-mode"));
  document.querySelectorAll("#filters button").forEach(filter => filter.classList.toggle("dark-mode"));

  // Changer l'icône
  const icon = toggleDarkModeBtn.querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }

  // Sauvegarder la préférence dans le LocalStorage
  const isDarkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDarkMode);
});

// Charger la préférence du mode sombre au démarrage
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

    // Icône soleil pour mode sombre
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  }
});