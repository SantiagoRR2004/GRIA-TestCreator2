from UTILS import exam, standalone
import re

numExams = 1
numOfQuestions = 15
folder = "database/ABIA"


if __name__ == "__main__":
    with open("quiz.html", "r", encoding="utf-8") as f:
        exam_content = f.read()

    with open("ExamenTest.html", "w", encoding="utf-8") as f:
        f.write(
            standalone.makeStandalone(
                exam_content, {"folder": folder, "numberOfQuestions": numOfQuestions}
            )
        )

    # exam.examGenerator(folder, numExams, numOfQuestions)
