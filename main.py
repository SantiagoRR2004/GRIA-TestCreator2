from UTILS import exam, standalone, questions
import json

numExams = 1
numOfQuestions = 15
folder = "Empresa"


if __name__ == "__main__":
    validQuestions = []
    for f in questions.validFolders()[folder].keys():
        with open(f, "r", encoding="utf-8") as file:
            validQuestions.extend(json.load(file)["questions"])

    with open("quiz.html", "r", encoding="utf-8") as f:
        exam_content = f.read()

    with open("ExamenTest.html", "w", encoding="utf-8") as f:
        f.write(
            standalone.makeStandalone(
                exam_content,
                {
                    "numberOfQuestions": numOfQuestions,
                    "questionList": validQuestions,
                },
            )
        )

    # exam.examGenerator(folder, numExams, numOfQuestions)
