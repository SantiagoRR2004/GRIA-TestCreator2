from typing import List

from UTILS import questionTypes


def examWriter(questions, fileOutName):
    submitFormFunction = """function submitForm() {
        var form = document.getElementById("testForm");
        form.elements["submitButton"].disabled = true;

        var correctGlobal = 0;
        var incorrectGlobal = 0;
        var unanswered = 0;
        var totalScore = 0;

        var questions = document.getElementsByClassName("singleChoice");

        for (var question of questions) {
            var score = singleChoice(question);
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

        var questions = document.getElementsByClassName("multipleChoice");

        for (var question of questions) {
            var score = multipleChoice(question);
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
        totalScore = ((totalScore / (correctGlobal + incorrectGlobal + unanswered)) * 10).toFixed(2);

        console.log("Score out of 10: " + totalScore);

        var scoreDisplay = document.getElementById("scoreDisplay");
        scoreDisplay.innerHTML = "Preguntas acertadas: " + correctGlobal + "<br>Preguntas falladas: " + incorrectGlobal + "<br>Puntuación total: " + totalScore + "/10";

        return false;
    }
"""

    singleChoiceFunction = """function singleChoice(question) {
        var selectedInput = question.querySelector("input:checked");
        var correctAnswer = question.querySelector(".correct-answer");
        correctAnswer.style.display = "block";

        // We only count the ones with radio buttons
        var options = question.querySelectorAll("input[type=radio]");
        var numOptions = options.length;

        // Disable all radio buttons to prevent changing the answer
        options.forEach(input => input.disabled = true);

        if (selectedInput && selectedInput.value === correctAnswer.innerHTML.split(":")[1].trim()) {
            correctAnswer.classList.add("correct");
        } else {
            correctAnswer.classList.add("incorrect");
        }

        // We log the number of the question and score

        // If it is correct we return 1
        if (selectedInput && selectedInput.value === correctAnswer.innerHTML.split(":")[1].trim()) {
            console.log(question.querySelector("p").innerHTML.split(":")[0] + " - Score: 1");
            return 1;
        } //If there is no answer we return NaN
        else if (selectedInput === null) {
            console.log(question.querySelector("p").innerHTML.split(":")[0] + " - Score: NaN");
            return NaN;
        } //If it is incorrect we return the penalty for random guessing
        else {
            console.log(question.querySelector("p").innerHTML.split(":")[0] + " - Score: -1/" + (numOptions - 1));
            return -1/(numOptions - 1);
        }
    }
"""

    multipleChoiceFunction = """function multipleChoice(question) {
        var selectedInputs = question.querySelectorAll("input:checked");

        // Get the correct answer element
        var correctAnswer = question.querySelector(".correct-answer");

        // Extract the correct answers from the hidden input field
        var correctAnswers = question.querySelector("input[name^='correct_']");
        var correctAnswersArray = correctAnswers ? correctAnswers.value.split(",").map(x => x.trim()) : [];

        // Display the correct answers
        question.querySelectorAll(".correct-answer").forEach(x => x.style.display = "block");

        // Get the total number of checkbox options
        var options = question.querySelectorAll("input[type=checkbox]");
        var numOptions = options.length;

        // Disable all checkboxes to prevent changing the answer
        options.forEach(input => input.disabled = true);

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
            console.log(question.querySelector("p").innerHTML.split(":")[0] + " - Score: 1");
            return 1;
        } // If there are no answers we return NaN
        else if (selectedInputs.length === 0) {
            correctAnswer.classList.add("incorrect");
            console.log(question.querySelector("p").innerHTML.split(":")[0] + " - Score: NaN");
            return NaN;
        } // If there are incorrect answers we return the penalty for random guessing
        else {
            correctAnswer.classList.add("incorrect");
            console.log(question.querySelector("p").innerHTML.split(":")[0] + " - Score: -0.5");
            return -0.5;
        }

    }
"""

    html_head = """
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Examen</title>
        <style>
            body {font-family: Arial, sans-serif; 
                }
                .correct {
                    color: green;
                }
                .incorrect {
                    color: red;
                }
                .question {
                    margin-bottom: 19px;
                }
                .question p {
                    font-weight: bold;
                    font-size: 19px;
                }
                .question span {
                    font-size: 17px;
                    font-style: italic;
                }
                .question li {
                    font-size: 18px;
                    list-style-type: none;
                }
                .correct-answer {
                    display: none;
                    font-weight: bold;
                    font-size: 16px;
                }
                .answered {
                    pointer-events: none;
                }
            
        </style>
    </head>
    <body>
        <form id="testForm" onsubmit="return submitForm()">
    """

    html_tail = """
            <input id="submitButton" type="submit" value="Enviar respuestas">
        </form>
        <p id="scoreDisplay"></p>
    </body>
    </html>
    """

    fileOut = open(fileOutName, "w", encoding="utf-8")
    fileOut.write(html_head)

    for questionNumber, question in enumerate(questions):
        """
        ##########################################################
        Here is where we would check the question type and generate the HTML accordingly.
        ##########################################################
        """
        if question["questionType"] == "singleChoice":
            fileOut.write(questionTypes.singleChoiceWriter(question, questionNumber))

        elif question["questionType"] == "multipleChoice":
            fileOut.write(questionTypes.multipleChoiceWriter(question, questionNumber))

        else:
            print("Tipo de pregunta no implementado")

    fileOut.write(html_tail)
    fileOut.write(
        combineFunctions(
            [submitFormFunction, singleChoiceFunction, multipleChoiceFunction]
        )
    )
    fileOut.close()


def combineFunctions(functions: List[str]) -> str:
    # Join the list of functions into a single string
    combinedFunctions = "\n".join(functions)

    # Wrap the combined functions in a <script> tag
    combinedScript = f"<script>\n{combinedFunctions}\n</script>"

    return combinedScript
