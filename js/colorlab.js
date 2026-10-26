/* Color Lab — interactive palette generator. */
const ColorLab = (() => {
  const instances = new WeakMap();
  const CURATED = [
    ["#E85D4A", "#F3B562", "#F7E7CE", "#72A98F", "#3D5A80"],
    ["#3B2E5A", "#7B6BA8", "#D6B6D8", "#F2D7C9", "#E07A5F"],
    ["#173F5F", "#20639B", "#3CAEA3", "#F6D55C", "#ED553B"],
    ["#202C39", "#4C5C68", "#DCDCDD", "#C5C3C6", "#A51C30"],
    ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"]
  ];

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
    if (mode === "monochrome") return [22, 34, 46, 61, 76].map((light, i) => hslToHex(h, 64 - i * 5, light));
    return [...CURATED[Math.floor(Math.random() * CURATED.length)]];
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
      window.setTimeout(() => { status.textContent = "Click a HEX code to copy it."; }, 1800);
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
        swatch.innerHTML = `
          <button class="color-swatch__lock" type="button" aria-label="${locked[index] ? "Unlock" : "Lock"} ${color}" aria-pressed="${locked[index]}">${locked[index] ? "●" : "○"}</button>
          <button class="color-swatch__hex" type="button" aria-label="Copy ${color}">${color}</button>`;
        swatch.querySelector(".color-swatch__lock").addEventListener("click", () => { locked[index] = !locked[index]; render(); });
        swatch.querySelector(".color-swatch__hex").addEventListener("click", () => copy(color, status, `${color} copied.`));
        paletteEl.appendChild(swatch);
      });
    }

    root.querySelector("[data-color-generate]").addEventListener("click", () => {
      const next = makePalette(modeEl.value);
      colors = colors.map((color, index) => locked[index] ? color : next[index]);
      render();
    });
    root.querySelector("[data-color-copy-all]").addEventListener("click", () => copy(colors.join(", "), status, "Palette copied."));
    render();
    instances.set(root, true);
  }

  document.addEventListener("portfolio:window-opened", event => {
    if (event.detail?.id === "color-lab") create(event.detail.element);
  });
  return { create };
})();
