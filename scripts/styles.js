// Gets the styles dictionary from session storage
function getStylesFromSession() {
  const stylesJson = sessionStorage.getItem("stylesDict");
  return stylesJson ? JSON.parse(stylesJson) : {};
}

// Gets a style path by its name from session storage
function getStylePath(styleName) {
  const stylesDict = getStylesFromSession();
  return stylesDict[styleName] || null;
}

// Gets all available style names from session storage
function getAvailableStyleNames() {
  const stylesDict = getStylesFromSession();
  return Object.keys(stylesDict);
}

// Save current style to session storage (stores the file path)
function saveCurrentStyle(stylePath) {
  sessionStorage.setItem("style", stylePath);
}

// Get current style from session storage (returns the file path)
function getCurrentStyle() {
  return sessionStorage.getItem("style");
}

// Get current style name from session storage
function getCurrentStyleName() {
  const currentStylePath = getCurrentStyle();
  if (!currentStylePath) return null;
  
  const stylesDict = getStylesFromSession();
  // Find the style name that corresponds to the current path
  for (const [styleName, stylePath] of Object.entries(stylesDict)) {
    if (stylePath === currentStylePath) {
      return styleName;
    }
  }
  return null;
}

// Switch to next available style
function switchStyle() {
  const stylesDict = getStylesFromSession();
  const styleNames = getAvailableStyleNames();

  if (styleNames.length === 0) return;

  const currentStyleName = getCurrentStyleName();
  const currentIndex = styleNames.indexOf(currentStyleName);
  const nextIndex = (currentIndex + 1) % styleNames.length;
  const nextStyleName = styleNames[nextIndex];

  // Apply the new style
  const existingLinks = document.querySelectorAll("link[data-style-switcher]");
  existingLinks.forEach((link) => link.remove());

  const stylePath = getStylePath(nextStyleName);
  if (stylePath) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylePath;
    link.setAttribute("data-style-switcher", "true");
    document.head.appendChild(link);

    // Save the new current style (save the path, not the name)
    saveCurrentStyle(stylePath);
    
    console.log(`Switched to style: ${nextStyleName} (${stylePath})`);
  }
}

// Apply the current style from session storage
function applyCurrentStyle() {
  const currentStylePath = getCurrentStyle();
  if (currentStylePath) {
    // Remove any existing style switcher links
    const existingLinks = document.querySelectorAll("link[data-style-switcher]");
    existingLinks.forEach((link) => link.remove());
    
    // Apply the current style
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = currentStylePath;
    link.setAttribute("data-style-switcher", "true");
    document.head.appendChild(link);
    
    console.log(`Applied current style: ${currentStylePath}`);
  }
}

// Create style switch button similar to back button
function createStyleButton() {
  // Check if button already exists to avoid duplicates
  if (document.getElementById("style-btn")) {
    return;
  }

  const styleButton = document.createElement("button");
  styleButton.id = "style-btn";
  styleButton.className = "style-btn small-btn";
  styleButton.textContent = "STYLE";

  styleButton.onclick = function () {
    switchStyle();
  };

  document.body.appendChild(styleButton);
}

// Apply current style and create button when the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    applyCurrentStyle();
    createStyleButton();
  });
} else {
  applyCurrentStyle();
  createStyleButton();
}
