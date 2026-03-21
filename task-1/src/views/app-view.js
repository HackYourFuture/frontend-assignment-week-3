import { TaskListView } from "./task-list-view.js";

export class AppView {
  constructor(root, handlers) {
    root.innerHTML = String.raw`
      <h1>To-Do List</h1>
      <form class="todo-form">
        <input type="text" id="title-input" placeholder="Task title" required>
        <input type="text" id="desc-input" placeholder="Description (optional)">
        <button type="submit">Add Task</button>
      </form>
      <div class="filter-bar">
        <button type="button" data-filter="all" class="active">All</button>
        <button type="button" data-filter="pending">Pending</button>
        <button type="button" data-filter="completed">Completed</button>
      </div>
      <ul class="task-list"></ul>
    `;

    const form = root.querySelector(".todo-form");
    const titleInput = root.querySelector("#title-input");
    const descInput = root.querySelector("#desc-input");
    const taskListEl = root.querySelector(".task-list");
    this.filterBar = root.querySelector(".filter-bar");

    this.taskListView = new TaskListView(taskListEl, handlers);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      if (!title) return;
      handlers.onAdd(title, descInput.value.trim());
      form.reset();
    });

    for (const btn of root.querySelectorAll(".filter-bar button")) {
      btn.addEventListener("click", () => {
        handlers.onFilter(btn.dataset.filter);
      });
    }
  }

  render(tasks, activeFilter) {
    this.taskListView.render(tasks);
    this.updateFilterButtons(activeFilter);
  }

  updateFilterButtons(activeFilter) {
    const buttons = this.filterBar.querySelectorAll("[data-filter]");
    for (const btn of buttons) {
      btn.classList.toggle("active", btn.dataset.filter === activeFilter);
    }
  }
}
