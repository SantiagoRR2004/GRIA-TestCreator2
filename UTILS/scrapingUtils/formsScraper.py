from bs4 import BeautifulSoup as soup
from urllib.request import urlopen
import json


def get_form_data(url: str = None, use_file: str = "") -> tuple[list, list, list]:
    """Extract questions, answers and question types from a google form URL.
    The "structured" data in forms is buried in a script at the bottom of the HTML, so
    we need to work around it.

    Parameters
    ----------
    url : str
            The url of the page to scrape.
    use_file : str, optional
            The file to use for testing. Default is "".

    Returns
    -------
    questions : list
            The list of questions.
    answers : list
            The list of answers.
    question_type : list
            The list of question types.
    """

    if use_file:
        with open("test.html", "r") as file:
            url_content = file.read()
    else:
        url_client = urlopen(url)
        url_content = url_client.read()  # getting the content of the url.
        url_client.close()

    # beautiful soup parser to parse the files in html and get all scripts
    parser = soup(url_content, "html.parser")
    content = parser.find_all("script")

    # filter to get the one with 'var FB_PUBLIC_LOAD_DATA_' in it.
    content = [item for item in content if "var FB_PUBLIC_LOAD_DATA_" in str(item)][0]

    # now, split the content to get the data. Extract the json in the var and remove the semicolon.
    content = content.text.split("var FB_PUBLIC_LOAD_DATA_ = ")[1][:-1]

    # use the json format to turn the string into list.
    content = json.loads(content)

    data = content[1][1]  # get the data. dump stupid aah lists
    questions = []
    answers = []
    question_type = []

    for pair in data:
        question = pair[1]
        questions.append(question)

        answer = pair[4][0][1]  # stupid list indentation, 'thanks' google
        answer = [ans[0] for ans in answer]
        answers.append(answer)

        question_type.append(pair[3])

    assert len(questions) == len(answers)

    return questions, answers, question_type


def format_into_json(questions, answers, type, filepath=None) -> dict:
    """Format the data into a json file for the quiz app.
    For format of the json file, refer to the README.

    Parameters
    ----------
    questions : list
            The list of questions.
    answers : list
            The list of answers.
    type : list
            The list of question types.
    filepath : str, optional
            The filepath to save the json file. Default is None.

    Returns
    -------
    dict_qs : dict
            The dictionary of questions.
    """

    dict_qs = {"questions": []}

    for q, a, t in zip(questions, answers, type):
        if t == 2:
            type = "singleChoice"
            dict_q = {
                "question": q,
                "options": a,
                "correct_option": None,
                "questionType": type,
            }
        elif t == 4:
            type = "multipleChoice"
            dict_q = {
                "question": q,
                "options": a,
                "correct_options": [],  # TODO implement a way to get this
                "questionType": type,
            }
        dict_qs["questions"].append(dict_q)

    if filepath:
        with open(filepath, "w") as file:
            json.dump(dict_qs, file, indent=4)

    return dict_qs


def get_correct_answers(html_content, class_id):
    # TODO this only works for the questions you answered WRONG
    # must implement a way to get the ones that are right!!!
    # also, you have to manually search for the class of the div containing the correct answers (class_id), which is shit
    parser = soup(html_content, "html.parser")
    correct_answers_divs = parser.find_all("div", class_=class_id)

    correct_answers = []
    for div in correct_answers_divs:
        answer_spans = div.find_all("span", dir="auto")
        for span in answer_spans:
            correct_answers.append(span.text)

    return correct_answers


if __name__ == "__main__":

    # Example usage
    url = input("Enter the url: ")
    name = input("Enter complete file name: ")
    assert name[-5:] == ".json"

    # q, a, t = get_data(url=url, use_file='test_answers.html')
    q, a, t = get_form_data(url=url)  # questions, answers, question type
    json_output = format_into_json(q, a, t, filepath=name)

    """# Example usage of get_correct_answers
    with open('test_answers.html', 'r') as file:
        html_content = file.read()
    correct_answers = get_correct_answers(html_content, 'D42QGf')
    print(correct_answers)"""
