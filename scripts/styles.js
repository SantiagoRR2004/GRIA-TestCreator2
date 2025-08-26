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

// Save current style to session storage
function saveCurrentStyle(styleName) {
  sessionStorage.setItem("style", styleName);
}

// Get current style from session storage
function getCurrentStyle() {
  return sessionStorage.getItem("style");
}

// Switch to next available style
function switchStyle() {
  const styles = getStylesFromSession();
  const styleNames = getAvailableStyleNames();

  if (styleNames.length === 0) return;

  const currentStyle = getCurrentStyle();
  const currentIndex = styleNames.indexOf(currentStyle);
  const nextIndex = (currentIndex + 1) % styleNames.length;
  const nextStyle = styleNames[nextIndex];

  // Apply the new style
  const existingLinks = document.querySelectorAll("link[data-style-switcher]");
  existingLinks.forEach((link) => link.remove());

  const stylePath = getStylePath(nextStyle);
  if (stylePath) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylePath;
    link.setAttribute("data-style-switcher", "true");
    document.head.appendChild(link);

    // Save the new current style
    saveCurrentStyle(nextStyle);
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

// Create the button when the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createStyleButton);
} else {
  createStyleButton();
}
