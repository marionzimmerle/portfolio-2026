/* Minimal Pinterest widget: desktop only. Pinterest supplies the live board;
   this script gently reveals different rows inside the masked viewport. */
(() => {
  const desktopQuery = window.matchMedia("(min-width: 801px)");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const widget = document.querySelector("[data-pinterest-widget]");
  const viewport = document.querySelector("[data-pinterest-viewport]");

  if (!widget || !viewport || !desktopQuery.matches) return;

  let timer = null;
  let lastPosition = -1;

  function randomPosition() {
    const maximum = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    if (maximum < 20) return;

    /* The first pixels contain Pinterest's own header when it renders inside
       an iframe. Keeping a top inset removes that red control from view. */
    const minimum = Math.min(64, maximum);
    const safeMaximum = Math.max(minimum, maximum - 42);
    let next = minimum + Math.random() * (safeMaximum - minimum);

    if (Math.abs(next - lastPosition) < 34 && safeMaximum - minimum > 68) {
      next = next < (minimum + safeMaximum) / 2 ? safeMaximum : minimum;
    }

    lastPosition = next;
    viewport.scrollTo({ top: next, behavior: "smooth" });
  }

  function beginRotation() {
    if (reduceMotion.matches || timer) return;
    randomPosition();
    timer = window.setInterval(randomPosition, 4300);
  }

  function waitForBoard() {
    if (viewport.scrollHeight > viewport.clientHeight + 20) {
      beginRotation();
      return;
    }

    const observer = new MutationObserver(() => {
      if (viewport.scrollHeight > viewport.clientHeight + 20) {
        observer.disconnect();
        beginRotation();
      }
    });

    observer.observe(viewport, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 12000);
  }

  const pinterestScript = document.createElement("script");
  pinterestScript.async = true;
  pinterestScript.defer = true;
  pinterestScript.src = "https://assets.pinterest.com/js/pinit.js";
  pinterestScript.addEventListener("load", waitForBoard, { once: true });
  document.head.appendChild(pinterestScript);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && timer) {
      window.clearInterval(timer);
      timer = null;
    } else if (!document.hidden) {
      beginRotation();
    }
  });
})();
