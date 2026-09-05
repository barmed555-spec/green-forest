// ==== Green Forest — interakcje frontu ====

// Rok w stopce (może być kilka wystąpień)
document.querySelectorAll("#year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Sticky nav — cień po przewinięciu
var nav = document.querySelector(".nav");
if (nav) {
  var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Dropdown „Usługi" — klik/klawiatura (hover ogarnia CSS)
var drop = document.querySelector(".nav__droptoggle");
if (drop) {
  var menu = drop.parentElement.querySelector(".nav__menu");
  drop.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = menu.classList.toggle("open");
    drop.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", function () {
    menu.classList.remove("open");
    drop.setAttribute("aria-expanded", "false");
  });
}

// Menu mobilne (hamburger)
var burger = document.querySelector(".nav__burger");
var mm = document.getElementById("mobile-menu");
if (burger && mm) {
  var closeBtn = mm.querySelector(".mobile-menu__close");
  var openMenu = function () { mm.classList.add("open"); mm.setAttribute("aria-hidden", "false"); burger.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden"; };
  var closeMenu = function () { mm.classList.remove("open"); mm.setAttribute("aria-hidden", "true"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  burger.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  mm.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
}

// Formularz kontaktowy — wysyłka AJAX (Web3Forms) z komunikatem bez przeładowania
document.querySelectorAll("form.contact-form").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var status = form.querySelector(".form-status");
    var btn = form.querySelector('button[type="submit"]');
    var setStatus = function (msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = ok ? "#2c7a45" : "#b3261e";
    };
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Wysyłam…"; }
    setStatus("", true);

    fetch(form.getAttribute("action"), {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        if (res.ok && res.d.success) {
          form.reset();
          setStatus("Dziękujemy! Wiadomość wysłana — odezwiemy się wkrótce.", true);
        } else {
          setStatus("Nie udało się wysłać. Zadzwoń: 694 757 680 lub napisz: green.forest33@op.pl", false);
        }
      })
      .catch(function () {
        setStatus("Brak połączenia. Zadzwoń: 694 757 680 lub napisz: green.forest33@op.pl", false);
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "Wyślij zapytanie"; }
      });
  });
});

// Reveal na scroll (IntersectionObserver) — działa we wszystkich przeglądarkach
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var reveals = document.querySelectorAll(".reveal");
if (!reduceMotion && "IntersectionObserver" in window) {
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach(function (el) { io.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add("is-visible"); });
}
