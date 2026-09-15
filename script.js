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
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      const original = button.textContent;
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    } catch (error) {
      console.error("Clipboard copy failed:", error);
    }
  });
});