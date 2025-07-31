function multipleChoice(question) {
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


// Register the function
if (typeof window !== 'undefined' && window.questionRegistry) {
    window.questionRegistry.register('multipleChoice', multipleChoice);
}