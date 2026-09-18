const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openMenuButton = document.getElementById("menu-open");
const closeMenuButton = document.getElementById("menu-close");

const desktopQuery = window.matchMedia("(min-width: 48rem)");

function openMenu() {
  sidebar.classList.add("is-open");
  overlay.hidden = false;
  document.body.classList.add("menu-open");
  openMenuButton.setAttribute("aria-expanded", "true");
  sidebar.setAttribute("aria-hidden", "false");
  closeMenuButton.focus();
}

function closeMenu({ returnFocus = true } = {}) {
  sidebar.classList.remove("is-open");
  overlay.hidden = true;
  document.body.classList.remove("menu-open");
  openMenuButton.setAttribute("aria-expanded", "false");
  sidebar.setAttribute("aria-hidden", "true");

  if (returnFocus) {
    openMenuButton.focus();
  }
}

function handleKeydown(event) {
  if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
    closeMenu();
  }
}

// Keep the sidebar's a11y state correct when crossing the desktop breakpoint
function syncWithScreenSize(event) {
  if (event.matches) {
    closeMenu({ returnFocus: false });
    sidebar.removeAttribute("aria-hidden");
  } else {
    sidebar.setAttribute("aria-hidden", "true");
  }
}

openMenuButton.addEventListener("click", openMenu);
closeMenuButton.addEventListener("click", () => closeMenu());
overlay.addEventListener("click", () => closeMenu());
document.addEventListener("keydown", handleKeydown);
desktopQuery.addEventListener("change", syncWithScreenSize);

syncWithScreenSize(desktopQuery);

// Copy the wifi password to the clipboard
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", () => copyToClipboard(button));
});

async function copyToClipboard(button) {
  const text = button.dataset.copy;
  const originalLabel = button.textContent;

  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    showCopyFeedback(button, "Copied", originalLabel);
  } catch (error) {
    console.error("Clipboard copy failed:", error);
    // navigator.clipboard exists but the write itself failed (e.g. permission denied) — try the fallback before giving up
    const fallbackSucceeded = fallbackCopy(text);
    showCopyFeedback(button, fallbackSucceeded ? "Copied" : "Copy failed", originalLabel);
  }
}

// Legacy fallback for browsers/contexts without navigator.clipboard (e.g. non-HTTPS)
function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // keep it out of the visible layout
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch (error) {
    console.error("Fallback copy failed:", error);
  }

  document.body.removeChild(textarea);
  return succeeded;
}

function showCopyFeedback(button, message, originalLabel) {
  button.textContent = message;
  button.setAttribute("aria-live", "polite"); // announce the change to screen readers too
  setTimeout(() => {
    button.textContent = originalLabel;
  }, 1500);
}