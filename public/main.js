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

// Formularz kontaktowy — wysyłka do Web3Forms (AJAX). Gdy klucz nie jest jeszcze
// wpisany, awaryjnie otwiera program pocztowy, żeby formularz działał od razu.
document.querySelectorAll("form.contact-form").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var status = form.querySelector(".form-status");
    // honeypot
    var hp = form.querySelector('input[name="_gotcha"]');
    if (hp && hp.value) { return; }

    var keyEl = form.querySelector('input[name="access_key"]');
    var key = keyEl ? String(keyEl.value).trim() : "";
    var keyReady = key && key.indexOf("TUTAJ") === -1;
    var actionOk = (form.getAttribute("action") || "").indexOf("web3forms") !== -1;

    // Fallback do mailto, dopóki nie ma prawdziwego klucza Web3Forms
    if (!actionOk || !keyReady) {
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
      return;
    }

    // Wysyłka przez Web3Forms
    var btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; }
    if (status) { status.textContent = "Wysyłanie…"; status.style.color = "#2c7a45"; }

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (r) { return r.json(); })
      .then(function (json) {
        if (json.success) {
          form.reset();
          if (status) { status.textContent = "Dziękujemy! Wiadomość została wysłana — odezwiemy się wkrótce."; status.style.color = "#2c7a45"; }
        } else {
          if (status) { status.textContent = "Nie udało się wysłać. Zadzwoń: 694 757 680 lub napisz: green.forest33@op.pl"; status.style.color = "#b00020"; }
        }
      })
      .catch(function () {
        if (status) { status.textContent = "Błąd połączenia. Zadzwoń: 694 757 680 lub napisz: green.forest33@op.pl"; status.style.color = "#b00020"; }
      })
      .then(function () { if (btn) { btn.disabled = false; } });
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
