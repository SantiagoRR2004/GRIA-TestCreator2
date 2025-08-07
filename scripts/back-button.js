// Create and insert the BACK button dynamically
function createBackButton() {
  // Check if button already exists to avoid duplicates
  if (document.getElementById("back-btn")) {
    return;
  }

  const backButton = document.createElement("button");
  backButton.id = "back-btn";
  backButton.className = "back-btn small-btn";
  backButton.textContent = "BACK";

  backButton.onclick = function () {
    window.location.href = "index.html";
  };

  document.body.appendChild(backButton);
}

// Create the button when the DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createBackButton);
} else {
  createBackButton();
}
