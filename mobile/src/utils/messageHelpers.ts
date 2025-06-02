/**
 * 🛠️ Message Helper Utilities
 * 
 * This file contains utility functions for handling messages in our chat app.
 * These functions are tested and reliable!
 */

/**
 * Formats a timestamp for display in the chat
 * 
 * @param timestamp - ISO timestamp string or null/undefined
 * @returns Formatted time string or "Now" if invalid
 * 
 * 🎯 EXAMPLES:
 * formatTimestamp('2024-01-01T10:30:00Z') → "10:30"
 * formatTimestamp(null) → "Now"
 * formatTimestamp('invalid-date') → "Now"
 */
export const formatTimestamp = (timestamp?: string | null): string => {
  // Handle missing timestamps
  if (!timestamp) {
    return 'Now';
  }
  
  try {
    const date = new Date(timestamp);
    
    // Check if the date is valid (this was our bug fix!)
    if (isNaN(date.getTime())) {
      return 'Now';
    }
    
    // Format the time in a user-friendly way
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    // Fallback for any unexpected errors
    return 'Now';
  }
};

/**
 * Sorts messages by timestamp (oldest first)
 * 
 * @param messages - Array of message objects
 * @returns Sorted array of messages
 */
export const sortMessagesByTimestamp = (messages: any[]): any[] => {
  return [...messages].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : Date.now();
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : Date.now();
    return timeA - timeB;
  });
};

/**
 * Checks if a message is from the user
 * 
 * @param message - Message object
 * @returns true if message is from user
 */
export const isUserMessage = (message: any): boolean => {
  return message.role === 'user';
};

/**
 * Checks if a message is from the assistant
 * 
 * @param message - Message object
 * @returns true if message is from assistant
 */
export const isAssistantMessage = (message: any): boolean => {
  return message.role === 'assistant';
};

/**
 * Gets a safe display name for message sender
 * 
 * @param message - Message object
 * @returns "You" for user messages, "SoberPal" for assistant messages
 */
export const getMessageSenderName = (message: any): string => {
  return isUserMessage(message) ? 'You' : 'SoberPal';
};

/**
 * Validates that a message has required fields
 * 
 * @param message - Message object to validate
 * @returns true if message is valid
 */
export const isValidMessage = (message: any): boolean => {
  return (
    message &&
    typeof message.id === 'string' &&
    typeof message.content === 'string' &&
    (message.role === 'user' || message.role === 'assistant')
  );
};
