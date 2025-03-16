from random import shuffle
import webbrowser


from UTILS import HTMLUtils
from UTILS import questions as qUtils


def examGenerator(
    folderPath: str,
    numberOfExams: int = 1,
    numberOfQuestions: str = 30,
    questionsPerTopic: dict = None,
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

    Returns:
        - None
    """
    output = "./ExamenTest.html"
    for exam in range(numberOfExams):
        questions = qUtils.questionGenerator(
            folderPath, numberOfQuestions, questionsPerTopic
        )
        # Randomize the order of the questions
        shuffle(questions)
        HTMLUtils.examWriter(questions, "./ExamenTest" + str(exam + 1) + ".html")

    # If the number of exams is 1, we open the exam in the browser
    if numberOfExams == 1:
        webbrowser.open("./ExamenTest" + str(exam + 1) + ".html")
