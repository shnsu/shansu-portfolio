const btn = document.getElementById("menuBtn");
const links = document.getElementById("navLinks");
btn.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => links.classList.remove("open"));
});

const FACTS = [
  {
    keys: ["lab", "clinical", "sample", "capstone", "prisma", "mysql", "hospital"],
    text: "My capstone is a Clinical Laboratory Information System. I designed the UI and built it full-stack: Angular on the front, Node.js API, Prisma + MySQL for samples and consumables like cotton and syringes. Goal: less manual tracking and clearer status for lab staff.",
  },
  {
    keys: ["n-compass", "ncompass", "inventory", "react", "equipment", "utensil", "cebu"],
    text: "At N-Compass TV in Cebu I work as a software engineer. I built a React inventory front end for equipment, utensils, and computer parts so staff can add, update, and find items without manual logs.",
  },
  {
    keys: ["qa", "selenium", "python", "test", "automation", "sdet"],
    text: "On the engineering side at N-Compass I write QA automation with Python and Selenium. I cover real user paths so regressions, broken flows, and performance issues show up before release.",
  },
  {
    keys: ["intern", "figma", "angular", "design", "ui"],
    text: "During my internship I designed screens in Figma, then implemented them in Angular as responsive front-end pages. Prototype first, then working UI with the team.",
  },
  {
    keys: ["seo", "marketing", "wordpress", "elementor"],
    text: "In my current SEO and digital marketing support work I improve page structure, accessibility, and content flow so sites stay usable and easier to find.",
  },
  {
    keys: ["ai", "claude", "chatgpt", "gemini", "copilot", "api", "integrat"],
    text: "I use ChatGPT, Claude, Gemini, and Copilot to move faster. For a product integration I would add a Node endpoint that sends a record to an LLM API and returns a summary into Angular. I would not put API keys in the browser.",
  },
  {
    keys: ["stack", "skill", "tech", "language"],
    text: "Stack I use: HTML, CSS, JavaScript, Angular 14, React, Node.js, PHP, Python, MySQL, Prisma, Selenium, Figma, WordPress, GitHub.",
  },
  {
    keys: ["contact", "email", "hire", "phone", "linkedin"],
    text: "Email Shansudelacruz@gmail.com, phone +63 956 366 3657, or LinkedIn linkedin.com/in/ronel-dela-cruz. Based in Silay City, Negros Occidental, Philippines.",
  },
  {
    keys: ["school", "educat", "university", "degree"],
    text: "BS Information Systems, Carlos Hilado Memorial State University, 2021–2025.",
  },
];

const FALLBACK =
  "I can talk about the lab system, N-Compass inventory, Python/Selenium QA, the Figma-to-Angular internship, my stack, or how I would add an LLM API. Try one of those.";

const SUGGESTIONS = [
  "What did you build for the lab?",
  "How do you use Selenium?",
  "How would you add ChatGPT to an app?",
  "What is your stack?",
];

const log = document.getElementById("chatLog");
const form = document.getElementById("chatForm");
const input = document.getElementById("chatInput");
const chips = document.getElementById("chips");

function addBubble(text, who) {
  const el = document.createElement("div");
  el.className = "bubble " + who;
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
  return el;
}

function answer(q) {
  const s = q.toLowerCase();
  const hit = FACTS.find((f) => f.keys.some((k) => s.includes(k)));
  return hit ? hit.text : FALLBACK;
}

function typeBot(text) {
  const el = addBubble("", "bot");
  let i = 0;
  const t = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    log.scrollTop = log.scrollHeight;
    if (i >= text.length) clearInterval(t);
  }, 12);
}

function ask(q) {
  addBubble(q, "user");
  setTimeout(() => typeBot(answer(q)), 250);
}

SUGGESTIONS.forEach((s) => {
  const b = document.createElement("button");
  b.type = "button";
  b.textContent = s;
  b.addEventListener("click", () => ask(s));
  chips.appendChild(b);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;
  input.value = "";
  ask(q);
});

addBubble(
  "Hi — I’m a guided assistant over Ronel’s work. Ask about the lab system, N-Compass, QA automation, or how he’d hook an AI API into a Node + Angular app.",
  "bot"
);
