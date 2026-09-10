# Implementation Plan: Todo List Life Dashboard

## Overview

This implementation plan breaks down the Todo List Life Dashboard feature into discrete, incremental coding tasks. Each task builds on previous work, with property-based tests validating correctness properties throughout. The plan covers project setup, all four feature areas (greeting section, focus timer, todo list, quick links), styling, and comprehensive testing.

## Tasks

- [x] 1. Set up project structure and core HTML
  - Create project directory structure with `css/`, `js/`, and root directories
  - Create `index.html` with semantic HTML structure for all sections
  - Set up basic page layout with placeholder sections for greeting, timer, todos, and quick links
  - Link to `css/styles.css` and `js/app.js`
  - _Requirements: 14, 15, 16_

- [x] 2. Initialize application state and utility functions
  - Create `js/app.js` with application state object
  - Implement `generateId()` function for creating unique identifiers
  - Implement `formatTime(date)` to format time as HH:MM:SS in 24-hour format
  - Implement `formatDate(date)` to format date as "Monday, January 15, 2024"
  - Implement `formatTimerDisplay(seconds)` to convert seconds to MM:SS format
  - _Requirements: 1, 2, 3, 15, 16_

- [x] 3. Implement greeting section - time display and updates
  - Implement `updateTime()` function to update current time display every second
  - Implement `initGreetingSection()` to set up greeting section on app start
  - Add event listener to start time updates via `setInterval()`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Implement greeting section - contextual greeting logic
  - Implement `getGreetingMessage(hour)` function returning "Good Morning" (0-11), "Good Afternoon" (12-16), or "Good Evening" (17-23)
  - Implement `updateGreeting()` function to set greeting message based on current hour
  - Integrate greeting updates into time update cycle
  - Detect greeting boundary crossings (00:00, 12:00, 17:00)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 4.1 Write property test for time display updates
  - **Property 1: Time Display Updates Every Second**
  - **Validates: Requirements 1.1, 1.3, 1.4**
  - Test that time display updates every second with correct format

- [x] 4.2 Write property test for greeting message boundary updates
  - **Property 2: Greeting Message Updates at Boundaries**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
  - Test that greeting updates at 00:00, 12:00, and 17:00 transitions

- [x] 5. Implement focus timer - initialization and display
  - Implement `initTimer()` to initialize timer to 25 minutes (1500 seconds)
  - Set up timer state variables (`timerRunning`, `timerPaused`, `timerRemaining`, `timerInterval`)
  - Implement `updateTimerDisplay()` to refresh timer display with current remaining time
  - _Requirements: 3.1, 3.3_

- [x] 6. Implement focus timer - start functionality
  - Implement `startTimer()` function to begin countdown
  - Set up interval to decrement `timerRemaining` every second
  - Update button states (disable start, enable pause)
  - Call `updateTimerDisplay()` and `onTimerComplete()` when needed
  - _Requirements: 3.2, 3.3, 4.1, 4.6_

- [ ] 7. Implement focus timer - pause and resume functionality
  - Implement `pauseTimer()` function to pause countdown and preserve remaining time
  - Implement `resumeTimer()` function to resume from paused state
  - Update button states appropriately (enable/disable start and pause buttons)
  - Ensure no time loss during pause/resume cycle
  - _Requirements: 4.2, 4.3, 4.4_

- [~] 7.1 Write property test for timer pause/resume preservation
  - **Property 3: Timer Countdown Preserves Remaining Time**
  - **Validates: Requirements 4.2, 4.3, 4.4**
  - Test that pausing and resuming preserves exact remaining seconds

- [ ] 8. Implement focus timer - reset functionality and completion
  - Implement `resetTimer()` function to return timer to 25:00 and stop counting
  - Implement `onTimerComplete()` function to handle timer reaching 00:00
  - Implement `notifyTimerComplete()` to show completion notification
  - Ensure timer stops at 00:00 and does not count into negative numbers
  - _Requirements: 3.4, 3.5, 4.5, 4.6_

- [~] 8.1 Write property test for timer completion halts countdown
  - **Property 9: Timer Completion Halts Countdown**
  - **Validates: Requirements 3.4, 3.5**
  - Test that timer stops at 00:00 and does not continue into negative time

- [~] 9. Wire up focus timer UI event listeners
  - Add click event listener to start button calling `startTimer()`
  - Add click event listener to pause button calling `pauseTimer()`
  - Add click event listener to reset button calling `resetTimer()`
  - Ensure buttons are disabled/enabled appropriately based on timer state
  - _Requirements: 3.2, 4.1, 4.2, 4.3, 4.5, 4.6_

- [x] 10. Implement todo list - initialization and Local Storage loading
  - Implement `loadTodosFromStorage()` to retrieve todos from Local Storage
  - Implement error handling for corrupted JSON data
  - Initialize `appState.todos` array from storage or empty array
  - Implement `initTodoList()` to call loading and rendering on app start
  - _Requirements: 5.1, 9.1, 9.2, 9.3, 9.4_

- [ ] 11. Implement todo list - add task functionality with validation
  - Implement `validateTaskTitle(title)` to check for empty/whitespace-only titles
  - Implement `addTodo(title)` function to create new task with unique ID, status "Active", and creation timestamp
  - Implement `displayTodoError(message)` to show error messages to user
  - Integrate add button click handler to validate, add, save, and render
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.5_

- [x] 11.1 Write property test for task addition idempotency
  - **Property 4: Task Addition Is Idempotent on Storage**
  - **Validates: Requirements 5.2, 5.3, 5.5, 9.1, 9.2**
  - Test that adding a task and retrieving from storage preserves title and Active status

- [x] 11.2 Write property test for empty input validation
  - **Property 8: Empty Input Validation Prevents Invalid Submissions**
  - **Validates: Requirements 5.7, 6.5**
  - Test that empty/whitespace-only titles are rejected with error message

- [~] 12. Implement todo list - display and rendering
  - Implement `renderTodoList()` to render all todos from state to DOM
  - Implement `renderTodoItem(todo)` to create DOM element for single task with checkbox, title, edit and delete buttons
  - Style completed tasks with visual distinction (strikethrough or grayed out)
  - Create `clearTodoError()` to hide error messages
  - _Requirements: 5.4, 5.5, 7.3, 8.3_

- [ ] 13. Implement todo list - mark complete functionality
  - Implement `toggleTodoComplete(id)` to toggle task status between Active and Completed
  - Update DOM to reflect status change (visual distinction for completed)
  - Save changes to Local Storage
  - Update button/checkbox state appropriately
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [~] 13.1 Write property test for task completion toggle
  - **Property 5: Task Completion Toggle Is Self-Inverse**
  - **Validates: Requirements 7.2, 7.4, 7.5**
  - Test that toggling completion state twice returns task to original state

- [~] 14. Implement todo list - edit task functionality
  - Implement `editTodo(id, newTitle)` to update task title
  - Show input field with current title when edit button clicked
  - Validate new title before saving (cannot be empty)
  - Display confirmation message on successful edit
  - Save changes to Local Storage
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 15. Implement todo list - delete task functionality
  - Implement `deleteTodo(id)` to remove task from todos array
  - Remove task from DOM immediately
  - Save changes to Local Storage
  - Optional: Show confirmation message before deletion
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [~] 15.1 Write property test for task deletion
  - **Property 6: Task Deletion Removes from Both UI and Storage**
  - **Validates: Requirements 8.2, 8.3, 8.4**
  - Test that deleting task removes it from both displayed list and Local Storage

- [~] 16. Implement todo list - Local Storage persistence
  - Implement `saveTodosToStorage()` to serialize and save todos to Local Storage under key `dashboard_todos`
  - Add error handling for storage quota exceeded
  - Call `saveTodosToStorage()` after every todo modification (add, edit, complete, delete)
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [~] 17. Checkpoint - Greeting and Timer Complete
  - Ensure greeting displays correctly with real-time updates
  - Ensure timer initializes to 25:00 and all controls function properly
  - Ask the user if questions arise.

- [x] 18. Implement quick links - initialization and Local Storage loading
  - Implement `loadQuickLinksFromStorage()` to retrieve quick links from Local Storage
  - Implement error handling for corrupted JSON data
  - Initialize `appState.quickLinks` array from storage or empty array
  - Implement `initQuickLinks()` to call loading and rendering on app start
  - _Requirements: 10.1, 13.1, 13.2, 13.3, 13.4_

- [ ] 19. Implement quick links - add functionality with validation
  - Implement `validateUrl(url)` to check for valid HTTP/HTTPS URLs
  - Implement `addQuickLink(label, url)` to create new quick link with unique ID
  - Implement `displayQuickLinkError(message)` to show error messages
  - Integrate add button click handler to validate, add, save, and render
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [~] 19.1 Write property test for quick link persistence
  - **Property 7: Quick Link URL Persistence Round-Trip**
  - **Validates: Requirements 10.2, 10.5, 11.3, 13.1, 13.2**
  - Test that saving and reloading quick link preserves label and URL

- [~] 19.2 Write property test for URL validation
  - **Property 10: Quick Link Invalid URL Rejection**
  - **Validates: Requirements 10.8, 11.5**
  - Test that invalid URL formats are rejected with error message

- [~] 20. Implement quick links - display and rendering
  - Implement `renderQuickLinks()` to render all quick links from state to DOM
  - Implement `renderQuickLinkItem(link)` to create DOM element with link button, edit, and delete buttons
  - Ensure links open in new tab via `target="_blank"`
  - Create `clearQuickLinkError()` to hide error messages
  - _Requirements: 10.3, 10.4, 10.5, 11.1_

- [~] 21. Implement quick links - edit functionality
  - Implement `editQuickLink(id, newLabel, newUrl)` to update quick link
  - Show input fields with current label and URL when edit button clicked
  - Validate new URL before saving (must be valid HTTP/HTTPS)
  - Save changes to Local Storage
  - Display confirmation on successful edit
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [~] 22. Implement quick links - delete functionality
  - Implement `deleteQuickLink(id)` to remove quick link from array
  - Remove link from DOM immediately
  - Save changes to Local Storage
  - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [~] 23. Implement quick links - Local Storage persistence
  - Implement `saveQuickLinksToStorage()` to serialize and save quick links to Local Storage under key `dashboard_quick_links`
  - Add error handling for storage quota exceeded
  - Call `saveQuickLinksToStorage()` after every quick link modification (add, edit, delete)
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [~] 24. Wire up all event listeners
  - Add click listeners to all buttons (add, edit, delete for todos and quick links)
  - Add enter key listener to input fields for quick submission
  - Ensure all event handlers call appropriate functions and trigger UI updates
  - _Requirements: 5.1, 10.1, 11.1, 12.1_

- [~] 25. Checkpoint - Todo List and Quick Links Complete
  - Ensure all CRUD operations work for todos and quick links
  - Ensure Local Storage persistence works correctly
  - Ask the user if questions arise.

- [~] 26. Create CSS file with base styles and layout
  - Create `css/styles.css` with complete styling
  - Implement base styles (font families, colors, spacing)
  - Create responsive layout foundation
  - Organize CSS with clear section comments for each component
  - _Requirements: 14, 16_

- [~] 27. Style greeting section
  - Style `.greeting-section` with appropriate container layout
  - Style `.greeting-message` as prominent heading
  - Style `.current-time` and `.current-date` with readable formatting
  - Apply color scheme and typography consistent with overall dashboard
  - _Requirements: 1, 2, 14, 16_

- [~] 28. Style focus timer section
  - Style `.focus-timer-section` container
  - Style `.timer-display` with large, monospace font
  - Style `.timer-btn` buttons with hover/active states
  - Style `.timer-notification` appropriately
  - _Requirements: 3, 4, 14, 16_

- [~] 29. Style todo list section
  - Style `.todo-section` container
  - Style `.todo-input-container` with input and button layout
  - Style `.todo-list` and `.todo-item` elements
  - Apply visual distinction for `.todo-item.completed` (strikethrough, grayed out)
  - Style error messages with appropriate colors
  - _Requirements: 5, 6, 7, 8, 14, 16_

- [~] 30. Style quick links section
  - Style `.quick-links-section` container
  - Style `.quick-link-item` wrapper with button layout
  - Style `.quick-link-btn` buttons with hover states
  - Style edit/delete buttons appropriately
  - Style error messages with appropriate colors
  - _Requirements: 10, 11, 12, 14, 16_

- [~] 31. Implement responsive layout and hover states
  - Apply responsive design principles (media queries for mobile, tablet, desktop)
  - Implement hover and active states for all buttons
  - Ensure touch-friendly button sizes
  - Test layout on different screen sizes
  - _Requirements: 14, 16_

- [~] 32. Final styling pass and consistency check
  - Review all components for visual consistency
  - Ensure color scheme is applied uniformly
  - Check typography hierarchy
  - Verify all interactive elements have clear hover/active states
  - _Requirements: 14, 16_

- [~] 33. Checkpoint - Styling Complete
  - Ensure all visual styling is complete and consistent
  - Verify responsive layout works on multiple screen sizes
  - Ask the user if questions arise.

- [ ] 34. Write unit tests for utility functions
  - Write tests for `formatTime()` with various time values
  - Write tests for `formatDate()` with various date values
  - Write tests for `formatTimerDisplay()` with various second values
  - Write tests for `getGreetingMessage()` with boundary hours
  - Write tests for `validateTaskTitle()` with empty, whitespace, and valid inputs
  - Write tests for `validateUrl()` with HTTP, HTTPS, invalid URLs
  - _Requirements: 15, 16_

- [~] 34.1 Write unit tests for todo CRUD operations
  - Test `addTodo()` creates task with correct properties
  - Test `editTodo()` updates task title
  - Test `toggleTodoComplete()` changes status correctly
  - Test `deleteTodo()` removes task from array
  - _Requirements: 5, 6, 7, 8_

- [~] 34.2 Write unit tests for quick link operations
  - Test `addQuickLink()` creates link with correct properties
  - Test `editQuickLink()` updates label and URL
  - Test `deleteQuickLink()` removes link from array
  - _Requirements: 10, 11, 12_

- [~] 34.3 Write unit tests for Local Storage operations
  - Test `saveTodosToStorage()` and `loadTodosFromStorage()` round-trip
  - Test `saveQuickLinksToStorage()` and `loadQuickLinksFromStorage()` round-trip
  - Test handling of empty storage
  - Test handling of corrupted JSON data
  - _Requirements: 9, 13_

- [~] 35. Write integration tests for todo list workflows
  - Test full workflow: add task → mark complete → edit → delete
  - Test that all changes persist to Local Storage
  - Test that UI updates immediately after each operation
  - _Requirements: 5, 6, 7, 8, 9_

- [~] 36. Write integration tests for quick link workflows
  - Test full workflow: add link → edit → delete
  - Test that links open in new tab
  - Test that all changes persist to Local Storage
  - _Requirements: 10, 11, 12, 13_

- [~] 37. Write integration tests for timer workflows
  - Test start → pause → resume → reset sequence
  - Test that timer counts down correctly
  - Test that completion notification appears
  - Test that UI reflects state changes
  - _Requirements: 3, 4_

- [~] 38. Test data persistence across page reload
  - Write test that adds todos and quick links
  - Simulate page reload by clearing DOM and reloading from storage
  - Verify all data is restored correctly
  - _Requirements: 9, 13_

- [~] 39. Final checkpoint - All tests passing
  - Ensure all unit tests pass
  - Ensure all property tests pass
  - Ensure all integration tests pass
  - Ask the user if questions arise.

- [~] 40. Manual verification and documentation
  - Manually test all features in browser
  - Verify greeting updates in real-time
  - Verify timer countdown and completion
  - Verify todo CRUD operations
  - Verify quick links open correctly
  - Verify data persists after page reload
  - Document any edge cases discovered
  - _Requirements: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16_

## Notes

- Tasks marked with `*` are optional testing tasks that can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Property-based tests are positioned near implementation to catch errors early
- Checkpoint tasks provide validation points for progressive delivery
- All tasks involve code writing, modification, or testing—no non-coding tasks included
- CSS and JavaScript files consolidate all styling and logic respectively as required
- Local Storage is the persistence mechanism throughout (no backend needed)
- All code should follow consistent naming conventions and be well-commented

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "2"] },
    { "id": 1, "tasks": ["3", "5", "10", "18"] },
    { "id": 2, "tasks": ["4", "4.1", "4.2", "6", "7", "11", "11.1", "11.2", "19", "19.1", "19.2"] },
    { "id": 3, "tasks": ["7.1", "8", "8.1", "9", "12", "13", "13.1", "14", "15", "15.1", "16", "20", "21", "22", "23", "24"] },
    { "id": 4, "tasks": ["17", "25", "26", "27", "28", "29", "30", "31", "32"] },
    { "id": 5, "tasks": ["33", "34", "34.1", "34.2", "34.3", "35", "36", "37", "38"] },
    { "id": 6, "tasks": ["39", "40"] }
  ]
}
```
