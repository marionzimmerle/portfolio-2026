/* =========================================================================
   menubar.js — top menu bar behavior (live clock + visual volume control)
   ========================================================================= */

const Menubar = (() => {

  const clockEl = document.getElementById("menubarClock");
  const volumeButton = document.getElementById("menubarVolumeButton");
  const volumePopover = document.getElementById("menubarVolumePopover");
  const volumeSlider = document.getElementById("menubarVolumeSlider");

  function init() {
    // Update immediately, then keep the displayed time synchronized
    // with the computer's clock without requiring a page refresh.
    tick();
    setInterval(tick, 1000);

    // Browsers can throttle timers when a tab is in the background.
    // Refresh the clock immediately when the user comes back to the site.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tick();
    });
    window.addEventListener("focus", tick);

    initVolume();
    document.addEventListener("portfolio:language-changed", tick);
  }

  function tick() {
    if (!clockEl) return;

    const now = new Date();
    const language = window.PortfolioI18n?.getLanguage?.() || "en";

    const englishDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const frenchDays = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];

    const englishMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sept", "oct", "nov", "dec"];
    const frenchMonths = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];

    const days = language === "fr" ? frenchDays : englishDays;
    const months = language === "fr" ? frenchMonths : englishMonths;

    const dayName = days[now.getDay()];
    const dayNumber = String(now.getDate());
    const monthName = months[now.getMonth()];
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const datePart = language === "fr"
      ? `${dayName} ${dayNumber} ${monthName}`
      : `${dayName} ${monthName} ${dayNumber}`;

    // Slightly larger separation between the date and the time.
    clockEl.textContent = `${datePart}\u00A0\u00A0\u00A0\u00A0${hours}:${minutes}`;
  }

  function initVolume() {
    if (!volumeButton || !volumePopover || !volumeSlider) return;

    const updateVisualVolume = () => {
      const value = Math.max(0, Math.min(100, Number(volumeSlider.value) || 0));
      volumeSlider.style.setProperty("--volume-value", `${value}%`);
      volumeSlider.setAttribute("aria-valuetext", `${value}%`);

      if (value === 0) {
        volumeButton.dataset.level = "mute";
      } else if (value < 50) {
        volumeButton.dataset.level = "low";
      } else {
        volumeButton.dataset.level = "high";
      }
    };

    const closeVolume = () => {
      volumePopover.hidden = true;
      volumeButton.setAttribute("aria-expanded", "false");
    };

    const openVolume = () => {
      volumePopover.hidden = false;
      volumeButton.setAttribute("aria-expanded", "true");
      volumeSlider.focus({ preventScroll: true });
    };

    volumeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = volumeButton.getAttribute("aria-expanded") === "true";
      if (isOpen) closeVolume();
      else openVolume();
    });

    volumePopover.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    volumeSlider.addEventListener("input", updateVisualVolume);

    document.addEventListener("pointerdown", (event) => {
      if (!volumePopover.hidden && !event.target.closest(".menubar__volume")) {
        closeVolume();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !volumePopover.hidden) {
        closeVolume();
        volumeButton.focus();
      }
    });

    updateVisualVolume();
  }

  return { init };
})();
