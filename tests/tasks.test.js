import { describe, test, expect, beforeEach } from 'vitest';

// Simuler localStorage pour les tests
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  clear() {
    this.store = {};
  },
};

global.localStorage = localStorageMock;

// Importer après le mock
import { TaskManager } from '../src/tasks.js';

describe('TaskManager', () => {
  let manager;

  beforeEach(() => {
    localStorage.clear();
    manager = new TaskManager();
  });

  describe('Initialization', () => {
    test('should start with empty tasks', () => {
      expect(manager.getTasks()).toEqual([]);
    });

    test('should have a unique instance ID', () => {
      expect(manager.id).toBeDefined();
    });
  });

  describe('addTask', () => {
    test('should add a task with title', () => {
      manager.addTask('Buy milk');
      const tasks = manager.getTasks();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Buy milk');
    });

    test('should generate unique ID for each task', () => {
      manager.addTask('Task 1');
      manager.addTask('Task 2');
      const tasks = manager.getTasks();
      expect(tasks[0].id).not.toBe(tasks[1].id);
    });

    test('should set completed to false by default', () => {
      manager.addTask('New task');
      const tasks = manager.getTasks();
      expect(tasks[0].completed).toBe(false);
    });

    test('should add createdAt timestamp', () => {
      const before = Date.now();
      manager.addTask('Timed task');
      const after = Date.now();
      const task = manager.getTasks()[0];
      expect(task.createdAt).toBeGreaterThanOrEqual(before);
      expect(task.createdAt).toBeLessThanOrEqual(after);
    });
  });

  describe('removeTask', () => {
    test('should remove task by ID', () => {
      manager.addTask('To remove');
      const taskId = manager.getTasks()[0].id;
      manager.removeTask(taskId);
      expect(manager.getTasks()).toHaveLength(0);
    });

    test('should not affect other tasks', () => {
      manager.addTask('Keep this');
      manager.addTask('Remove this');
      const tasks = manager.getTasks();
      const keepId = tasks[0].id;
      const removeId = tasks[1].id;

      manager.removeTask(removeId);

      expect(manager.getTasks()).toHaveLength(1);
      expect(manager.getTasks()[0].id).toBe(keepId);
    });
  });

  describe('toggleTask', () => {
    test('should toggle completed status', () => {
      manager.addTask('Toggle me');
      const taskId = manager.getTasks()[0].id;

      manager.toggleTask(taskId);
      expect(manager.getTasks()[0].completed).toBe(true);

      manager.toggleTask(taskId);
      expect(manager.getTasks()[0].completed).toBe(false);
    });
  });

  describe('getStats', () => {
    test('should return correct stats', () => {
      manager.addTask('Task 1');
      manager.addTask('Task 2');
      manager.addTask('Task 3');

      const taskId = manager.getTasks()[0].id;
      manager.toggleTask(taskId);

      const stats = manager.getStats();
      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
    });

    test('should return zeros for empty list', () => {
      const stats = manager.getStats();
      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.pending).toBe(0);
    });
  });

  describe('Persistence', () => {
    test('should save tasks to localStorage', () => {
      manager.addTask('Persistent task');
      const stored = JSON.parse(localStorage.getItem('taskflow-tasks'));
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Persistent task');
    });

    test('should load tasks from localStorage on init', () => {
      // Préparer des données
      const existingTasks = [
        { id: '1', title: 'Existing', completed: false, createdAt: Date.now() }
      ];
      localStorage.setItem('taskflow-tasks', JSON.stringify(existingTasks));

      // Nouveau manager doit charger les données
      const newManager = new TaskManager();
      expect(newManager.getTasks()).toHaveLength(1);
      expect(newManager.getTasks()[0].title).toBe('Existing');
    });
  });

  describe('filterByStatus', () => {
    beforeEach(() => {
      manager.addTask('Task 1');
      manager.addTask('Task 2');
      manager.addTask('Task 3');
      manager.toggleTask(manager.getTasks()[0].id); // Complete first task
    });

    test('should return all tasks with "all" filter', () => {
      const filtered = manager.filterByStatus('all');
      expect(filtered).toHaveLength(3);
    });

    test('should return only completed tasks', () => {
      const filtered = manager.filterByStatus('completed');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].completed).toBe(true);
    });

    test('should return only pending tasks', () => {
      const filtered = manager.filterByStatus('pending');
      expect(filtered).toHaveLength(2);
      filtered.forEach(t => expect(t.completed).toBe(false));
    });
  });

});
