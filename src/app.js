/**
 * TaskFlow - Application principale
 *
 * Point d'entrée de l'application. Gère l'interface utilisateur
 * et les interactions avec le module tasks.js
 */

import { TaskManager } from './tasks.js'

// Instance du gestionnaire de tâches
const taskManager = new TaskManager()

// État de l'application
let currentFilter = 'all'

// Éléments du DOM
const taskForm = document.getElementById('task-form')
const taskInput = document.getElementById('task-input')
const taskPriority = document.getElementById('task-priority')
const taskList = document.getElementById('task-list')
const taskCount = document.getElementById('task-count')
const clearCompletedBtn = document.getElementById('clear-completed')
const filterButtons = document.querySelectorAll('.filter-btn')

/**
 * Initialise l'application
 */
function init() {
  render()
  setupEventListeners()
}

/**
 * Configure les écouteurs d'événements
 */
function setupEventListeners() {
  // Soumission du formulaire
  taskForm.addEventListener('submit', handleSubmit)

  // Boutons de filtre
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter
      updateFilterButtons()
      render()
    })
  })

  // Bouton supprimer terminées
  clearCompletedBtn.addEventListener('click', handleClearCompleted)

  // Délégation d'événements pour la liste
  taskList.addEventListener('click', handleTaskClick)
  taskList.addEventListener('change', handleTaskChange)
}

/**
 * Gère la soumission du formulaire
 * @param {Event} e - Événement de soumission
 */
function handleSubmit(e) {
  e.preventDefault()

  const text = taskInput.value.trim()
  const priority = taskPriority ? taskPriority.value : 'medium'

  if (!text) {
    alert('Le texte de la tâche ne peut pas être vide')
    return
  }

  try {
    // Utilisation de addTask de TaskManager
    // Note: TaskManager utilise 'title' au lieu de 'text'
    taskManager.addTask(text)
    render()
    taskInput.value = ''
    taskInput.focus()
  } catch (error) {
    alert(error.message)
  }
}

/**
 * Gère les clics sur les tâches (suppression)
 * @param {Event} e - Événement de clic
 */
function handleTaskClick(e) {
  if (e.target.classList.contains('task-delete')) {
    const id = e.target.closest('.task-item').dataset.id
    taskManager.removeTask(id)
    render()
  }
}

/**
 * Gère les changements sur les tâches (checkbox)
 * @param {Event} e - Événement de changement
 */
function handleTaskChange(e) {
  if (e.target.classList.contains('task-checkbox')) {
    const id = e.target.closest('.task-item').dataset.id
    taskManager.toggleTask(id)
    render()
  }
}

/**
 * Gère la suppression des tâches terminées
 */
function handleClearCompleted() {
  const tasks = taskManager.getTasks()
  const completedIds = tasks.filter(t => t.completed).map(t => t.id)
  completedIds.forEach(id => taskManager.removeTask(id))
  render()
}

/**
 * Met à jour l'état actif des boutons de filtre
 */
function updateFilterButtons() {
  filterButtons.forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === currentFilter)
  })
}

/**
 * Filtre les tâches selon le filtre actuel
 * @param {Array} tasks - Liste des tâches
 * @returns {Array} Tâches filtrées
 */
function filterTasks(tasks) {
  switch (currentFilter) {
    case 'active':
      return tasks.filter(task => !task.completed)
    case 'completed':
      return tasks.filter(task => task.completed)
    default:
      return tasks
  }
}

/**
 * Génère le HTML d'une tâche
 * @param {Object} task - Tâche à afficher
 * @returns {string} HTML de la tâche
 */
function renderTask(task) {
  // TaskManager utilise 'title' au lieu de 'text'
  const taskText = task.title || task.text || ''

  // Gestion de la priorité si elle existe
  let priorityHtml = ''
  if (task.priority) {
    const priorityLabels = {
      high: 'Haute',
      medium: 'Moyenne',
      low: 'Basse',
    }
    priorityHtml = `<span class="task-priority ${task.priority}">${priorityLabels[task.priority]}</span>`
  }

  return `
    <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
      >
      <span class="task-text">${escapeHtml(taskText)}</span>
      ${priorityHtml}
      <button class="task-delete" title="Supprimer" aria-label="Delete">×</button>
    </li>
  `
}

/**
 * Échappe les caractères HTML dangereux
 * @param {string} text - Texte à échapper
 * @returns {string} Texte échappé
 */
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Met à jour l'affichage
 */
function render() {
  const allTasks = taskManager.getTasks()
  const filteredTasks = filterTasks(allTasks)
  const stats = taskManager.getStats()

  // Affichage de la liste
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <li class="empty-state">
        ${currentFilter === 'all' ? 'Aucune tâche pour le moment' : 'Aucune tâche dans cette catégorie'}
      </li>
    `
  } else {
    taskList.innerHTML = filteredTasks.map(renderTask).join('')
  }

  // Mise à jour du compteur (utilise stats.pending de TaskManager)
  const label = stats.pending === 1 ? 'tâche restante' : 'tâches restantes'
  taskCount.textContent = `${stats.pending} ${label}`

  // Affichage du bouton "Supprimer terminées"
  clearCompletedBtn.style.display = stats.completed > 0 ? 'block' : 'none'
}

// Démarrage de l'application
init()
