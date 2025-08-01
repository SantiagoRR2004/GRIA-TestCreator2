// indexPage.js - Index page initialization and event handling

function initializeIndexPage() {
  // Load subject folders when page loads
  loadSubjectFolders();

  // Set default value for question count from sessionStorage if available
  const questionCountInput = document.getElementById("question-count");
  const storedNQuestions = sessionStorage.getItem("nQuestions");
  if (questionCountInput && storedNQuestions !== null) {
    questionCountInput.value = storedNQuestions;
  }

  // Set up subject selection event listener
  const subjectSelect = document.getElementById("subject-select");
  if (subjectSelect) {
    subjectSelect.addEventListener("change", handleSubjectSelection);
  }

  // Set up question count input event listener to update sessionStorage
  if (questionCountInput) {
    questionCountInput.addEventListener("input", function () {
      sessionStorage.setItem("nQuestions", questionCountInput.value);
    });
  }

  // Set up start test button event listener
  const startTestBtn = document.getElementById("start-test-btn");
  if (startTestBtn) {
    startTestBtn.addEventListener("click", handleStartTest);
  }
}

function handleSubjectSelection() {
  const selectedSubject = document.getElementById("subject-select").value;
  if (selectedSubject) {
    // Store the selected subject in sessionStorage
    sessionStorage.setItem("selectedSubject", selectedSubject);
    console.log("Selected subject:", selectedSubject);
    // Here you can add logic to load units or navigate to test creation
  }
}

function handleStartTest() {
  const selectedSubject = document.getElementById("subject-select").value;
  const nQuestions = document.getElementById("question-count").value;
  if (selectedSubject) {
    // Store the selected subject and number of questions in sessionStorage
    sessionStorage.setItem("selectedSubject", selectedSubject);
    sessionStorage.setItem("nQuestions", nQuestions);
    // Navigate to the quiz page
    window.location.href = "quiz.html";
  } else {
    alert("Please select a subject first.");
  }
}
