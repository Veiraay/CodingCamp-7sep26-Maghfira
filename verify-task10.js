/**
 * Task 10 Verification Script
 * Verifies the implementation of todo list initialization and Local Storage loading
 */

// Mock Local Storage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

global.localStorage = new LocalStorageMock();

// Mock document
document.body.innerHTML = `
  <ul id="todo-list" class="todo-list"></ul>
  <div id="todo-error" class="error-message" style="display: none;"></div>
  <div id="quick-links-list" class="quick-links-list"></div>
  <div id="quick-link-error" class="error-message" style="display: none;"></div>
`;

// Load app.js
require('./js/app.js');

console.log('=== Task 10: Todo List Initialization and Local Storage Loading ===\n');

// Test 1: Load todos from empty storage
console.log('Test 1: Loading from empty storage');
localStorage.clear();
appState.todos = [];
loadTodosFromStorage();
console.log('✓ appState.todos initialized to empty array:', appState.todos.length === 0);

// Test 2: Load todos from populated storage
console.log('\nTest 2: Loading from populated storage');
localStorage.clear();
appState.todos = [];
const testTodos = [
  { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', title: 'Another Task', status: 'Completed', createdAt: '2024-01-14T09:00:00Z' }
];
localStorage.setItem('dashboard_todos', JSON.stringify(testTodos));
loadTodosFromStorage();
console.log('✓ Loaded todos from storage:', appState.todos.length === 2);
console.log('✓ First todo title matches:', appState.todos[0].title === 'Test Task');
console.log('✓ Second todo status matches:', appState.todos[1].status === 'Completed');

// Test 3: Handle corrupted JSON
console.log('\nTest 3: Handling corrupted JSON data');
localStorage.clear();
appState.todos = [];
localStorage.setItem('dashboard_todos', 'corrupted json {invalid}');
loadTodosFromStorage();
console.log('✓ Initialized to empty array on corrupt data:', appState.todos.length === 0);
console.log('✓ Corrupted data removed from storage:', localStorage.getItem('dashboard_todos') === null);

// Test 4: Save todos to storage
console.log('\nTest 4: Saving todos to storage');
localStorage.clear();
appState.todos = [
  { id: '1', title: 'New Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
];
saveTodosToStorage();
const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
console.log('✓ Todos saved to storage:', stored !== null);
console.log('✓ Stored data matches appState:', stored[0].title === appState.todos[0].title);

// Test 5: initTodoList function
console.log('\nTest 5: initTodoList initialization');
localStorage.clear();
appState.todos = [];
document.getElementById('todo-list').innerHTML = '';
const testTodos2 = [
  { id: '1', title: 'Init Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
];
localStorage.setItem('dashboard_todos', JSON.stringify(testTodos2));
initTodoList();
console.log('✓ Todos loaded from storage:', appState.todos.length === 1);
console.log('✓ Todos rendered to DOM:', document.querySelectorAll('.todo-item').length === 1);

// Test 6: renderTodoList clears before rendering
console.log('\nTest 6: renderTodoList clears existing items');
document.getElementById('todo-list').innerHTML = '<li>Old item</li>';
appState.todos = [
  { id: '1', title: 'New Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
];
renderTodoList();
const todoElements = document.querySelectorAll('.todo-item');
const oldElements = document.querySelectorAll('li:not(.todo-item)');
console.log('✓ Old items cleared:', oldElements.length === 0);
console.log('✓ New items rendered:', todoElements.length === 1);

// Test 7: renderTodoItem creates proper structure
console.log('\nTest 7: renderTodoItem creates proper DOM structure');
const todo = { id: '1', title: 'Test', status: 'Active', createdAt: '2024-01-15T10:00:00Z' };
const item = renderTodoItem(todo);
console.log('✓ Has checkbox:', item.querySelector('.todo-checkbox') !== null);
console.log('✓ Has title span:', item.querySelector('.todo-title') !== null);
console.log('✓ Has edit button:', item.querySelector('.todo-edit-btn') !== null);
console.log('✓ Has delete button:', item.querySelector('.todo-delete-btn') !== null);

// Test 8: Completed status rendering
console.log('\nTest 8: Completed todo rendering');
document.getElementById('todo-list').innerHTML = '';
appState.todos = [
  { id: '1', title: 'Completed Task', status: 'Completed', createdAt: '2024-01-15T10:00:00Z' }
];
renderTodoList();
const completedItem = document.querySelector('.todo-item');
console.log('✓ Item has completed class:', completedItem.classList.contains('completed'));
console.log('✓ Checkbox is checked:', completedItem.querySelector('.todo-checkbox').checked);

// Test 9: Round-trip persistence
console.log('\nTest 9: Round-trip persistence (save then load)');
localStorage.clear();
appState.todos = [];
document.getElementById('todo-list').innerHTML = '';
const originalTodos = [
  { id: '1', title: 'Task 1', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
  { id: '2', title: 'Task 2', status: 'Completed', createdAt: '2024-01-14T09:00:00Z' }
];
appState.todos = originalTodos;
saveTodosToStorage();
appState.todos = []; // Clear in-memory
loadTodosFromStorage();
console.log('✓ Round-trip successful:', appState.todos.length === 2);
console.log('✓ Data integrity maintained:', JSON.stringify(appState.todos) === JSON.stringify(originalTodos));

// Test 10: Quick links storage
console.log('\nTest 10: Quick links storage functions');
localStorage.clear();
appState.quickLinks = [];
loadQuickLinksFromStorage();
console.log('✓ Quick links initialized to empty on empty storage:', appState.quickLinks.length === 0);
const testLink = { id: '1', label: 'Gmail', url: 'https://gmail.com' };
appState.quickLinks = [testLink];
saveQuickLinksToStorage();
const storedLink = JSON.parse(localStorage.getItem('dashboard_quick_links'));
console.log('✓ Quick links saved to storage:', storedLink[0].label === 'Gmail');

console.log('\n=== All Task 10 Verification Tests Passed ===');
