import { escapeHtml } from "./utils.js";

export function enterEditMode(li, task, handlers) {
  li.innerHTML = String.raw`
    <input type="checkbox"${task.completed ? " checked" : ""}>
    <div class="edit-form">
      <input type="text" class="edit-title" value="${escapeHtml(task.title)}">
      <input type="text" class="edit-desc" value="${escapeHtml(task.description)}">
      <div class="edit-actions">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
    </div>`;

  const checkbox = li.querySelector("input[type='checkbox']");
  const titleInput = li.querySelector(".edit-title");
  const descInput = li.querySelector(".edit-desc");

  checkbox.addEventListener("change", () => handlers.onToggle(task.id));

  li.querySelector(".save-btn")
    .addEventListener("click", () => {
      const newTitle = titleInput.value.trim();
      if (!newTitle) return;
      handlers.onEdit(task.id, newTitle, descInput.value.trim());
    });

  li.querySelector(".cancel-btn")
    .addEventListener("click", () => {
      const activeFilter =
        document.querySelector(".filter-bar .active")?.dataset.filter ?? "all";
      handlers.onFilter(activeFilter);
    });

  titleInput.focus();
}
