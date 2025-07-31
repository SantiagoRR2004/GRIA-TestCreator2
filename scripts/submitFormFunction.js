function submitForm() {
  var form = document.getElementById("testForm");
  form.elements["submitButton"].disabled = true;

  var correctGlobal = 0;
  var incorrectGlobal = 0;
  var unanswered = 0;
  var totalScore = 0;

  // Get all question divs that have a class matching a question type
  var allQuestions = document.querySelectorAll(".question");

  for (var question of allQuestions) {
    var score = 0;

    // Determine question type from the class names
    var questionType = null;
    if (question.classList.contains("singleChoice")) {
      questionType = "singleChoice";
    } else if (question.classList.contains("multipleChoice")) {
      questionType = "multipleChoice";
    }

    if (questionType) {
      // Use the question registry to get the appropriate solver
      var solver = window.questionRegistry.getSolver(questionType);
      if (solver && typeof solver === "function") {
        try {
          score = solver(question);
        } catch (error) {
          console.error(
            `Error solving question of type ${questionType}:`,
            error,
          );
          score = 0;
        }
      } else {
        console.error(`No solver found for question type: ${questionType}`);
        score = 0;
      }
    }

    // Process the score
    if (score === 1) {
      correctGlobal++;
      totalScore += score;
    } else if (isNaN(score)) {
      unanswered++;
    } else {
      incorrectGlobal++;
      totalScore += score;
    }
  }

  console.log("Score out of all questions: " + totalScore);
  console.log("Correct: " + correctGlobal);
  console.log("Incorrect: " + incorrectGlobal);
  console.log("Unanswered: " + unanswered);

  // We calculate the score out of 10
  totalScore = (
    (totalScore / (correctGlobal + incorrectGlobal + unanswered)) *
    10
  ).toFixed(2);

  console.log("Score out of 10: " + totalScore);

  var scoreDisplay = document.getElementById("scoreDisplay");
  scoreDisplay.innerHTML =
    "Preguntas acertadas: " +
    correctGlobal +
    "<br>Preguntas falladas: " +
    incorrectGlobal +
    "<br>Puntuación total: " +
    totalScore +
    "/10";

  return false;
}
