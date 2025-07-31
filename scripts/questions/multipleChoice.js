function multipleChoiceSolver(question) {
  var selectedInputs = question.querySelectorAll("input:checked");

  // Get the correct answer element
  var correctAnswer = question.querySelector(".correct-answer");

  // Extract the correct answers from the hidden input field
  var correctAnswers = question.querySelector("input[name^='correct_']");
  var correctAnswersArray = correctAnswers
    ? correctAnswers.value.split(",").map((x) => x.trim())
    : [];

  // Display the correct answers
  question
    .querySelectorAll(".correct-answer")
    .forEach((x) => (x.style.display = "block"));

  // Get the total number of checkbox options
  var options = question.querySelectorAll("input[type=checkbox]");
  var numOptions = options.length;

  // Disable all checkboxes to prevent changing the answer
  options.forEach((input) => (input.disabled = true));

  var correct = 0;
  var incorrect = 0;
  var unanswered = 0;

  // Iterate over selected inputs to mark correct/incorrect answers
  for (var selectedInput of selectedInputs) {
    var listItem = selectedInput.closest("li"); // Get the <li> containing the checkbox

    if (listItem) {
      if (correctAnswersArray.includes(selectedInput.value)) {
        // listItem.classList.add("correct"); // Apply class to the entire list item
        correct++;
      } else {
        // listItem.classList.add("incorrect");
        incorrect++;
      }
    }
  }

  // We log the number of the question and score

  // If all the correct answers are selected and no incorrect answers are selected
  // we return 1
  if (correct === correctAnswersArray.length && incorrect === 0) {
    correctAnswer.classList.add("correct");
    console.log(
      question.querySelector("p").innerHTML.split(":")[0] + " - Score: 1",
    );
    return 1;
  } // If there are no answers we return NaN
  else if (selectedInputs.length === 0) {
    correctAnswer.classList.add("incorrect");
    console.log(
      question.querySelector("p").innerHTML.split(":")[0] + " - Score: NaN",
    );
    return NaN;
  } // If there are incorrect answers we return the penalty for random guessing
  else {
    correctAnswer.classList.add("incorrect");
    console.log(
      question.querySelector("p").innerHTML.split(":")[0] + " - Score: -0.5",
    );
    return -0.5;
  }
}

function multipleChoiceGenerator(question, nQuestion) {
  /**
   * Generate the HTML for a multiple choice question
   *
   * @param {Object} question - The question data. It requires the following keys:
   *   - question (string): The question text
   *   - options (array): A list with the possible answers
   *   - correct_options (array): A list with the indexes of the correct answers
   *   - questionType (string): The type of question
   *   It also can have the following optional keys:
   *   - folder (string): The folder where the images are located
   *   - images (array): A list with the names of the images
   * @param {number} nQuestion - The question number. It needs to be in base 0
   *
   * @returns {string} The HTML code for the question
   */

  // First we randomize the order of the options
  const randomizedQuestion = randomizeMultipleChoice(question);

  const questionText = randomizedQuestion.question;
  const options = randomizedQuestion.options;
  const correctOptions = randomizedQuestion.correct_options;
  let optionHtml = "";

  // Generate the HTML for the options
  for (let j = 0; j < options.length; j++) {
    const optionLetter = String.fromCharCode(65 + j); // Convert index to letter (A, B, C, ...)
    optionHtml += `<li><input type="checkbox" name="question_${nQuestion}" value="${optionLetter}"> ${optionLetter}) ${options[j]}</li>`;
  }

  // Add the images to the question
  let images = "";
  if (randomizedQuestion.images && randomizedQuestion.images.length > 0) {
    for (const img of randomizedQuestion.images) {
      const location = `${randomizedQuestion.folder}/${img}`;
      images += `<img src="${location}" alt="imagen">`;
    }
  }

  // Convert correct option indices to letters and sort them
  const correctOptionsStr = correctOptions
    .map((i) => String.fromCharCode(65 + i))
    .sort()
    .join(", ");

  const correctHtml = `<p class="correct-answer">Respuestas correctas: ${correctOptionsStr}</p>`;
  const correctHiddenInput = `<input type="hidden" name="correct_${nQuestion}" value="${correctOptionsStr}">`;

  return `
            <div class="${randomizedQuestion.questionType} question">
                <p>${nQuestion + 1}: ${questionText}</p>  <!-- Mostrar el número de pregunta -->
                ${images}
                <ul>
                    ${optionHtml}
                </ul>
                ${correctHtml}
                ${correctHiddenInput}
            </div>
            `;
}

function randomizeMultipleChoice(question) {
  /**
   * Randomize the order of the options in a multiple choice question
   *
   * @param {Object} question - The question data
   * @returns {Object} The question data with the options randomized
   */
  const questionCopy = JSON.parse(JSON.stringify(question)); // Deep copy
  const correct = questionCopy.correct_options.map(
    (i) => questionCopy.options[i],
  );

  // Shuffle the options array
  for (let i = questionCopy.options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionCopy.options[i], questionCopy.options[j]] = [
      questionCopy.options[j],
      questionCopy.options[i],
    ];
  }

  // Update the correct option indices
  questionCopy.correct_options = correct.map((c) =>
    questionCopy.options.indexOf(c),
  );
  return questionCopy;
}

// Register both solver and generator functions
if (typeof window !== "undefined" && window.questionRegistry) {
  window.questionRegistry.registerSolver(
    "multipleChoice",
    multipleChoiceSolver,
  );
  window.questionRegistry.registerGenerator(
    "multipleChoice",
    multipleChoiceGenerator,
  );
}
