// General UX JS for custom_theme: theme toggle and minor animations
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle (persists in localStorage)
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  function setDark(dark){
    if(dark){
      document.documentElement.classList.add("dark");
      localStorage.setItem("qc_theme","dark");
      if(toggle) toggle.textContent = "☀️";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("qc_theme","light");
      if(toggle) toggle.textContent = "🌙";
    }
  }
  // initialize
  const saved = localStorage.getItem("qc_theme");
  if(saved === "dark") setDark(true);
  else if(saved === "light") setDark(false);
  else { // respect system
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(prefersDark);
  }
  if(toggle) toggle.addEventListener("click", () => setDark(!document.documentElement.classList.contains("dark")));

  // small animation: fade in card
  const card = document.querySelector(".auth-card");
  if(card) { card.style.opacity = 0; card.style.transform = "translateY(6px)"; setTimeout(()=>{ card.style.transition = "opacity .36s ease, transform .36s ease"; card.style.opacity=1; card.style.transform="translateY(0)"; }, 80); }

  // login form: disable double submit
  const loginForm = document.getElementById("login-form");
  if(loginForm){
    loginForm.addEventListener("submit", () => {
      const btn = document.getElementById("login-btn");
      if(btn) btn.disabled = true;
    });
  }
});