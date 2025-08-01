// File Loader Module
// Functions to load and manage question files

/**
 * Sets the list of all JSON files in the configured folder
 */
async function getQuestionFiles() {
  try {
    const folderPath = "database/" + sessionStorage.getItem("selectedSubject");
    console.log(`Loading files from folder: ${folderPath}`);

    // Try to fetch the directory listing
    try {
      const response = await fetch(folderPath);
      if (response.ok) {
        const html = await response.text();

        // Extract file links from the HTML directory listing
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const links = doc.querySelectorAll("a[href]");

        const jsonFiles = [];
        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (href && href.endsWith(".json")) {
            jsonFiles.push(`${folderPath}/${href}`);
          }
        });

        sessionStorage.setItem("allQuestionFiles", JSON.stringify(jsonFiles));
        console.log(
          `Found ${jsonFiles.length} JSON files:`,
          jsonFiles,
        );
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
    const questionFiles = JSON.parse(sessionStorage.getItem("allQuestionFiles"));

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
