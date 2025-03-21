from typing import List

from UTILS import questionTypes


def examWriter(questions, fileOutName, style):

    with open(style, "r", encoding="utf-8") as styleFile, open(
        "UTILS/scripts/submitFormFunction.js", "r", encoding="utf-8"
    ) as submitFormFile, open(
        "UTILS/scripts/singleChoice.js", "r", encoding="utf-8"
    ) as singleChoiceFile, open(
        "UTILS/scripts/multipleChoice.js", "r", encoding="utf-8"
    ) as multipleChoiceFile:

        submitFormFunction = submitFormFile.read()
        singleChoiceFunction = singleChoiceFile.read()
        multipleChoiceFunction = multipleChoiceFile.read()
        styles = styleFile.read()

    html_head = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Examen</title>
        <style>
            {styles}     
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
