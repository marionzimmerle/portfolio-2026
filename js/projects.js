(() => {
  function initGallery(root) {
    if (!root || root.dataset.galleryReady === "true") return;
    root.dataset.galleryReady = "true";

    const slidesWrap = root.querySelector(".project-gallery__slides");
    const pageCount = Number(slidesWrap?.dataset.pageCount || 0);
    if (pageCount > 0) {
      const prefix = slidesWrap.dataset.pagePrefix;
      const label = slidesWrap.dataset.pageLabel || "Project";
      slidesWrap.innerHTML = Array.from({ length: pageCount }, (_, pageIndex) => {
        const page = String(pageIndex + 1).padStart(2, "0");
        return `<figure class="project-gallery__slide${pageIndex === 0 ? " is-active" : ""}"><img src="${prefix}${page}.jpg" alt="${label} — page ${pageIndex + 1}" loading="${pageIndex < 2 ? "eager" : "lazy"}"></figure>`;
      }).join("");
    }

    const slides = [...root.querySelectorAll(".project-gallery__slide")];
    const dotsWrap = root.querySelector("[data-gallery-dots]");
    const counter = root.querySelector("[data-gallery-counter]");
    let index = 0;

    const dots = slides.map((_, dotIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-gallery__dot";
      button.setAttribute("aria-label", `Image ${dotIndex + 1}`);
      button.addEventListener("click", () => show(dotIndex));
      dotsWrap.appendChild(button);
      return button;
    });

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      counter.textContent = `${index + 1} / ${slides.length}`;
      const image = slides[index].querySelector("img");
      const applyImageRatio = () => {
        if (image.naturalWidth && image.naturalHeight) {
          slidesWrap.style.aspectRatio = `${image.naturalWidth} / ${image.naturalHeight}`;
        }
      };
      if (image.complete) applyImageRatio();
      else image.addEventListener("load", applyImageRatio, { once: true });
    }

    root.querySelector("[data-gallery-prev]").addEventListener("click", () => show(index - 1));
    root.querySelector("[data-gallery-next]").addEventListener("click", () => show(index + 1));
    show(0);
  }

  function initMagazine(root) {
    if (!root || root.dataset.magazineReady === "true") return;
    root.dataset.magazineReady = "true";

    const slidesWrap = root.querySelector(".project-magazine__slides");
    const pageCount = Number(slidesWrap?.dataset.pageCount || 0);
    const prefix = slidesWrap?.dataset.pagePrefix;
    const label = slidesWrap?.dataset.pageLabel || "Document";
    if (!slidesWrap || !prefix || pageCount < 1) return;

    const pageImage = page => {
      if (page === "blank") return `<span class="project-magazine__blank" aria-label="Blank page"></span>`;
      const number = String(page).padStart(2, "0");
      const revision = [5, 43, 57, 59].includes(page) ? "?v=5" : "";
      return `<img src="${prefix}${number}.jpg${revision}" alt="${label} — page ${page}" loading="${page <= 3 ? "eager" : "lazy"}">`;
    };
    const pages = (slidesWrap.dataset.pageList || Array.from({ length: pageCount }, (_, i) => i + 1).join(","))
      .split(",")
      .map(value => value.trim() === "blank" ? "blank" : Number(value.trim()))
      .filter(value => value === "blank" || Number.isFinite(value));
    const spreads = [{ start: pages[0], end: pages[0], html: pageImage(pages[0]) }];
    for (let position = 1; position < pages.length; position += 2) {
      const page = pages[position];
      const end = pages[Math.min(position + 1, pages.length - 1)];
      spreads.push({
        start: page,
        end,
        html: pageImage(page) + (position + 1 < pages.length ? pageImage(end) : "")
      });
    }
    slidesWrap.innerHTML = spreads.map((spread, spreadIndex) =>
      `<figure class="project-magazine__spread${spreadIndex === 0 ? " is-active is-cover" : ""}" data-start="${spread.start}" data-end="${spread.end}">${spread.html}</figure>`
    ).join("");

    const slides = [...slidesWrap.querySelectorAll(".project-magazine__spread")];
    const dotsWrap = root.querySelector("[data-magazine-dots]");
    const counter = root.querySelector("[data-magazine-counter]");
    const zoomOut = root.querySelector("[data-magazine-zoom-out]");
    const zoomIn = root.querySelector("[data-magazine-zoom-in]");
    const zoomReset = root.querySelector("[data-magazine-zoom-reset]");
    let index = 0;
    let zoom = 1;
    const dots = slides.map((_, dotIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-gallery__dot";
      button.setAttribute("aria-label", `Double page ${dotIndex + 1}`);
      button.addEventListener("click", () => show(dotIndex));
      dotsWrap.appendChild(button);
      return button;
    });

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      const { start, end } = slides[index].dataset;
      if (start === "10" && end === "blank") counter.textContent = `Page 10 + blank page`;
      else counter.textContent = start === end ? `Page ${start}` : `Pages ${start}–${end}`;
    }

    function setZoom(nextZoom) {
      zoom = Math.min(2.5, Math.max(1, nextZoom));
      slidesWrap.style.setProperty("--magazine-zoom", zoom);
      zoomReset.textContent = `${Math.round(zoom * 100)} %`;
      zoomOut.disabled = zoom <= 1;
      zoomIn.disabled = zoom >= 2.5;
    }

    root.querySelector("[data-magazine-prev]").addEventListener("click", () => show(index - 1));
    root.querySelector("[data-magazine-next]").addEventListener("click", () => show(index + 1));
    zoomOut.addEventListener("click", () => setZoom(zoom - .25));
    zoomIn.addEventListener("click", () => setZoom(zoom + .25));
    zoomReset.addEventListener("click", () => setZoom(1));
    setZoom(1);
    show(0);
  }

  document.addEventListener("portfolio:window-opened", event => {
    initGallery(event.detail.element.querySelector("[data-project-gallery]"));
    initMagazine(event.detail.element.querySelector("[data-project-magazine]"));
  });
})();
