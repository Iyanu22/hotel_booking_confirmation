# Frontend Mentor - Hotel booking confirmation page solution

This is a solution to the [Hotel booking confirmation page challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/hotel-booking-confirmation-page). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Open and close the navigation menu on smaller screens
- Copy the Wi-Fi password to their clipboard using the copy button

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [Add your Frontend Mentor solution URL here]
- Live Site URL: [Add your deployed URL here]

## My process

### Built with

- Semantic HTML5 markup
- SCSS (variables, nesting, `@media` queries) compiled to CSS
- Flexbox for component-level layout
- CSS Grid for the desktop sidebar/main-content shell
- Mobile-first workflow
- Vanilla JavaScript — menu open/close state, keyboard support, and the Clipboard API for the Wi-Fi password copy button

### What I learned

I started by building this for desktop only, then went back to make it responsive — and that order caused most of the real bugs, so it's the main thing I'm taking away.

**Nested SCSS selectors compile to descendant selectors by default.** I had markup like `<aside class="sidebar" id="sidebar">`, where `sidebar` is a class on the element itself — but my SCSS nested `.sidebar` *inside* an `aside { }` block, which compiles to `.container aside .sidebar`. That selector requires `.sidebar` to be a *child* of `aside`, not the same element, so it silently matched nothing. The fixed positioning, slide-in transform, and `.is-open` toggle never applied, and there was no error anywhere — the styles just didn't exist. Retrofitting mobile behaviour onto desktop-first SCSS made this easy to miss, because the base (desktop) rules still rendered fine and hid the problem:

```scss
// Before — never matches anything, because .sidebar IS the <aside>, not a descendant of it
aside {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
}

// After — matches the element directly
aside.sidebar {
  position: fixed;
  transform: translateX(-100%);
}
```

**The `&` symbol matters more than I realized.** `&` stands in for the parent selector with no space, which is required for modifier classes, pseudo-classes, and JS-toggled state classes:

```scss
.sidebar {
  &.is-open { transform: translateX(0); } // compiles to .sidebar.is-open — same element
}
```

Without `&`, that would compile to `.sidebar .is-open` — a descendant with a different class — which is the exact same category of bug as the one above.

**Rebuilding mobile-first instead of retrofitting fixed the root cause, not just the symptom.** Writing base styles for the smallest screen first and adding complexity at `min-width: 48rem` meant every rule had an obvious, single place it belonged, so there was no more guessing about how deep to nest something.

**Naming conventions prevent this class of bug.** Switching to BEM-style names (`.receipt__title`, `.info-card--wifi`) meant every class name encodes its own place in the hierarchy, so it's much harder to accidentally nest something one level too deep without noticing.

**Accessibility is cheap to build in, expensive to retrofit.** Adding `aria-expanded`, `aria-hidden`, `:focus-visible` outlines, an `Escape`-to-close handler, and focus management (moving focus into the menu on open, back to the trigger on close) took very little extra code once the component structure was already right — but would have meant re-touching every interactive element if I'd added it after the fact.

### Continued development

- Test the responsive breakpoints on real devices, not just by resizing a desktop browser window — the in-between widths are where layout bugs like the one above tend to hide.
- Add a `prefers-reduced-motion` check for anyone with that OS setting on, so the slide-in menu animation doesn't play for them.
- Try rebuilding this same challenge in React/Next.js — my usual stack — to compare how much of the accessibility work (focus trapping, `aria-*` sync) a component model handles for free versus by hand.
- Get more disciplined about compiling and opening the page after every meaningful SCSS change, rather than at the end of a session — that's what let the sidebar bug sit unnoticed for a while.

### AI Collaboration

I used Claude (Anthropic) throughout this build, in a few distinct ways:

- **Debugging**: I pasted my existing HTML/SCSS/JS and asked what was wrong. Claude traced the mobile menu failure back to the SCSS nesting issue described above, rather than just patching the symptom, and explained *why* the selector didn't match instead of only handing me a fix.

What worked well: getting a direct explanation of *why* something broke, not just a corrected file — that's what let me apply the same fix pattern (checking whether a nested selector's DOM assumption actually matches the markup) on my own afterward.

What I'd do differently: I gave Claude the finished mobile/desktop mockups partway through rather than at the start, which meant an earlier debugging pass was working from an incomplete picture of the target design. 

## Author

- Frontend Mentor - [@Iyanuoluwa](https://www.frontendmentor.io/profile/Iyanuoluwa) *(update with your actual username)*
