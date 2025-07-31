// Quiz Configuration
// This file contains the hardcoded settings for the quiz

const QUIZ_CONFIG = {
  // The folder containing the questions (relative to the project root)
  folder: "database/PIC",

  // Number of questions to include in the quiz
  numberOfQuestions: 10,

  // Additional configuration options for future use
  style: "legacy", // Can be "default", "legacy", or "dark"
};

// Make the configuration available globally
window.QUIZ_CONFIG = QUIZ_CONFIG;

// Global boolean variable to indicate if the quiz is running in standalone mode
window.notStandalone = true;
/*
Need to use this always in a conditional as window.notStandalone, it is important for re to find
it and delete the block for the python code to work correctly.
*/

// Log configuration for debugging
console.log("Quiz Configuration loaded:", QUIZ_CONFIG);
