function singleChoiceSolver(question) {
  var selectedInput = question.querySelector("input:checked");
  var correctAnswer = question.querySelector(".correct-answer");
  correctAnswer.style.display = "block";

  // We only count the ones with radio buttons
  var options = question.querySelectorAll("input[type=radio]");
  var numOptions = options.length;

  // Disable all radio buttons to prevent changing the answer
  options.forEach((input) => (input.disabled = true));

  if (
    selectedInput &&
    selectedInput.value === correctAnswer.innerHTML.split(":")[1].trim()
  ) {
    correctAnswer.classList.add("correct");
  } else {
    correctAnswer.classList.add("incorrect");
  }

  // We log the number of the question and score

  // If it is correct we return 1
  if (
    selectedInput &&
    selectedInput.value === correctAnswer.innerHTML.split(":")[1].trim()
  ) {
    console.log(
      question.querySelector("p").innerHTML.split(":")[0] + " - Score: 1",
    );
    return 1;
  } //If there is no answer we return NaN
  else if (selectedInput === null) {
    console.log(
      question.querySelector("p").innerHTML.split(":")[0] + " - Score: NaN",
    );
    return NaN;
  } //If it is incorrect we return the penalty for random guessing
  else {
    console.log(
      question.querySelector("p").innerHTML.split(":")[0] +
        " - Score: -1/" +
        (numOptions - 1),
    );
    return -1 / (numOptions - 1);
  }
}

function singleChoiceGenerator(question, nQuestion) {
  /**
   * Generate the HTML for a single choice question
   *
   * @param {Object} question - The question data. It requires the following keys:
   *   - question (string): The question text
   *   - options (array): A list with the possible answers
   *   - correct_option (number): The index of the correct answer
   *   - questionType (string): The type of question
   *   It also can have the following optional keys:
   *   - folder (string): The folder where the images are located
   *   - images (array): A list with the names of the images
   * @param {number} nQuestion - The question number. It needs to be in base 0
   *
   * @returns {string} The HTML code for the question
   */
  
  // First we randomize the order of the options
  const randomizedQuestion = randomizeSingleChoice(question);
  
  const questionText = randomizedQuestion.question;
  const options = randomizedQuestion.options;
  const correctOption = randomizedQuestion.correct_option;
  let optionHtml = "";

  // Generate the HTML for the options
  for (let j = 0; j < options.length; j++) {
    const optionLetter = String.fromCharCode(65 + j); // Convert index to letter (A, B, C, ...)
    optionHtml += `<li><input type="radio" name="question_${nQuestion}" value="${optionLetter}"> ${optionLetter}) ${options[j]}</li>`;
  }

  // Add the images to the question
  let images = "";
  if (randomizedQuestion.images && randomizedQuestion.images.length > 0) {
    for (const img of randomizedQuestion.images) {
      const location = `${randomizedQuestion.folder}/${img}`;
      images += `<img src="${location}" alt="imagen">`;
    }
  }

  const correctLetter = String.fromCharCode(65 + correctOption);
  const correctHtml = `<p class="correct-answer">Respuesta correcta: ${correctLetter}</p>`;
  const correctHiddenInput = `<input type="hidden" name="correct_${nQuestion}" value="${correctLetter}">`;

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

function randomizeSingleChoice(question) {
  /**
   * Randomize the order of the options in a single choice question
   *
   * @param {Object} question - The question data
   * @returns {Object} The question data with the options randomized
   */
  const questionCopy = JSON.parse(JSON.stringify(question)); // Deep copy
  const correct = questionCopy.options[questionCopy.correct_option];
  
  // Shuffle the options array
  for (let i = questionCopy.options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionCopy.options[i], questionCopy.options[j]] = [questionCopy.options[j], questionCopy.options[i]];
  }
  
  // Update the correct option index
  questionCopy.correct_option = questionCopy.options.indexOf(correct);
  return questionCopy;
}

// Register the function
if (typeof window !== "undefined" && window.questionRegistry) {
  window.questionRegistry.register("singleChoice", singleChoiceSolver);
}
