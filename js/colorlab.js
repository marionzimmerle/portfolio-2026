/* Palette — interactive color palette generator. */
const ColorLab = (() => {
  const instances = new WeakMap();
  const CURATED = [
    ["#E85D4A", "#F3B562", "#F7E7CE", "#72A98F", "#3D5A80"],
    ["#3B2E5A", "#7B6BA8", "#D6B6D8", "#F2D7C9", "#E07A5F"],
    ["#173F5F", "#20639B", "#3CAEA3", "#F6D55C", "#ED553B"],
    ["#202C39", "#4C5C68", "#DCDCDD", "#C5C3C6", "#A51C30"],
    ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
    ["#0B132B", "#1C2541", "#3A506B", "#5BC0BE", "#D7F9F1"],
    ["#2F2235", "#3F3244", "#60495A", "#A9ACA9", "#E8E9F3"],
    ["#2D1E2F", "#5A3D5C", "#C1839F", "#E8B4BC", "#F6E7E6"],
    ["#14213D", "#FCA311", "#E5E5E5", "#FFFFFF", "#000000"],
    ["#355070", "#6D597A", "#B56576", "#E56B6F", "#EAAC8B"],
    ["#006D77", "#83C5BE", "#EDF6F9", "#FFDDD2", "#E29578"],
    ["#582F0E", "#7F4F24", "#A68A64", "#B6AD90", "#E6CCB2"],
    ["#386641", "#6A994E", "#A7C957", "#F2E8CF", "#BC4749"],
    ["#03045E", "#0077B6", "#00B4D8", "#90E0EF", "#CAF0F8"],
    ["#590D22", "#800F2F", "#A4133C", "#C9184A", "#FFB3C1"],
    ["#4A4E69", "#9A8C98", "#C9ADA7", "#F2E9E4", "#22223B"],
    ["#FF6B6B", "#FFE66D", "#4ECDC4", "#1A535C", "#F7FFF7"],
    ["#240046", "#5A189A", "#9D4EDD", "#C77DFF", "#E0AAFF"],
    ["#283618", "#606C38", "#DDA15E", "#FEFAE0", "#BC6C25"],
    ["#011627", "#2EC4B6", "#E71D36", "#FF9F1C", "#FDFFFC"],
    ["#F72585", "#B5179E", "#7209B7", "#3A0CA3", "#4CC9F0"],
    ["#001219", "#005F73", "#0A9396", "#EE9B00", "#AE2012"],
    ["#33415C", "#5C677D", "#7D8597", "#979DAC", "#C5D5EA"],
    ["#432818", "#99582A", "#BB9457", "#FFE6A7", "#6F1D1B"],
    ["#D8E2DC", "#FFE5D9", "#FFCAD4", "#F4ACB7", "#9D8189"]
  ];
  let lastCuratedIndex = -1;

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return "#" + [f(0), f(8), f(4)].map(v => Math.round(255 * v).toString(16).padStart(2, "0")).join("").toUpperCase();
  }

  function makePalette(mode) {
    const h = Math.floor(Math.random() * 360);
    if (mode === "analogous") return [-40, -20, 0, 20, 40].map((d, i) => hslToHex((h + d + 360) % 360, 55 + i * 3, 42 + i * 4));
    if (mode === "complementary") return [h, h + 22, h + 180, h + 202, h + 330].map((v, i) => hslToHex(v % 360, 58 + (i % 2) * 10, 42 + i * 5));
    if (mode === "split-complementary") return [h, h + 28, h + 150, h + 180, h + 210].map((v, i) => hslToHex(v % 360, 58 + (i % 3) * 7, 43 + i * 4));
    if (mode === "triadic") return [h, h + 30, h + 120, h + 240, h + 270].map((v, i) => hslToHex(v % 360, 62 + (i % 2) * 8, 43 + i * 4));
    if (mode === "tetradic") return [h, h + 60, h + 180, h + 240, h + 300].map((v, i) => hslToHex(v % 360, 58 + (i % 2) * 9, 42 + i * 5));
    if (mode === "monochrome") return [22, 34, 46, 61, 76].map((light, i) => hslToHex(h, 64 - i * 5, light));
    if (mode === "pastel") return [0, 48, 112, 188, 258].map((d, i) => hslToHex((h + d) % 360, 58 + i * 3, 76 + (i % 2) * 6));
    if (mode === "warm") {
      const start = 338 + Math.floor(Math.random() * 28);
      return [0, 16, 31, 47, 65].map((d, i) => hslToHex((start + d) % 360, 62 + i * 4, 40 + i * 7));
    }
    if (mode === "cool") {
      const start = 162 + Math.floor(Math.random() * 35);
      return [0, 20, 42, 68, 94].map((d, i) => hslToHex((start + d) % 360, 54 + i * 5, 38 + i * 7));
    }
    if (mode === "earthy") {
      const start = 18 + Math.floor(Math.random() * 28);
      return [0, 12, 28, 68, 118].map((d, i) => hslToHex((start + d) % 360, 30 + i * 5, 29 + i * 9));
    }
    if (mode === "vibrant") return [0, 67, 139, 211, 286].map((d, i) => hslToHex((h + d) % 360, 78 + (i % 2) * 10, 48 + (i % 3) * 5));

    let index = Math.floor(Math.random() * CURATED.length);
    if (CURATED.length > 1 && index === lastCuratedIndex) index = (index + 1) % CURATED.length;
    lastCuratedIndex = index;
    return [...CURATED[index]];
  }

  function isFrench() {
    return window.PortfolioI18n?.getLanguage?.() === "fr";
  }

  function localize(english, french) {
    return isFrench() ? french : english;
  }

  function copy(text, status, message) {
    const fallback = () => {
      const area = document.createElement("textarea");
      area.value = text; document.body.appendChild(area); area.select();
      document.execCommand("copy"); area.remove();
    };
    const operation = navigator.clipboard?.writeText ? navigator.clipboard.writeText(text) : Promise.resolve(fallback());
    operation.then(() => {
      status.textContent = message;
      window.setTimeout(() => {
        status.textContent = localize("Click a HEX code to copy it.", "Cliquez sur un code HEX pour le copier.");
      }, 1800);
    }).catch(fallback);
  }

  function create(windowEl) {
    const root = windowEl.querySelector("[data-color-lab]");
    if (!root || instances.has(root)) return;
    const paletteEl = root.querySelector("[data-color-palette]");
    const modeEl = root.querySelector("[data-color-harmony]");
    const status = root.querySelector("[data-color-status]");
    let colors = CURATED[0].slice();
    let locked = [false, false, false, false, false];

    function render() {
      paletteEl.innerHTML = "";
      colors.forEach((color, index) => {
        const swatch = document.createElement("section");
        swatch.className = "color-swatch";
        swatch.style.background = color;
        const lockAction = locked[index]
          ? localize("Unlock", "Déverrouiller")
          : localize("Lock", "Verrouiller");
        const copyAction = localize("Copy", "Copier");
        swatch.innerHTML = `
          <button class="color-swatch__lock" type="button" aria-label="${lockAction} ${color}" aria-pressed="${locked[index]}">${locked[index] ? "●" : "○"}</button>
          <button class="color-swatch__hex" type="button" aria-label="${copyAction} ${color}">${color}</button>`;
        swatch.querySelector(".color-swatch__lock").addEventListener("click", () => { locked[index] = !locked[index]; render(); });
        swatch.querySelector(".color-swatch__hex").addEventListener("click", () => copy(
          color,
          status,
          isFrench() ? `${color} copié.` : `${color} copied.`
        ));
        paletteEl.appendChild(swatch);
      });
    }

    root.querySelector("[data-color-generate]").addEventListener("click", () => {
      const next = makePalette(modeEl.value);
      colors = colors.map((color, index) => locked[index] ? color : next[index]);
      render();
    });
    root.querySelector("[data-color-copy-all]").addEventListener("click", () => copy(
      colors.join(", "),
      status,
      localize("Palette copied.", "Palette copiée.")
    ));
    document.addEventListener("portfolio:language-changed", render);
    render();
    instances.set(root, true);
  }

  document.addEventListener("portfolio:window-opened", event => {
    if (event.detail?.id === "color-lab") create(event.detail.element);
  });
  return { create };
})();
