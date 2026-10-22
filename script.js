const btn = document.getElementById("menuBtn");
const links = document.getElementById("navLinks");

if (btn && links) {
  btn.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(isOpen));
    btn.querySelector("span").textContent = isOpen ? "－" : "＋";
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.querySelector("span").textContent = "＋";
    });
  });
}

// Reveal sections as they enter the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Gentle 3D tilt on desktop project cards; disabled for touch/reduced-motion users.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 2.8}deg) rotateX(${-y * 2.2}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
}

const FACTS = [
  { keys: ["lab", "clinical", "sample", "capstone", "prisma", "mysql", "hospital"],
    text: "My capstone is a Clinical Laboratory Information System. It uses Angular for the frontend, a Node.js API, and Prisma with MySQL to track samples and consumables such as cotton and syringes. The goal is clearer status tracking and less manual work." },
  { keys: ["n-compass", "ncompass", "inventory", "equipment", "utensil", "cebu"],
    text: "For the N-Compass equipment inventory work, I designed the UI in Figma and worked on the Angular frontend for tracking equipment, utensils, and computer parts. The interface helps staff add, update, and find items without relying on manual logs." },
  { keys: ["qa", "selenium", "python", "test", "automation", "sdet"],
    text: "I use Python and Selenium for QA automation, focusing on realistic user paths so broken flows and regressions can be caught before release." },
  { keys: ["intern", "figma", "angular", "design", "ui"],
    text: "During my internship, I designed screens in Figma and implemented responsive frontend pages with Angular. My process is to plan the interface, then turn the design into a working UI." },
  { keys: ["seo", "marketing", "wordpress", "elementor", "zapier", "aloware", "gohighlevel"],
    text: "My digital marketing work included WordPress and Elementor website updates, SEO audits, keyword research, and SMS/email automation workflows using GoHighLevel, Zapier, and Aloware." },
  { keys: ["ai", "claude", "chatgpt", "gemini", "copilot", "api", "integrat"],
    text: "For an AI integration, I would send requests through a backend endpoint (for example, Node.js) and keep API keys on the server rather than exposing them in the browser." },
  { keys: ["stack", "skill", "tech", "language"],
    text: "My toolkit includes HTML, CSS, JavaScript, Angular, React, Node.js, PHP, Python, MySQL, PostgreSQL, Prisma, Selenium, Figma, WordPress, GitHub, and marketing automation tools." },
  { keys: ["contact", "email", "hire", "phone", "linkedin", "github"],
    text: "You can reach me at Shansudelacruz@gmail.com, connect on LinkedIn at linkedin.com/in/ronel-dela-cruz, or view GitHub projects at github.com/shnsu." },
  { keys: ["school", "educat", "university", "degree"],
    text: "I completed a BS in Information Systems at Carlos Hilado Memorial State University, from 2021 to 2025." },
  { keys: ["pos", "cafe", "sales", "postgres"],
    text: "I have also been building a POS and inventory system for a cafe using React, Node.js, and PostgreSQL, with product management, sales recording, and stock deduction workflows." }
];

const FALLBACK = "I can share more about the Clinical Laboratory Information System, equipment inventory, Python/Selenium QA, Figma-to-Angular work, websites and marketing automation, or my technical toolkit. Try asking about one of those topics.";
const SUGGESTIONS = [
  "Tell me about the lab system",
  "How do you use Selenium?",
  "What is your tech stack?"
];
const log = document.getElementById("chatLog");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const chips = document.getElementById("chips");

function addBubble(text, who) {
  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}
function answer(question) {
  const normalized = question.toLowerCase();
  const hit = FACTS.find((fact) => fact.keys.some((key) => normalized.includes(key)));
  return hit ? hit.text : FALLBACK;
}
function typeBot(text) {
  const el = addBubble("", "bot");
  // Respect reduced motion and avoid a long character-by-character wait for long answers.
  if (reduceMotion) {
    el.textContent = text;
    log.scrollTop = log.scrollHeight;
    return;
  }
  let i = 0;
  const timer = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    log.scrollTop = log.scrollHeight;
    if (i >= text.length) clearInterval(timer);
  }, 8);
}
function ask(question) {
  const clean = question.trim();
  if (!clean) return;
  addBubble(clean, "user");
  window.setTimeout(() => typeBot(answer(clean)), 180);
}
if (log && form && input && chips) {
  SUGGESTIONS.forEach((suggestion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = suggestion;
    button.addEventListener("click", () => ask(suggestion));
    chips.appendChild(button);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
  });
  addBubble("Hi! I’m a small portfolio guide. Ask about a project, a tool, or how I approach development. Answers are based on prepared portfolio information.", "bot");
}

document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
