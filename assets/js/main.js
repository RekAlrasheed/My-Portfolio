/* =============================================================
   Rakan Alrasheed — Portfolio interactions
   Vanilla JS, no dependencies.
   ============================================================= */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = $("#theme-button");
  const STORAGE_KEY = "ra-theme";

  const getPreferred = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  applyTheme(getPreferred());

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  const header = $("#header");
  const onScrollHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = $("#nav-toggle");
  const navMenu = $("#nav-menu");
  const closeMenu = () => {
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav__link", navMenu).forEach((link) => link.addEventListener("click", closeMenu));
  }

  /* ---------- Scroll-spy active nav link ---------- */
  const sections = $$("main section[id]");
  const navLinks = new Map($$(".nav__link").map((l) => [l.getAttribute("href"), l]));

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const link = navLinks.get(`#${entry.target.id}`);
        if (!link) return;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          // light stagger for items revealing together
          entry.target.style.transitionDelay = `${Math.min(i * 60, 240)}ms`;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => revealer.observe(el));
  }

  /* ---------- Typed role ---------- */
  const roleEl = $("#role-text");
  if (roleEl && !reduceMotion) {
    // Rotate through fields / subjects of expertise (type out, delete, next).
    const phrases = [
      "AI Automation",
      "Agentic & Multi-Agent Systems",
      "Large Language Models",
      "Reinforcement Learning",
      "Computer Vision",
      "Retrieval-Augmented Generation",
      "Test Automation",
      "Robot Framework",
      "Prompt Engineering",
      "Full-Stack Engineering",
    ];
    let pi = 0, ci = 0, deleting = false;

    const tick = () => {
      const word = phrases[pi];
      ci += deleting ? -1 : 1;
      roleEl.textContent = word.slice(0, ci);

      let delay = deleting ? 45 : 90;
      if (!deleting && ci === word.length) {
        delay = 1600;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    };
    tick();
  } else if (roleEl) {
    roleEl.textContent = "AI Automation & Agentic Systems";
  }

  /* ---------- Project card spotlight ---------- */
  $$(".work-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Contact form → mailto ---------- */
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#name").value.trim();
      const email = $("#email").value.trim();
      const message = $("#message").value.trim();
      const subject = encodeURIComponent(`Portfolio inquiry from ${name || "someone"}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      window.location.href = `mailto:alrasheed.rkan@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
