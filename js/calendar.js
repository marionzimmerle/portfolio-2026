/* =========================================================================
   calendar.js — live clock and interactive monthly calendar widget
   ========================================================================= */

const PortfolioCalendar = (() => {
  const clockEl = document.getElementById("calendarClock");
  const dateEl = document.getElementById("calendarFullDate");
  const monthEl = document.getElementById("calendarMonth");
  const gridEl = document.getElementById("calendarGrid");
  const previousButton = document.getElementById("calendarPrevious");
  const nextButton = document.getElementById("calendarNext");

  const today = new Date();
  let displayedYear = today.getFullYear();
  let displayedMonth = today.getMonth();

  function language() {
    return window.PortfolioI18n?.getLanguage?.() === "fr" ? "fr-FR" : "en-US";
  }

  function updateClock() {
    if (!clockEl || !dateEl) return;

    const now = new Date();
    const locale = language();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    clockEl.textContent = `${hours}:${minutes}`;
    clockEl.dateTime = now.toISOString();
    dateEl.textContent = new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long"
    }).format(now);
  }

  function mondayFirstIndex(jsDay) {
    return (jsDay + 6) % 7;
  }

  function renderCalendar() {
    if (!monthEl || !gridEl) return;

    const locale = language();
    const now = new Date();
    const monthDate = new Date(displayedYear, displayedMonth, 1);
    const firstDayOffset = mondayFirstIndex(monthDate.getDay());
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
    const daysInPreviousMonth = new Date(displayedYear, displayedMonth, 0).getDate();

    monthEl.textContent = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric"
    }).format(monthDate);

    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const monday = new Date(2024, 0, 1);
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 7; index += 1) {
      const label = document.createElement("span");
      label.className = "clock-calendar__weekday";
      label.textContent = weekdayFormatter.format(new Date(2024, 0, monday.getDate() + index)).replace(".", "");
      fragment.appendChild(label);
    }

    for (let cell = 0; cell < 42; cell += 1) {
      const day = document.createElement("span");
      day.className = "clock-calendar__day";
      const currentDay = cell - firstDayOffset + 1;

      if (currentDay < 1) {
        day.textContent = String(daysInPreviousMonth + currentDay);
        day.classList.add("clock-calendar__day--muted");
      } else if (currentDay > daysInMonth) {
        day.textContent = String(currentDay - daysInMonth);
        day.classList.add("clock-calendar__day--muted");
      } else {
        day.textContent = String(currentDay);
        const isToday = currentDay === now.getDate()
          && displayedMonth === now.getMonth()
          && displayedYear === now.getFullYear();

        if (isToday) {
          day.classList.add("clock-calendar__day--today");
          day.setAttribute("aria-current", "date");
        }
      }

      fragment.appendChild(day);
    }

    gridEl.replaceChildren(fragment);
  }

  function changeMonth(offset) {
    const next = new Date(displayedYear, displayedMonth + offset, 1);
    displayedYear = next.getFullYear();
    displayedMonth = next.getMonth();
    renderCalendar();
  }

  function returnToToday() {
    const now = new Date();
    displayedYear = now.getFullYear();
    displayedMonth = now.getMonth();
    renderCalendar();
  }

  function refresh() {
    updateClock();
    renderCalendar();
  }

  function init() {
    if (!clockEl || !dateEl || !monthEl || !gridEl) return;

    refresh();
    setInterval(updateClock, 1000);
    previousButton?.addEventListener("click", () => changeMonth(-1));
    nextButton?.addEventListener("click", () => changeMonth(1));
    monthEl.addEventListener("click", returnToToday);
    document.addEventListener("portfolio:language-changed", refresh);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refresh();
    });
    window.addEventListener("focus", refresh);
  }

  return { init };
})();
