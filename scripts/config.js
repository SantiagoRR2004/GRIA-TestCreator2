// Quiz Configuration
// This file is made to make the standalone quiz work

numberOfQuestions = 10;
questionList = [];

if (!sessionStorage.getItem("nQuestions")) {
  sessionStorage.setItem("nQuestions", numberOfQuestions);
}

if (!sessionStorage.getItem("allQuestions")) {
  sessionStorage.setItem("allQuestions", JSON.stringify(questionList));
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
