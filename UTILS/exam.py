from random import shuffle
import webbrowser


from UTILS import HTMLUtils
from UTILS import questions as qUtils


def examGenerator(
    folderPath: str,
    numberOfExams: int = 1,
    numberOfQuestions: str = 30,
    questionsPerTopic: dict = None,
    style: str = "default",
) -> None:
    """
    Generates exams based on the number of exams, number of questions and the folder path

    If it is only one exam, it will open the exam in the browser

    Args:
        - folderPath: The path to the folder where the questions are stored
        - numberOfExams: The number of exams to generate
        - numberOfQuestions: The number of questions per exam
        - questionsPerTopic: A dictionary with the number of questions
          per topic to generate. The keys must be absolute paths to the files
          with the questions
        - style: The style of the exam. It can be "default" or "legacy".

    Returns:
        - None
    """
    match style:
        case "default":
            css = "UTILS/style.css"
        case "legacy":
            css = "UTILS/legacy.css"
        case "dark":
            css = "UTILS/dark.css"
        case _:
            raise ValueError(f"Unknown style: {style}")

    for exam in range(numberOfExams):
        questions = qUtils.questionGenerator(
            folderPath, numberOfQuestions, questionsPerTopic
        )
        # Randomize the order of the questions
        shuffle(questions)
        HTMLUtils.examWriter(questions, "./ExamenTest" + str(exam + 1) + ".html", css)

    # If the number of exams is 1, we open the exam in the browser
    if numberOfExams == 1:
        webbrowser.open("./ExamenTest" + str(exam + 1) + ".html")
