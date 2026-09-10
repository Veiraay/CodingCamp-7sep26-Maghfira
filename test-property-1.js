// Property-Based Test for Time Display Updates
// Property 1: Time Display Updates Every Second
// Validates: Requirements 1.1, 1.3, 1.4

/**
 * This test file contains comprehensive property-based tests for the time display
 * functionality. Property-based testing verifies that a property holds true for
 * all possible inputs within a domain, rather than just specific examples.
 */

describe('Property 1: Time Display Updates Every Second', () => {
  describe('formatTime - Time Format Consistency', () => {
    test('should format time as HH:MM:SS for all 24 hours', () => {
      /**
       * Property: For any hour (0-23), formatTime produces HH:MM:SS format
       * This validates that the function correctly handles all valid hour values
       */
      for (let hour = 0; hour < 24; hour++) {
        const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:30:45`;
        const date = new Date(dateStr);
        const result = formatTime(date);
        
        expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
        expect(result.substring(0, 2)).toBe(String(hour).padStart(2, '0'));
      }
    });

    test('should format time as HH:MM:SS for all 60 minutes', () => {
      /**
       * Property: For any minute (0-59), formatTime produces HH:MM:SS format
       * This validates minute component formatting across full range
       */
      for (let minute = 0; minute < 60; minute++) {
        const dateStr = `2024-01-15T14:${String(minute).padStart(2, '0')}:30`;
        const date = new Date(dateStr);
        const result = formatTime(date);
        
        expect(result).toMatch(/^14:\d{2}:30$/);
        expect(result.substring(3, 5)).toBe(String(minute).padStart(2, '0'));
      }
    });

    test('should format time as HH:MM:SS for all 60 seconds', () => {
      /**
       * Property: For any second (0-59), formatTime produces HH:MM:SS format
       * This validates second component formatting across full range
       */
      for (let second = 0; second < 60; second++) {
        const dateStr = `2024-01-15T14:30:${String(second).padStart(2, '0')}`;
        const date = new Date(dateStr);
        const result = formatTime(date);
        
        expect(result).toMatch(/^14:30:\d{2}$/);
        expect(result.substring(6, 8)).toBe(String(second).padStart(2, '0'));
      }
    });

    test('should maintain format consistency across boundary times', () => {
      /**
       * Property: At day boundaries (00:00:00, 23:59:59), formatting is consistent
       * Boundaries are critical points where off-by-one errors commonly occur
       */
      const boundaryTimes = [
        { date: new Date('2024-01-15T00:00:00'), expected: '00:00:00' },
        { date: new Date('2024-01-15T00:00:01'), expected: '00:00:01' },
        { date: new Date('2024-01-15T23:59:58'), expected: '23:59:58' },
        { date: new Date('2024-01-15T23:59:59'), expected: '23:59:59' }
      ];

      boundaryTimes.forEach(({ date, expected }) => {
        expect(formatTime(date)).toBe(expected);
      });
    });

    test('should increment correctly for consecutive seconds', () => {
      /**
       * Property: Consecutive seconds should increment without gaps or duplicates
       * This validates temporal ordering and monotonicity
       */
      const startTime = new Date('2024-01-15T12:30:00').getTime();
      const times = [];
      
      for (let i = 0; i < 120; i++) {
        const date = new Date(startTime + i * 1000);
        times.push(formatTime(date));
      }

      // Verify no duplicate consecutive times
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).not.toBe(times[i - 1]);
      }

      // Verify proper increment pattern
      for (let i = 1; i < times.length; i++) {
        const prevSeconds = parseInt(times[i - 1].split(':')[2]);
        const currSeconds = parseInt(times[i].split(':')[2]);
        const prevMinutes = parseInt(times[i - 1].split(':')[1]);
        const currMinutes = parseInt(times[i].split(':')[1]);

        // Either seconds increment, or we're rolling over to next minute
        if (currSeconds !== (prevSeconds + 1) % 60) {
          expect(currMinutes).toBe((prevMinutes + 1) % 60);
        }
      }
    });

    test('should always zero-pad single-digit components', () => {
      /**
       * Property: Single-digit hours, minutes, or seconds are always zero-padded
       * This ensures consistent string length and format
       */
      const singleDigitTests = [
        new Date('2024-01-15T00:00:00'),
        new Date('2024-01-15T01:02:03'),
        new Date('2024-01-15T09:05:07'),
        new Date('2024-01-15T05:08:09')
      ];

      singleDigitTests.forEach(date => {
        const result = formatTime(date);
        const [h, m, s] = result.split(':');
        
        expect(h.length).toBe(2);
        expect(m.length).toBe(2);
        expect(s.length).toBe(2);
        expect(/^\d{2}:\d{2}:\d{2}$/.test(result)).toBe(true);
      });
    });

    test('should produce output of exactly 8 characters', () => {
      /**
       * Property: Every formatted time is exactly 8 characters (HH:MM:SS)
       * This validates consistent output length for all valid inputs
       */
      for (let hour = 0; hour < 24; hour += 3) {
        for (let minute = 0; minute < 60; minute += 10) {
          for (let second = 0; second < 60; second += 10) {
            const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
            const date = new Date(dateStr);
            const result = formatTime(date);
            
            expect(result.length).toBe(8);
          }
        }
      }
    });

    test('should be deterministic (same input produces same output)', () => {
      /**
       * Property: Calling formatTime multiple times with the same input produces identical output
       * This validates the function has no side effects or non-deterministic behavior
       */
      const date = new Date('2024-01-15T15:45:32');
      const results = [
        formatTime(date),
        formatTime(date),
        formatTime(date),
        formatTime(date),
        formatTime(date)
      ];

      // All results should be identical
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBe(results[0]);
      }
    });

    test('should match regex pattern for all valid times', () => {
      /**
       * Property: All formatted times match the HH:MM:SS regex pattern
       * This validates structural consistency across the full input domain
       */
      const timePattern = /^\d{2}:\d{2}:\d{2}$/;
      
      for (let hour = 0; hour < 24; hour += 2) {
        for (let minute = 0; minute < 60; minute += 15) {
          for (let second = 0; second < 60; second += 15) {
            const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
            const date = new Date(dateStr);
            const result = formatTime(date);
            
            expect(result).toMatch(timePattern);
          }
        }
      }
    });
  });

  describe('formatTime - 24-Hour Format Validation', () => {
    test('should use 24-hour format for all hours', () => {
      /**
       * Property: Hours are always displayed in 24-hour format (00-23), not 12-hour
       * This validates that AM/PM distinction is not used
       */
      const earlyMorning = formatTime(new Date('2024-01-15T02:30:00'));
      const lateEvening = formatTime(new Date('2024-01-15T22:30:00'));
      
      expect(earlyMorning).toBe('02:30:00');
      expect(lateEvening).toBe('22:30:00');
      
      // No AM/PM indicators should appear
      expect(earlyMorning).not.toMatch(/AM|PM|am|pm/);
      expect(lateEvening).not.toMatch(/AM|PM|am|pm/);
    });

    test('should correctly represent all 24 hours distinctly', () => {
      /**
       * Property: Each hour (0-23) produces a unique formatted string
       * This validates that all hours can be differentiated
       */
      const hourStrings = new Set();
      
      for (let hour = 0; hour < 24; hour++) {
        const dateStr = `2024-01-15T${String(hour).padStart(2, '0')}:00:00`;
        const date = new Date(dateStr);
        const result = formatTime(date);
        hourStrings.add(result);
      }

      // Should have 24 unique hour strings
      expect(hourStrings.size).toBe(24);
    });
  });
});

describe('Property 1: Updates Every Second - Update Timing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.body.innerHTML = `
      <div id="current-time">00:00:00</div>
      <div id="current-date">Monday, January 15, 2024</div>
      <h1 id="greeting-message">Good Morning</h1>
    `;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should update time display every second with different values', () => {
    /**
     * Property: Sequential calls to updateTime with advancing time produce different displays
     * This validates that the update mechanism captures time progression
     */
    let mockTime = new Date('2024-01-15T12:30:00').getTime();
    
    // Mock Date constructor
    jest.spyOn(global, 'Date').mockImplementation(() => new Date(mockTime));

    updateTime();
    const time1 = document.getElementById('current-time').textContent;

    // Advance by 1 second
    mockTime += 1000;
    jest.spyOn(global, 'Date').mockImplementation(() => new Date(mockTime));
    updateTime();
    const time2 = document.getElementById('current-time').textContent;

    // Advance by 1 second again
    mockTime += 1000;
    jest.spyOn(global, 'Date').mockImplementation(() => new Date(mockTime));
    updateTime();
    const time3 = document.getElementById('current-time').textContent;

    // All three times should be different
    expect(time2).not.toBe(time1);
    expect(time3).not.toBe(time2);
  });

  test('should handle time boundary transitions correctly', () => {
    /**
     * Property: At critical time boundaries (minute/hour changes), updates are accurate
     * This validates proper handling of temporal boundary conditions
     */
    const boundaryTimes = [
      new Date('2024-01-15T12:30:59'),
      new Date('2024-01-15T12:31:00'),
      new Date('2024-01-15T23:59:59'),
      new Date('2024-01-16T00:00:00')
    ];

    boundaryTimes.forEach(boundaryDate => {
      jest.spyOn(global, 'Date').mockImplementationOnce(() => boundaryDate);
      updateTime();
      
      const displayedTime = document.getElementById('current-time').textContent;
      const expectedTime = formatTime(boundaryDate);
      
      expect(displayedTime).toBe(expectedTime);
    });
  });
});
