import json


def join_jsons(json1, json2, filepath=None) -> dict:
    """Join two sjon files with questions, without repeating questions.
    The new questions are added to the first json file.
    Note, the questions must be exactly the same string to be considered the same.

    Parameters
    ----------
    json1 : str
            The filepath to the first json file.
    json2 : str
            The filepath to the second json file.
    filepath : str, optional
            The filepath to save the json file. Default is None.

    Returns
    -------
    dict_qs : dict
            The dictionary of questions
    """
    with open(json1, encoding="utf-8") as file:
        json1 = json.load(file)
    with open(json2, encoding="utf-8") as file:
        json2 = json.load(file)

    # check which questions of json2 are already in json1
    q1 = set([q["question"] for q in json1["questions"]])
    q2 = set([q["question"] for q in json2["questions"]])
    q2_new = q2 - q1

    # add the new questions to json1
    for q in json2["questions"]:
        if q["question"] in q2_new:
            json1["questions"].append(q)

    if filepath:
        with open(filepath, "w", encoding="utf-8") as file:
            json.dump(json1, file, indent=2, ensure_ascii=False)

    return json1
