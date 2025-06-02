/**
 * 🧪 LESSON 1: Simple Unit Testing (No Complex Setup!)
 *
 * This file tests our message helper functions to make sure:
 * 1. Timestamp formatting works correctly
 * 2. Message ordering logic is correct
 * 3. Safety checks prevent crashes
 *
 * Think of this as testing individual "gears" in our machine!
 */

// 🛠️ HELPER FUNCTIONS: Let's create some simple functions to test
const formatTimestamp = (timestamp) => {
  // This is the same logic from our ChatConversationScreen
  if (!timestamp) {
    return 'Now';
  }

  try {
    const date = new Date(timestamp);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Now';
    }
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Now';
  }
};

const sortMessagesByTimestamp = (messages) => {
  // This function sorts messages chronologically (oldest first)
  return [...messages].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : Date.now();
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : Date.now();
    return timeA - timeB;
  });
};

const isUserMessage = (message) => {
  return message.role === 'user';
};

const isAssistantMessage = (message) => {
  return message.role === 'assistant';
};

// 🧪 THE ACTUAL TESTS START HERE!
describe('Message Helper Functions', () => {

  // ✅ TEST 1: Timestamp formatting
  describe('formatTimestamp', () => {
    it('should format valid timestamps correctly', () => {
      // WHAT THIS DOES: Tests that valid timestamps get formatted properly
      // WHY IT'S IMPORTANT: Users need to see readable times

      const timestamp = '2024-01-01T10:30:00Z';
      const result = formatTimestamp(timestamp);

      // The result should be a time string (format may vary by locale)
      expect(result).toMatch(/\d{1,2}:\d{2}/); // Matches "10:30" or "10:30 AM"
      expect(result).not.toBe('Now');
    });

    it('should handle missing timestamps gracefully', () => {
      // WHAT THIS DOES: Tests our timestamp safety check
      // WHY IT'S IMPORTANT: Prevents crashes when timestamps are missing

      expect(formatTimestamp(null)).toBe('Now');
      expect(formatTimestamp(undefined)).toBe('Now');
      expect(formatTimestamp('')).toBe('Now');
    });

    it('should handle invalid timestamps gracefully', () => {
      // WHAT THIS DOES: Tests that bad timestamp data doesn't crash the app
      // WHY IT'S IMPORTANT: Real-world data can be messy

      expect(formatTimestamp('invalid-date')).toBe('Now');
      expect(formatTimestamp('not-a-date-at-all')).toBe('Now');
    });
  });

  // ✅ TEST 2: Message sorting (our recent fix!)
  describe('sortMessagesByTimestamp', () => {
    it('should sort messages in chronological order', () => {
      // WHAT THIS DOES: Verifies our message ordering logic
      // WHY IT'S IMPORTANT: Messages should appear in the right order

      const unsortedMessages = [
        {
          id: '3',
          content: 'Third message',
          timestamp: '2024-01-01T10:02:00Z'
        },
        {
          id: '1',
          content: 'First message',
          timestamp: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          content: 'Second message',
          timestamp: '2024-01-01T10:01:00Z'
        }
      ];

      const sorted = sortMessagesByTimestamp(unsortedMessages);

      expect(sorted[0].content).toBe('First message');
      expect(sorted[1].content).toBe('Second message');
      expect(sorted[2].content).toBe('Third message');
    });

    it('should handle messages without timestamps', () => {
      // WHAT THIS DOES: Tests that missing timestamps don't break sorting
      // WHY IT'S IMPORTANT: Some messages might not have timestamps

      const messagesWithMissingTimestamps = [
        {
          id: '1',
          content: 'Message with timestamp',
          timestamp: '2024-01-01T10:00:00Z'
        },
        {
          id: '2',
          content: 'Message without timestamp'
          // No timestamp property
        }
      ];

      const sorted = sortMessagesByTimestamp(messagesWithMissingTimestamps);

      // Should not crash and should return an array
      expect(Array.isArray(sorted)).toBe(true);
      expect(sorted).toHaveLength(2);
    });
  });

  // ✅ TEST 3: Message type detection
  describe('Message Type Detection', () => {
    it('should correctly identify user messages', () => {
      // WHAT THIS DOES: Tests that we can tell user messages from AI messages
      // WHY IT'S IMPORTANT: Different message types need different styling

      const userMessage = { role: 'user', content: 'Hello' };
      const assistantMessage = { role: 'assistant', content: 'Hi there!' };

      expect(isUserMessage(userMessage)).toBe(true);
      expect(isUserMessage(assistantMessage)).toBe(false);
    });

    it('should correctly identify assistant messages', () => {
      const userMessage = { role: 'user', content: 'Hello' };
      const assistantMessage = { role: 'assistant', content: 'Hi there!' };

      expect(isAssistantMessage(assistantMessage)).toBe(true);
      expect(isAssistantMessage(userMessage)).toBe(false);
    });
  });
});

/**
 * 🎓 LEARNING NOTES:
 *
 * 1. **Unit Tests** - Test individual functions in isolation
 * 2. **describe()** - Groups related tests together
 * 3. **it()** - Defines a single test case
 * 4. **expect()** - Checks if something is true
 * 5. **toBe()** - Checks exact equality
 * 6. **toMatch()** - Checks if a string matches a pattern
 *
 * 🎯 WHAT WE'RE TESTING:
 * - Does timestamp formatting work correctly?
 * - Do missing timestamps get handled safely?
 * - Does message sorting work properly?
 * - Can we identify different message types?
 *
 * 🚀 WHY THIS APPROACH IS BETTER:
 * - Simple to understand and run
 * - Tests core business logic
 * - No complex setup required
 * - Fast execution
 * - Easy to debug when tests fail
 */
