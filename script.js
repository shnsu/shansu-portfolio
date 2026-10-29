
const btn = document.getElementById("menuBtn");
const links = document.getElementById("navLinks");

// ========================================
// MOBILE NAVIGATION
// ========================================

if (btn && links) {
  const menuIcon = btn.querySelector("span");

  btn.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");

    btn.setAttribute("aria-expanded", String(isOpen));

    if (menuIcon) {
      menuIcon.textContent = isOpen ? "－" : "＋";
    }
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");

      if (menuIcon) {
        menuIcon.textContent = "＋";
      }
    });
  });
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${(index % 4) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => {
    item.classList.add("is-visible");
  });
}

// ========================================
// MOTION PREFERENCES
// ========================================

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// ========================================
// PROJECT CARD TILT EFFECT
// ========================================

if (
  !reduceMotion &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches
) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.transform =
        `perspective(900px) ` +
        `rotateY(${x * 2.8}deg) ` +
        `rotateX(${-y * 2.2}deg) ` +
        `translateY(-5px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// ========================================
// PORTFOLIO CHATBOT KNOWLEDGE
// ========================================

const FACTS = [
  {
    keys: ["lab", "clinical", "sample", "capstone", "prisma", "mysql", "hospital"],
    text: "My capstone is a Clinical Laboratory Information System. It uses Angular for the frontend, a Node.js API, and Prisma with MySQL to track samples and consumables such as cotton and syringes. The goal is clearer status tracking and less manual work.",
  },
  {
    keys: ["n-compass", "ncompass", "inventory", "equipment", "utensil", "cebu"],
    text: "For the N-Compass equipment inventory work, I designed the UI in Figma and worked on the Angular frontend for tracking equipment, utensils, and computer parts. The interface helps staff add, update, and find items without relying on manual logs.",
  },
  {
    keys: ["qa", "selenium", "python", "test", "automation", "sdet"],
    text: "I use Python and Selenium for QA automation, focusing on realistic user paths so broken flows and regressions can be caught before release.",
  },
  {
    keys: ["intern", "figma", "angular", "design", "ui"],
    text: "During my internship, I designed screens in Figma and implemented responsive frontend pages with Angular. My process is to plan the interface, then turn the design into a working UI.",
  },
  {
    keys: ["seo", "marketing", "wordpress", "elementor", "zapier", "aloware", "gohighlevel"],
    text: "My digital marketing work included WordPress and Elementor website updates, SEO audits, keyword research, and SMS/email automation workflows using GoHighLevel, Zapier, and Aloware.",
  },
  {
    keys: ["ai", "claude", "chatgpt", "gemini", "copilot", "api", "integrat"],
    text: "For an AI integration, I would send requests through a backend endpoint, for example Node.js, and keep API keys on the server rather than exposing them in the browser.",
  },
  {
    keys: ["stack", "skill", "tech", "language"],
    text: "My toolkit includes HTML, CSS, JavaScript, Angular, React, Node.js, PHP, Python, RESTful API, MySQL, PostgreSQL, Prisma, Selenium, Figma, WordPress, GitHub, and marketing automation tools.",
  },
  {
    keys: ["contact", "email", "hire", "phone", "linkedin", "github"],
    text: "You can reach me at Shansudelacruz@gmail.com, connect on LinkedIn at linkedin.com/in/ronel-dela-cruz, or view GitHub projects at github.com/shnsu.",
  },
  {
    keys: ["school", "educat", "university", "degree"],
    text: "I completed a BS in Information Systems at Carlos Hilado Memorial State University, from 2021 to 2025.",
  },
  {
    keys: ["pos", "cafe", "sales", "postgres"],
    text: "I have also been building a POS and inventory system for a cafe using React, Node.js, and PostgreSQL, with product management, sales recording, and stock deduction workflows.",
  },
];

const FALLBACK =
  "I can share more about the Clinical Laboratory Information System, equipment inventory, Python/Selenium QA, Figma-to-Angular work, websites and marketing automation, or my technical toolkit. Try asking about one of those topics.";

const SUGGESTIONS = [
  "Tell me about the lab system",
  "How do you use Selenium?",
  "What is your tech stack?",
];

const log = document.getElementById("chatLog");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const chips = document.getElementById("chips");

// ========================================
// CHATBOT HELPERS
// ========================================

function addBubble(text, who) {
  if (!log) return null;

  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;

  log.appendChild(el);
  log.scrollTop = log.scrollHeight;

  return el;
}

function answer(question) {
  const normalized = question.toLowerCase();

  const hit = FACTS.find((fact) =>
    fact.keys.some((key) => normalized.includes(key))
  );

  return hit ? hit.text : FALLBACK;
}

function typeBot(text) {
  if (!log) return;

  const el = addBubble("", "bot");
  if (!el) return;

  if (reduceMotion) {
    el.textContent = text;
    log.scrollTop = log.scrollHeight;
    return;
  }

  let i = 0;

  const timer = window.setInterval(() => {
    el.textContent = text.slice(0, ++i);
    log.scrollTop = log.scrollHeight;

    if (i >= text.length) {
      window.clearInterval(timer);
    }
  }, 8);
}

function ask(question) {
  const clean = question.trim();

  if (!clean || !log) return;

  addBubble(clean, "user");

  window.setTimeout(() => {
    typeBot(answer(clean));
  }, 180);
}

// ========================================
// CHATBOT INITIALIZATION
// ========================================

if (log && form && input && chips) {
  SUGGESTIONS.forEach((suggestion) => {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = suggestion;

    button.addEventListener("click", () => {
      ask(suggestion);
    });

    chips.appendChild(button);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    ask(input.value);
    input.value = "";
  });

  addBubble(
    "Hi! I’m a small portfolio guide. Ask about a project, a tool, or how I approach development. Answers are based on prepared portfolio information.",
    "bot"
  );
}

// ========================================
// DISCOURAGE RIGHT-CLICK
// ========================================

// This discourages casual context-menu access.
// It does not protect source code from inspection.

document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// ========================================
// CUSTOM ANIMATED CURSOR
// ========================================

(() => {
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!finePointer || reducedMotion) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";

  const ring = document.createElement("div");
  ring.className = "cursor-ring";

  document.body.append(glow, ring);

  let lastParticleX = 0;
  let lastParticleY = 0;

  document.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;

    glow.style.transform =
      `translate(${x}px, ${y}px) translate(-50%, -50%)`;

    ring.style.transform =
      `translate(${x}px, ${y}px) translate(-50%, -50%)`;

    const distance = Math.hypot(
      x - lastParticleX,
      y - lastParticleY
    );

    if (distance > 12) {
      const particle = document.createElement("div");
      particle.className = "cursor-particle";

      particle.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%)`;

      document.body.appendChild(particle);

      particle.addEventListener("animationend", () => {
        particle.remove();
      });

      lastParticleX = x;
      lastParticleY = y;
    }
  });

  document.addEventListener("mousedown", () => {
    ring.classList.add("clicking");
  });

  document.addEventListener("mouseup", () => {
    ring.classList.remove("clicking");
  });

  document.addEventListener("mouseleave", () => {
    glow.style.display = "none";
    ring.style.display = "none";
  });

  document.addEventListener("mouseenter", () => {
    glow.style.display = "";
    ring.style.display = "";
  });
})();

// ========================================
// DISCOURAGE COMMON DEVTOOLS SHORTCUTS
// ========================================

// Best-effort deterrent only.
// DevTools can still be opened through browser menus or other methods.

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  const devToolsShortcut =
    event.key === "F12" ||
    (event.ctrlKey &&
      event.shiftKey &&
      ["i", "j", "c"].includes(key)) ||
    (event.ctrlKey && key === "u");

  if (devToolsShortcut) {
    event.preventDefault();
    event.stopPropagation();
  }
});

/* ========================================
   WELCOME INTRO BEHAVIOR
======================================== */

(() => {
  const intro = document.getElementById("welcomeIntro");
  const enterButton = document.getElementById("enterPortfolio");

  if (!intro || !enterButton) return;

  document.body.classList.add("intro-active");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  enterButton.addEventListener("click", () => {
    if (intro.classList.contains("intro-exit")) return;

    intro.classList.add("intro-exit");
    document.body.classList.remove("intro-active");

    window.setTimeout(() => {
      intro.remove();
    }, reducedMotion ? 0 : 800);
  });
})();
