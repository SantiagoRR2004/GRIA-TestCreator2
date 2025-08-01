// folderLoader.js - Handles loading folder names from database directory

async function loadSubjectFolders() {
  try {
    const currentUrl = window.location.href;
    const isGitHubPages = currentUrl.includes("github.io");

    let folders = [];

    if (isGitHubPages) {
      folders = await loadFromGitHubPages(currentUrl);
    } else {
      folders = await loadFromLocalServer();
    }

    console.log("Found subject folders:", folders);
    populateSubjectDropdown(folders);
    restorePreviousSelection(folders);
  } catch (error) {
    console.error("Error loading folders:", error);
    showFolderLoadError(error.message);
    throw error;
  }
}

async function loadFromGitHubPages(currentUrl) {
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

  console.log(`Detected repository: ${repoOwner}/${repoName}`);

  // Use GitHub API to get folders from the database directory
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/database`;
  console.log("Fetching from API:", apiUrl);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Filter for directories only
  return data.filter((item) => item.type === "dir").map((item) => item.name);
}

async function loadFromLocalServer() {
  // Local/Normal server: Try to discover folders dynamically
  console.log(
    "Running on local server, attempting to discover subject folders",
  );

  try {
    // Try to fetch the directory listing if the server supports it
    const dirResponse = await fetch("database/");

    if (!dirResponse.ok) {
      throw new Error("Directory listing not available");
    }

    const dirText = await dirResponse.text();

    // Parse HTML directory listing for folders
    const parser = new DOMParser();
    const doc = parser.parseFromString(dirText, "text/html");
    const links = doc.querySelectorAll("a[href]");

    const folders = [];
    for (const link of links) {
      const href = link.getAttribute("href");
      // Look for links that end with / (indicating directories) and exclude parent directory
      if (href && href.endsWith("/") && href !== "../" && href !== "./") {
        // Remove the trailing slash
        const folderName = href.slice(0, -1);
        folders.push(folderName);
      }
    }

    console.log("Discovered folders from directory listing:", folders);

    if (folders.length === 0) {
      throw new Error(
        "No subject folders could be discovered in the database directory. Please ensure folders exist and are accessible.",
      );
    }

    return folders;
  } catch (dirError) {
    console.log("Directory listing failed:", dirError.message);
    throw new Error(
      "No subject folders could be discovered in the database directory. Please ensure folders exist and are accessible.",
    );
  }
}

function populateSubjectDropdown(folders) {
  const select = document.getElementById("subject-select");
  select.innerHTML = '<option value="">Select a subject...</option>';

  folders.forEach((folder) => {
    const option = document.createElement("option");
    option.value = folder;
    option.textContent = folder;
    select.appendChild(option);
  });
}

function restorePreviousSelection(folders) {
  const previouslySelected = sessionStorage.getItem("selectedSubject");
  if (previouslySelected && folders.includes(previouslySelected)) {
    const select = document.getElementById("subject-select");
    select.value = previouslySelected;
  }
}

function showFolderLoadError(message) {
  const select = document.getElementById("subject-select");
  select.innerHTML = `<option value="">Error: ${message}</option>`;
}
