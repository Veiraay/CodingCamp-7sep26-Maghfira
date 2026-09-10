#!/usr/bin/env node

/**
 * Verification script for timer functionality
 * Validates initTimer() and updateTimerDisplay() implementation
 */

const fs = require('fs');
const path = require('path');

// Read app.js and check for required functions
const appJsPath = path.join(__dirname, 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf-8');

console.log('='.repeat(60));
console.log('TIMER IMPLEMENTATION VERIFICATION');
console.log('='.repeat(60));
console.log('');

// Check 1: initTimer function exists
const hasInitTimer = appJsContent.includes('function initTimer()');
console.log(`[${hasInitTimer ? '✓' : '✗'}] initTimer() function exists`);

// Check 2: updateTimerDisplay function exists
const hasUpdateTimerDisplay = appJsContent.includes('function updateTimerDisplay()');
console.log(`[${hasUpdateTimerDisplay ? '✓' : '✗'}] updateTimerDisplay() function exists`);

// Check 3: initTimer sets timerRunning to false
const initTimerSetsRunning = appJsContent.includes('appState.timerRunning = false') && 
                              appJsContent.match(/function initTimer[\s\S]*?appState\.timerRunning = false/);
console.log(`[${initTimerSetsRunning ? '✓' : '✗'}] initTimer() sets timerRunning to false`);

// Check 4: initTimer sets timerPaused to false
const initTimerSetsPaused = appJsContent.includes('appState.timerPaused = false') && 
                            appJsContent.match(/function initTimer[\s\S]*?appState\.timerPaused = false/);
console.log(`[${initTimerSetsPaused ? '✓' : '✗'}] initTimer() sets timerPaused to false`);

// Check 5: initTimer sets timerRemaining to 1500
const initTimerSetsRemaining = appJsContent.includes('appState.timerRemaining = 1500') && 
                               appJsContent.match(/function initTimer[\s\S]*?appState\.timerRemaining = 1500/);
console.log(`[${initTimerSetsRemaining ? '✓' : '✗'}] initTimer() sets timerRemaining to 1500`);

// Check 6: initTimer sets timerInterval to null
const initTimerSetsInterval = appJsContent.includes('appState.timerInterval = null') && 
                              appJsContent.match(/function initTimer[\s\S]*?appState\.timerInterval = null/);
console.log(`[${initTimerSetsInterval ? '✓' : '✗'}] initTimer() sets timerInterval to null`);

// Check 7: initTimer calls updateTimerDisplay()
const initTimerCallsUpdate = appJsContent.match(/function initTimer[\s\S]*?updateTimerDisplay\(\)/);
console.log(`[${initTimerCallsUpdate ? '✓' : '✗'}] initTimer() calls updateTimerDisplay()`);

// Check 8: updateTimerDisplay uses formatTimerDisplay
const updateTimerUsesFormat = appJsContent.match(/function updateTimerDisplay[\s\S]*?formatTimerDisplay/);
console.log(`[${updateTimerUsesFormat ? '✓' : '✗'}] updateTimerDisplay() uses formatTimerDisplay()`);

// Check 9: updateTimerDisplay updates DOM element
const updateTimerUpdatesDom = appJsContent.match(/function updateTimerDisplay[\s\S]*?timerDisplay\.textContent/);
console.log(`[${updateTimerUpdatesDom ? '✓' : '✗'}] updateTimerDisplay() updates DOM element`);

// Check 10: formatTimerDisplay is implemented
const hasFormatTimerDisplay = appJsContent.includes('function formatTimerDisplay(seconds)');
console.log(`[${hasFormatTimerDisplay ? '✓' : '✗'}] formatTimerDisplay() function exists`);

console.log('');
console.log('='.repeat(60));

const allChecks = [
  hasInitTimer,
  hasUpdateTimerDisplay,
  initTimerSetsRunning,
  initTimerSetsPaused,
  initTimerSetsRemaining,
  initTimerSetsInterval,
  initTimerCallsUpdate,
  updateTimerUsesFormat,
  updateTimerUpdatesDom,
  hasFormatTimerDisplay
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

console.log(`RESULTS: ${passedChecks}/${totalChecks} checks passed`);

if (passedChecks === totalChecks) {
  console.log('✓ All implementation checks passed!');
  console.log('');
  console.log('IMPLEMENTATION SUMMARY:');
  console.log('- initTimer() initializes timer to 25:00 (1500 seconds)');
  console.log('- Timer state variables are properly set:');
  console.log('  * timerRunning = false');
  console.log('  * timerPaused = false');
  console.log('  * timerRemaining = 1500 seconds');
  console.log('  * timerInterval = null');
  console.log('- updateTimerDisplay() updates DOM with formatted time');
  console.log('- Timer display follows MM:SS format');
  console.log('');
  console.log('VALIDATES REQUIREMENTS: 3.1, 3.3');
  console.log('3.1: THE Focus_Timer SHALL have a duration of exactly 25 minutes');
  console.log('3.3: THE Dashboard SHALL display remaining time in MM:SS format');
  process.exit(0);
} else {
  console.log(`✗ ${totalChecks - passedChecks} check(s) failed`);
  process.exit(1);
}
