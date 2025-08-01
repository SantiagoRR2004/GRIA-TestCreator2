from UTILS import standalone
from UTILS import questions
import webbrowser


def examGenerator(
    folderPath: str,
    numberOfExams: int = 1,
    numberOfQuestions: str = 30,
    questionsPerTopic: dict = None,
    style: str = "styles/legacy.css",
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
        - style (str): The path to the style file to be used in the exam

    Returns:
        - None
    """
    with open("quiz.html", "r", encoding="utf-8") as f:
        examContent = f.read()

    with open(style, "r", encoding="utf-8") as f:
        styleContent = f.read()

    for exam in range(numberOfExams):
        validQuestions = questions.questionGenerator(
            folderPath, numberOfQuestions, questionsPerTopic
        )

        with open(f"ExamenTest{exam + 1}.html", "w", encoding="utf-8") as f:
            f.write(
                standalone.makeStandalone(
                    examContent,
                    styleContent,
                    {
                        "numberOfQuestions": numberOfQuestions,
                        "questionList": validQuestions,
                    },
                )
            )

    # If the number of exams is 1, we open the exam in the browser
    if numberOfExams == 1:
        webbrowser.open(f"./ExamenTest{exam + 1}.html")
