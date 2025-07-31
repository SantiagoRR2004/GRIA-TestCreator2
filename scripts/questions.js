const questionHandlers = new Map();

function registerQuestionType(type, handler) {
  questionHandlers.set(type, handler);
}

function getQuestionHandler(type) {
  return questionHandlers.get(type);
}

function processQuestion(question) {
  const handler = getQuestionHandler(question["questionType"]);
  if (handler && typeof handler === "function") {
    return handler(question);
  } else {
    console.error(
      `No handler found for question type: ${question["questionType"]}`,
    );
    return 0;
  }
}

// Export functions
window.questionRegistry = {
  register: registerQuestionType,
  get: getQuestionHandler,
  process: processQuestion,
};
