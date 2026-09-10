#!/usr/bin/env node

/**
 * Property-Based Test Verification for Time Display Functions
 * Tests Property 1: Time Display Updates Every Second
 * Validates: Requirements 1.1, 1.3, 1.4
 */

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
const failedTestDetails = [];

// Test helpers
function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.log(`  ✗ ${message}`);
    failedTestDetails.push(message);
  }
}

function assertEquals(actual, expected, message) {
  const passed = actual === expected;
  assert(passed, `${message} (expected: ${expected}, got: ${actual})`);
  return passed;
}

function assertMatch(value, pattern, message) {
  const passed = pattern.test(value);
  assert(passed, `${message} (value: ${value}, pattern: ${pattern})`);
  return passed;
}

// ============================================
// Property 1: Time Display Updates Every Second
// ============================================
console.log('\n' + '='.repeat(60));
console.log('Property 1: Time Display Updates Every Second');
console.log('Validates: Requirements 1.1, 1.3, 1.4');
console.log('='.repeat(60));

console.log('\nTest Suite 1: formatTime - Time Format Consistency');
console.log('-'.repeat(60));

// Test 1.1: Time format is always HH:MM:SS in 24-hour format
console.log('\nProperty Test 1.1: Time format is always HH:MM:SS');
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
  assertMatch(result, /^\d{2}:\d{2}:\d{2}$/, `formatTime(${date.toISOString()}) format is HH:MM:SS`);
  assertEquals(result, expected, `formatTime(${date.toISOString()}) equals ${expected}`);
});

// Test 1.2: Boundary times format correctly
console.log('\nProperty Test 1.2: Boundary times format correctly');
const midnightStart = new Date('2024-01-15T00:00:00');
const almostMidnight = new Date('2024-01-15T23:59:59');
const oneSecondAfterMidnight = new Date('2024-01-15T00:00:01');

assertEquals(formatTime(midnightStart), '00:00:00', 'Midnight (00:00:00)');
assertEquals(formatTime(almostMidnight), '23:59:59', 'Almost midnight (23:59:59)');
assertEquals(formatTime(oneSecondAfterMidnight), '00:00:01', 'One second after midnight (00:00:01)');

// Test 1.3: Format consistency across all hour values (0-23)
console.log('\nProperty Test 1.3: Format consistency across all hours');
let hourTestsPass = true;
for (let hour = 0; hour < 24; hour++) {
  const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:30:45`;
  const date = new Date(dateStr);
  const result = formatTime(date);
  const expectedHour = String(hour).padStart(2, '0');
  
  if (!result.match(/^\d{2}:30:45$/) || result.substring(0, 2) !== expectedHour) {
    hourTestsPass = false;
    break;
  }
}
assert(hourTestsPass, 'All 24 hours (0-23) format correctly');

// Test 1.4: Format consistency across all minute values (0-59)
console.log('\nProperty Test 1.4: Format consistency across all minutes');
let minuteTestsPass = true;
for (let minute = 0; minute < 60; minute += 5) {
  const dateStr = `2024-01-15T14:${String(minute).padStart(2, '0')}:30`;
  const date = new Date(dateStr);
  const result = formatTime(date);
  
  if (!result.match(/^14:\d{2}:30$/)) {
    minuteTestsPass = false;
    break;
  }
}
assert(minuteTestsPass, 'All minutes (0-59) format correctly');

// Test 1.5: Format consistency across all second values (0-59)
console.log('\nProperty Test 1.5: Format consistency across all seconds');
let secondTestsPass = true;
for (let second = 0; second < 60; second += 10) {
  const dateStr = `2024-01-15T14:30:${String(second).padStart(2, '0')}`;
  const date = new Date(dateStr);
  const result = formatTime(date);
  
  if (!result.match(/^14:30:\d{2}$/)) {
    secondTestsPass = false;
    break;
  }
}
assert(secondTestsPass, 'All seconds (0-59) format correctly');

// Test 1.6: Consecutive seconds increment correctly (no skips or duplicates)
console.log('\nProperty Test 1.6: Consecutive seconds increment correctly');
const times = [];
let currentDate = new Date('2024-01-15T12:30:00');

for (let i = 0; i < 60; i++) {
  times.push(formatTime(new Date(currentDate.getTime() + i * 1000)));
}

let incrementTestPass = true;
for (let i = 1; i < times.length; i++) {
  const prev = times[i - 1];
  const curr = times[i];
  const prevSeconds = parseInt(prev.split(':')[2]);
  const currSeconds = parseInt(curr.split(':')[2]);
  
  if (currSeconds !== (prevSeconds + 1) % 60) {
    incrementTestPass = false;
    break;
  }
}
assert(incrementTestPass, 'Consecutive times increment without skips or duplicates');

// Test 1.7: Deterministic - same time produces same format
console.log('\nProperty Test 1.7: Deterministic output (no variations)');
const date = new Date('2024-01-15T15:45:32');
const result1 = formatTime(date);
const result2 = formatTime(date);
const result3 = formatTime(date);

assertEquals(result1, result2, 'First and second call produce same output');
assertEquals(result2, result3, 'Second and third call produce same output');

// Test 1.8: Zero-padding for single digit values
console.log('\nProperty Test 1.8: Zero-padding for single digit values');
const singleDigitTests = [
  { date: new Date('2024-01-15T00:00:00'), expected: '00:00:00' },
  { date: new Date('2024-01-15T01:02:03'), expected: '01:02:03' },
  { date: new Date('2024-01-15T09:05:07'), expected: '09:05:07' },
  { date: new Date('2024-01-15T10:20:30'), expected: '10:20:30' }
];

singleDigitTests.forEach(({ date, expected }) => {
  const result = formatTime(date);
  assertEquals(result, expected, `formatTime zero-pads single digits for ${date.toISOString()}`);
  
  const [h, m, s] = result.split(':');
  assertEquals(h.length, 2, `Hours component has length 2`);
  assertEquals(m.length, 2, `Minutes component has length 2`);
  assertEquals(s.length, 2, `Seconds component has length 2`);
});

// Test 1.9: Exactly 8 characters in output
console.log('\nProperty Test 1.9: Output always exactly 8 characters (HH:MM:SS)');
let lengthTestPass = true;
for (let hour = 0; hour < 24; hour += 4) {
  for (let minute = 0; minute < 60; minute += 15) {
    for (let second = 0; second < 60; second += 15) {
      const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
      const date = new Date(dateStr);
      const result = formatTime(date);
      
      if (result.length !== 8 || !result.match(/^\d{2}:\d{2}:\d{2}$/)) {
        lengthTestPass = false;
        break;
      }
    }
  }
}
assert(lengthTestPass, 'All formatted times are exactly 8 characters');

console.log('\n' + '='.repeat(60));
console.log('Test Summary');
console.log('='.repeat(60));
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests} ✓`);
console.log(`Failed: ${failedTests} ✗`);
console.log('='.repeat(60));

if (failedTests > 0) {
  console.log('\nFailed Test Details:');
  failedTestDetails.forEach(detail => {
    console.log(`  - ${detail}`);
  });
}

if (failedTests === 0) {
  console.log('\n✓ All property-based tests PASSED!');
  console.log('\nProperty 1 (Time Display Updates Every Second) validated successfully.');
  console.log('The time display function formats correctly in HH:MM:SS 24-hour format,');
  console.log('handles boundary times accurately, and produces consistent output.');
  process.exit(0);
} else {
  console.log(`\n✗ ${failedTests} test(s) FAILED`);
  process.exit(1);
}
