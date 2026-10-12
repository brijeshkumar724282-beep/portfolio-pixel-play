const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const blob = document.getElementById("blob");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => mobileMenu.classList.remove("open"));
  });
}

// smooth scroll with offset for sticky pill nav
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length > 1) {
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  });
});

// cursor blob follows mouse
if (window.matchMedia("(hover:hover)").matches && blob) {
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
  (function follow() {
    x += (tx - x) * 0.2;
    y += (ty - y) * 0.2;
    blob.style.transform = "translate(" + (x - 13) + "px," + (y - 13) + "px)";
    requestAnimationFrame(follow);
  })();
  document.querySelectorAll("a, button, .card").forEach((el) => {
    el.addEventListener("mouseenter", () => { blob.style.background = "#FFC531"; blob.style.width = "38px"; blob.style.height = "38px"; });
    el.addEventListener("mouseleave", () => { blob.style.background = "#FF5C39"; blob.style.width = "26px"; blob.style.height = "26px"; });
  });
}

// work filter
const chips = document.querySelectorAll(".chip");
const cards = document.querySelectorAll("#workGrid .card");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");
    const f = chip.dataset.filter;
    cards.forEach((card) => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("hide", !show);
      if (show) {
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = "pop .35s ease";
      }
    });
  });
});

// testimonials slider with auto rotate
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let idx = 0;
let timer = null;

slides.forEach((_, i) => {
  const d = document.createElement("button");
  d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
  if (i === 0) d.classList.add("on");
  d.addEventListener("click", () => { go(i); restart(); });
  dotsWrap.appendChild(d);
});
const dots = Array.from(dotsWrap.children);

function go(n) {
  idx = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("active", i === idx));
  dots.forEach((d, i) => d.classList.toggle("on", i === idx));
}
function restart() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => go(idx + 1), 4500);
}
if (prevBtn) prevBtn.addEventListener("click", () => { go(idx - 1); restart(); });
if (nextBtn) nextBtn.addEventListener("click", () => { go(idx + 1); restart(); });
restart();

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add("in");
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// contact validation
const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("fName");
    const email = document.getElementById("fEmail");
    const msg = document.getElementById("fMsg");
    const eName = document.getElementById("eName");
    const eEmail = document.getElementById("eEmail");
    const eMsg = document.getElementById("eMsg");
    const ok = document.getElementById("formOk");
    let valid = true;
    eName.textContent = ""; eEmail.textContent = ""; eMsg.textContent = ""; ok.textContent = "";

    if (name.value.trim().length < 2) { eName.textContent = "Please add your name."; valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { eEmail.textContent = "Please add a valid email."; valid = false; }
    if (msg.value.trim().length < 10) { eMsg.textContent = "Tell me a little more, 10 plus characters."; valid = false; }

    if (valid) {
      ok.textContent = "Message sent. Thanks for saying hello. I reply soon.";
      form.reset();
    }
  });
}

// back to top + year
const toTop = document.getElementById("toTop");
if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
const yr = document.getElementById("year");
if (yr) yr.textContent = new Date().getFullYear();
