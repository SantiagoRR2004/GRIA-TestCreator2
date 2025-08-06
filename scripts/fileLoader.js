// File Loader Module
// Functions to load and manage question files

/**
 * Sets the list of all JSON files in the configured folder
 */
async function getQuestionFiles() {
  try {
    const currentUrl = window.location.href;
    const isGitHubPages = currentUrl.includes("github.io");

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

      folderPath = `https://api.github.com/repos/${repoOwner}/GRIA-TestCreator/contents/${sessionStorage.getItem("selectedSubject")}`;
    } else {
      folderPath =
        "database/" + sessionStorage.getItem("selectedSubject");
    }

    console.log(`Loading files from folder: ${folderPath}`);

    // Try to fetch the directory listing
    try {
      const response = await fetch(folderPath);
      if (response.ok) {
        if (isGitHubPages) {
          const data = await response.json();
          jsonFiles = data
            .filter(
              (item) => item.type === "file" && item.name.endsWith(".json"),
            )
            .map((item) => item.download_url);
        } else {
          const html = await response.text();

          // Extract file links from the HTML directory listing
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const links = doc.querySelectorAll("a[href]");

          jsonFiles = [];
          links.forEach((link) => {
            const href = link.getAttribute("href");
            if (href && href.endsWith(".json")) {
              jsonFiles.push(`${folderPath}/${href}`);
            }
          });
        }

        sessionStorage.setItem("allQuestionFiles", JSON.stringify(jsonFiles));
        console.log(`Found ${jsonFiles.length} JSON files:`, jsonFiles);
      }
    } catch (error) {
      console.log(
        "Directory listing not available, falling back to file discovery",
      );
    }
  } catch (error) {
    console.error("Error getting question files:", error);
  }
}

/**
 * Loads a single JSON file and returns its questions
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<Array>} Array of questions from the file
 */
async function loadQuestionsFromFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const questions = data.questions || [];

    return questions;
  } catch (error) {
    console.error(`Error loading questions from ${filePath}:`, error);
    return [];
  }
}

/**
 * Loads all questions from all JSON files in the configured folder
 */
async function loadAllQuestions() {
  try {
    console.log("Starting to load all questions...");

    // First get all question files
    await getQuestionFiles();
    const questionFiles = JSON.parse(
      sessionStorage.getItem("allQuestionFiles"),
    );

    if (!questionFiles || questionFiles.length === 0) {
      console.warn("No question files found");
      sessionStorage.setItem("allQuestions", JSON.stringify([]));
    }

    // Load questions from all files
    const questionPromises = questionFiles.map((filePath) =>
      loadQuestionsFromFile(filePath),
    );
    const questionArrays = await Promise.all(questionPromises);

    // Flatten all questions into a single array
    const allQuestionsArr = questionArrays.flat();
    sessionStorage.setItem("allQuestions", JSON.stringify(allQuestionsArr));

    console.log(
      `Successfully loaded ${allQuestionsArr.length} total questions from ${questionFiles.length} files`,
    );
    // No return value; questions are stored in sessionStorage
  } catch (error) {
    console.error("Error loading all questions:", error);
  }
}

// Export functions for use in other modules
window.fileLoader = {
  loadQuestionsFromFile,
  loadAllQuestions,
  // Getter functions for sessionStorage data
  getAllQuestions: () => {
    const questions = sessionStorage.getItem("allQuestions");
    return questions ? JSON.parse(questions) : [];
  },
  getAllQuestionFiles: () => {
    const files = sessionStorage.getItem("allQuestionFiles");
    return files ? JSON.parse(files) : [];
  },
};
