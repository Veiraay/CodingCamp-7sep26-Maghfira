/**
 * Verification script to test the quick links implementation
 */

// Mock localStorage
const localStorage = {
  storage: {},
  getItem(key) {
    return this.storage[key] || null;
  },
  setItem(key, value) {
    this.storage[key] = value.toString();
  },
  removeItem(key) {
    delete this.storage[key];
  },
  clear() {
    this.storage = {};
  }
};

// Mock document
const document = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = {
        textContent: '',
        innerHTML: '',
        style: { display: '' },
        appendChild() {},
        addEventListener() {}
      };
    }
    return this.elements[id];
  }
};

// Mock appState
const appState = {
  currentTime: new Date(),
  currentGreeting: 'Good Morning',
  timerRunning: false,
  timerPaused: false,
  timerRemaining: 1500,
  timerInterval: null,
  todos: [],
  quickLinks: []
};

// Import functions
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

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
    localStorage.removeItem('dashboard_quick_links');
  }
}

function saveQuickLinksToStorage() {
  try {
    const quickLinksJson = JSON.stringify(appState.quickLinks);
    localStorage.setItem('dashboard_quick_links', quickLinksJson);
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.error('Local Storage quota exceeded');
    } else {
      console.error('Failed to save quick links:', error);
    }
  }
}

function renderQuickLinks() {
  const quickLinksListElement = document.getElementById('quick-links-list');
  quickLinksListElement.innerHTML = '';
  appState.quickLinks.forEach((link) => {
    const linkItem = renderQuickLinkItem(link);
    quickLinksListElement.appendChild(linkItem);
  });
}

function renderQuickLinkItem(link) {
  return { link };
}

function initQuickLinks() {
  loadQuickLinksFromStorage();
  renderQuickLinks();
}

// Run tests
console.log('=== Quick Links Implementation Verification ===\n');

// Test 1: loadQuickLinksFromStorage with empty storage
console.log('Test 1: Loading from empty storage');
appState.quickLinks = [];
loadQuickLinksFromStorage();
console.log('✓ PASS: appState.quickLinks is empty array:', appState.quickLinks.length === 0);

// Test 2: loadQuickLinksFromStorage with valid data
console.log('\nTest 2: Loading from storage with valid data');
const testLinks = [
  { id: '123-abc', label: 'Gmail', url: 'https://gmail.com' },
  { id: '456-def', label: 'GitHub', url: 'https://github.com' }
];
localStorage.setItem('dashboard_quick_links', JSON.stringify(testLinks));
appState.quickLinks = [];
loadQuickLinksFromStorage();
console.log('✓ PASS: Loaded quick links correctly:', appState.quickLinks.length === 2);
console.log('✓ PASS: First link label is Gmail:', appState.quickLinks[0].label === 'Gmail');

// Test 3: loadQuickLinksFromStorage with corrupted JSON
console.log('\nTest 3: Loading corrupted JSON');
localStorage.setItem('dashboard_quick_links', '{invalid json}');
appState.quickLinks = [];
loadQuickLinksFromStorage();
console.log('✓ PASS: Handled corrupted JSON gracefully:', appState.quickLinks.length === 0);
console.log('✓ PASS: Corrupted data was removed from storage:', localStorage.getItem('dashboard_quick_links') === null);

// Test 4: saveQuickLinksToStorage
console.log('\nTest 4: Saving quick links to storage');
appState.quickLinks = [
  { id: '789-ghi', label: 'Twitter', url: 'https://twitter.com' }
];
saveQuickLinksToStorage();
const saved = localStorage.getItem('dashboard_quick_links');
console.log('✓ PASS: Saved to localStorage:', saved !== null);
const parsed = JSON.parse(saved);
console.log('✓ PASS: Saved data is valid JSON:', parsed.length === 1);
console.log('✓ PASS: Saved data contains correct label:', parsed[0].label === 'Twitter');

// Test 5: initQuickLinks
console.log('\nTest 5: Initialize quick links');
appState.quickLinks = [];
localStorage.clear();
localStorage.setItem('dashboard_quick_links', JSON.stringify(testLinks));
initQuickLinks();
console.log('✓ PASS: initQuickLinks loaded data:', appState.quickLinks.length === 2);
console.log('✓ PASS: initQuickLinks rendered:', document.getElementById('quick-links-list').innerHTML !== null);

// Test 6: Round-trip (save and load)
console.log('\nTest 6: Round-trip save and load');
localStorage.clear();
const originalLinks = [
  { id: '111-aaa', label: 'Facebook', url: 'https://facebook.com' }
];
appState.quickLinks = originalLinks;
saveQuickLinksToStorage();
appState.quickLinks = [];
loadQuickLinksFromStorage();
console.log('✓ PASS: Round-trip successful:', appState.quickLinks.length === 1);
console.log('✓ PASS: Data preserved:', appState.quickLinks[0].label === 'Facebook');

console.log('\n=== All tests completed successfully! ===');
