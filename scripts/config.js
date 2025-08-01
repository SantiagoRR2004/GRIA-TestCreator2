// Quiz Configuration
// This file contains the hardcoded settings for the quiz

// The folder containing the questions (relative to the project root)
folder = "None";
numberOfQuestions = 10;

if (!sessionStorage.getItem("selectedSubject")) {
  sessionStorage.setItem("selectedSubject", folder);
}

if (!sessionStorage.getItem("nQuestions")) {
  sessionStorage.setItem("nQuestions", numberOfQuestions);
}

const QUIZ_CONFIG = {
  // Additional configuration options for future use
  style: "legacy", // Can be "default", "legacy", or "dark"
};


// Global boolean variable to indicate if the quiz is running in standalone mode
window.notStandalone = true;
/*
Need to use this always in a conditional as window.notStandalone, it is important for re to find
it and delete the block for the python code to work correctly.
*/

