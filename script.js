/* =========================================================
   TheKage Gym — script.js (vanilla JavaScript)
   ========================================================= */

/* ---------- Easy-to-edit settings ---------- */
// Add your real social media URLs here. Empty links are hidden automatically.
const SOCIAL_LINKS = {
  Instagram: "",
  Facebook: "",
  TikTok: "",
  YouTube: ""
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link-item");
  const backToTop = document.getElementById("backToTop");

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Social links ---------- */
  const socialList = document.getElementById("socialLinks");
  Object.entries(SOCIAL_LINKS).forEach(([name, url]) => {
    if (!url) return;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = url;
    a.textContent = name;
    a.target = "_blank";
    a.rel = "noopener";
    li.appendChild(a);
    socialList.appendChild(li);
  });
  if (!socialList.children.length) socialList.remove();

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }
  navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
  navLinks.forEach(l => l.addEventListener("click", () => setMenu(false)));
  document.querySelector(".nav-cta").addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      setMenu(false);
      navToggle.focus();
    }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 991) setMenu(false); });

  /* ---------- Scroll: sticky header + back to top ---------- */
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    backToTop.classList.toggle("show", y > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  /* ---------- Active nav link ---------- */
  const sections = ["home", "programs", "about", "contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => navObs.observe(s));
  }

  /* ---------- Contact form (demo only — nothing is sent) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  const rules = {
    fullName: v => v.trim().length >= 2 ? "" : "Please enter your full name.",
    phone: v => {
      const digits = v.replace(/[\s\-()+]/g, "");
      return /^\d{10,13}$/.test(digits) ? "" : "Enter a valid phone number (10–13 digits).";
    },
    service: v => v ? "" : "Please choose a service.",
    message: v => v.trim().length >= 10 ? "" : "Please write at least 10 characters."
  };

  function validateField(name) {
    const field = form.elements[name];
    const error = rules[name](field.value);
    document.getElementById(name + "Error").textContent = error;
    field.classList.toggle("invalid", Boolean(error));
    field.setAttribute("aria-invalid", error ? "true" : "false");
    if (error) field.setAttribute("aria-describedby", name + "Error");
    return !error;
  }

  Object.keys(rules).forEach(name => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(name));
    field.addEventListener("input", () => {
      if (field.classList.contains("invalid")) validateField(name);
    });
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    status.textContent = "";
    const results = Object.keys(rules).map(validateField);
    if (results.every(Boolean)) {
      status.textContent = "Thanks! This is a demo form, so your message was not sent. Please call or WhatsApp the gym to get in touch.";
      form.reset();
    } else {
      const firstBad = form.querySelector(".invalid");
      if (firstBad) firstBad.focus();
      status.textContent = "Please fix the highlighted fields.";
    }
  });
});
