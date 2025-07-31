// Create and insert the MAIN button dynamically
function createMainButton() {
  // Check if button already exists to avoid duplicates
  if (document.getElementById("main-btn")) {
    return;
  }

  const mainButton = document.createElement("button");
  mainButton.id = "main-btn";
  mainButton.className = "main-btn small-btn";
  mainButton.textContent = "MAIN";

  mainButton.onclick = function () {
    window.location.href = window.location.origin;
  };

  document.body.appendChild(mainButton);
}

// Create the button when the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createMainButton);
} else {
  createMainButton();
}
