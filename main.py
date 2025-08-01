from UTILS import exam

numExams = 2
numOfQuestions = 15
folder = "database/Empresa"


if __name__ == "__main__":
    exam.examGenerator(folder, numExams, numOfQuestions)
