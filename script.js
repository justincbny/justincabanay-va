const CONFIG = {
  WEB3FORMS_ACCESS_KEY: "REPLACE_WITH_YOUR_WEB3FORMS_KEY",
  CALENDLY_URL: "https://calendly.com/justin-cabanay/15min"
};

/* ==========================================================================
   Justin Cabanay — Virtual Assistant Portfolio
   Vanilla ES6+. Only external dependency: Lucide (CDN).
   ========================================================================== */

/* ---------------------------- Case study data ---------------------------- */
const SAMPLES = [
  {
    title: "Inbox Zero Folder & Label Architecture",
    category: "Email Systems",
    key: "email",
    file: "assets/sample-email-1.webp",
    challenge:
      "A 4,200-message inbox with no priority signal. Client threads sat beside newsletters, urgent asks were buried for days, and every morning opened with twenty minutes of scrolling before any real work started.",
    tools: ["Gmail", "Filters & Labels", "Notion SOP"],
    result:
      "Inbox Zero reached in 11 days and held. Average first-response time dropped from 26 hours to 90 minutes, with a documented triage rule the client now runs without me."
  },
  {
    title: "Automated Client Triage & Canned Templates",
    category: "Email Systems",
    key: "email",
    file: "assets/sample-email-2.webp",
    challenge:
      "Every new client was onboarded from scratch — seven to eight back-and-forth emails, inconsistent asset requests, and a kickoff that routinely slipped a full week.",
    tools: ["Gmail Templates", "HubSpot", "Google Forms"],
    result:
      "Onboarding dropped from 7 emails to 2. New-client setup time fell 68%, and every signed client now receives the same complete intake on day one."
  },
  {
    title: "30-Day Brand Content Calendar & Grid",
    category: "Social Media",
    key: "social",
    file: "assets/sample-social-1.webp",
    challenge:
      "Posting depended on whoever had five spare minutes. The grid looked accidental, captions were written the same day, and three weeks out of four finished short of the target cadence.",
    tools: ["Canva", "Meta Business Suite", "Notion"],
    result:
      "A full 30-day calendar approved in one 45-minute review. Posting consistency went from 24 of 30 days to 30 of 30, with branded templates reused every month."
  },
  {
    title: "Carousel Campaign & Engagement Report",
    category: "Social Media",
    key: "social",
    file: "assets/sample-social-2.webp",
    challenge:
      "Engagement had gone flat and nobody could explain why. There was no design system, no caption structure, and no reporting beyond follower counts.",
    tools: ["Canva", "Figma", "Meta Insights"],
    result:
      "Carousel engagement rate rose 3.4× across a six-week campaign. Monthly reporting now takes under 20 minutes because the metrics template fills itself."
  },
  {
    title: "Executive Time-Blocked Weekly Master Schedule",
    category: "Calendar & Ops",
    key: "calendar",
    file: "assets/sample-calendar-1.webp",
    challenge:
      "Back-to-back calls from 9am to 6pm, no focus blocks, and repeated double-bookings whenever a client in another timezone proposed a slot.",
    tools: ["Google Calendar", "Calendly", "World Time Buddy"],
    result:
      "12 hours of protected deep work restored every week and zero double-bookings across 90 days. All meeting requests now route through one intake link."
  },
  {
    title: "Notion Daily Executive Brief & SOP Hub",
    category: "Calendar & Ops",
    key: "calendar",
    file: "assets/sample-calendar-2.webp",
    challenge:
      "Status was only discoverable by asking. The executive interrupted deep work several times a day for updates, and procedures lived in half-finished documents.",
    tools: ["Notion", "Loom", "Google Workspace"],
    result:
      "One daily brief that reads in four minutes. Status pings fell roughly 80%, and 14 core processes now live in a searchable, versioned SOP library."
  }
];

/* -------------------------------- Helpers -------------------------------- */
const EMAIL = "justin.cabanay@msugensan.edu.ph";
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

/* ------------------------------ Mobile nav ------------------------------- */
function initNav() {
  const header = $("#siteHeader");
  const toggle = $("#navToggle");
  const nav = $("#primaryNav");
  if (!header || !toggle || !nav) return;

  const setOpen = (open) => {
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("nav-open"));
  });

  $$("a", nav).forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("nav-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("nav-open")) return;
    if (!header.contains(event.target)) setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) setOpen(false);
  });
}

/* ------------------------------ Scroll spy ------------------------------- */
function initScrollSpy() {
  const links = $$(".nav-links a[data-spy]");
  if (!links.length || !("IntersectionObserver" in window)) return;

  const byId = new Map(links.map((link) => [link.dataset.spy, link]));
  const sections = $$("main section[id]").filter((section) => byId.has(section.id));
  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.spy === id));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
}

/* -------------------------------- Filters -------------------------------- */
function initFilters() {
  const buttons = $$(".filter-btn");
  const cards = $$(".work-card");
  const status = $("#filterStatus");
  if (!buttons.length || !cards.length) return;

  const applyFilter = (filter) => {
    let shown = 0;

    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
      if (match) shown += 1;
    });

    buttons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    if (status) {
      status.textContent = `Showing ${shown} system${shown === 1 ? "" : "s"}${
        filter === "all" ? "" : " in this category"
      }.`;
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
  });

  // Service cards deep-link into the matching filter
  $$("[data-filter-jump]").forEach((card) => {
    card.addEventListener("click", () => {
      const target = card.dataset.filterJump;
      const button = buttons.find((item) => item.dataset.filter === target);
      if (button) applyFilter(target);
    });
  });

  applyFilter("all");
}

/* -------------------------------- Lightbox ------------------------------- */
function initLightbox() {
  const root = $("#lightbox");
  if (!root) return;

  const panel = $(".lightbox-panel", root);
  const media = $("#lbMedia");
  const fileNote = $("#lbFile");
  const categoryEl = $("#lbCategory");
  const titleEl = $("#lbTitle");
  const challengeEl = $("#lbChallenge");
  const toolsEl = $("#lbTools");
  const resultEl = $("#lbResult");
  const cards = $$(".work-card");
  let lastFocused = null;

  const focusable = () =>
    $$(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      panel
    ).filter((el) => el.getClientRects().length > 0);

  const open = (index, trigger) => {
    const data = SAMPLES[Number(index)];
    if (!data) return;

    const card = cards.find((item) => item.dataset.index === String(index));
    lastFocused = trigger || document.activeElement;

    categoryEl.textContent = data.category;
    categoryEl.className = `work-tag work-tag--${data.key}`;
    titleEl.textContent = data.title;
    challengeEl.textContent = data.challenge;
    resultEl.textContent = data.result;
    fileNote.textContent = data.file;

    toolsEl.innerHTML = "";
    data.tools.forEach((tool) => {
      const li = document.createElement("li");
      li.textContent = tool;
      toolsEl.appendChild(li);
    });

    const cardMedia = card ? $(".work-media", card) : null;
    const fallback = cardMedia ? $(".work-fallback", cardMedia) : null;
    const isFallback = cardMedia ? cardMedia.classList.contains("is-fallback") : true;

    media.innerHTML = "";
    media.className = "work-media lb-media";

    const img = document.createElement("img");
    img.src = data.file;
    img.alt = `${data.title} — system preview`;
    img.loading = "eager";
    img.decoding = "async";
    img.addEventListener("error", () => media.classList.add("is-fallback"));
    media.appendChild(img);

    if (fallback) media.insertAdjacentHTML("beforeend", fallback.outerHTML);
    if (isFallback) media.classList.add("is-fallback");

    root.classList.add("is-open");
    root.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    const closeBtn = $("#lightboxClose");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const close = () => {
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  };

  cards.forEach((card) => {
    const trigger = $(".work-media", card);
    if (!trigger) return;
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      open(card.dataset.index, trigger);
    });
    // Keyboard users reach the media button; pointer users can click anywhere sensible.
    card.addEventListener("click", (event) => {
      if (event.target.closest(".work-media")) return;
      open(card.dataset.index, trigger);
    });
  });

  const closeBtn = $("#lightboxClose");
  if (closeBtn) closeBtn.addEventListener("click", close);

  $$("[data-close-lightbox]", root).forEach((el) => {
    el.addEventListener("click", (event) => {
      close();
      if (el.tagName === "A") {
        const href = el.getAttribute("href");
        if (href && href.startsWith("#")) {
          event.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!root.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "Tab") {
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

/* ------------------------------- Contact form ---------------------------- */
function initForm() {
  const form = $("#contactForm");
  if (!form) return;

  const status = $("#formStatus");
  const submit = $("#submitBtn");
  const submitLabel = $(".submit-label", submit);
  const accessKey = $("#accessKey");
  const nameField = $("#name");
  const emailField = $("#email");
  const needField = $("#need");
  const messageField = $("#message");

  if (accessKey) accessKey.value = CONFIG.WEB3FORMS_ACCESS_KEY;

  const setStatus = (state, html) => {
    status.className = `form-status is-${state}`;
    status.innerHTML = html;
  };

  const clearStatus = () => {
    status.className = "form-status";
    status.textContent = "";
  };

  const setLoading = (loading) => {
    submit.disabled = loading;
    submitLabel.textContent = loading ? "Sending..." : "Send Brief";
  };

  const keyIsMissing =
    !CONFIG.WEB3FORMS_ACCESS_KEY || /REPLACE_WITH_YOUR_WEB3FORMS_KEY/i.test(CONFIG.WEB3FORMS_ACCESS_KEY);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("error", "Please fill in every field so I have enough context to reply properly.");
      return;
    }

    if (keyIsMissing) {
      setStatus(
        "error",
        `The form isn't connected yet — add your Web3Forms access key to <code>CONFIG.WEB3FORMS_ACCESS_KEY</code> in <code>script.js</code>. In the meantime, email me directly at <a href="mailto:${EMAIL}">${EMAIL}</a>.`
      );
      return;
    }

    const payload = {
      access_key: CONFIG.WEB3FORMS_ACCESS_KEY,
      subject: "New VA enquiry from justincabanay.com",
      from_name: "Justin Cabanay VA Portfolio",
      name: nameField.value.trim(),
      email: emailField.value.trim(),
      need: needField.value,
      message: messageField.value.trim(),
      botcheck: form.elements.botcheck && form.elements.botcheck.checked ? "true" : ""
    };

    setLoading(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data = {};
      try {
        data = await response.json();
      } catch (parseError) {
        data = {};
      }

      if (response.ok && data.success !== false) {
        setStatus(
          "success",
          "Brief received — thank you. I'll reply within one business day, usually sooner, with a proposed call time and the first thing I'd fix."
        );
        form.reset();
        if (accessKey) accessKey.value = CONFIG.WEB3FORMS_ACCESS_KEY;
      } else {
        const reason =
          (data && data.message) ||
          "The service rejected the submission. Double-check the access key and try again.";
        setStatus(
          "error",
          `Something went wrong: ${reason} You can also email me at <a href="mailto:${EMAIL}">${EMAIL}</a>.`
        );
      }
    } catch (error) {
      setStatus(
        "error",
        `I couldn't reach the form service — check your connection and retry, or email me at <a href="mailto:${EMAIL}">${EMAIL}</a>.`
      );
    } finally {
      setLoading(false);
    }
  });
}

/* ------------------------------ Booking link ----------------------------- */
function initBooking() {
  const link = $("#bookingLink");
  if (!link) return;

  link.href = CONFIG.CALENDLY_URL;

  if (!/^https?:\/\//i.test(CONFIG.CALENDLY_URL)) {
    link.removeAttribute("target");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = `mailto:${EMAIL}?subject=Discovery%20call%20request`;
    });
  }
}

/* --------------------------------- Boot ---------------------------------- */
function init() {
  renderIcons();
  initNav();
  initScrollSpy();
  initFilters();
  initLightbox();
  initForm();
  initBooking();

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
