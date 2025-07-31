function singleChoice(question) {
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


// Register the function
if (typeof window !== 'undefined' && window.questionRegistry) {
    window.questionRegistry.register('singleChoice', singleChoice);
}