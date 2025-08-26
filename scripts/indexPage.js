// indexPage.js - Index page initialization and event handling

/**
 * Initializes repository information and stores it in session storage
 */
function initializeRepositoryInfo() {
  // Check if repository info is already stored
  const storedIsGitHubPages = sessionStorage.getItem("isGitHubPages");
  if (storedIsGitHubPages !== null) {
    return; // Already initialized
  }

  const currentUrl = window.location.href;
  const isGitHubPages = currentUrl.includes("github.io");

  sessionStorage.setItem("isGitHubPages", isGitHubPages.toString());

  if (isGitHubPages) {
    const urlParts = new URL(currentUrl);
    const pathParts = urlParts.pathname
      .split("/")
      .filter((part) => part.length > 0);

    let repoOwner, repoName;

    if (urlParts.hostname.includes("github.io")) {
      // Standard GitHub Pages: username.github.io/repo-name
      repoOwner = urlParts.hostname.split(".")[0];
      repoName = pathParts[0];
    } else {
      throw new Error("Unable to parse GitHub Pages URL format: " + currentUrl);
    }

    if (!repoOwner || !repoName) {
      throw new Error(
        "Could not extract repository information from URL: " + currentUrl,
      );
    }

    sessionStorage.setItem("repoOwner", repoOwner);
    sessionStorage.setItem("repoName", repoName);
  }
}

function initializeIndexPage() {
  // Initialize repository information first
  initializeRepositoryInfo();
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

// Dynamically load available styles from the styles folder, populate the dropdown,
// and store styles as a dictionary in session storage
async function loadAvailableStyles() {
  const styleSelect = document.getElementById("style-select");
  if (!styleSelect) return;

  styleSelect.innerHTML = '<option value="">Loading styles...</option>';
  try {
    const currentUrl = window.location.href;
    const isGitHubPages = currentUrl.includes("github.io");

    if (isGitHubPages) {
      styleFiles = await loadAvailableStylesGitHubPages(currentUrl);
    } else {
      styleFiles = await loadAvailableStylesLocalServer();
    }

    // Create styles dictionary with name as key and full path as value
    const stylesDict = {};
    styleFiles.forEach((file) => {
      // Extract only the filename (after the last slash) and remove .css
      const styleName = decodeURIComponent(file)
        .split("/")
        .pop()
        .replace(/\.css$/, "");
      stylesDict[styleName] = file;
    });

    // Sort the styles dictionary alphabetically by keys
    const sortedStylesDict = {};
    Object.keys(stylesDict)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
      .forEach((key) => {
        sortedStylesDict[key] = stylesDict[key];
      });

    // Store sorted styles dictionary in session storage
    sessionStorage.setItem("stylesDict", JSON.stringify(sortedStylesDict));
    console.log(
      "Styles dictionary stored in session storage:",
      sortedStylesDict,
    );

    styleSelect.innerHTML = "";
    Object.entries(sortedStylesDict).forEach(([styleName, filePath]) => {
      const option = document.createElement("option");
      option.value = filePath;
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

async function loadAvailableStylesGitHubPages(currentUrl) {
  // GitHub Pages: Use GitHub API
  const urlParts = new URL(currentUrl);
  const pathParts = urlParts.pathname
    .split("/")
    .filter((part) => part.length > 0);

  let repoOwner, repoName;

  if (urlParts.hostname.includes("github.io")) {
    // Standard GitHub Pages: username.github.io/repo-name
    repoOwner = urlParts.hostname.split(".")[0];
    repoName = pathParts[0];
  } else {
    throw new Error("Unable to parse GitHub Pages URL format: " + currentUrl);
  }

  if (!repoOwner || !repoName) {
    throw new Error(
      "Could not extract repository information from URL: " + currentUrl,
    );
  }

  // Use GitHub API to get the files in the styles directory
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/styles`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch styles from GitHub API: ${response.statusText}`,
    );
  }
  const files = await response.json();

  // Only keep .css files
  const cssFiles = files
    .filter((file) => file.type === "file" && file.name.endsWith(".css"))
    .map((file) => {
      // Construct the URL with properly encoded filename
      return `https://${repoOwner}.github.io/${repoName}/styles/${encodeURIComponent(file.name)}`;
    });

  if (cssFiles.length === 0) {
    throw new Error(
      "No CSS styles found in the GitHub repository styles directory",
    );
  }

  return cssFiles;
}

async function loadAvailableStylesLocalServer() {
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
    .map((href) => `styles/${decodeURIComponent(href)}`);

  if (styleFiles.length === 0) {
    throw new Error("No styles found in the styles directory");
  }
  return styleFiles;
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
