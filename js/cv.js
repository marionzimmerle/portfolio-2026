/* FR / EN CV switcher */
const CvViewer = (() => {
  const documents = {
    fr: {
      path: "assets/cv/cv-fr.pdf",
      title: "Marion Zimmerlé Resume — French",
      download: "CV_Marion_Zimmerle_FR.pdf"
    },
    en: {
      path: "assets/cv/cv-en.pdf",
      title: "Marion Zimmerlé Resume — English",
      download: "Marion_Zimmerle_Resume_EN.pdf"
    }
  };

  const viewers = new Set();

  function init(windowEl) {
    const root = windowEl.querySelector("[data-cv-viewer]");
    if (!root || root.dataset.cvReady) return;
    root.dataset.cvReady = "true";
    windowEl.classList.add("window--cv");

    const frame = root.querySelector("[data-cv-frame]");
    const openLink = root.querySelector("[data-cv-open]");
    const downloadLink = root.querySelector("[data-cv-download]");
    const buttons = root.querySelectorAll("[data-cv-language]");
    let currentLanguage = window.PortfolioI18n?.getLanguage?.() || "en";

    function show(language) {
      const documentInfo = documents[language];
      if (!documentInfo) return;
      currentLanguage = language;
      frame.src = `${documentInfo.path}#view=FitH`;
      frame.title = documentInfo.title;
      openLink.href = documentInfo.path;
      downloadLink.href = documentInfo.path;
      downloadLink.download = documentInfo.download;

      buttons.forEach(button => {
        const active = button.dataset.cvLanguage === language;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    buttons.forEach(button => {
      button.addEventListener("click", () => show(button.dataset.cvLanguage));
    });

    downloadLink.addEventListener("click", async event => {
      event.preventDefault();

      const documentInfo = documents[currentLanguage];
      if (!documentInfo) return;

      try {
        const response = await fetch(documentInfo.path);
        if (!response.ok) throw new Error("Download failed");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = documentInfo.download;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        const link = document.createElement("a");
        link.href = documentInfo.path;
        link.download = documentInfo.download;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });

    root.__showCvLanguage = show;
    viewers.add(root);

    show(window.PortfolioI18n?.getLanguage?.() || "en");
  }

  document.addEventListener("portfolio:window-opened", event => {
    if (event.detail.id === "cv") init(event.detail.element);
  });

  document.addEventListener("portfolio:window-closing", event => {
    if (event.detail.id !== "cv") return;
    const root = event.detail.element?.querySelector?.("[data-cv-viewer]");
    if (root) viewers.delete(root);
  });

  document.addEventListener("portfolio:language-changed", event => {
    const language = event.detail?.language || "en";
    viewers.forEach(root => root.__showCvLanguage?.(language));
  });

  return {};
})();
