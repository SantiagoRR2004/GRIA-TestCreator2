// indexPage.js - Index page initialization and event handling

function initializeIndexPage() {
  // Load subject folders when page loads
  loadSubjectFolders();

  // Load available styles when page loads
  loadAvailableStyles();

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

  // Set up style selection event listener
  const styleSelect = document.getElementById("style-select");
  if (styleSelect) {
    styleSelect.addEventListener("change", handleStyleSelection);
  }
}

// Dynamically load available styles from the styles folder and populate the dropdown
async function loadAvailableStyles() {
  const styleSelect = document.getElementById("style-select");
  if (!styleSelect) return;

  styleSelect.innerHTML = '<option value="">Loading styles...</option>';
  try {
    const dirResponse = await fetch("styles/");
    if (!dirResponse.ok) throw new Error("Failed to fetch styles directory");
    const text = await dirResponse.text();

    // Try to extract filenames from the directory listing
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const links = Array.from(doc.querySelectorAll("a"));
    const styleFiles = links
      .map((a) => a.getAttribute("href"))
      .filter((href) => href && href.match(/\.css$/))
      .map((href) => `styles/${href}`);

    styleSelect.innerHTML = "";
    styleFiles.forEach((file) => {
      // Extract only the filename (after the last slash) and remove .css
      const styleName = file
        .split("/")
        .pop()
        .replace(/\.css$/, "");
      const option = document.createElement("option");
      option.value = file;
      option.textContent = styleName;
      styleSelect.appendChild(option);
    });

    // Set default value from sessionStorage if available
    const storedStyle = sessionStorage.getItem("style");
    if (storedStyle && styleFiles.includes(storedStyle)) {
      styleSelect.value = storedStyle;
    } else if (styleFiles.length > 0) {
      // Choose a random style if none is selected
      const randomStyle =
        styleFiles[Math.floor(Math.random() * styleFiles.length)];
      styleSelect.value = randomStyle;
      sessionStorage.setItem("style", randomStyle);
      console.log("Random style selected:", randomStyle);
    }
  } catch (err) {
    styleSelect.innerHTML = '<option value="">No styles found</option>';
    console.error("Error loading styles:", err);
  }
}

function handleStyleSelection() {
  const styleSelect = document.getElementById("style-select");
  if (styleSelect) {
    const selectedStyle = styleSelect.value;
    sessionStorage.setItem("style", selectedStyle);
    console.log("Selected style:", selectedStyle);
  }
}

function handleSubjectSelection() {
  const selectedSubject = document.getElementById("subject-select").value;
  if (selectedSubject) {
    // Store the selected subject in sessionStorage
    sessionStorage.setItem("selectedSubject", selectedSubject);
    console.log("Selected subject:", selectedSubject);
  }
}

function handleStartTest() {
  const selectedSubject = document.getElementById("subject-select").value;
  const nQuestions = document.getElementById("question-count").value;
  const selectedStyle = document.getElementById("style-select").value;
  if (selectedSubject) {
    // Store the selected subject and number of questions in sessionStorage
    sessionStorage.setItem("selectedSubject", selectedSubject);
    sessionStorage.setItem("nQuestions", nQuestions);
    sessionStorage.setItem("style", selectedStyle);
    // Navigate to the quiz page
    window.location.href = "quiz.html";
  } else {
    alert("Please select a subject first.");
  }
}
