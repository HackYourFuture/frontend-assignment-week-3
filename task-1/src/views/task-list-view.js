import { enterEditMode } from "./task-edit-view.js";
import { escapeHtml } from "./utils.js";

export class TaskListView {
  constructor(root, handlers) {
    this.root = root;
    this.handlers = handlers;
  }

  render(tasks) {
    if (tasks.length === 0) {
      this.root.innerHTML = `<li class="empty-state">No tasks to show.</li>`;
      return;
    }

    this.root.innerHTML = tasks
      .map(
        (task) => String.raw`
          <li class="task-item${task.completed ? " completed" : ""}" data-id="${task.id}">
            <input type="checkbox"${task.completed ? " checked" : ""}>
            <div class="task-content">
              <div class="task-title">${escapeHtml(task.title)}</div>
              <div class="task-description">${escapeHtml(task.description)}</div>
            </div>
            <div class="task-actions">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </li>
        `,
      )
      .join("");

    for (const li of this.root.querySelectorAll(".task-item")) {
      const id = li.dataset.id;
      const task = tasks.find((t) => t.id === id);

      li.querySelector("input[type='checkbox']").addEventListener(
        "change",
        () => this.handlers.onToggle(id),
      );

      li.querySelector(".edit-btn").addEventListener("click", () => {
        enterEditMode(li, task, this.handlers);
      });

      li.querySelector(".delete-btn").addEventListener("click", () =>
        this.handlers.onDelete(id),
      );
    }
  }
}
