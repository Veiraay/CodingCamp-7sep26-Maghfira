/**
 * Unit tests for Todo List Life Dashboard
 * Tests for Local Storage loading, initialization, and todo list functions
 * Requirements: 5.1, 9.1, 9.2, 9.3, 9.4
 */

// Mock Local Storage for testing
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

// Set up global localStorage mock
global.localStorage = new LocalStorageMock();

// Mock document elements for DOM testing
document.body.innerHTML = `
  <ul id="todo-list" class="todo-list"></ul>
  <div id="todo-error" class="error-message" style="display: none;"></div>
  <div id="quick-links-list" class="quick-links-list"></div>
  <div id="quick-link-error" class="error-message" style="display: none;"></div>
`;

// Load the app.js file
require('./app.js');

describe('Local Storage Functions', () => {
  beforeEach(() => {
    // Clear localStorage and appState before each test
    localStorage.clear();
    appState.todos = [];
    appState.quickLinks = [];
  });

  describe('loadTodosFromStorage', () => {
    test('should initialize todos array to empty when localStorage is empty', () => {
      loadTodosFromStorage();
      expect(appState.todos).toEqual([]);
    });

    test('should load todos from localStorage when data exists', () => {
      const testTodos = [
        { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];
      localStorage.setItem('dashboard_todos', JSON.stringify(testTodos));

      loadTodosFromStorage();

      expect(appState.todos).toEqual(testTodos);
      expect(appState.todos.length).toBe(1);
      expect(appState.todos[0].title).toBe('Test Task');
    });

    test('should handle corrupted JSON data gracefully', () => {
      localStorage.setItem('dashboard_todos', 'corrupted json {invalid}');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      loadTodosFromStorage();

      expect(appState.todos).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to parse stored todos:',
        expect.any(Error)
      );
      expect(localStorage.getItem('dashboard_todos')).toBeNull();
      consoleErrorSpy.mockRestore();
    });

    test('should clear corrupted data from localStorage', () => {
      localStorage.setItem('dashboard_todos', 'invalid json');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      loadTodosFromStorage();

      expect(localStorage.getItem('dashboard_todos')).toBeNull();
      consoleErrorSpy.mockRestore();
    });

    test('should load multiple todos from storage', () => {
      const testTodos = [
        { id: '1', title: 'Task 1', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Task 2', status: 'Completed', createdAt: '2024-01-14T09:00:00Z' },
        { id: '3', title: 'Task 3', status: 'Active', createdAt: '2024-01-15T11:00:00Z' }
      ];
      localStorage.setItem('dashboard_todos', JSON.stringify(testTodos));

      loadTodosFromStorage();

      expect(appState.todos).toEqual(testTodos);
      expect(appState.todos.length).toBe(3);
    });
  });

  describe('saveTodosToStorage', () => {
    test('should save todos to localStorage', () => {
      appState.todos = [
        { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      saveTodosToStorage();

      const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
      expect(stored).toEqual(appState.todos);
    });

    test('should save empty todos array', () => {
      appState.todos = [];

      saveTodosToStorage();

      const stored = localStorage.getItem('dashboard_todos');
      expect(stored).toBe('[]');
    });

    test('should handle and log storage errors', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Simulate a storage error by mocking localStorage.setItem to throw
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      appState.todos = [{ id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }];
      saveTodosToStorage();

      expect(consoleErrorSpy).toHaveBeenCalled();
      setItemSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('loadQuickLinksFromStorage', () => {
    test('should initialize quick links array to empty when localStorage is empty', () => {
      loadQuickLinksFromStorage();
      expect(appState.quickLinks).toEqual([]);
    });

    test('should load quick links from localStorage when data exists', () => {
      const testLinks = [
        { id: '1', label: 'Gmail', url: 'https://gmail.com' }
      ];
      localStorage.setItem('dashboard_quick_links', JSON.stringify(testLinks));

      loadQuickLinksFromStorage();

      expect(appState.quickLinks).toEqual(testLinks);
      expect(appState.quickLinks.length).toBe(1);
      expect(appState.quickLinks[0].label).toBe('Gmail');
    });

    test('should handle corrupted JSON data gracefully', () => {
      localStorage.setItem('dashboard_quick_links', 'corrupted json {invalid}');
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      loadQuickLinksFromStorage();

      expect(appState.quickLinks).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to parse stored quick links:',
        expect.any(Error)
      );
      expect(localStorage.getItem('dashboard_quick_links')).toBeNull();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('saveQuickLinksToStorage', () => {
    test('should save quick links to localStorage', () => {
      appState.quickLinks = [
        { id: '1', label: 'Gmail', url: 'https://gmail.com' }
      ];

      saveQuickLinksToStorage();

      const stored = JSON.parse(localStorage.getItem('dashboard_quick_links'));
      expect(stored).toEqual(appState.quickLinks);
    });

    test('should save empty quick links array', () => {
      appState.quickLinks = [];

      saveQuickLinksToStorage();

      const stored = localStorage.getItem('dashboard_quick_links');
      expect(stored).toBe('[]');
    });
  });
});

describe('Todo List Initialization', () => {
  beforeEach(() => {
    localStorage.clear();
    appState.todos = [];
    document.getElementById('todo-list').innerHTML = '';
  });

  describe('initTodoList', () => {
    test('should load todos from storage and render them', () => {
      const testTodos = [
        { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];
      localStorage.setItem('dashboard_todos', JSON.stringify(testTodos));

      initTodoList();

      expect(appState.todos).toEqual(testTodos);
      const todoElements = document.querySelectorAll('.todo-item');
      expect(todoElements.length).toBe(1);
    });

    test('should initialize with empty list when storage is empty', () => {
      initTodoList();

      expect(appState.todos).toEqual([]);
      const todoElements = document.querySelectorAll('.todo-item');
      expect(todoElements.length).toBe(0);
    });

    test('should render multiple todos correctly', () => {
      const testTodos = [
        { id: '1', title: 'Task 1', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Task 2', status: 'Completed', createdAt: '2024-01-14T09:00:00Z' }
      ];
      localStorage.setItem('dashboard_todos', JSON.stringify(testTodos));

      initTodoList();

      const todoElements = document.querySelectorAll('.todo-item');
      expect(todoElements.length).toBe(2);
    });
  });

  describe('renderTodoList', () => {
    test('should render todos with correct structure', () => {
      appState.todos = [
        { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      renderTodoList();

      const todoItem = document.querySelector('.todo-item');
      expect(todoItem).not.toBeNull();
      expect(todoItem.querySelector('.todo-title').textContent).toBe('Test Task');
      expect(todoItem.querySelector('.todo-checkbox')).not.toBeNull();
      expect(todoItem.querySelector('.todo-edit-btn')).not.toBeNull();
      expect(todoItem.querySelector('.todo-delete-btn')).not.toBeNull();
    });

    test('should mark completed todos with completed class', () => {
      appState.todos = [
        { id: '1', title: 'Completed Task', status: 'Completed', createdAt: '2024-01-15T10:00:00Z' }
      ];

      renderTodoList();

      const todoItem = document.querySelector('.todo-item');
      expect(todoItem.classList.contains('completed')).toBe(true);
      expect(todoItem.querySelector('.todo-checkbox').checked).toBe(true);
    });

    test('should clear existing todos before rendering', () => {
      document.getElementById('todo-list').innerHTML = '<li>Old item</li>';

      appState.todos = [
        { id: '1', title: 'New Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      renderTodoList();

      const todoElements = document.querySelectorAll('.todo-item');
      expect(todoElements.length).toBe(1);
      const oldItem = document.querySelector('li:not(.todo-item)');
      expect(oldItem).toBeNull();
    });

    test('should render empty list when todos array is empty', () => {
      appState.todos = [];

      renderTodoList();

      const todoElements = document.querySelectorAll('.todo-item');
      expect(todoElements.length).toBe(0);
    });
  });

  describe('renderTodoItem', () => {
    test('should create todo item with all required elements', () => {
      const todo = { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' };

      const item = renderTodoItem(todo);

      expect(item.className).toBe('todo-item');
      expect(item.querySelector('.todo-checkbox')).not.toBeNull();
      expect(item.querySelector('.todo-title')).not.toBeNull();
      expect(item.querySelector('.todo-edit-btn')).not.toBeNull();
      expect(item.querySelector('.todo-delete-btn')).not.toBeNull();
    });

    test('should set checkbox as unchecked for active todos', () => {
      const todo = { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' };

      const item = renderTodoItem(todo);

      expect(item.querySelector('.todo-checkbox').checked).toBe(false);
    });

    test('should set checkbox as checked for completed todos', () => {
      const todo = { id: '1', title: 'Test Task', status: 'Completed', createdAt: '2024-01-15T10:00:00Z' };

      const item = renderTodoItem(todo);

      expect(item.querySelector('.todo-checkbox').checked).toBe(true);
    });

    test('should add completed class for completed todos', () => {
      const todo = { id: '1', title: 'Test Task', status: 'Completed', createdAt: '2024-01-15T10:00:00Z' };

      const item = renderTodoItem(todo);

      expect(item.classList.contains('completed')).toBe(true);
    });

    test('should display correct todo title', () => {
      const todo = { id: '1', title: 'My Important Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' };

      const item = renderTodoItem(todo);

      expect(item.querySelector('.todo-title').textContent).toBe('My Important Task');
    });
  });
});

describe('Todo List Operations', () => {
  beforeEach(() => {
    localStorage.clear();
    appState.todos = [];
    document.getElementById('todo-list').innerHTML = '';
    document.getElementById('todo-error').style.display = 'none';
    document.getElementById('todo-error').textContent = '';
  });

  describe('addTodo', () => {
    test('should add a valid todo to the list', () => {
      addTodo('New Task');

      expect(appState.todos.length).toBe(1);
      expect(appState.todos[0].title).toBe('New Task');
      expect(appState.todos[0].status).toBe('Active');
    });

    test('should save new todo to localStorage', () => {
      addTodo('New Task');

      const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
      expect(stored.length).toBe(1);
      expect(stored[0].title).toBe('New Task');
    });

    test('should generate unique ID for each todo', () => {
      addTodo('Task 1');
      addTodo('Task 2');

      expect(appState.todos[0].id).not.toBe(appState.todos[1].id);
    });

    test('should set createdAt timestamp', () => {
      const beforeTime = new Date().getTime();
      addTodo('Task with timestamp');
      const afterTime = new Date().getTime();

      const createdAtTime = new Date(appState.todos[0].createdAt).getTime();
      expect(createdAtTime).toBeGreaterThanOrEqual(beforeTime);
      expect(createdAtTime).toBeLessThanOrEqual(afterTime);
    });

    test('should trim whitespace from title', () => {
      addTodo('  Task with spaces  ');

      expect(appState.todos[0].title).toBe('Task with spaces');
    });

    test('should reject empty task title', () => {
      addTodo('');

      expect(appState.todos.length).toBe(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('should reject whitespace-only task title', () => {
      addTodo('   ');

      expect(appState.todos.length).toBe(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('should reject task title longer than 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      addTodo(longTitle);

      expect(appState.todos.length).toBe(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('should accept task title of exactly 255 characters', () => {
      const longTitle = 'a'.repeat(255);
      addTodo(longTitle);

      expect(appState.todos.length).toBe(1);
      expect(appState.todos[0].title).toBe(longTitle);
    });
  });

  describe('toggleTodoComplete', () => {
    test('should toggle todo status from Active to Completed', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      toggleTodoComplete('1');

      expect(appState.todos[0].status).toBe('Completed');
    });

    test('should toggle todo status from Completed to Active', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Completed', createdAt: '2024-01-15T10:00:00Z' }
      ];

      toggleTodoComplete('1');

      expect(appState.todos[0].status).toBe('Active');
    });

    test('should save toggled status to localStorage', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      toggleTodoComplete('1');

      const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
      expect(stored[0].status).toBe('Completed');
    });

    test('should not affect other todos when toggling one', () => {
      appState.todos = [
        { id: '1', title: 'Task 1', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Task 2', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      toggleTodoComplete('1');

      expect(appState.todos[0].status).toBe('Completed');
      expect(appState.todos[1].status).toBe('Active');
    });

    test('should handle non-existent todo ID gracefully', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      toggleTodoComplete('999');

      expect(appState.todos[0].status).toBe('Active');
    });
  });

  describe('deleteTodo', () => {
    test('should delete todo from list', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      deleteTodo('1');

      expect(appState.todos.length).toBe(0);
    });

    test('should save deletion to localStorage', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      deleteTodo('1');

      const stored = localStorage.getItem('dashboard_todos');
      expect(JSON.parse(stored).length).toBe(0);
    });

    test('should not affect other todos when deleting one', () => {
      appState.todos = [
        { id: '1', title: 'Task 1', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Task 2', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      deleteTodo('1');

      expect(appState.todos.length).toBe(1);
      expect(appState.todos[0].id).toBe('2');
    });

    test('should handle non-existent todo ID gracefully', () => {
      appState.todos = [
        { id: '1', title: 'Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      deleteTodo('999');

      expect(appState.todos.length).toBe(1);
    });
  });

  describe('validateTaskTitle', () => {
    test('should return true for valid task title', () => {
      const result = validateTaskTitle('Valid Task');
      expect(result).toBe(true);
    });

    test('should return false for empty string', () => {
      const result = validateTaskTitle('');
      expect(result).toBe(false);
    });

    test('should return false for whitespace-only string', () => {
      const result = validateTaskTitle('   ');
      expect(result).toBe(false);
    });

    test('should return false for null', () => {
      const result = validateTaskTitle(null);
      expect(result).toBe(false);
    });

    test('should return false for undefined', () => {
      const result = validateTaskTitle(undefined);
      expect(result).toBe(false);
    });

    test('should return false for title longer than 255 characters', () => {
      const longTitle = 'a'.repeat(256);
      const result = validateTaskTitle(longTitle);
      expect(result).toBe(false);
    });

    test('should return true for title exactly 255 characters', () => {
      const longTitle = 'a'.repeat(255);
      const result = validateTaskTitle(longTitle);
      expect(result).toBe(true);
    });
  });

  describe('Error handling', () => {
    test('should display error message when adding empty task', () => {
      addTodo('');

      const errorElement = document.getElementById('todo-error');
      expect(errorElement.style.display).toBe('block');
      expect(errorElement.textContent).toBe('Task title cannot be empty');
    });

    test('should display error message when adding task exceeding max length', () => {
      const longTitle = 'a'.repeat(256);
      addTodo(longTitle);

      const errorElement = document.getElementById('todo-error');
      expect(errorElement.textContent).toBe('Task title must be 255 characters or less');
    });

    test('should clear error message after 5 seconds', async () => {
      addTodo('');

      const errorElement = document.getElementById('todo-error');
      expect(errorElement.style.display).toBe('block');

      // Fast-forward time by 5000ms
      jest.advanceTimersByTime(5000);

      expect(errorElement.style.display).toBe('none');
    });
  });
});

describe('Property-Based Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    appState.todos = [];
    document.getElementById('todo-list').innerHTML = '';
  });

  describe('Property 2: Greeting Message Updates at Boundaries', () => {
    test('Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5', () => {
      // For any time boundary (00:00, 12:00, 17:00, 00:00), the greeting message shall update when 
      // the system time crosses that boundary, displaying the appropriate greeting (Morning/Afternoon/Evening).

      // Mock DOM elements for greeting display
      if (!document.getElementById('greeting-message')) {
        const greetingSection = document.createElement('section');
        greetingSection.id = 'greeting-section';
        const greetingMessage = document.createElement('h1');
        greetingMessage.id = 'greeting-message';
        greetingSection.appendChild(greetingMessage);
        document.body.appendChild(greetingSection);
      }

      // Test boundary 1: 00:00 (Midnight - Evening to Morning transition)
      appState.currentGreeting = 'Good Evening';
      appState.currentTime = new Date();
      appState.currentTime.setHours(0, 0, 0);
      updateGreeting();
      expect(appState.currentGreeting).toBe('Good Morning');
      expect(document.getElementById('greeting-message').textContent).toBe('Good Morning');

      // Test boundary 2: 12:00 (Noon - Morning to Afternoon transition)
      appState.currentGreeting = 'Good Morning';
      appState.currentTime = new Date();
      appState.currentTime.setHours(12, 0, 0);
      updateGreeting();
      expect(appState.currentGreeting).toBe('Good Afternoon');
      expect(document.getElementById('greeting-message').textContent).toBe('Good Afternoon');

      // Test boundary 3: 17:00 (5 PM - Afternoon to Evening transition)
      appState.currentGreeting = 'Good Afternoon';
      appState.currentTime = new Date();
      appState.currentTime.setHours(17, 0, 0);
      updateGreeting();
      expect(appState.currentGreeting).toBe('Good Evening');
      expect(document.getElementById('greeting-message').textContent).toBe('Good Evening');

      // Test hours within Morning zone (0-11)
      const morningHours = [0, 1, 6, 11];
      morningHours.forEach(hour => {
        appState.currentTime = new Date();
        appState.currentTime.setHours(hour, 0, 0);
        const result = getGreetingMessage(hour);
        expect(result).toBe('Good Morning');
      });

      // Test hours within Afternoon zone (12-16)
      const afternoonHours = [12, 13, 15, 16];
      afternoonHours.forEach(hour => {
        appState.currentTime = new Date();
        appState.currentTime.setHours(hour, 0, 0);
        const result = getGreetingMessage(hour);
        expect(result).toBe('Good Afternoon');
      });

      // Test hours within Evening zone (17-23)
      const eveningHours = [17, 18, 22, 23];
      eveningHours.forEach(hour => {
        appState.currentTime = new Date();
        appState.currentTime.setHours(hour, 0, 0);
        const result = getGreetingMessage(hour);
        expect(result).toBe('Good Evening');
      });

      // Test that greeting remains unchanged within a time zone
      appState.currentGreeting = 'Good Morning';
      appState.currentTime = new Date();
      appState.currentTime.setHours(9, 0, 0);
      updateGreeting();
      // Within Morning zone, greeting should remain the same
      expect(appState.currentGreeting).toBe('Good Morning');

      appState.currentGreeting = 'Good Afternoon';
      appState.currentTime = new Date();
      appState.currentTime.setHours(14, 0, 0);
      updateGreeting();
      // Within Afternoon zone, greeting should remain the same
      expect(appState.currentGreeting).toBe('Good Afternoon');

      appState.currentGreeting = 'Good Evening';
      appState.currentTime = new Date();
      appState.currentTime.setHours(20, 0, 0);
      updateGreeting();
      // Within Evening zone, greeting should remain the same
      expect(appState.currentGreeting).toBe('Good Evening');
    });

    test('Greeting correctly detects boundaries at edge cases', () => {
      // Mock DOM elements for greeting display
      if (!document.getElementById('greeting-message')) {
        const greetingSection = document.createElement('section');
        greetingSection.id = 'greeting-section';
        const greetingMessage = document.createElement('h1');
        greetingMessage.id = 'greeting-message';
        greetingSection.appendChild(greetingMessage);
        document.body.appendChild(greetingSection);
      }

      // Test 11:59:59 (last second of Morning zone)
      appState.currentTime = new Date();
      appState.currentTime.setHours(11, 59, 59);
      const greetingAt1159 = getGreetingMessage(11);
      expect(greetingAt1159).toBe('Good Morning');

      // Test 12:00:00 (first second of Afternoon zone)
      appState.currentTime = new Date();
      appState.currentTime.setHours(12, 0, 0);
      const greetingAt1200 = getGreetingMessage(12);
      expect(greetingAt1200).toBe('Good Afternoon');

      // Test 16:59:59 (last second of Afternoon zone)
      appState.currentTime = new Date();
      appState.currentTime.setHours(16, 59, 59);
      const greetingAt1659 = getGreetingMessage(16);
      expect(greetingAt1659).toBe('Good Afternoon');

      // Test 17:00:00 (first second of Evening zone)
      appState.currentTime = new Date();
      appState.currentTime.setHours(17, 0, 0);
      const greetingAt1700 = getGreetingMessage(17);
      expect(greetingAt1700).toBe('Good Evening');

      // Test 23:59:59 (last second of Evening zone)
      appState.currentTime = new Date();
      appState.currentTime.setHours(23, 59, 59);
      const greetingAt2359 = getGreetingMessage(23);
      expect(greetingAt2359).toBe('Good Evening');

      // Test 00:00:00 (first second of Morning zone)
      appState.currentTime = new Date();
      appState.currentTime.setHours(0, 0, 0);
      const greetingAt0000 = getGreetingMessage(0);
      expect(greetingAt0000).toBe('Good Morning');
    });

    test('DOM is updated when boundary is crossed', () => {
      // Mock DOM elements for greeting display
      if (!document.getElementById('greeting-message')) {
        const greetingSection = document.createElement('section');
        greetingSection.id = 'greeting-section';
        const greetingMessage = document.createElement('h1');
        greetingMessage.id = 'greeting-message';
        greetingSection.appendChild(greetingMessage);
        document.body.appendChild(greetingSection);
      }

      // Initial state: Evening greeting
      appState.currentGreeting = 'Good Evening';
      document.getElementById('greeting-message').textContent = 'Good Evening';

      // Cross boundary from Evening to Morning (00:00)
      appState.currentTime = new Date();
      appState.currentTime.setHours(0, 0, 0);
      updateGreeting();

      // Verify both state and DOM updated
      expect(appState.currentGreeting).toBe('Good Morning');
      expect(document.getElementById('greeting-message').textContent).toBe('Good Morning');

      // Cross boundary from Morning to Afternoon (12:00)
      appState.currentTime = new Date();
      appState.currentTime.setHours(12, 0, 0);
      updateGreeting();

      expect(appState.currentGreeting).toBe('Good Afternoon');
      expect(document.getElementById('greeting-message').textContent).toBe('Good Afternoon');

      // Cross boundary from Afternoon to Evening (17:00)
      appState.currentTime = new Date();
      appState.currentTime.setHours(17, 0, 0);
      updateGreeting();

      expect(appState.currentGreeting).toBe('Good Evening');
      expect(document.getElementById('greeting-message').textContent).toBe('Good Evening');
    });
  });

  describe('Property 4: Task Addition Is Idempotent on Storage', () => {
    /**
     * **Validates: Requirements 5.2, 5.3, 5.5, 9.1, 9.2**
     * 
     * Property: For any valid task title, adding it to the todo list and then retrieving 
     * from Local Storage shall return a task with the same title and Active status.
     */

    // Helper: Generate various valid task titles for property testing
    function* generateValidTitles() {
      // Single word tasks
      yield 'Buy';
      yield 'Code';
      yield 'Review';

      // Multi-word tasks
      yield 'Buy groceries';
      yield 'Code review';
      yield 'Update documentation';

      // Tasks with numbers
      yield 'Fix bug #123';
      yield 'Task 1';
      yield 'Project 2024';

      // Tasks with special characters
      yield 'Email: check inbox';
      yield 'Fix @mention bug';
      yield 'Use (parentheses)';
      yield 'Test [brackets]';
      yield "It's working!";
      yield 'Why?';
      yield 'Update: v1.0 → v1.1';

      // Tasks with various whitespace (will be trimmed)
      yield '  Leading spaces';
      yield 'Trailing spaces  ';
      yield '  Both sides  ';
      yield '\t\tTabs\t\t';

      // Long tasks (up to 255 chars)
      yield 'a'.repeat(100);
      yield 'Task with ' + 'a'.repeat(200);
      yield 'Short task';

      // Unicode and emoji support
      yield 'Buy café ☕';
      yield '日本語タスク';
      yield 'مهمة عربية';
      yield 'Тест на русском';

      // Edge cases with valid lengths
      yield 'a'.repeat(255); // Maximum length
      yield 'b'; // Single character
      yield 'Two';
    }

    test('Property: For any valid task title, adding preserves title and sets Active status', () => {
      // Collect all test cases
      const testTitles = Array.from(generateValidTitles());

      // Verify all titles are valid (non-empty after trim)
      testTitles.forEach((title) => {
        expect(title.trim().length).toBeGreaterThan(0);
        expect(title.length).toBeLessThanOrEqual(255);
      });

      // Run property test on each title
      testTitles.forEach((title) => {
        // Setup: clear state for each test case
        localStorage.clear();
        appState.todos = [];
        document.getElementById('todo-list').innerHTML = '';

        // Action: Add task
        addTodo(title);

        // Verification 1: Task is in memory
        expect(appState.todos).toHaveLength(1);
        const todo = appState.todos[0];
        expect(todo.title).toBe(title.trim());
        expect(todo.status).toBe('Active');

        // Verification 2: Task is saved to storage
        const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
        expect(stored).toHaveLength(1);
        expect(stored[0].title).toBe(title.trim());
        expect(stored[0].status).toBe('Active');

        // Verification 3: Round-trip persistence (add → save → load)
        // Simulate page reload
        const savedTodo = stored[0];
        localStorage.clear();
        appState.todos = [];
        localStorage.setItem('dashboard_todos', JSON.stringify([savedTodo]));
        loadTodosFromStorage();

        expect(appState.todos).toHaveLength(1);
        expect(appState.todos[0].title).toBe(title.trim());
        expect(appState.todos[0].status).toBe('Active');
      });
    });

    test('Property: Adding multiple tasks preserves all titles and statuses', () => {
      const titles = [
        'First task',
        'Second task',
        'Third task',
        'Task with numbers 42',
        'Last task!'
      ];

      titles.forEach((title) => {
        addTodo(title);
      });

      // Verify all tasks are in memory with correct data
      expect(appState.todos).toHaveLength(titles.length);
      titles.forEach((expectedTitle, index) => {
        expect(appState.todos[index].title).toBe(expectedTitle);
        expect(appState.todos[index].status).toBe('Active');
      });

      // Verify all tasks are persisted in storage
      const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
      expect(stored).toHaveLength(titles.length);
      titles.forEach((expectedTitle, index) => {
        expect(stored[index].title).toBe(expectedTitle);
        expect(stored[index].status).toBe('Active');
      });
    });

    test('Property: Each added task has unique ID', () => {
      const titles = [
        'Task 1',
        'Task 2',
        'Task 3'
      ];

      titles.forEach((title) => {
        addTodo(title);
      });

      const ids = appState.todos.map((t) => t.id);
      const uniqueIds = new Set(ids);

      // All IDs should be unique
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('Property: Each added task has createdAt timestamp', () => {
      const beforeTime = new Date().getTime();

      addTodo('Task with timestamp');

      const afterTime = new Date().getTime();
      const todo = appState.todos[0];

      expect(todo.createdAt).toBeDefined();
      const createdAtTime = new Date(todo.createdAt).getTime();

      // Timestamp should be between before and after
      expect(createdAtTime).toBeGreaterThanOrEqual(beforeTime);
      expect(createdAtTime).toBeLessThanOrEqual(afterTime);
    });

    test('Property: Task title is trimmed but content preserved', () => {
      const testCases = [
        { input: '  Task  ', expected: 'Task' },
        { input: '\t\tTask\t\t', expected: 'Task' },
        { input: '  Multi word task  ', expected: 'Multi word task' },
        { input: 'No spaces', expected: 'No spaces' },
        { input: '  Task with   internal   spaces  ', expected: 'Task with   internal   spaces' }
      ];

      testCases.forEach(({ input, expected }) => {
        localStorage.clear();
        appState.todos = [];

        addTodo(input);

        expect(appState.todos[0].title).toBe(expected);
      });
    });

    test('Property: Storage round-trip preserves task data integrity', () => {
      // Add a task
      addTodo('Important task');
      const originalTask = { ...appState.todos[0] };

      // Simulate page reload
      localStorage.clear();
      appState.todos = [];

      loadTodosFromStorage();

      // Load from storage (should be empty now since we cleared)
      expect(appState.todos).toHaveLength(0);

      // Manually set storage and reload
      localStorage.setItem('dashboard_todos', JSON.stringify([originalTask]));
      loadTodosFromStorage();

      // Verify integrity
      expect(appState.todos).toHaveLength(1);
      const reloadedTask = appState.todos[0];

      expect(reloadedTask.id).toBe(originalTask.id);
      expect(reloadedTask.title).toBe(originalTask.title);
      expect(reloadedTask.status).toBe(originalTask.status);
      expect(reloadedTask.createdAt).toBe(originalTask.createdAt);
    });

    test('Property: Invalid titles (empty/whitespace) do not add to storage', () => {
      const invalidTitles = ['', '   ', '\t', '\n', '\t\t  \n'];

      invalidTitles.forEach((title) => {
        localStorage.clear();
        appState.todos = [];
        document.getElementById('todo-error').style.display = 'none';

        addTodo(title);

        // Should not add to memory
        expect(appState.todos).toHaveLength(0);

        // Should not add to storage
        const stored = localStorage.getItem('dashboard_todos');
        expect(stored).toBeNull();
      });
    });

    test('Property: Task fields are populated correctly on addition', () => {
      addTodo('Test task fields');
      const todo = appState.todos[0];

      // Verify all required fields exist
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('status');
      expect(todo).toHaveProperty('createdAt');

      // Verify field types
      expect(typeof todo.id).toBe('string');
      expect(typeof todo.title).toBe('string');
      expect(typeof todo.status).toBe('string');
      expect(typeof todo.createdAt).toBe('string');

      // Verify field values
      expect(todo.title).toBe('Test task fields');
      expect(todo.status).toBe('Active');
      expect(todo.id).not.toBe('');
      expect(new Date(todo.createdAt).getTime()).not.toBeNaN();
    });
  });

  describe('Property 5: Task Completion Toggle Is Self-Inverse', () => {
    test('Validates: Requirements 7.2, 7.4, 7.5', () => {
      // For any task, toggling the completion state twice shall return the task to its original state
      appState.todos = [
        { id: '1', title: 'Test Task', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];

      const originalStatus = appState.todos[0].status;

      // Toggle once
      toggleTodoComplete('1');
      expect(appState.todos[0].status).not.toBe(originalStatus);

      // Toggle twice
      toggleTodoComplete('1');
      expect(appState.todos[0].status).toBe(originalStatus);
    });
  });

  describe('Property 6: Task Deletion Removes from Both UI and Storage', () => {
    test('Validates: Requirements 8.2, 8.3, 8.4', () => {
      // For any task in the todo list, deleting it shall remove it from both
      // the displayed list and Local Storage immediately

      appState.todos = [
        { id: '1', title: 'Task 1', status: 'Active', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'Task 2', status: 'Active', createdAt: '2024-01-15T10:00:00Z' }
      ];
      saveTodosToStorage();
      renderTodoList();

      // Delete first task
      deleteTodo('1');

      // Check both state and storage
      expect(appState.todos).toHaveLength(1);
      expect(appState.todos[0].id).toBe('2');

      const stored = JSON.parse(localStorage.getItem('dashboard_todos'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('2');

      // Check DOM
      const todoElements = document.querySelectorAll('.todo-item');
      expect(todoElements).toHaveLength(1);
    });
  });

  describe('Property 8: Empty Input Validation Prevents Invalid Submissions', () => {
    test('Validates: Requirements 5.7, 6.5 - Rejects empty string', () => {
      // For any empty or whitespace-only task title, the system shall reject the submission
      // and display an error message without modifying the task list
      localStorage.clear();
      appState.todos = [];
      document.getElementById('todo-error').style.display = 'none';

      addTodo('');

      expect(appState.todos).toHaveLength(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('Validates: Requirements 5.7, 6.5 - Rejects spaces only', () => {
      localStorage.clear();
      appState.todos = [];
      document.getElementById('todo-error').style.display = 'none';

      addTodo('   ');

      expect(appState.todos).toHaveLength(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('Validates: Requirements 5.7, 6.5 - Rejects tabs only', () => {
      localStorage.clear();
      appState.todos = [];
      document.getElementById('todo-error').style.display = 'none';

      addTodo('\t');

      expect(appState.todos).toHaveLength(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('Validates: Requirements 5.7, 6.5 - Rejects newlines only', () => {
      localStorage.clear();
      appState.todos = [];
      document.getElementById('todo-error').style.display = 'none';

      addTodo('\n');

      expect(appState.todos).toHaveLength(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('Validates: Requirements 5.7, 6.5 - Rejects mixed whitespace', () => {
      localStorage.clear();
      appState.todos = [];
      document.getElementById('todo-error').style.display = 'none';

      addTodo('  \t\n  ');

      expect(appState.todos).toHaveLength(0);
      expect(document.getElementById('todo-error').style.display).toBe('block');
    });

    test('Validates: Requirements 5.7, 6.5 - Rejects various whitespace combinations', () => {
      // Property: For any combination of whitespace characters,
      // submission should be rejected and no task added
      const whitespaceVariations = [
        '',
        ' ',
        '  ',
        '   ',
        '\t',
        '\t\t',
        '\n',
        '\n\n',
        ' \t ',
        ' \n ',
        '\t\n',
        '  \t  \n  '
      ];

      whitespaceVariations.forEach((title) => {
        localStorage.clear();
        appState.todos = [];
        document.getElementById('todo-error').style.display = 'none';
        document.getElementById('todo-error').textContent = '';

        addTodo(title);

        expect(appState.todos).toHaveLength(0);
        expect(document.getElementById('todo-error').style.display).toBe('block');
        expect(document.getElementById('todo-error').textContent).toBe('Task title cannot be empty');
      });
    });

    test('Validates: Requirements 5.7, 6.5 - Does not affect existing tasks when rejecting empty input', () => {
      // Property: When an empty/whitespace submission is rejected,
      // existing tasks remain unchanged
      localStorage.clear();
      appState.todos = [];
      document.getElementById('todo-error').style.display = 'none';

      // Add a valid task first
      addTodo('Existing task');
      expect(appState.todos).toHaveLength(1);

      const originalTask = { ...appState.todos[0] };

      // Try to add invalid empty tasks
      addTodo('');
      addTodo('   ');
      addTodo('\t\n');

      // Verify existing task is unchanged
      expect(appState.todos).toHaveLength(1);
      expect(appState.todos[0]).toEqual(originalTask);
      expect(appState.todos[0].title).toBe('Existing task');
      expect(appState.todos[0].status).toBe('Active');
    });

    test('Validates: Requirements 5.7, 6.5 - Error message is displayed for all invalid inputs', () => {
      // Property: For any empty/whitespace input, error message is shown
      const invalidInputs = ['', ' ', '\t', '\n', '  \t\n  '];

      invalidInputs.forEach((title) => {
        localStorage.clear();
        appState.todos = [];
        document.getElementById('todo-error').style.display = 'none';

        addTodo(title);

        const errorElement = document.getElementById('todo-error');
        expect(errorElement.style.display).toBe('block');
        expect(errorElement.textContent.length).toBeGreaterThan(0);
      });
    });

    test('Validates: Requirements 5.7, 6.5 - Storage remains unmodified when rejecting invalid input', () => {
      // Property: When empty/whitespace input is rejected,
      // Local Storage does not get modified
      localStorage.clear();
      appState.todos = [];

      // Add a valid task first
      addTodo('Valid task');
      const initialStorageState = localStorage.getItem('dashboard_todos');

      // Try to add invalid tasks
      addTodo('');
      addTodo('   ');

      // Verify storage has not changed
      const currentStorageState = localStorage.getItem('dashboard_todos');
      expect(currentStorageState).toBe(initialStorageState);

      // Verify storage still contains only the original task
      const stored = JSON.parse(currentStorageState);
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Valid task');
    });
  });
});


describe('Time Display Functions (Property-Based Tests)', () => {
  describe('formatTime - Property 1: Time Display Format', () => {
    test('Validates: Requirements 1.1, 1.3, 1.4 - Time format is always HH:MM:SS in 24-hour format', () => {
      // Generate various times and verify format consistency
      // Property: For any time value, the output is always HH:MM:SS in 24-hour format
      const testCases = [
        { date: new Date('2024-01-15T00:00:00'), expected: '00:00:00' },
        { date: new Date('2024-01-15T01:05:09'), expected: '01:05:09' },
        { date: new Date('2024-01-15T09:30:45'), expected: '09:30:45' },
        { date: new Date('2024-01-15T12:00:00'), expected: '12:00:00' },
        { date: new Date('2024-01-15T13:15:30'), expected: '13:15:30' },
        { date: new Date('2024-01-15T23:59:59'), expected: '23:59:59' },
        { date: new Date('2024-01-15T00:00:01'), expected: '00:00:01' }
      ];

      testCases.forEach(({ date, expected }) => {
        const result = formatTime(date);
        // Verify format: HH:MM:SS (always 8 characters with colons)
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        expect(result).toBe(expected);
      });
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - Boundary times format correctly', () => {
      // Property: Boundary times (00:00:00 and 23:59:59) format correctly
      const midnightStart = new Date('2024-01-15T00:00:00');
      const almostMidnight = new Date('2024-01-15T23:59:59');
      const oneSecondAfterMidnight = new Date('2024-01-15T00:00:01');

      expect(formatTime(midnightStart)).toBe('00:00:00');
      expect(formatTime(almostMidnight)).toBe('23:59:59');
      expect(formatTime(oneSecondAfterMidnight)).toBe('00:00:01');
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - Format consistency across hour boundaries', () => {
      // Property: For any hour value (0-23), formatting is consistent
      const hourTests = [];
      for (let hour = 0; hour < 24; hour++) {
        const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:30:45`;
        hourTests.push(new Date(dateStr));
      }

      hourTests.forEach((date, index) => {
        const result = formatTime(date);
        const expectedHour = String(index).padStart(2, '0');
        expect(result).toMatch(/^\d{2}:30:45$/);
        expect(result.substring(0, 2)).toBe(expectedHour);
      });
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - Format consistency across minute boundaries', () => {
      // Property: For any minute value (0-59), formatting is consistent
      const minuteTests = [];
      for (let minute = 0; minute < 60; minute += 5) {
        const dateStr = `2024-01-15T14:${String(minute).padStart(2, '0')}:30`;
        minuteTests.push(new Date(dateStr));
      }

      minuteTests.forEach((date, index) => {
        const result = formatTime(date);
        expect(result).toMatch(/^14:\d{2}:30$/);
      });
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - Format consistency across second boundaries', () => {
      // Property: For any second value (0-59), formatting is consistent
      const secondTests = [];
      for (let second = 0; second < 60; second += 10) {
        const dateStr = `2024-01-15T14:30:${String(second).padStart(2, '0')}`;
        secondTests.push(new Date(dateStr));
      }

      secondTests.forEach((date, index) => {
        const result = formatTime(date);
        expect(result).toMatch(/^14:30:\d{2}$/);
      });
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - Consecutive seconds increment correctly', () => {
      // Property: Consecutive time values produce properly ordered formatted times
      const times = [];
      let currentDate = new Date('2024-01-15T12:30:00');

      for (let i = 0; i < 60; i++) {
        times.push(formatTime(new Date(currentDate.getTime() + i * 1000)));
      }

      // Verify progression (no skips or duplicates in sequence)
      for (let i = 1; i < times.length; i++) {
        const prev = times[i - 1];
        const curr = times[i];
        // Check that seconds incremented or rolled over to next minute
        const prevSeconds = parseInt(prev.split(':')[2]);
        const currSeconds = parseInt(curr.split(':')[2]);
        expect(currSeconds).toBe((prevSeconds + 1) % 60);
      }
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - No format variations for same time', () => {
      // Property: Multiple calls with same time produce identical output (deterministic)
      const date = new Date('2024-01-15T15:45:32');
      const result1 = formatTime(date);
      const result2 = formatTime(date);
      const result3 = formatTime(date);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('formatTime - Property 1: Padding and Format Validation', () => {
    test('Validates: Requirements 1.1, 1.3, 1.4 - Single digit values are zero-padded', () => {
      // Property: Single digit hours, minutes, or seconds are always padded with zero
      const singleDigitTests = [
        new Date('2024-01-15T00:00:00'), // all zeros
        new Date('2024-01-15T01:02:03'), // all single digits
        new Date('2024-01-15T09:05:07'), // mixed single and double
        new Date('2024-01-15T10:20:30')  // all double digits
      ];

      const expected = [
        '00:00:00',
        '01:02:03',
        '09:05:07',
        '10:20:30'
      ];

      singleDigitTests.forEach((date, index) => {
        const result = formatTime(date);
        expect(result).toBe(expected[index]);
        // Verify each component is 2 digits
        const [h, m, s] = result.split(':');
        expect(h.length).toBe(2);
        expect(m.length).toBe(2);
        expect(s.length).toBe(2);
      });
    });

    test('Validates: Requirements 1.1, 1.3, 1.4 - Returned format exactly 8 characters', () => {
      // Property: Formatted time is always exactly 8 characters long (HH:MM:SS)
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          for (let second = 0; second < 60; second += 15) {
            const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
            const date = new Date(dateStr);
            const result = formatTime(date);
            expect(result.length).toBe(8);
            expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
          }
        }
      }
    });
  });

  describe('updateTimerDisplay - Property: Display Format Consistency', () => {
    test('Validates: Requirements 1.1, 1.3, 1.4 - Timer displays in MM:SS format', () => {
      // Mock the DOM element
      document.body.innerHTML = '<div id="timer-display"></div>';

      // Test various second values
      const testValues = [0, 1, 59, 60, 61, 300, 1499, 1500];

      testValues.forEach((seconds) => {
        appState.timerRemaining = seconds;
        updateTimerDisplay();

        const display = document.getElementById('timer-display').textContent;
        // Should be MM:SS format
        expect(display).toMatch(/^\d{2}:\d{2}$/);

        const [minutes, secs] = display.split(':').map(Number);
        expect(minutes).toBe(Math.floor(seconds / 60));
        expect(secs).toBe(seconds % 60);
      });
    });
  });
});

describe('Time Update Timing Properties', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = `
      <div id="current-time">00:00:00</div>
      <div id="current-date">Monday, January 15, 2024</div>
      <h1 id="greeting-message">Good Morning</h1>
      <div id="timer-display">25:00</div>
    `;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Validates: Requirements 1.1, 1.3, 1.4 - Time display updates every second without skipping', () => {
    // Property: Time updates happen at 1-second intervals
    // Call updateTime and verify it updates the display
    const initialDate = new Date('2024-01-15T12:30:00');

    // Mock Date.now to return consistent timestamps
    let mockTime = initialDate.getTime();
    jest.spyOn(global, 'Date').mockImplementation(() => new Date(mockTime));

    updateTime();
    const firstUpdate = document.getElementById('current-time').textContent;

    // Advance by 1 second
    mockTime += 1000;
    updateTime();
    const secondUpdate = document.getElementById('current-time').textContent;

    // They should be different (advanced by 1 second)
    expect(secondUpdate).not.toBe(firstUpdate);
  });

  test('Validates: Requirements 1.1, 1.3, 1.4 - Boundary time updates are accurate', () => {
    // Property: At time boundaries (00:00:00, 11:59:59 → 12:00:00), updates are accurate
    document.body.innerHTML = `
      <div id="current-time">00:00:00</div>
      <div id="current-date">Monday, January 15, 2024</div>
      <h1 id="greeting-message">Good Morning</h1>
    `;

    const boundaryTimes = [
      new Date('2024-01-15T00:00:00'),
      new Date('2024-01-15T11:59:59'),
      new Date('2024-01-15T12:00:00'),
      new Date('2024-01-15T16:59:59'),
      new Date('2024-01-15T17:00:00'),
      new Date('2024-01-15T23:59:59')
    ];

    boundaryTimes.forEach((boundaryDate) => {
      // Mock Date constructor for this iteration
      jest.spyOn(global, 'Date').mockImplementationOnce(() => boundaryDate);

      updateTime();

      const displayedTime = document.getElementById('current-time').textContent;
      const expectedTime = formatTime(boundaryDate);
      expect(displayedTime).toBe(expectedTime);
    });
  });
});
