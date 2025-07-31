// indexPage.js - Index page initialization and event handling

function initializeIndexPage() {
  // Load subject folders when page loads
  loadSubjectFolders();

  // Set up subject selection event listener
  const subjectSelect = document.getElementById("subject-select");
  if (subjectSelect) {
    subjectSelect.addEventListener("change", handleSubjectSelection);
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
  if (selectedSubject) {
    // Store the selected subject in sessionStorage
    sessionStorage.setItem("selectedSubject", selectedSubject);
    // Navigate to the quiz page
    window.location.href = "quiz.html";
  } else {
    alert("Please select a subject first.");
  }
}
