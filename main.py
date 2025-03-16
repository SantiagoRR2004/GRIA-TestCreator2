from UTILS import exam
import os

numExams = 1
numOfQuestions = 2
folder = "PIC"

# get current dir for testing a specific file that was added
currentDir = os.getcwd()
folder = os.path.join(currentDir, folder)
questionsPerTopic = {os.path.join(folder, "Unit4Teacher.json"): 10}

if __name__ == "__main__":
    exam.examGenerator(folder, numExams, numOfQuestions, questionsPerTopic)
