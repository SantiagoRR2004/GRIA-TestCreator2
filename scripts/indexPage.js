// indexPage.js - Index page initialization and event handling

function initializeIndexPage() {
  // Load subject folders when page loads
  loadSubjectFolders();

  // Set up subject selection event listener
  const subjectSelect = document.getElementById("subject-select");
  if (subjectSelect) {
    subjectSelect.addEventListener("change", handleSubjectSelection);
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
