// src/tasks.js
export class TaskManager {
  constructor() {
    this.id = crypto.randomUUID()
    this.tasks = this.loadTasks()
  }

  loadTasks() {
    const stored = localStorage.getItem('taskflow-tasks')
    return stored ? JSON.parse(stored) : []
  }

  saveTasks() {
    localStorage.setItem('taskflow-tasks', JSON.stringify(this.tasks))
  }

  getTasks() {
    return [...this.tasks]
  }

  addTask(title) {
    const task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    }
    this.tasks.push(task)
    this.saveTasks()
    return task
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id)
    this.saveTasks()
  }

  toggleTask(id) {
    const task = this.tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      this.saveTasks()
    }
  }

  getStats() {
    const total = this.tasks.length
    const completed = this.tasks.filter(t => t.completed).length
    return {
      total,
      completed,
      pending: total - completed,
    }
  }
}
