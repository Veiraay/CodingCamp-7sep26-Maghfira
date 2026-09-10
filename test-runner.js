#!/usr/bin/env node

/**
 * Simple test runner for utility functions
 * Tests the app.js utility functions without Jest
 */

// Import the app.js functions
const fs = require('fs');
const path = require('path');

// Read and execute app.js
const appJsPath = path.join(__dirname, 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf-8');
eval(appJsContent);

// Test counters
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

// Test helpers
function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ ${message}`);
  } else {
    failedTests++;
    console.log(`✗ ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
}

function assertTrue(condition, message) {
  assert(condition === true, message);
}

// Run tests
console.log('Running utility function tests...\n');

// ============================================
// generateId() Tests
// ============================================
console.log('Testing generateId()');
const id1 = generateId();
assertTrue(typeof id1 === 'string', 'generateId() should return a string');
const id2 = generateId();
assert(id1 !== id2, 'generateId() should generate unique IDs');
const parts = id1.split('-');
assertEquals(parts.length, 2, 'ID should have two parts separated by dash');
console.log('');

// ============================================
// formatTime() Tests
// ============================================
console.log('Testing formatTime()');
assertEquals(formatTime(new Date('2024-01-15T09:30:45')), '09:30:45', 'formatTime() should format time as HH:MM:SS');
assertEquals(formatTime(new Date('2024-01-15T08:00:00')), '08:00:00', 'formatTime() should pad single-digit hours');
assertEquals(formatTime(new Date('2024-01-15T10:05:30')), '10:05:30', 'formatTime() should pad single-digit minutes');
assertEquals(formatTime(new Date('2024-01-15T10:30:07')), '10:30:07', 'formatTime() should pad single-digit seconds');
assertEquals(formatTime(new Date('2024-01-15T00:00:00')), '00:00:00', 'formatTime() should format midnight correctly');
assertEquals(formatTime(new Date('2024-01-15T23:59:59')), '23:59:59', 'formatTime() should format 23:59:59 correctly');
console.log('');

// ============================================
// formatDate() Tests
// ============================================
console.log('Testing formatDate()');
const formattedDate = formatDate(new Date('2024-01-15'));
assert(formattedDate.includes('Monday'), 'formatDate() should include weekday name');
assert(formattedDate.includes('January'), 'formatDate() should include month name');
assert(formattedDate.includes('15'), 'formatDate() should include day');
assert(formattedDate.includes('2024'), 'formatDate() should include year');
console.log('');

// ============================================
// formatTimerDisplay() Tests
// ============================================
console.log('Testing formatTimerDisplay()');
assertEquals(formatTimerDisplay(1500), '25:00', 'formatTimerDisplay() should format 1500 seconds as 25:00');
assertEquals(formatTimerDisplay(0), '00:00', 'formatTimerDisplay() should format 0 seconds as 00:00');
assertEquals(formatTimerDisplay(60), '01:00', 'formatTimerDisplay() should format 60 seconds as 01:00');
assertEquals(formatTimerDisplay(45), '00:45', 'formatTimerDisplay() should format 45 seconds as 00:45');
assertEquals(formatTimerDisplay(65), '01:05', 'formatTimerDisplay() should pad single-digit seconds');
assertEquals(formatTimerDisplay(125), '02:05', 'formatTimerDisplay() should pad single-digit minutes');
assertEquals(formatTimerDisplay(59), '00:59', 'formatTimerDisplay() should handle 59 seconds correctly');
assertEquals(formatTimerDisplay(119), '01:59', 'formatTimerDisplay() should handle 1:59 correctly');
assertEquals(formatTimerDisplay(599), '09:59', 'formatTimerDisplay() should handle 9:59 correctly');
console.log('');

// ============================================
// appState Tests
// ============================================
console.log('Testing appState');
assertEquals(appState.timerRemaining, 1500, 'appState should have initial timer value of 1500 seconds');
assertEquals(appState.timerRunning, false, 'appState.timerRunning should be false initially');
assertEquals(appState.timerPaused, false, 'appState.timerPaused should be false initially');
assertTrue(Array.isArray(appState.todos), 'appState.todos should be an array');
assertTrue(Array.isArray(appState.quickLinks), 'appState.quickLinks should be an array');
assertEquals(appState.currentGreeting, 'Good Morning', 'appState.currentGreeting should be initialized');
console.log('');

// ============================================
// Test Summary
// ============================================
console.log('='.repeat(50));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✓`);
console.log(`Failed: ${failedTests} ✗`);
console.log('='.repeat(50));

if (failedTests === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log(`\n✗ ${failedTests} test(s) failed`);
  process.exit(1);
}
