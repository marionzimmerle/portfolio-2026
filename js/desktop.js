/* =========================================================================
   desktop.js — desktop icons: rendering, selection, dragging,
   double-click, temporary icon positions
   ========================================================================= */

const Desktop = (() => {

  // Icon movements last only until the page is reloaded.
  // Old saved positions are deliberately ignored.

  const desktopEl = document.getElementById("desktop");
  const tplIcon = document.getElementById("tpl-icon");

  let positions = {};
  let touchPositions = {};
  let selectedId = null;
  const naturalPositions = {};
  let resizeFrame = null;
  let layoutReference = null;

  function usesResponsiveGrid() {
    return window.matchMedia("(max-width: 800px)").matches;
  }

  function usesTouchInteraction() {
    return window.matchMedia("(hover: none), (pointer: coarse)").matches;
  }

  function init() {
    // Clear obsolete saved layouts from previous versions.
    try {
      ["portfolio.iconPositions.v2", "portfolio.iconPositions.v3", "portfolio.iconPositions.touch.v1"].forEach(key => localStorage.removeItem(key));
    } catch (_) {}
    const initialRect = desktopEl.getBoundingClientRect();
    layoutReference = {
      width: initialRect.width,
      height: initialRect.height
    };

    DESKTOP_ITEMS.forEach(renderIcon);
    layoutIconsForViewport();

    // Click on the desktop (outside any icon) = clear selection
    desktopEl.addEventListener("mousedown", (e) => {
      if (e.target === desktopEl) {
        clearSelection();
      }
    });

    window.addEventListener("resize", () => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);

      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = null;
        layoutIconsForViewport();
      });
    });
  }

  function renderIcon(item) {
    const node = tplIcon.content.firstElementChild.cloneNode(true);
    node.classList.add(item.type === "folder" ? "icon--folder" : "icon--file");
    node.dataset.id = item.id;
    node.dataset.kind = item.kind || "";
    node.querySelector(".icon__label-text").textContent = item.name;

    // Custom icon image: use a real <img> element instead of a CSS
    // background so the icon cannot be erased by another background rule.
    if (item.icon) {
      const imageEl = node.querySelector(".icon__image");
      imageEl.classList.add("icon__image--custom");
      const customImg = document.createElement("img");
      customImg.className = "icon__custom-img";
      customImg.src = item.icon;
      customImg.alt = "";
      customImg.draggable = false;
      customImg.addEventListener("error", () => {
        customImg.remove();
        imageEl.classList.remove("icon__image--custom");
      });
      imageEl.appendChild(customImg);
    }

    const pos = positions[item.id];
    const x = pos ? pos.x : item.x;
    const y = pos ? pos.y : item.y;

    naturalPositions[item.id] = { x, y };
    node.style.left = x + "px";
    node.style.top = y + "px";

    const touchPosition = touchPositions[item.id] || { x: 0, y: 0 };
    node.style.setProperty("--touch-x", touchPosition.x + "px");
    node.style.setProperty("--touch-y", touchPosition.y + "px");

    desktopEl.appendChild(node);
    item.__el = node;

    bindIconEvents(item, node);
  }

  /** Fixed opening arrangement matching the supplied desktop screenshot.
   * Four project folders on top, three tools below, Archives top-right.
   * Positions are recalculated for the available desktop space only.
   */
  function getDefaultGridPositions() {
    const rect = desktopEl.getBoundingClientRect();
    const widgets = desktopEl.querySelector(".desktop-widgets");
    const widgetRight = widgets ? widgets.getBoundingClientRect().right - rect.left : 0;
    const iconWidth = 92;
    const gap = 24;
    const step = iconWidth + gap;
    // Reflow into columns at intermediate widths instead of squeezing icons.
    // The wide-screen screenshot arrangement remains unchanged.
    const columns = rect.width <= 1050 ? 2 : rect.width <= 1350 ? 3 : 4;
    const ids = ["project-02", "project-01", "project-03", "project-04", "play", "color-lab", "cv"];
    const groupWidth = columns * iconWidth + (columns - 1) * gap;
    const minLeft = Math.max(16, widgetRight + 20);
    const maxLeft = Math.max(16, rect.width - groupWidth - 20);
    const left = Utils.clamp(rect.width * 0.48 - groupWidth / 2, Math.min(minLeft, maxLeft), maxLeft);
    const top = Math.max(48, Math.min(170, rect.height * 0.18));
    const rowStep = Math.max(112, Math.min(145, rect.height * 0.17));
    const result = {};
    ids.forEach((id, index) => {
      result[id] = { x: left + (index % columns) * step, y: top + Math.floor(index / columns) * rowStep };
    });
    result.archives = { x: Math.max(8, rect.width - iconWidth - 26), y: 28 };
    return result;
  }

  /**
   * Keeps every freely positioned desktop icon visible when the browser
   * becomes narrower or shorter.
   *
   * Important: resizing the browser does NOT overwrite the user's saved
   * position. If the browser becomes large again, the icon returns to the
   * position chosen by the user.
   */
  function getViewportScale(rect = desktopEl.getBoundingClientRect()) {
    const refWidth = Math.max(1, layoutReference?.width || rect.width);
    const refHeight = Math.max(1, layoutReference?.height || rect.height);

    // Compress positions continuously when the browser becomes smaller.
    // Do not spread icons farther apart when the window becomes larger
    // than the size at which the page was opened.
    return {
      x: 1,
      y: 1
    };
  }

  function placeInsideViewport(item) {
    if (!item.__el || usesResponsiveGrid()) return;

    const desired = naturalPositions[item.id] || {
      x: positions[item.id]?.x ?? item.x,
      y: positions[item.id]?.y ?? item.y
    };

    const rect = desktopEl.getBoundingClientRect();
    const node = item.__el;
    const margin = 8;
    const scale = getViewportScale(rect);

    // Every icon follows the viewport continuously instead of waiting
    // until it touches the right/bottom edge.
    const fluidLeft = margin + (desired.x - margin) * scale.x;
    const fluidTop = margin + (desired.y - margin) * scale.y;

    const maxLeft = Math.max(margin, rect.width - node.offsetWidth - margin);
    const maxTop = Math.max(margin, rect.height - node.offsetHeight - margin);

    const visibleLeft = Utils.clamp(fluidLeft, margin, maxLeft);
    const visibleTop = Utils.clamp(fluidTop, margin, maxTop);

    node.style.left = visibleLeft + "px";
    node.style.top = visibleTop + "px";
  }

  function layoutIconsForViewport() {
    // Under 800px the CSS already switches the desktop icons to a responsive
    // grid. When returning to desktop mode, their saved positions are restored.
    if (usesResponsiveGrid()) return;

    const defaultPositions = getDefaultGridPositions();

    DESKTOP_ITEMS.forEach((item) => {
      if (!positions[item.id] && defaultPositions[item.id]) {
        const next = defaultPositions[item.id];
        naturalPositions[item.id] = { ...next };
        item.__el.style.left = next.x + "px";
        item.__el.style.top = next.y + "px";
        return;
      }

      if (item.corner && !positions[item.id]) placeInCorner(item);
      else placeInsideViewport(item);
    });
  }

  /** Repositions an "anchored" icon (like the Trash) in a corner of the
   *  desktop, unless the user has already moved it manually. */
  function placeInCorner(item) {
    if (positions[item.id]) return; // the user already moved it
    const rect = desktopEl.getBoundingClientRect();
    const margin = 24;
    const iconSize = 92;
    let x = margin, y = margin;

    switch (item.corner) {
      case "bottom-right":
        x = rect.width - iconSize - margin;
        y = rect.height - iconSize - margin;
        break;
      case "bottom-left":
        x = margin;
        y = rect.height - iconSize - margin;
        break;
      default:
        break;
    }
    item.__el.style.left = x + "px";
    item.__el.style.top = y + "px";
  }

  function bindIconEvents(item, node) {
    let dragging = false;
    let moved = false;
    let startX, startY, originLeft, originTop;
    let touchPointerId = null;
    let touchMoved = false;
    let suppressNextClick = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchOriginX = 0;
    let touchOriginY = 0;
    let touchMinX = 0;
    let touchMaxX = 0;
    let touchMinY = 0;
    let touchMaxY = 0;

    node.addEventListener("pointerdown", (e) => {
      // On phones the icons behave like a regular home-screen grid. Keeping
      // them fixed prevents an old drag offset from hiding them under widgets.
      if (usesResponsiveGrid()) return;
      if (e.pointerType === "mouse" || (!usesResponsiveGrid() && !usesTouchInteraction())) return;

      e.stopPropagation();
      select(item.id);
      touchPointerId = e.pointerId;
      touchMoved = false;
      touchStartX = e.clientX;
      touchStartY = e.clientY;

      const saved = touchPositions[item.id] || { x: 0, y: 0 };
      touchOriginX = saved.x;
      touchOriginY = saved.y;

      const desktopRect = desktopEl.getBoundingClientRect();
      const iconRect = node.getBoundingClientRect();
      const baseLeft = iconRect.left - desktopRect.left - touchOriginX;
      const baseTop = iconRect.top - desktopRect.top - touchOriginY;
      touchMinX = -baseLeft + 6;
      touchMaxX = desktopRect.width - baseLeft - iconRect.width - 6;
      touchMinY = -baseTop + 6;
      touchMaxY = desktopRect.height - baseTop - iconRect.height - 82;

      node.setPointerCapture?.(e.pointerId);
      node.classList.add("is-touch-dragging");
    });

    node.addEventListener("pointermove", (e) => {
      if (e.pointerId !== touchPointerId) return;

      const dx = e.clientX - touchStartX;
      const dy = e.clientY - touchStartY;
      if (Math.hypot(dx, dy) > 7) touchMoved = true;
      if (!touchMoved) return;

      e.preventDefault();
      const nextX = Utils.clamp(touchOriginX + dx, touchMinX, touchMaxX);
      const nextY = Utils.clamp(touchOriginY + dy, touchMinY, Math.max(touchMinY, touchMaxY));
      node.style.setProperty("--touch-x", nextX + "px");
      node.style.setProperty("--touch-y", nextY + "px");
    }, { passive: false });

    function finishTouchDrag(e) {
      if (e.pointerId !== touchPointerId) return;

      if (touchMoved) {
        const currentX = parseFloat(node.style.getPropertyValue("--touch-x")) || 0;
        const currentY = parseFloat(node.style.getPropertyValue("--touch-y")) || 0;
        touchPositions[item.id] = { x: currentX, y: currentY };
        // Keep the movement in memory only until refresh.
        suppressNextClick = true;
        window.setTimeout(() => { suppressNextClick = false; }, 450);
      }

      node.releasePointerCapture?.(e.pointerId);
      node.classList.remove("is-touch-dragging");
      touchPointerId = null;
    }

    node.addEventListener("pointerup", finishTouchDrag);
    node.addEventListener("pointercancel", finishTouchDrag);

    node.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      select(item.id);

      // On tablets and phones CSS arranges the icons in a responsive grid.
      // Dragging is disabled there so saved desktop coordinates cannot break it.
      if (usesResponsiveGrid()) return;

      dragging = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      originLeft = node.offsetLeft;
      originTop = node.offsetTop;
      node.classList.add("is-dragging");

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });

    function onMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;

      const rect = desktopEl.getBoundingClientRect();
      const newLeft = Utils.clamp(originLeft + dx, 0, rect.width - node.offsetWidth);
      const newTop = Utils.clamp(originTop + dy, 0, rect.height - node.offsetHeight);
      node.style.left = newLeft + "px";
      node.style.top = newTop + "px";
    }

    function onUp() {
      dragging = false;
      node.classList.remove("is-dragging");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      if (moved) {
        const rect = desktopEl.getBoundingClientRect();
        const scale = getViewportScale(rect);
        const margin = 8;

        // Save the position in the original desktop coordinate system so
        // dragging still behaves correctly at any browser width.
        const newPosition = {
          x: margin + (node.offsetLeft - margin) / Math.max(scale.x, 0.0001),
          y: margin + (node.offsetTop - margin) / Math.max(scale.y, 0.0001)
        };

        positions[item.id] = newPosition;
        naturalPositions[item.id] = { ...newPosition };
        // Keep the movement in memory only until refresh.
      }
    }

    // On desktop, a single click selects and a double-click opens.
    // Touchscreens do not have a reliable double-click gesture, so one tap
    // opens the icon directly on phones and tablets.
    node.addEventListener("click", (e) => {
      e.stopPropagation();
      if (suppressNextClick || touchMoved) {
        e.preventDefault();
        touchMoved = false;
        return;
      }
      if (usesResponsiveGrid() || usesTouchInteraction()) {
        select(item.id);
        openItem(item, e);
      }
    });

    node.addEventListener("dblclick", (e) => {
      e.stopPropagation();
      if (usesResponsiveGrid() || usesTouchInteraction()) return;
      openItem(item, e);
    });

    // Keyboard accessibility: Enter opens the item, like a double-click
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        select(item.id);
        openItem(item, e);
      }
    });
  }

  function openItem(item, event) {
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (item.window) WindowManager.open(item, event);
  }

  function select(id) {
    if (selectedId === id) return;
    clearSelection();
    selectedId = id;
    const item = DESKTOP_ITEMS.find((i) => i.id === id);
    if (item && item.__el) item.__el.classList.add("is-selected");
  }

  function clearSelection() {
    if (!selectedId) return;
    const item = DESKTOP_ITEMS.find((i) => i.id === selectedId);
    if (item && item.__el) item.__el.classList.remove("is-selected");
    selectedId = null;
  }

  function openById(id) {
    const item = DESKTOP_ITEMS.find((i) => i.id === id);
    if (item) {
      select(id);
      openItem(item);
    }
  }

  return { init, openById };
})();
