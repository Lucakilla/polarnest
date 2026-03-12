const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const currentPage = document.body.dataset.page || "home";

document.querySelectorAll("#year").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = nav ? Array.from(nav.querySelectorAll("a")) : [];

function closeNavigation() {
  if (!siteHeader || !navToggle) {
    return;
  }

  siteHeader.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

if (siteHeader && navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("click", (event) => {
    if (!siteHeader.classList.contains("is-open")) {
      return;
    }

    if (event.target instanceof Node && !siteHeader.contains(event.target)) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
    }
  });
}

const pageLinks = document.querySelectorAll("[data-page-link]");
const pathname = window.location.pathname.replace(/\/+$/, "");
const currentFile = pathname.split("/").pop() || "index.html";

pageLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) {
    return;
  }

  if (href === currentFile || (currentFile === "" && href === "index.html")) {
    link.setAttribute("aria-current", "page");
  }
});

const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else if (revealElements.length > 0) {
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
      threshold: 0.14,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (currentPage === "home" && nav) {
  const sectionLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));
  const sectionMap = new Map();

  sectionLinks.forEach((link) => {
    const targetId = link.getAttribute("href")?.slice(1);
    if (!targetId) {
      return;
    }

    const section = document.getElementById(targetId);
    if (section) {
      sectionMap.set(section, link);
    }
  });

  if (sectionMap.size > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) {
          return;
        }

        sectionLinks.forEach((link) => link.classList.remove("is-active"));
        const activeLink = sectionMap.get(visibleEntry.target);
        if (activeLink) {
          activeLink.classList.add("is-active");
        }
      },
      {
        rootMargin: "-22% 0px -55% 0px",
        threshold: [0.2, 0.4, 0.7],
      },
    );

    sectionMap.forEach((_, section) => sectionObserver.observe(section));
  }
}

const accordionRoot = document.querySelector("[data-accordion]");

if (accordionRoot) {
  const accordionItems = Array.from(accordionRoot.querySelectorAll("[data-accordion-item]"));

  accordionItems.forEach((item) => {
    const trigger = item.querySelector(".accordion__trigger");
    const panel = item.querySelector(".accordion__panel");

    if (!trigger || !panel) {
      return;
    }

    trigger.addEventListener("click", () => {
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";

      accordionItems.forEach((entry) => {
        const entryTrigger = entry.querySelector(".accordion__trigger");
        const entryPanel = entry.querySelector(".accordion__panel");

        if (!entryTrigger || !entryPanel) {
          return;
        }

        entryTrigger.setAttribute("aria-expanded", "false");
        entryPanel.classList.remove("is-open");
      });

      if (willOpen) {
        trigger.setAttribute("aria-expanded", "true");
        panel.classList.add("is-open");
      }
    });
  });
}

const sliderRoots = document.querySelectorAll("[data-slider]");

sliderRoots.forEach((sliderRoot) => {
  const track = sliderRoot.querySelector("[data-slider-track]");
  const prevButton = sliderRoot.querySelector("[data-slider-prev]");
  const nextButton = sliderRoot.querySelector("[data-slider-next]");
  const progress = sliderRoot.querySelector("[data-slider-progress]");

  if (!(track instanceof HTMLElement)) {
    return;
  }

  function getStepSize() {
    const firstCard = track.children[0];
    if (!(firstCard instanceof HTMLElement)) {
      return track.clientWidth * 0.9;
    }

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap || "20");
    return firstCard.getBoundingClientRect().width + gap;
  }

  function updateSliderState() {
    const maxScroll = Math.max(track.scrollWidth - track.clientWidth, 0);
    const progressValue = maxScroll === 0 ? 100 : ((track.scrollLeft + track.clientWidth) / track.scrollWidth) * 100;

    if (progress instanceof HTMLElement) {
      progress.style.width = `${Math.min(progressValue, 100)}%`;
    }

    if (prevButton instanceof HTMLButtonElement) {
      prevButton.disabled = track.scrollLeft <= 8;
    }

    if (nextButton instanceof HTMLButtonElement) {
      nextButton.disabled = track.scrollLeft >= maxScroll - 8;
    }
  }

  function scrollTrack(direction) {
    track.scrollBy({
      left: getStepSize() * direction,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  if (prevButton instanceof HTMLButtonElement) {
    prevButton.addEventListener("click", () => scrollTrack(-1));
  }

  if (nextButton instanceof HTMLButtonElement) {
    nextButton.addEventListener("click", () => scrollTrack(1));
  }

  track.addEventListener("scroll", updateSliderState, { passive: true });
  window.addEventListener("resize", updateSliderState);
  updateSliderState();
});

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm instanceof HTMLFormElement) {
  const status = contactForm.querySelector("[data-form-status]");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      if (status instanceof HTMLElement) {
        status.textContent = "Bitte fuellen Sie die markierten Felder vollstaendig aus.";
      }
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = `Polarnest Anfrage von ${name}`;
    const body = [
      `Name: ${name}`,
      `E-Mail: ${email}`,
      `Telefon: ${phone || "nicht angegeben"}`,
      "",
      "Projektziel:",
      message,
    ].join("\n");

    const mailtoUrl = `mailto:info@gut-bau.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (status instanceof HTMLElement) {
      status.textContent =
        "Ihr Mailprogramm wird geoeffnet. Falls nichts passiert, senden Sie Ihre Anfrage bitte direkt an info@gut-bau.com.";
    }

    window.location.href = mailtoUrl;
  });
}
