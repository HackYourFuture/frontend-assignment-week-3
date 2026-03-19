export class TaskManager {
  tasks = [];

  constructor(store) {
    this.store = store;
    this.tasks = store.load();
  }

  save() {
    this.store.save(this.tasks);
  }

  addTask(title, description) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
    };
    this.tasks = [newTask, ...this.tasks];
    this.save();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
  }

  toggleTask(id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    this.save();
  }

  editTask(id, title, description) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, title, description } : task,
    );
    this.save();
  }

  getFiltered(status) {
    switch (status) {
      case "all":
        return this.tasks;
      case "completed":
        return this.tasks.filter((task) => task.completed);
      case "pending":
        return this.tasks.filter((task) => !task.completed);
    }
  }
}
