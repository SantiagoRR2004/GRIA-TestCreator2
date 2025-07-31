// File Loader Module
// Functions to load and manage question files

// Global variables to store loaded data
let allQuestionFiles = [];
let allQuestions = [];

/**
 * Gets the list of all JSON files in the configured folder
 * @returns {Promise<Array>} Array of file paths
 */
async function getQuestionFiles() {
  try {
    const folderPath = QUIZ_CONFIG.folder;
    console.log(`Loading files from folder: ${folderPath}`);
    
    // Try to fetch the directory listing
    try {
      const response = await fetch(folderPath);
      if (response.ok) {
        const html = await response.text();
        
        // Extract file links from the HTML directory listing
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href]');
        
        const jsonFiles = [];
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.endsWith('.json')) {
            jsonFiles.push(`${folderPath}/${href}`);
          }
        });
        
        allQuestionFiles = jsonFiles;
        console.log(`Found ${allQuestionFiles.length} JSON files:`, allQuestionFiles);
        return allQuestionFiles;
      }
    } catch (error) {
      console.log("Directory listing not available, falling back to file discovery");
    }
  }
  catch (error) {
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
    console.log(`Loading questions from: ${filePath}`);
    
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const questions = data.questions || [];
    
    console.log(`Loaded ${questions.length} questions from ${filePath}`);
    return questions;
    
  } catch (error) {
    console.error(`Error loading questions from ${filePath}:`, error);
    return [];
  }
}

/**
 * Loads all questions from all JSON files in the configured folder
 * @returns {Promise<Array>} Array of all questions from all files
 */
async function loadAllQuestions() {
  try {
    console.log("Starting to load all questions...");
    
    // First get all question files
    await getQuestionFiles();
    
    if (allQuestionFiles.length === 0) {
      console.warn("No question files found");
      return [];
    }
    
    // Load questions from all files
    const questionPromises = allQuestionFiles.map(filePath => loadQuestionsFromFile(filePath));
    const questionArrays = await Promise.all(questionPromises);
    
    // Flatten all questions into a single array
    allQuestions = questionArrays.flat();
    
    console.log(`Successfully loaded ${allQuestions.length} total questions from ${allQuestionFiles.length} files`);
    return allQuestions;
    
  } catch (error) {
    console.error("Error loading all questions:", error);
    return [];
  }
}

// Export functions for use in other modules
window.fileLoader = {
  getQuestionFiles,
  loadQuestionsFromFile,
  loadAllQuestions,
  // Getter functions for the global variables
  getAllQuestions: () => allQuestions,
  getAllQuestionFiles: () => allQuestionFiles,
};
