/* =========================================================================
   main.js — entry point: initializes every module
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
  window.__menubarHeight = document.getElementById("menubar").offsetHeight;

  Menubar.init();
  PortfolioCalendar.init();
  Desktop.init();
});
