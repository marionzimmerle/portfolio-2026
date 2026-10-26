/* =========================================================================
   mobile.js — phone behaviour (≤ 800px): bottom dock shortcuts and
   "swipe down on the top bar to close" for full-screen windows.
   Does nothing on desktop.
   ========================================================================= */

(() => {
  const isMobile = () => window.matchMedia("(max-width: 800px)").matches;

  // ---- Bottom dock shortcuts -------------------------------------------
  document.querySelectorAll("[data-mobile-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.mobileOpen;
      if (target === "cv") Desktop.openById("cv");
      // About and Contact reuse the existing buttons so both stay in sync.
      if (target === "about") document.getElementById("aboutDockButton")?.click();
      if (target === "contact") {
        document.querySelector('[data-menubar-action="contact"]')?.click();
      }
    });
  });

  // ---- Swipe down on a window's top bar to close it ---------------------
  const CLOSE_DISTANCE = 110;
  let startY = null;
  let currentWindow = null;
  let distance = 0;

  document.addEventListener("touchstart", (event) => {
    if (!isMobile()) return;
    const bar = event.target.closest?.(".window__titlebar");
    if (!bar || event.target.closest(".window__btn")) return;
    currentWindow = bar.closest(".window");
    startY = event.touches[0].clientY;
    distance = 0;
    currentWindow.style.transition = "none";
  }, { passive: true });

  document.addEventListener("touchmove", (event) => {
    if (startY === null || !currentWindow) return;
    distance = Math.max(0, event.touches[0].clientY - startY);
    currentWindow.style.transform = `translateY(${distance}px)`;
  }, { passive: true });

  function endSwipe() {
    if (startY === null || !currentWindow) return;
    const win = currentWindow;
    startY = null;
    currentWindow = null;

    if (distance > CLOSE_DISTANCE) {
      win.style.setProperty("--drag", `${distance}px`);
      win.style.transform = "";
      win.style.transition = "";
      WindowManager.close(win.dataset.id);
    } else {
      win.style.transition = "transform .2s ease";
      win.style.transform = "";
      window.setTimeout(() => { win.style.transition = ""; }, 220);
    }
  }

  document.addEventListener("touchend", endSwipe);
  document.addEventListener("touchcancel", endSwipe);
})();

// Mobile-only tools folder, inserted into the same desktop grid as project icons.
(() => {
 const desktop=document.getElementById('desktop');
 const overlay=document.getElementById('mobileToolsOverlay');
 if(!desktop||!overlay)return;
 const launcher=document.createElement('button');
 launcher.type='button';launcher.className='mobile-tools-launch';launcher.setAttribute('aria-label','Ouvrir le dossier TOOLS');
 launcher.innerHTML='<span class="mobile-tools-mini">'+[
 'photoshop.svg','illustrator.svg','indesign.svg','premierepro.svg','aftereffects.svg','figma.png','vscode.png','blender.webp','microsoft-365.png'
 ].map(n=>'<img src="assets/apps/'+n+'" alt="">').join('')+'</span><span>TOOLS</span>';
 desktop.appendChild(launcher);
 const close=()=>{overlay.hidden=true;};
 launcher.addEventListener('click',()=>{overlay.hidden=false;});
 document.getElementById('mobileToolsClose')?.addEventListener('click',close);
 overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
})();
