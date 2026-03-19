import { TaskManager } from "./task-manager.js";
import { TaskStore } from "./store.js";
import { AppView } from "./views/app-view.js";

const taskManager = new TaskManager(new TaskStore());
let currentFilter = "all";
let appView;

function render() {
  appView.render(taskManager.getFiltered(currentFilter), currentFilter);
}

const handlers = {
  onAdd(title, description) {
    taskManager.addTask(title, description);
    render();
  },
  onToggle(id) {
    taskManager.toggleTask(id);
    render();
  },
  onDelete(id) {
    taskManager.deleteTask(id);
    render();
  },
  onEdit(id, title, description) {
    taskManager.editTask(id, title, description);
    render();
  },
  onFilter(status) {
    currentFilter = status;
    render();
  },
};

const app = document.getElementById("app");
if (app) {
  appView = new AppView(app, handlers);
  render();
}
