import tkinter as tk
from tkinter import filedialog
import questions
import random
import os


class TestCreator:

    currentDirectory = os.path.dirname(os.path.abspath(__file__))
    NUMBEROFEXAMS = 1
    NUMBEROFQUESTIONS = 10
    QUESTIONSPERTOPIC = False
    QUESTIONSPERTOPICTEXT = ""

    def __init__(self) -> None:
        self.createWindow()
        self.window.mainloop()

    def reset(self):
        self.numOfExams = self.NUMBEROFEXAMS
        self.numOfQuestions = self.NUMBEROFQUESTIONS
        self.questionsPerTopic = self.QUESTIONSPERTOPIC
        self.questionsPerTopicText = self.QUESTIONSPERTOPICTEXT
        for widget in self.window.winfo_children():
            widget.destroy()
        self.createWidgets()

    def createWindow(self):
        self.window = tk.Tk()
        self.window.title("Test Creator")
        self.window.geometry("800x600")
        self.reset()

    def createWidgets(self):
        self.createFolderSelection()
        self.createNumberOfExams()
        self.createNumberOfQuestions()
        self.createQuestionsPerTopicButton()
        self.createQuestionsPerTopicEntry()
        self.createTestButton()
        self.createResetButton()

    def browse_folder(self, pathToSet: tk.StringVar) -> None:
        """
        Necessary function to get the Browse button working.

        Args:
            - pathToSet: A StringVar to set the folder path.

        Returns:
            - None
        """
        folder_path = filedialog.askdirectory(title="Select a folder")
        if folder_path:
            pathToSet.set(folder_path)

    def createFolderSelection(self) -> None:
        """
        Create the folder selection dropdown to choose the questions folder.

        Args:
            - None

        Returns:
            - None
        """
        validFolders = list(questions.validFolders().keys())

        # Folder selection Dropdown
        if not hasattr(self, "folder_path_var"):
            self.folder_path_var = tk.StringVar(value=random.choice(validFolders))

        # Label
        folderLabel = tk.Label(self.window, text="Questions folder:")
        folderLabel.grid(row=0, column=0, padx=5, pady=10, sticky="w")

        # Dropdown
        folderDropdown = tk.OptionMenu(self.window, self.folder_path_var, *validFolders)
        folderDropdown.grid(row=0, column=1, padx=5, pady=10, sticky="w")

    def createNumberOfExams(self) -> None:
        """
        Create a spinbox to select the number of exams to create.
        """
        label = tk.Label(self.window, text="Number of exams:")
        label.grid(row=1, column=0, padx=5, pady=10, sticky="w")
        self.spinboxNExams = tk.Spinbox(
            self.window,
            from_=1,
            to=float("inf"),
            width=5,
            textvariable=tk.IntVar(value=self.numOfExams),
        )
        self.spinboxNExams.grid(row=1, column=1, padx=5, pady=10, sticky="w")

    def createNumberOfQuestions(self) -> None:
        """
        Create a spinbox to select the number of questions for the test.
        """
        label = tk.Label(self.window, text="Number of questions:")
        label.grid(row=2, column=0, padx=5, pady=10, sticky="w")
        self.spinboxNQuestions = tk.Spinbox(
            self.window,
            from_=1,
            to=float("inf"),
            width=5,
            textvariable=tk.IntVar(value=self.numOfQuestions),
        )
        self.spinboxNQuestions.grid(row=2, column=1, padx=5, pady=10, sticky="w")

    def createQuestionsPerTopicButton(self) -> None:
        """
        Create a checkbox to select whether to use questions per topic or not.

        Args:
            - None

        Returns:
            - None
        """
        self.questionsPerTopicVar = tk.BooleanVar(value=self.questionsPerTopic)

        boolean_checkbox = tk.Checkbutton(
            self.window,
            text="Use questions per topic",
            command=self.updateQuestionsPerTopicEntry,
            variable=self.questionsPerTopicVar,
        )
        boolean_checkbox.grid(row=3, column=0, padx=5, pady=10, sticky="w")

    def createQuestionsPerTopicEntry(self) -> None:
        """
        Create the entry field for questions per topic configuration.

        Args:
            - None

        Returns:
            - None
        """
        # Entry for questions per topic
        self.questions_per_topic_text_var = tk.StringVar(
            value=self.questionsPerTopicText
        )

        # Label
        entryLabel = tk.Label(self.window, text="Questions per topic:")
        entryLabel.grid(row=4, column=0, padx=5, pady=10, sticky="w")

        # Entry
        self.questionsPerTopicEntry = tk.Entry(
            self.window,
            textvariable=self.questions_per_topic_text_var,
            width=40,
            state="disabled",
        )
        self.questionsPerTopicEntry.grid(row=4, column=1, padx=5, pady=10, sticky="w")

        self.updateQuestionsPerTopicEntry()

    def updateQuestionsPerTopicEntry(self) -> None:
        """
        Update the state of the questions per topic entry based on the checkbox.

        Args:
            - None

        Returns:
            - None
        """
        if self.questionsPerTopicVar.get():
            self.questionsPerTopicEntry.config(state="normal")
            self.questionsPerTopicEntry.config(
                textvariable=self.questions_per_topic_text_var
            )
        else:
            self.questionsPerTopicEntry.config(state="disabled")
            self.questionsPerTopicEntry.config(textvariable=tk.StringVar(value=""))

    def createTestButton(self):
        """
        Create the button to generate tests.
        """
        # TODO: Implement test generation functionality
        pass

    def createResetButton(self):
        button = tk.Button(self.window, text="Reset", command=self.reset)
        button.place(
            relx=0.0, rely=1.0, anchor="sw", x=10, y=-10
        )  # Bottom-left with padding


if __name__ == "__main__":
    TestCreator()
