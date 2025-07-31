from UTILS import exam
import re

numExams = 1
numOfQuestions = 15
folder = "database/ABIA"


def makeStandalone(exam: str) -> str:
    # First search for all <script src=*></script>
    script_pattern = re.compile(r'<script\s+src="([^"]+)"\s*></script>', re.IGNORECASE)
    scripts = script_pattern.findall(exam)

    # Replace each script tag with an embedded script tag
    for script in scripts:
        with open(script, "r", encoding="utf-8") as f:
            script_content = f.read()
        embedded_script = f"<script>\n{script_content}\n</script>"
        exam = exam.replace(f'<script src="{script}"></script>', embedded_script)

    # Now replace the parameters
    # folder: "*",
    folder_pattern = re.compile(r'folder:\s*"([^"]+)"')
    exam = folder_pattern.sub(f'folder: "{folder}"', exam)
    # numberOfQuestions: *,
    questions_pattern = re.compile(r"numberOfQuestions:\s*(\d+)")
    exam = questions_pattern.sub(f"numberOfQuestions: {numOfQuestions}", exam)

    return exam


if __name__ == "__main__":
    with open("quiz.html", "r", encoding="utf-8") as f:
        exam_content = f.read()

    with open("ExamenTest.html", "w", encoding="utf-8") as f:
        f.write(makeStandalone(exam_content))

    # exam.examGenerator(folder, numExams, numOfQuestions)
