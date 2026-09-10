// ============================================
// APPLICATION STATE
// ============================================

/**
 * Global application state object
 * Contains all data for the Todo List Life Dashboard
 */
const appState = {
  // Greeting Section
  currentTime: new Date(),
  currentGreeting: 'Good Morning',

  // Focus Timer
  timerRunning: false,
  timerPaused: false,
  timerRemaining: 1500, // 25 minutes in seconds
  timerInterval: null,

  // Todo List
  todos: [],

  // Quick Links
  quickLinks: []
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generates a unique identifier for todos and quick links
 * Format: timestamp-random string
 * @returns {string} Unique ID
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formats a date object to HH:MM:SS in 24-hour format
 * @param {Date} date - The date object to format
 * @returns {string} Formatted time as "HH:MM:SS"
 */
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a date object to readable date format
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date as "Monday, January 15, 2024"
 */
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Converts seconds to MM:SS format for timer display
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time as "MM:SS"
 */
function formatTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

/**
 * Loads todos from Local Storage and initializes appState.todos
 * Handles JSON parsing errors gracefully by resetting to empty array
 * Storage key: 'dashboard_todos'
 * @returns {void}
 */
function loadTodosFromStorage() {
  try {
    const stored = localStorage.getItem('dashboard_todos');
    if (stored) {
      appState.todos = JSON.parse(stored);
    } else {
      appState.todos = [];
    }
  } catch (error) {
    console.error('Failed to parse stored todos:', error);
    appState.todos = [];
    // Clear corrupted data from storage
    localStorage.removeItem('dashboard_todos');
  }
}

/**
 * Saves todos array to Local Storage
 * Storage key: 'dashboard_todos'
 * @returns {void}
 */
function saveTodosToStorage() {
  try {
    const todosJson = JSON.stringify(appState.todos);
    localStorage.setItem('dashboard_todos', todosJson);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Local Storage quota exceeded');
    } else {
      console.error('Failed to save todos to storage:', error);
    }
  }
}

/**
 * Loads quick links from Local Storage and initializes appState.quickLinks
 * Handles JSON parsing errors gracefully by resetting to empty array
 * Storage key: 'dashboard_quick_links'
 * @returns {void}
 */
function loadQuickLinksFromStorage() {
  try {
    const stored = localStorage.getItem('dashboard_quick_links');
    if (stored) {
      appState.quickLinks = JSON.parse(stored);
    } else {
      appState.quickLinks = [];
    }
  } catch (error) {
    console.error('Failed to parse stored quick links:', error);
    appState.quickLinks = [];
    // Clear corrupted data from storage
    localStorage.removeItem('dashboard_quick_links');
  }
}

/**
 * Saves quick links array to Local Storage
 * Storage key: 'dashboard_quick_links'
 * @returns {void}
 */
function saveQuickLinksToStorage() {
  try {
    const quickLinksJson = JSON.stringify(appState.quickLinks);
    localStorage.setItem('dashboard_quick_links', quickLinksJson);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Local Storage quota exceeded');
    } else {
      console.error('Failed to save quick links to storage:', error);
    }
  }
}

// ============================================
// TODO LIST FUNCTIONS
// ============================================

/**
 * Initializes the todo list section
 * Loads todos from storage and renders them on app start
 * @returns {void}
 */
function initTodoList() {
  loadTodosFromStorage();
  renderTodoList();
}

/**
 * Renders all todos to the DOM
 * Clears existing list and populates with current todos
 * @returns {void}
 */
function renderTodoList() {
  const todoListElement = document.getElementById('todo-list');
  todoListElement.innerHTML = '';

  appState.todos.forEach((todo) => {
    const todoItem = renderTodoItem(todo);
    todoListElement.appendChild(todoItem);
  });
}

/**
 * Creates a DOM element for a single todo item
 * @param {Object} todo - Todo object with id, title, status, createdAt
 * @returns {HTMLElement} Li element representing the todo item
 */
function renderTodoItem(todo) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  if (todo.status === 'Completed') {
    li.classList.add('completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = todo.status === 'Completed';
  checkbox.addEventListener('change', () => {
    toggleTodoComplete(todo.id);
  });

  const span = document.createElement('span');
  span.className = 'todo-title';
  span.textContent = todo.title;

  const editBtn = document.createElement('button');
  editBtn.className = 'todo-edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    editTodo(todo.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'todo-delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteTodo(todo.id);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * Adds a new todo to the list
 * @param {string} title - The title of the new todo
 * @returns {void}
 */
function addTodo(title) {
  if (!validateTaskTitle(title)) {
    return;
  }

  const todo = {
    id: generateId(),
    title: title.trim(),
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  appState.todos.push(todo);
  saveTodosToStorage();
  renderTodoList();
  clearTodoError();
}

/**
 * Edits an existing todo's title
 * @param {string} id - The ID of the todo to edit
 * @param {string} newTitle - The new title (optional, prompts user if not provided)
 * @returns {void}
 */
function editTodo(id, newTitle) {
  const todo = appState.todos.find((t) => t.id === id);
  if (!todo) {
    return;
  }

  let titleToUse = newTitle;
  if (!newTitle) {
    titleToUse = prompt('Edit task:', todo.title);
    if (titleToUse === null) {
      return; // User cancelled
    }
  }

  if (!validateTaskTitle(titleToUse)) {
    return;
  }

  todo.title = titleToUse.trim();
  saveTodosToStorage();
  renderTodoList();
  clearTodoError();
}

/**
 * Toggles the completion status of a todo
 * @param {string} id - The ID of the todo to toggle
 * @returns {void}
 */
function toggleTodoComplete(id) {
  const todo = appState.todos.find((t) => t.id === id);
  if (!todo) {
    return;
  }

  todo.status = todo.status === 'Active' ? 'Completed' : 'Active';
  saveTodosToStorage();
  renderTodoList();
}

/**
 * Deletes a todo from the list
 * @param {string} id - The ID of the todo to delete
 * @returns {void}
 */
function deleteTodo(id) {
  appState.todos = appState.todos.filter((t) => t.id !== id);
  saveTodosToStorage();
  renderTodoList();
}

/**
 * Validates a task title
 * @param {string} title - The title to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateTaskTitle(title) {
  if (!title || title.trim() === '') {
    displayTodoError('Task title cannot be empty');
    return false;
  }
  if (title.length > 255) {
    displayTodoError('Task title must be 255 characters or less');
    return false;
  }
  return true;
}

/**
 * Displays a todo error message
 * @param {string} message - The error message to display
 * @returns {void}
 */
function displayTodoError(message) {
  const errorElement = document.getElementById('todo-error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    clearTodoError();
  }, 5000);
}

/**
 * Clears the todo error message
 * @returns {void}
 */
function clearTodoError() {
  const errorElement = document.getElementById('todo-error');
  errorElement.textContent = '';
  errorElement.style.display = 'none';
}

// ============================================
// QUICK LINKS FUNCTIONS
// ============================================

/**
 * Initializes the quick links section
 * Loads quick links from storage and renders them on app start
 * @returns {void}
 */
function initQuickLinks() {
  loadQuickLinksFromStorage();
  renderQuickLinks();
}

/**
 * Renders all quick links to the DOM
 * @returns {void}
 */
function renderQuickLinks() {
  const quickLinksListElement = document.getElementById('quick-links-list');
  quickLinksListElement.innerHTML = '';

  appState.quickLinks.forEach((link) => {
    const linkItem = renderQuickLinkItem(link);
    quickLinksListElement.appendChild(linkItem);
  });
}

/**
 * Creates a DOM element for a single quick link
 * @param {Object} link - Quick link object with id, label, url
 * @returns {HTMLElement} Div element representing the quick link
 */
function renderQuickLinkItem(link) {
  const div = document.createElement('div');
  div.className = 'quick-link-item';

  const a = document.createElement('a');
  a.href = link.url;
  a.className = 'quick-link-btn';
  a.textContent = link.label;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';

  const editBtn = document.createElement('button');
  editBtn.className = 'quick-link-edit-btn';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    editQuickLink(link.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'quick-link-delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteQuickLink(link.id);
  });

  div.appendChild(a);
  div.appendChild(editBtn);
  div.appendChild(deleteBtn);

  return div;
}

/**
 * Adds a new quick link
 * @param {string} label - The label for the quick link
 * @param {string} url - The URL for the quick link
 * @returns {void}
 */
function addQuickLink(label, url) {
  if (!validateQuickLinkLabel(label)) {
    return;
  }
  if (!validateUrl(url)) {
    return;
  }

  const quickLink = {
    id: generateId(),
    label: label.trim(),
    url: url.trim()
  };

  appState.quickLinks.push(quickLink);
  saveQuickLinksToStorage();
  renderQuickLinks();
  clearQuickLinkError();
}

/**
 * Edits an existing quick link
 * @param {string} id - The ID of the quick link to edit
 * @param {string} newLabel - The new label (optional)
 * @param {string} newUrl - The new URL (optional)
 * @returns {void}
 */
function editQuickLink(id, newLabel, newUrl) {
  const link = appState.quickLinks.find((l) => l.id === id);
  if (!link) {
    return;
  }

  let labelToUse = newLabel;
  let urlToUse = newUrl;

  if (!newLabel || !newUrl) {
    labelToUse = prompt('Edit label:', link.label);
    if (labelToUse === null) {
      return;
    }
    urlToUse = prompt('Edit URL:', link.url);
    if (urlToUse === null) {
      return;
    }
  }

  if (!validateQuickLinkLabel(labelToUse)) {
    return;
  }
  if (!validateUrl(urlToUse)) {
    return;
  }

  link.label = labelToUse.trim();
  link.url = urlToUse.trim();
  saveQuickLinksToStorage();
  renderQuickLinks();
  clearQuickLinkError();
}

/**
 * Deletes a quick link
 * @param {string} id - The ID of the quick link to delete
 * @returns {void}
 */
function deleteQuickLink(id) {
  appState.quickLinks = appState.quickLinks.filter((l) => l.id !== id);
  saveQuickLinksToStorage();
  renderQuickLinks();
}

/**
 * Validates a quick link label
 * @param {string} label - The label to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateQuickLinkLabel(label) {
  if (!label || label.trim() === '') {
    displayQuickLinkError('Link label cannot be empty');
    return false;
  }
  if (label.length > 50) {
    displayQuickLinkError('Link label must be 50 characters or less');
    return false;
  }
  return true;
}

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid HTTP/HTTPS URL, false otherwise
 */
function validateUrl(url) {
  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(url)) {
    displayQuickLinkError('URL must start with http:// or https://');
    return false;
  }
  return true;
}

/**
 * Displays a quick link error message
 * @param {string} message - The error message to display
 * @returns {void}
 */
function displayQuickLinkError(message) {
  const errorElement = document.getElementById('quick-link-error');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
  setTimeout(() => {
    clearQuickLinkError();
  }, 5000);
}

/**
 * Clears the quick link error message
 * @returns {void}
 */
function clearQuickLinkError() {
  const errorElement = document.getElementById('quick-link-error');
  errorElement.textContent = '';
  errorElement.style.display = 'none';
}

// ============================================
// FOCUS TIMER SECTION FUNCTIONS
// ============================================

/**
 * Initializes the focus timer to 25 minutes (1500 seconds)
 * Sets up timer state variables and displays initial time
 * Validates that timer elements exist in the DOM
 */
function initTimer() {
  // Validate that required DOM elements exist
  const timerDisplay = document.getElementById('timer-display');
  if (!timerDisplay) {
    console.error('Timer display element not found');
    return;
  }

  // Reset timer state to initial values
  appState.timerRunning = false;
  appState.timerPaused = false;
  appState.timerRemaining = 1500; // 25 minutes in seconds
  appState.timerInterval = null;

  // Display initial timer value
  updateTimerDisplay();
}

/**
 * Updates the timer display with the current remaining time
 * Formats the remaining seconds using formatTimerDisplay()
 * Updates the DOM element with id="timer-display"
 */
function updateTimerDisplay() {
  const timerDisplay = document.getElementById('timer-display');
  if (!timerDisplay) {
    console.error('Timer display element not found');
    return;
  }

  // Format remaining seconds to MM:SS and update display
  const formattedTime = formatTimerDisplay(appState.timerRemaining);
  timerDisplay.textContent = formattedTime;
}

/**
 * Starts the focus timer countdown
 * Begins decrementing timerRemaining every 1 second
 * Updates button states and display during countdown
 * Calls onTimerComplete() when timer reaches 00:00
 * Requirements: 3.2, 3.3, 4.1, 4.6
 */
function startTimer() {
  // Prevent starting if timer is already running
  if (appState.timerRunning) {
    return;
  }

  // Set timer state to running
  appState.timerRunning = true;
  appState.timerPaused = false;

  // Update button states: disable start, enable pause
  const startBtn = document.getElementById('timer-start-btn');
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (startBtn) {
    startBtn.disabled = true;
  }
  if (pauseBtn) {
    pauseBtn.disabled = false;
  }

  // Set up interval to decrement timer every second
  appState.timerInterval = setInterval(() => {
    // Decrement remaining time
    appState.timerRemaining -= 1;

    // Update display
    updateTimerDisplay();

    // Check if timer has completed
    if (appState.timerRemaining <= 0) {
      clearInterval(appState.timerInterval);
      appState.timerInterval = null;
      onTimerComplete();
    }
  }, 1000);
}

/**
 * Handles timer completion
 * Stops the timer and resets button states
 * Displays a notification to the user
 * Placeholder for implementation in a future task
 */
function onTimerComplete() {
  // Placeholder: Implementation details will be added in future tasks
  // This function will:
  // - Ensure timer stops running
  // - Reset button states
  // - Display notification
  // - Ensure timerRemaining doesn't go negative
  console.log('Timer completed');
}



// ============================================
// GREETING SECTION FUNCTIONS
// ============================================

/**
 * Returns greeting message based on current hour
 * 0-11: Morning, 12-16: Afternoon, 17-23: Evening
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Appropriate greeting message
 */
function getGreetingMessage(hour) {
  if (hour >= 0 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

/**
 * Updates the greeting message based on current time
 * Detects boundary crossings (00:00, 12:00, 17:00)
 */
function updateGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const newGreeting = getGreetingMessage(hour);

  if (newGreeting !== appState.currentGreeting) {
    appState.currentGreeting = newGreeting;
    const greetingElement = document.getElementById('greeting-message');
    if (greetingElement) {
      greetingElement.textContent = newGreeting;
    }
  }
}

/**
 * Updates the time and date display
 * Called every second via setInterval
 */
function updateTime() {
  const now = new Date();
  appState.currentTime = now;

  // Update time display
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = formatTime(now);
  }

  // Update date display
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    dateElement.textContent = formatDate(now);
  }

  // Update greeting if boundary crossed
  updateGreeting();
}

/**
 * Initializes the greeting section on app start
 * Sets initial time, date, greeting, and starts update interval
 */
function initGreetingSection() {
  // Set initial values
  const now = new Date();
  appState.currentTime = now;
  appState.currentGreeting = getGreetingMessage(now.getHours());

  // Update initial display
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = formatTime(now);
  }

  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    dateElement.textContent = formatDate(now);
  }

  const greetingElement = document.getElementById('greeting-message');
  if (greetingElement) {
    greetingElement.textContent = appState.currentGreeting;
  }

  // Start time updates every 1 second
  setInterval(updateTime, 1000);
}

// ============================================
// APPLICATION INITIALIZATION
// ============================================

/**
 * Initializes the entire application
 * Called when DOM is fully loaded
 */
function initApp() {
  initGreetingSection();
  initTimer();
  initQuickLinks();
  // Additional section initializations will be added here
}

// Start app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Set up event listeners for quick links
document.addEventListener('DOMContentLoaded', function () {
  const quickLinkAddBtn = document.getElementById('quick-link-add-btn');
  if (quickLinkAddBtn) {
    quickLinkAddBtn.addEventListener('click', onAddQuickLinkClick);
  }

  // Set up event listener for timer start button
  const timerStartBtn = document.getElementById('timer-start-btn');
  if (timerStartBtn) {
    timerStartBtn.addEventListener('click', startTimer);
  }
});
