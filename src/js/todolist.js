// let todos = [];
let filterValue = "all";
let selectedDay = getDateKey(new Date());

const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");
const plannerDate = document.querySelector("#planner-date");
const selectedDateLabel = document.querySelector("#selected-date-label");
const dayHeading = document.querySelector("#day-heading");
const updateTodoBtn = document.querySelector("#update-todo");

plannerDate.value = selectedDay;
plannerDate.setAttribute("lang", "fa-IR");
plannerDate.setAttribute("dir", "rtl");
plannerDate.addEventListener("focus", () => {
  plannerDate.setAttribute("lang", "fa-IR");
  plannerDate.setAttribute("dir", "rtl");
});
updateDateLabel();


// events
updateTodoBtn.addEventListener("click", updateTodo);

plannerDate.addEventListener("change", (e) => {
  selectedDay = e.target.value || getDateKey(new Date());
  updateDateLabel();
  filterTodos();
});

todoForm.addEventListener("submit", addNewTodo);

selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});

function addNewTodo(e) {
  e.preventDefault();

  if (!todoInput.value) return null;

  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    day: selectedDay,
    title: todoInput.value,
    isCompleted: false,
  };

  // todos.push(newTodo);
  saveTodo(newTodo);
  filterTodos();
}

function createTodos(todos) {
  // create todos on DOM
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
      <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
      <span class="todo__createdAt">${new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
      }).format(new Date(todo.createdAt))}</span>
      <button class="todo__check" data-todo-id=${
        todo.id
      } ><i class="far fa-check-square"></i></button>

      <button onclick="openEditForm(event)" id="open-modal" class="todo__edit" data-todo-id=${
        todo.id
      } ><i class="far fa-edit"></i></button>

      <button class="todo__remove" data-todo-id=${
        todo.id
      } ><i class="far fa-trash-alt"></i></button>
    </li>`;
  });

  todoList.innerHTML = result;
  todoInput.value = "";

  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
}

function filterTodos() {
  const todos = getAllTodos().filter((todo) => {
    const todoDay = todo.day || getDateKey(new Date(todo.createdAt));
    return todoDay === selectedDay;
  });
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    default:
      createTodos(todos);
  }
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function updateDateLabel() {
  const date = new Date(`${selectedDay}T12:00:00`);
  const formattedDate = new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
  }).format(date);
  selectedDateLabel.textContent = formattedDate;
  dayHeading.textContent = selectedDay === getDateKey(new Date())
    ? "کارهای امروز"
    : `کارهای ${formattedDate}`;
}

function removeTodo(e) {
  // console.log(e.target.dataset.todoId);
  // data-todo-id => todoId
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
}

function checkTodo(e) {
  // console.log(e.target.dataset.todoId);
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

// localStorage => web API

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  // const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Edit toto:
function findOneTodo(id) {
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === id);
  return todo;
}

let todoToEditId;
const editTodoInput = document.querySelector("#edit-todo");

function openEditForm(e) {
  todoToEditId = Number(e.target.dataset.todoId);//local
  const todoToEdit = findOneTodo(todoToEditId);
  editTodoInput.value = todoToEdit.title;
  openModal();
}

function updateTodo(e) {
  const todos = getAllTodos();
  const todo = todos.find((t) => t.id === todoToEditId);
  todo.title = editTodoInput.value;
  saveAllTodos(todos);
  filterTodos();
}
