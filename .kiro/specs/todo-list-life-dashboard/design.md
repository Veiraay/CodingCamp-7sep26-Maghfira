# Technical Design Document: Todo List Life Dashboard

## Overview

The Todo List Life Dashboard is a single-page productivity application that combines time and date display, contextual greetings, a Pomodoro-style focus timer, task management with CRUD operations, and quick links to frequently accessed websites. The entire application is built as a single HTML file with organized CSS and JavaScript files, using Local Storage for data persistence.

The design prioritizes:
- **Simplicity**: Single HTML file with organized CSS and JS folders
- **Persistence**: All data automatically saved to Local Storage
- **Real-time Updates**: Time display updates every second, UI reflects state changes immediately
- **Modularity**: Code organized by feature with clear function boundaries
- **Accessibility**: Semantic HTML and keyboard-friendly interactions

## Architecture

### Overall Application Structure

```
todo-list-life-dashboard/
├── index.html                 # Main HTML file (single file)
├── css/
│   └── styles.css            # All styling (single CSS file)
└── js/
    └── app.js                # All functionality (single JS file)
```

### Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (index.html)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Greeting Section                              │   │
│  │  - Current Time (updates every 1 second)                │   │
│  │  - Current Date                                         │   │
│  │  - Contextual Greeting (Morning/Afternoon/Evening)      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Focus Timer Section                           │   │
│  │  - Timer Display (MM:SS)                                │   │
│  │  - Start/Pause/Resume Button                            │   │
│  │  - Reset Button                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Todo List Section                             │   │
│  │  - Input field for new tasks                            │   │
│  │  - List of tasks with:                                  │   │
│  │    - Checkbox (complete/active)                         │   │
│  │    - Task title                                         │   │
│  │    - Edit button                                        │   │
│  │    - Delete button                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Quick Links Section                           │   │
│  │  - Input fields for label and URL                       │   │
│  │  - Add button                                           │   │
│  │  - List of quick link buttons with edit/delete options  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                       Local Storage                               │
│  - todos: [{ id, title, status, createdAt }, ...]              │
│  - quickLinks: [{ id, label, url }, ...]                       │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Component: Greeting Section

**Purpose**: Display current time, date, and contextual greeting

**HTML Structure**:
```html
<section id="greeting-section" class="greeting-section">
  <div class="greeting-container">
    <h1 id="greeting-message" class="greeting-message">Good Morning</h1>
    <div id="current-time" class="current-time">00:00:00</div>
    <div id="current-date" class="current-date">Monday, January 15, 2024</div>
  </div>
</section>
```

**CSS Organization**:
- `.greeting-section`: Main container styling
- `.greeting-container`: Flex layout for alignment
- `.greeting-message`: Large, prominent heading
- `.current-time`: Time display in 24-hour format
- `.current-date`: Readable date format

**JavaScript Functions**:
- `updateGreeting()`: Updates greeting based on current hour
- `updateTime()`: Updates time display every second
- `getGreetingMessage(hour)`: Returns appropriate greeting based on hour (0-11: Morning, 12-16: Afternoon, 17-23: Evening)
- `formatTime(date)`: Formats time as HH:MM:SS
- `formatDate(date)`: Formats date as readable string (e.g., "Monday, January 15, 2024")
- `initGreetingSection()`: Initialize greeting updates on app start

**Update Mechanism**: 
- Time updates triggered by `setInterval()` every 1000ms
- Greeting checks every update to detect boundary crossings

---

### Component: Focus Timer Section

**Purpose**: Provide 25-minute Pomodoro-style countdown timer with controls

**HTML Structure**:
```html
<section id="focus-timer-section" class="focus-timer-section">
  <div class="timer-container">
    <h2>Focus Timer</h2>
    <div id="timer-display" class="timer-display">25:00</div>
    <div class="timer-controls">
      <button id="timer-start-btn" class="timer-btn timer-start">Start</button>
      <button id="timer-pause-btn" class="timer-btn timer-pause" disabled>Pause</button>
      <button id="timer-reset-btn" class="timer-btn timer-reset">Reset</button>
    </div>
    <div id="timer-notification" class="timer-notification" style="display: none;"></div>
  </div>
</section>
```

**CSS Organization**:
- `.focus-timer-section`: Main container
- `.timer-container`: Flex layout for vertical stacking
- `.timer-display`: Large, monospace font for time display
- `.timer-controls`: Button container with flex layout
- `.timer-btn`: Button styling
- `.timer-notification`: Notification container (hidden by default)

**JavaScript Functions**:
- `initTimer()`: Initialize timer to 25 minutes (1500 seconds)
- `startTimer()`: Begin countdown
- `pauseTimer()`: Pause countdown and preserve remaining time
- `resumeTimer()`: Resume from paused state
- `resetTimer()`: Return to 25:00 and stop
- `updateTimerDisplay()`: Update display every second
- `formatTimerDisplay(seconds)`: Convert seconds to MM:SS format
- `onTimerComplete()`: Handle completion (notification and stop)
- `notifyTimerComplete()`: Show notification when timer reaches 00:00

**State Variables**:
- `timerInterval`: Reference to setInterval for cleanup
- `timerRemaining`: Current remaining seconds
- `timerRunning`: Boolean indicating if timer is active
- `timerPaused`: Boolean indicating if timer is paused

**Control Logic**:
- Start button: enabled when timer is not running, disables itself and enables pause
- Pause button: enabled only when timer is running, disables itself and enables start
- Reset button: always enabled, returns to 25:00

---

### Component: Todo List Section

**Purpose**: Manage tasks with add, edit, complete, and delete operations

**HTML Structure**:
```html
<section id="todo-section" class="todo-section">
  <h2>My Tasks</h2>
  
  <div class="todo-input-container">
    <input 
      id="todo-input" 
      type="text" 
      class="todo-input" 
      placeholder="Add a new task..."
      maxlength="255"
    />
    <button id="todo-add-btn" class="todo-add-btn">Add Task</button>
  </div>
  
  <div id="todo-error" class="error-message" style="display: none;"></div>
  
  <ul id="todo-list" class="todo-list">
    <!-- Dynamic task items inserted here -->
    <!-- <li class="todo-item">
      <input type="checkbox" class="todo-checkbox" />
      <span class="todo-title">Task title</span>
      <button class="todo-edit-btn">Edit</button>
      <button class="todo-delete-btn">Delete</button>
    </li> -->
  </ul>
</section>
```

**CSS Organization**:
- `.todo-section`: Main container
- `.todo-input-container`: Input and button layout
- `.todo-input`: Input field styling
- `.todo-add-btn`: Add button styling
- `.error-message`: Error message styling
- `.todo-list`: List container (ul)
- `.todo-item`: Individual task item styling
- `.todo-item.completed`: Styling for completed tasks (strikethrough)
- `.todo-checkbox`: Checkbox styling
- `.todo-title`: Task title styling
- `.todo-edit-btn`, `.todo-delete-btn`: Button styling

**JavaScript Functions**:
- `initTodoList()`: Load todos from Local Storage and render
- `addTodo(title)`: Create new task and add to list
- `editTodo(id, newTitle)`: Update task title
- `toggleTodoComplete(id)`: Toggle task between Active/Completed
- `deleteTodo(id)`: Remove task from list
- `renderTodoList()`: Render all todos to DOM
- `renderTodoItem(todo)`: Create DOM element for single todo
- `saveTodosToStorage()`: Save todos array to Local Storage
- `loadTodosFromStorage()`: Load todos from Local Storage
- `validateTaskTitle(title)`: Ensure title is not empty or whitespace only
- `displayTodoError(message)`: Show error message
- `clearTodoError()`: Hide error message

**Data Model**:
```javascript
{
  id: "uuid-string",
  title: "Task description",
  status: "Active" | "Completed",
  createdAt: "2024-01-15T10:30:00Z"
}
```

**Event Handlers**:
- Add button click: Validate input, create task, clear input, save to storage
- Checkbox change: Toggle status, update display, save to storage
- Edit button click: Show input field with current title, allow modification
- Delete button click: Remove from list, save to storage
- Input field Enter key: Same as add button click

---

### Component: Quick Links Section

**Purpose**: Store and provide quick access to frequently visited websites

**HTML Structure**:
```html
<section id="quick-links-section" class="quick-links-section">
  <h2>Quick Links</h2>
  
  <div class="quick-links-input-container">
    <input 
      id="quick-link-label-input" 
      type="text" 
      class="quick-link-input" 
      placeholder="Link label (max 50 chars)"
      maxlength="50"
    />
    <input 
      id="quick-link-url-input" 
      type="url" 
      class="quick-link-input" 
      placeholder="URL (https://example.com)"
    />
    <button id="quick-link-add-btn" class="quick-link-add-btn">Add Link</button>
  </div>
  
  <div id="quick-link-error" class="error-message" style="display: none;"></div>
  
  <div id="quick-links-list" class="quick-links-list">
    <!-- Dynamic quick link buttons inserted here -->
    <!-- <div class="quick-link-item">
      <a href="https://example.com" target="_blank" class="quick-link-btn">Label</a>
      <button class="quick-link-edit-btn">Edit</button>
      <button class="quick-link-delete-btn">Delete</button>
    </div> -->
  </div>
</section>
```

**CSS Organization**:
- `.quick-links-section`: Main container
- `.quick-links-input-container`: Input fields and button layout
- `.quick-link-input`: Input field styling
- `.quick-link-add-btn`: Add button styling
- `.quick-links-list`: Container for quick link buttons
- `.quick-link-item`: Wrapper for each quick link with controls
- `.quick-link-btn`: Link button styling
- `.quick-link-edit-btn`, `.quick-link-delete-btn`: Edit/delete button styling
- `.error-message`: Error message styling

**JavaScript Functions**:
- `initQuickLinks()`: Load quick links from Local Storage and render
- `addQuickLink(label, url)`: Create new quick link
- `editQuickLink(id, newLabel, newUrl)`: Update quick link
- `deleteQuickLink(id)`: Remove quick link
- `renderQuickLinks()`: Render all quick links to DOM
- `renderQuickLinkItem(link)`: Create DOM element for single quick link
- `saveQuickLinksToStorage()`: Save quick links array to Local Storage
- `loadQuickLinksFromStorage()`: Load quick links from Local Storage
- `validateUrl(url)`: Ensure URL is valid HTTP/HTTPS format
- `displayQuickLinkError(message)`: Show error message
- `clearQuickLinkError()`: Hide error message
- `generateId()`: Generate unique ID for quick links

**Data Model**:
```javascript
{
  id: "uuid-string",
  label: "Link label",
  url: "https://example.com"
}
```

**Event Handlers**:
- Add button click: Validate inputs, create link, clear inputs, save to storage
- Link button click: Open URL in new tab (native browser behavior via target="_blank")
- Edit button click: Show input fields with current values, allow modification
- Delete button click: Remove from list, save to storage

---

## Data Models

### Local Storage Schema

**Storage Key: `dashboard_todos`**
```javascript
[
  {
    id: "todo-1",
    title: "Complete project",
    status: "Active",           // or "Completed"
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "todo-2",
    title: "Review documentation",
    status: "Completed",
    createdAt: "2024-01-14T09:15:00Z"
  }
]
```

**Storage Key: `dashboard_quick_links`**
```javascript
[
  {
    id: "link-1",
    label: "Gmail",
    url: "https://gmail.com"
  },
  {
    id: "link-2",
    label: "GitHub",
    url: "https://github.com"
  }
]
```

### Data Persistence Patterns

**Pattern 1: Save on Modification**
```javascript
// Whenever a todo is modified:
function saveTodosToStorage() {
  const todosJson = JSON.stringify(todos);
  localStorage.setItem('dashboard_todos', todosJson);
}

// Called after: addTodo(), editTodo(), toggleTodoComplete(), deleteTodo()
```

**Pattern 2: Load on Initialization**
```javascript
function loadTodosFromStorage() {
  const stored = localStorage.getItem('dashboard_todos');
  if (stored) {
    try {
      todos = JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse todos:', error);
      todos = [];
    }
  } else {
    todos = [];
  }
}

// Called during app initialization
```

**Pattern 3: Generate Unique Identifiers**
```javascript
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Used when creating new todos and quick links
```

---

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Time Display Updates Every Second

*For any* application state, the displayed time shall update every second and display the current time in HH:MM:SS format in 24-hour notation.

**Validates: Requirements 1.1, 1.3, 1.4**

### Property 2: Greeting Message Updates at Boundaries

*For any* time boundary (00:00, 12:00, 17:00, 00:00), the greeting message shall update when the system time crosses that boundary, displaying the appropriate greeting (Morning/Afternoon/Evening).

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 3: Timer Countdown Preserves Remaining Time

*For any* running timer that is paused, resuming the timer shall continue from the exact remaining seconds without loss of time.

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 4: Task Addition Is Idempotent on Storage

*For any* valid task title, adding it to the todo list and then retrieving from Local Storage shall return a task with the same title and Active status.

**Validates: Requirements 5.2, 5.3, 5.5, 9.1, 9.2**

### Property 5: Task Completion Toggle Is Self-Inverse

*For any* task, toggling the completion state twice shall return the task to its original state.

**Validates: Requirements 7.2, 7.4, 7.5**

### Property 6: Task Deletion Removes from Both UI and Storage

*For any* task in the todo list, deleting it shall remove it from both the displayed list and Local Storage immediately.

**Validates: Requirements 8.2, 8.3, 8.4**

### Property 7: Quick Link URL Persistence Round-Trip

*For any* valid quick link with label and URL, saving it and reloading the application shall display the same label and URL when the link is accessed.

**Validates: Requirements 10.2, 10.5, 11.3, 13.1, 13.2**

### Property 8: Empty Input Validation Prevents Invalid Submissions

*For any* empty or whitespace-only task title, the system shall reject the submission and display an error message without modifying the task list.

**Validates: Requirements 5.7, 6.5**

### Property 9: Timer Completion Halts Countdown

*For any* running timer that reaches 00:00, the timer shall stop counting and not continue into negative time.

**Validates: Requirements 3.4, 3.5**

### Property 10: Quick Link Invalid URL Rejection

*For any* URL string that does not match HTTP or HTTPS format, the system shall reject the submission and display an error message without modifying the quick links collection.

**Validates: Requirements 10.8, 11.5**

---

## Error Handling

### Task Input Validation

**Error Case 1: Empty Task Title**
```javascript
function validateTaskTitle(title) {
  if (!title || title.trim() === '') {
    displayTodoError('Task title cannot be empty');
    return false;
  }
  return true;
}
```
- Display: Red error banner below input field
- Duration: 5 seconds auto-dismiss or manual clear on next input
- Recovery: User can edit and resubmit

**Error Case 2: Task Title Too Long**
```javascript
// HTML constraint: maxlength="255"
// JavaScript validation:
if (title.length > 255) {
  displayTodoError('Task title must be 255 characters or less');
  return false;
}
```

### Quick Link Input Validation

**Error Case 1: Invalid URL Format**
```javascript
function validateUrl(url) {
  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(url)) {
    displayQuickLinkError('URL must start with http:// or https://');
    return false;
  }
  return true;
}
```

**Error Case 2: Empty Label**
```javascript
function validateQuickLinkLabel(label) {
  if (!label || label.trim() === '') {
    displayQuickLinkError('Link label cannot be empty');
    return false;
  }
  return true;
}
```

**Error Case 3: Duplicate Quick Link**
```javascript
// Optional: Prevent adding duplicate URLs
function isDuplicateUrl(url) {
  return quickLinks.some(link => link.url.toLowerCase() === url.toLowerCase());
}
```

### Local Storage Handling

**Error Case 1: Storage Quota Exceeded**
```javascript
function saveTodosToStorage() {
  try {
    const todosJson = JSON.stringify(todos);
    localStorage.setItem('dashboard_todos', todosJson);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Local Storage quota exceeded');
      // Fallback: Keep data in memory, notify user
    }
  }
}
```

**Error Case 2: Corrupted Storage Data**
```javascript
function loadTodosFromStorage() {
  try {
    const stored = localStorage.getItem('dashboard_todos');
    if (stored) {
      todos = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse stored todos:', error);
    todos = []; // Reset to empty array
    // Optional: Clear corrupted data
    localStorage.removeItem('dashboard_todos');
  }
}
```

---

## Testing Strategy

### Unit Testing Approach

Unit tests will verify specific examples and edge cases with concrete values:

**Time/Date Functions**:
- Test that `formatTime(new Date('2024-01-15T09:30:45'))` returns `"09:30:45"`
- Test that `formatDate(new Date('2024-01-15'))` returns correct day and date string
- Test that `getGreetingMessage(8)` returns "Good Morning"
- Test that `getGreetingMessage(14)` returns "Good Afternoon"
- Test that `getGreetingMessage(18)` returns "Good Evening"

**Timer Functions**:
- Test that `formatTimerDisplay(0)` returns "00:00"
- Test that `formatTimerDisplay(1500)` returns "25:00"
- Test that `formatTimerDisplay(45)` returns "00:45"
- Test starting, pausing, resuming timer preserves remaining time
- Test that reset returns timer to "25:00"

**Task Management**:
- Test that `addTodo("Buy groceries")` creates task with Active status
- Test that `toggleTodoComplete(todoId)` changes status from Active to Completed
- Test that `toggleTodoComplete(todoId)` again changes status back to Active
- Test that `deleteTodo(todoId)` removes task from todos array
- Test that `editTodo(todoId, "New title")` updates task title

**Validation Functions**:
- Test that `validateTaskTitle("")` returns false
- Test that `validateTaskTitle("   ")` returns false
- Test that `validateTaskTitle("Valid task")` returns true
- Test that `validateUrl("https://example.com")` returns true
- Test that `validateUrl("example.com")` returns false
- Test that `validateUrl("ftp://example.com")` returns false

**Local Storage Integration**:
- Test that `saveTodosToStorage()` and `loadTodosFromStorage()` round-trip data
- Test that loading empty storage initializes empty arrays
- Test that corrupted JSON is caught and logged

### Property-Based Testing Approach

Property tests will verify universal properties across many generated inputs:

**Property Test 1: Timer Countdown Property**
```javascript
// Framework: Fast-Check (or similar)
// Generate: Random durations between 0 and 1500 seconds
// Property: Pausing and resuming should preserve remaining time
// Iterations: 100+
```

**Property Test 2: Task Status Toggle Property**
```javascript
// Generate: Random task objects with various titles and statuses
// Property: Toggling status twice returns to original state
// Iterations: 100+
```

**Property Test 3: URL Validation Property**
```javascript
// Generate: Random strings with and without http/https protocol
// Property: Valid URLs (http://, https://) are accepted, others rejected
// Iterations: 100+
```

**Property Test 4: Persistence Round-Trip Property**
```javascript
// Generate: Random arrays of todos and quick links
// Property: Save to storage, then load should equal original
// Iterations: 100+
```

### Integration Testing Approach

Integration tests will verify end-to-end workflows:

1. **Full Workflow: Add Task, Complete, Delete**
   - Add task via UI
   - Verify task appears in list and Local Storage
   - Mark as complete and verify visual change
   - Delete task and verify removal from list and storage

2. **Full Workflow: Quick Link Lifecycle**
   - Add quick link via UI
   - Verify link appears in list and Local Storage
   - Edit quick link and verify update
   - Delete quick link and verify removal

3. **Full Workflow: Timer Completion**
   - Start 25-minute timer
   - Simulate time passing (or fast-forward in test)
   - Verify timer reaches 00:00 and stops
   - Verify notification is shown

4. **Data Persistence Across Sessions**
   - Add todos and quick links
   - Simulate page reload (clear DOM, reload from storage)
   - Verify all data is restored correctly

---

## State Management

### Application State Structure

```javascript
// Global state object (in memory)
const appState = {
  // Greeting Section
  currentTime: new Date(),
  currentGreeting: "Good Morning",
  
  // Focus Timer
  timerRunning: false,
  timerPaused: false,
  timerRemaining: 1500,
  timerInterval: null,
  
  // Todo List
  todos: [
    { id: "...", title: "...", status: "Active", createdAt: "..." },
    // ...
  ],
  
  // Quick Links
  quickLinks: [
    { id: "...", label: "...", url: "..." },
    // ...
  ]
};
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   User Interactions                      │
└────────────────┬──────────────────────────────────────┬──┘
                 │                                      │
        ┌────────▼────────┐                    ┌────────▼────────┐
        │  DOM Events     │                    │  Timer Events   │
        │  (click, enter) │                    │  (setInterval)  │
        └────────┬────────┘                    └────────┬────────┘
                 │                                      │
        ┌────────▼──────────────────────────────────────▼──────┐
        │      Event Handlers (app.js)                         │
        │  - onAddTodoClick()                                  │
        │  - onEditTodoClick()                                 │
        │  - onCompleteTodoChange()                            │
        │  - onDeleteTodoClick()                               │
        │  - onAddQuickLinkClick()                             │
        │  - updateGreeting()                                  │
        │  - updateTimerDisplay()                              │
        └────────┬──────────────────────────────────────┬──────┘
                 │                                      │
        ┌────────▼────────┐                    ┌────────▼────────┐
        │ Update State    │                    │ Update State    │
        │ (todos array)   │                    │ (timerRemaining)│
        └────────┬────────┘                    └────────┬────────┘
                 │                                      │
        ┌────────▼──────────────────────────────────────▼──────┐
        │         Save to Local Storage                        │
        │  - localStorage.setItem('dashboard_todos', ...)      │
        │  - localStorage.setItem('dashboard_quick_links', ...) │
        └────────┬──────────────────────────────────────┬──────┘
                 │                                      │
        ┌────────▼──────────────────────────────────────▼──────┐
        │         Render Updates to DOM                        │
        │  - renderTodoList()                                  │
        │  - updateTimerDisplay()                              │
        │  - updateGreeting()                                  │
        └──────────────────────────────────────────────────────┘
```

### Event Handling Patterns

**Pattern 1: User-Initiated Event**
```javascript
// 1. User clicks "Add Task" button
document.getElementById('todo-add-btn').addEventListener('click', onAddTodoClick);

// 2. Handler executes
function onAddTodoClick() {
  const title = document.getElementById('todo-input').value;
  
  // 3. Validate input
  if (!validateTaskTitle(title)) {
    return;
  }
  
  // 4. Update state
  addTodo(title);
  
  // 5. Save to storage
  saveTodosToStorage();
  
  // 6. Render changes
  renderTodoList();
  document.getElementById('todo-input').value = '';
}
```

**Pattern 2: Timer Interval Event**
```javascript
// 1. Start interval
function startTimer() {
  timerInterval = setInterval(() => {
    // 2. Update state
    timerRemaining -= 1;
    
    // 3. Render changes
    updateTimerDisplay();
    
    // 4. Check completion
    if (timerRemaining <= 0) {
      onTimerComplete();
    }
  }, 1000);
}
```

### Local Storage Synchronization

**Write Pattern**:
```
User Action → Update State → Save to Storage → Render UI
```

**Read Pattern**:
```
App Initialize → Load from Storage → Populate State → Render UI
```

**Conflict Resolution**:
- No conflict: Single browser tab has full control
- Fresh load: Storage is source of truth
- Corrupted data: Default to empty state and clear corrupted data

---

## Code Organization

### JavaScript File Structure (`js/app.js`)

```javascript
// ============================================
// 1. APPLICATION STATE
// ============================================
const appState = {
  todos: [],
  quickLinks: [],
  timerRunning: false,
  timerRemaining: 1500,
  timerInterval: null,
  currentGreeting: 'Good Morning'
};

// ============================================
// 2. GREETING SECTION FUNCTIONS
// ============================================
function initGreetingSection() { /* ... */ }
function updateGreeting() { /* ... */ }
function updateTime() { /* ... */ }
function getGreetingMessage(hour) { /* ... */ }
function formatTime(date) { /* ... */ }
function formatDate(date) { /* ... */ }

// ============================================
// 3. FOCUS TIMER SECTION FUNCTIONS
// ============================================
function initTimer() { /* ... */ }
function startTimer() { /* ... */ }
function pauseTimer() { /* ... */ }
function resumeTimer() { /* ... */ }
function resetTimer() { /* ... */ }
function updateTimerDisplay() { /* ... */ }
function formatTimerDisplay(seconds) { /* ... */ }
function onTimerComplete() { /* ... */ }
function notifyTimerComplete() { /* ... */ }

// ============================================
// 4. TODO LIST FUNCTIONS
// ============================================
function initTodoList() { /* ... */ }
function addTodo(title) { /* ... */ }
function editTodo(id, newTitle) { /* ... */ }
function toggleTodoComplete(id) { /* ... */ }
function deleteTodo(id) { /* ... */ }
function renderTodoList() { /* ... */ }
function renderTodoItem(todo) { /* ... */ }
function validateTaskTitle(title) { /* ... */ }
function displayTodoError(message) { /* ... */ }
function clearTodoError() { /* ... */ }

// ============================================
// 5. QUICK LINKS FUNCTIONS
// ============================================
function initQuickLinks() { /* ... */ }
function addQuickLink(label, url) { /* ... */ }
function editQuickLink(id, newLabel, newUrl) { /* ... */ }
function deleteQuickLink(id) { /* ... */ }
function renderQuickLinks() { /* ... */ }
function renderQuickLinkItem(link) { /* ... */ }
function validateUrl(url) { /* ... */ }
function displayQuickLinkError(message) { /* ... */ }
function clearQuickLinkError() { /* ... */ }

// ============================================
// 6. LOCAL STORAGE FUNCTIONS
// ============================================
function saveTodosToStorage() { /* ... */ }
function loadTodosFromStorage() { /* ... */ }
function saveQuickLinksToStorage() { /* ... */ }
function loadQuickLinksFromStorage() { /* ... */ }
function generateId() { /* ... */ }

// ============================================
// 7. EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', initApp);
// Timer buttons
document.getElementById('timer-start-btn').addEventListener('click', startTimer);
// Todo buttons
document.getElementById('todo-add-btn').addEventListener('click', onAddTodoClick);
// Quick Link buttons
document.getElementById('quick-link-add-btn').addEventListener('click', onAddQuickLinkClick);
// Enter key handlers for inputs
document.getElementById('todo-input').addEventListener('keypress', onTodoInputKeypress);

// ============================================
// 8. INITIALIZATION
// ============================================
function initApp() {
  loadTodosFromStorage();
  loadQuickLinksFromStorage();
  initGreetingSection();
  initTimer();
  initTodoList();
  initQuickLinks();
}
```

### CSS File Organization (`css/styles.css`)

```css
/* ============================================
   RESET & GLOBAL STYLES
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

/* ============================================
   GREETING SECTION
   ============================================ */
.greeting-section {
  /* Main container styles */
}

.greeting-container {
  /* Flex container for greeting, time, date */
}

.greeting-message {
  /* Large heading for greeting */
}

.current-time {
  /* Time display styling */
}

.current-date {
  /* Date display styling */
}

/* ============================================
   FOCUS TIMER SECTION
   ============================================ */
.focus-timer-section {
  /* Main container styles */
}

.timer-container {
  /* Flex container for timer */
}

.timer-display {
  /* Large monospace time display */
}

.timer-controls {
  /* Button container */
}

.timer-btn {
  /* Base button styling */
}

.timer-start, .timer-pause, .timer-reset {
  /* Individual button variants */
}

.timer-btn:disabled {
  /* Disabled button state */
}

.timer-notification {
  /* Notification display */
}

/* ============================================
   TODO LIST SECTION
   ============================================ */
.todo-section {
  /* Main container styles */
}

.todo-input-container {
  /* Input and button layout */
}

.todo-input {
  /* Input field styling */
}

.todo-add-btn {
  /* Add button styling */
}

.error-message {
  /* Error message styling */
}

.todo-list {
  /* UL container styling */
}

.todo-item {
  /* Individual task item styling */
}

.todo-item.completed {
  /* Completed task styling (strikethrough) */
}

.todo-checkbox {
  /* Checkbox styling */
}

.todo-title {
  /* Task title styling */
}

.todo-edit-btn, .todo-delete-btn {
  /* Button styling */
}

/* ============================================
   QUICK LINKS SECTION
   ============================================ */
.quick-links-section {
  /* Main container styles */
}

.quick-links-input-container {
  /* Input fields and button layout */
}

.quick-link-input {
  /* Input field styling */
}

.quick-link-add-btn {
  /* Add button styling */
}

.quick-links-list {
  /* Container for quick link buttons */
}

.quick-link-item {
  /* Wrapper for each quick link with controls */
}

.quick-link-btn {
  /* Link button styling */
}

.quick-link-edit-btn, .quick-link-delete-btn {
  /* Edit/delete button styling */
}

/* ============================================
   UTILITY CLASSES
   ============================================ */
.hidden {
  display: none;
}

.error {
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 10px;
  border-radius: 4px;
}

.success {
  color: #27ae60;
  background-color: #d5f4e6;
  padding: 10px;
  border-radius: 4px;
}

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) {
  /* Mobile-specific styles */
}
```

### Function Naming Convention

**Greeting Functions**:
- `update*()` - Functions that modify display
- `get*()` - Functions that compute values
- `format*()` - Functions that format output

**Timer Functions**:
- `init*()`, `start*()`, `pause*()`, `reset*()` - State change operations
- `update*()` - Display updates
- `on*()` - Event handlers

**Todo Functions**:
- `add*()`, `edit*()`, `toggle*()`, `delete*()` - CRUD operations
- `render*()` - DOM rendering
- `validate*()` - Input validation
- `display*()`, `clear*()` - Error handling

**Storage Functions**:
- `save*ToStorage()` - Write to storage
- `load*FromStorage()` - Read from storage
- `generate*()` - Utility functions

### Code Comments Strategy

**Section Headers**: Clearly mark sections with comment blocks
```javascript
// ============================================
// FOCUS TIMER SECTION
// ============================================
```

**Complex Logic**: Comment non-obvious algorithms
```javascript
// Check if time crossed greeting boundary
// (e.g., 11:59:59 → 12:00:00 triggers update)
if (previousHour !== currentHour && shouldUpdateGreeting) {
  updateGreeting();
}
```

**Data Transformations**: Explain data flow
```javascript
// Convert seconds to MM:SS format
// Example: 125 seconds → "02:05"
function formatTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
```

**Edge Cases**: Document special handling
```javascript
// Handle corrupted Local Storage data gracefully
// If JSON parsing fails, reset to empty array and clear storage
try {
  todos = JSON.parse(stored);
} catch (error) {
  console.error('Failed to parse stored todos:', error);
  todos = [];
  localStorage.removeItem('dashboard_todos');
}
```

---

## Implementation Considerations

### Browser Compatibility
- Use standard ES6 syntax (supported in all modern browsers)
- Use `setInterval()` for timer (widely supported)
- Use Local Storage API (supported since IE8)
- No external dependencies required

### Performance Optimization
- Timer updates via `setInterval` (efficient)
- Time updates via `setInterval` (1 second interval)
- DOM renders only on changes (no unnecessary reflows)
- Local Storage operations are synchronous but fast for small datasets

### Accessibility
- Use semantic HTML (section, button, input, ul, li)
- Provide descriptive button labels
- Use aria-labels for icon-only buttons if applicable
- Ensure keyboard navigation works (Tab through inputs/buttons)
- Use proper color contrast for visibility

### Future Enhancements
- Add categories for tasks
- Add due dates to tasks
- Add task completion statistics
- Add dark/light theme toggle
- Add sound notification for timer completion
- Add export/import of data

---

## Summary

This design provides a complete technical blueprint for the Todo List Life Dashboard feature. The architecture emphasizes simplicity with a single HTML file and organized CSS/JS directories. The data models use straightforward Local Storage schemas, and the state management follows clear event-driven patterns. The code organization maintains clear separation of concerns while keeping everything in single CSS and JS files for easy maintenance. All components follow consistent naming conventions, error handling patterns, and are ready for testing with both unit and property-based approaches.
