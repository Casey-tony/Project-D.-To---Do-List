// ==== Select DOM Elements ====
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// ==== Load Tasks on Startup ====
window.addEventListener('DOMContentLoaded', loadTasks);

// ==== Add New Task ====
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  addTaskToDOM(task);
  saveTaskToLocal(task);
  taskInput.value = '';
});

// ==== Add Task to DOM ====
function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;
  if (task.completed) li.classList.add('completed');

  li.innerHTML = `
    <span>${task.text}</span>
    <div>
      <button onclick="toggleTask(${task.id})">✅</button>
      <button onclick="editTask(${task.id})">✏️</button>
      <button onclick="deleteTask(${task.id})">🗑️</button>
    </div>
  `;

  taskList.appendChild(li);
}

// ==== Save Task to Local Storage ====
function saveTaskToLocal(task) {
  const tasks = getTasksFromLocal();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ==== Get Tasks from Local Storage ====
function getTasksFromLocal() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

// ==== Load Tasks from Local Storage ====
function loadTasks() {
  const tasks = getTasksFromLocal();
  tasks.forEach(addTaskToDOM);
}

// ==== Toggle Complete ====
function toggleTask(id) {
  const tasks = getTasksFromLocal();
  const updatedTasks = tasks.map(task => {
    if (task.id === id) task.completed = !task.completed;
    return task;
  });
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  refreshTaskList();
}

// ==== Edit Task ====
function editTask(id) {
  const tasks = getTasksFromLocal();
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Edit your task:', task.text);
  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskList();
  }
}

// ==== Delete Task ====
function deleteTask(id) {
  const tasks = getTasksFromLocal();
  const updatedTasks = tasks.filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  refreshTaskList();
}

// ==== Refresh Task List in DOM ====
function refreshTaskList() {
  taskList.innerHTML = '';
  loadTasks();
}
