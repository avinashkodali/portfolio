/*
  Update these values before publishing.
  Leave optional case study links empty if you do not want those buttons enabled.
*/
const PORTFOLIO_CONFIG = {

  resumeUrl: "assets/Avinash_Kodali_Resume.pdf", // Replace with your PDF export before publishing.
  githubUrl: "https://github.com/avinashkodali",
  linkedinUrl: "https://www.linkedin.com/in/avinashkodali",
  profileImage: "assets/profile.jpg",
  profileImageAlt: "Portrait of Avinash Kodali",
  caseStudies: {
    walmart: "",
    asuPlatform: "",
    forecasting: "",
    adas: ""
  }
};

const themeKey = "avinash-portfolio-theme";
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

function getConfigValue(path) {
  return path.split(".").reduce((value, key) => (value && key in value ? value[key] : ""), PORTFOLIO_CONFIG);
}

function applyExternalLinks() {
  const placeholders = new WeakSet();

  document.querySelectorAll("[data-link-key]").forEach((link) => {
    const value = getConfigValue(link.dataset.linkKey);

    if (value) {
      link.setAttribute("href", value);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noreferrer");
      link.classList.remove("is-placeholder");
      link.removeAttribute("aria-disabled");
      link.removeAttribute("title");

      if (link.dataset.filledLabel) {
        const strong = link.querySelector("strong");
        if (strong) {
          strong.textContent = link.dataset.filledLabel;
        } else {
          link.textContent = link.dataset.filledLabel;
        }
      }
    } else {
      link.setAttribute("href", "#");
      link.classList.add("is-placeholder");
      link.setAttribute("aria-disabled", "true");
      link.setAttribute("title", link.dataset.placeholder || "Update this link in script.js");
      placeholders.add(link);
    }
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-link-key]");
    if (link && placeholders.has(link)) {
      event.preventDefault();
    }
  });
}

function applyProfileImage() {
  const profileContainer = document.querySelector("[data-profile-image]");
  if (!profileContainer || !PORTFOLIO_CONFIG.profileImage) {
    return;
  }

  const image = document.createElement("img");
  image.src = PORTFOLIO_CONFIG.profileImage;
  image.alt = PORTFOLIO_CONFIG.profileImageAlt || "Portrait of Avinash Kodali";
  image.loading = "eager";
  profileContainer.replaceChildren(image);
}

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem(themeKey, theme);

  if (!themeToggle) {
    return;
  }

  const icon = themeToggle.querySelector(".theme-toggle__icon");
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  if (icon) {
    icon.textContent = theme === "dark" ? "☀" : "☾";
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem(themeKey);
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const initialTheme = savedTheme || (systemPrefersLight ? "light" : "dark");
  setTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") || "dark";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
}

function closeMenu() {
  navMenu?.classList.remove("is-open");
  navToggle?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

function initializeNavigation() {
  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 860) {
        closeMenu();
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      closeMenu();
    }
  });
}

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -5% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initializeTypewriter() {
  const typewriterElement = document.querySelector("[data-typewriter]");
  if (!typewriterElement) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const words = typewriterElement.dataset.typewriter
    .split("|")
    .map((word) => word.trim())
    .filter(Boolean);

  if (!words.length) {
    return;
  }

  let wordIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const type = () => {
    const currentWord = words[wordIndex];

    if (!deleting) {
      characterIndex += 1;
      typewriterElement.textContent = currentWord.slice(0, characterIndex);

      if (characterIndex === currentWord.length) {
        deleting = true;
        window.setTimeout(type, 1300);
        return;
      }

      window.setTimeout(type, 75);
      return;
    }

    characterIndex -= 1;
    typewriterElement.textContent = currentWord.slice(0, characterIndex);

    if (characterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      window.setTimeout(type, 240);
      return;
    }

    window.setTimeout(type, 42);
  };

  typewriterElement.textContent = "";
  window.setTimeout(type, 300);
}

function initializeContactForm() {
  const form = document.getElementById("contact-form");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const subject = form.elements["subject"].value.trim() || "Portfolio Contact";
    const message = form.elements["message"].value.trim();

    const body = `Hi Avinash,\n\n${message}\n\nFrom,\n${name}\n${email}`;
    const mailtoLink = `mailto:avinashkodali45@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  });
}

function initializeFooterYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
}

applyExternalLinks();
applyProfileImage();
initializeTheme();
initializeNavigation();
initializeRevealAnimations();
initializeTypewriter();
initializeContactForm();
initializeFooterYear();
