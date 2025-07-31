const questionSolvers = new Map();
const questionGenerators = new Map();

function registerQuestionSolver(type, solverFunction) {
  questionSolvers.set(type, solverFunction);
}

function registerQuestionGenerator(type, generatorFunction) {
  questionGenerators.set(type, generatorFunction);
}

function getQuestionSolver(type) {
  return questionSolvers.get(type);
}

function getQuestionGenerator(type) {
  return questionGenerators.get(type);
}

function processQuestion(question) {
  const solver = getQuestionSolver(question["questionType"]);
  if (solver && typeof solver === "function") {
    return solver(question);
  } else {
    console.error(
      `No solver found for question type: ${question["questionType"]}`,
    );
    return 0;
  }
}

function generateQuestion(question, questionNumber) {
  const generator = getQuestionGenerator(question["questionType"]);
  if (generator && typeof generator === "function") {
    return generator(question, questionNumber);
  } else {
    console.error(
      `No generator found for question type: ${question["questionType"]}`,
    );
    return `<div class="error">Unknown question type: ${question["questionType"]}</div>`;
  }
}

// Export functions
window.questionRegistry = {
  // Solver methods
  registerSolver: registerQuestionSolver,
  getSolver: getQuestionSolver,
  process: processQuestion,

  // Generator methods
  registerGenerator: registerQuestionGenerator,
  getGenerator: getQuestionGenerator,
  generate: generateQuestion,
};
