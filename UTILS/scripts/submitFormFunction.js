function submitForm() {
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