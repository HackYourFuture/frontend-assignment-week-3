export class TaskStore {
  STORAGE_KEY = "todo-tasks";

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  save(tasks) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }
}
