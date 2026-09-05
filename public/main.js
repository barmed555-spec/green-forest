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

// Formularz kontaktowy — walidacja + komunikat (bez backendu wysyła mailto jako fallback)
document.querySelectorAll("form.contact-form").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    var status = form.querySelector(".form-status");
    // honeypot
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) { e.preventDefault(); return; }
    // Jeśli nie ustawiono prawdziwego endpointu (action zawiera TODO) — fallback do mailto
    if (form.getAttribute("action").indexOf("TODO") !== -1) {
      e.preventDefault();
      var name = (form.querySelector('[name="imie"]') || {}).value || "";
      var tel = (form.querySelector('[name="telefon"]') || {}).value || "";
      var mail = (form.querySelector('[name="email"]') || {}).value || "";
      var temat = (form.querySelector('[name="temat"]') || {}).value || "";
      var tresc = (form.querySelector('[name="wiadomosc"]') || {}).value || "";
      var body = encodeURIComponent(
        "Imię: " + name + "\nTelefon: " + tel + "\nE-mail: " + mail + "\nTemat: " + temat + "\n\n" + tresc
      );
      window.location.href = "mailto:green.forest33@op.pl?subject=" +
        encodeURIComponent("Zapytanie ze strony: " + (temat || "kontakt")) + "&body=" + body;
      if (status) { status.textContent = "Otwieram Twój program pocztowy…"; status.style.color = "#2c7a45"; }
    }
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
