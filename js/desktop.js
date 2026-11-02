/* =========================================================================
   desktop.js — desktop icons: rendering, selection, dragging,
   double-click, temporary icon positions
   ========================================================================= */

const Desktop = (() => {

  // Icon movements last only until the page is reloaded.
  // Old saved positions are deliberately ignored.

  const desktopEl = document.getElementById("desktop");
  const tplIcon = document.getElementById("tpl-icon");
  const projectsCluster = desktopEl.querySelector(".projects-cluster");
  const projectsWidget = desktopEl.querySelector(".projects-widget");
  const projectsWidgetGrid = desktopEl.querySelector("[data-projects-widget-grid]");
  const contactWidget = desktopEl.querySelector(".contact-widget");

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
    syncProjectCompartment();
    bindWidgetDrag();
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

  /** Every glass card can be moved independently on desktop. Interactive
   * controls keep their normal click behavior, and mobile remains fixed. */
  function bindWidgetDrag() {
    const widgets = [...desktopEl.querySelectorAll(".desktop-widget")];
    let topLayer = 50;

    widgets.forEach((widget) => {
      let pointerId = null;
      let startX = 0;
      let startY = 0;
      let originX = 0;
      let originY = 0;
      let baseLeft = 0;
      let baseTop = 0;
      let layer = null;

      widget.addEventListener("pointerdown", (event) => {
        const interactiveTarget = event.target.closest(
          "button, a, input, select, textarea, [contenteditable], .icon"
        );
        if (usesResponsiveGrid() || event.button !== 0 || interactiveTarget) return;

        const desktopRect = desktopEl.getBoundingClientRect();
        const widgetRect = widget.getBoundingClientRect();
        pointerId = event.pointerId;
        startX = event.clientX;
        startY = event.clientY;
        originX = Number(widget.dataset.widgetX || 0);
        originY = Number(widget.dataset.widgetY || 0);
        baseLeft = widgetRect.left - desktopRect.left - originX;
        baseTop = widgetRect.top - desktopRect.top - originY;

        layer = widget.closest(".desktop-widgets, .projects-cluster") || widget;
        layer.style.zIndex = String(++topLayer);
        widget.style.zIndex = String(topLayer + 1);
        widget.setPointerCapture?.(pointerId);
        widget.classList.add("is-widget-dragging");
        event.preventDefault();
      });

      widget.addEventListener("pointermove", (event) => {
        if (event.pointerId !== pointerId) return;

        const desktopRect = desktopEl.getBoundingClientRect();
        const widgetRect = widget.getBoundingClientRect();
        const bottomClearance = 76;
        const minX = 8 - baseLeft;
        const minY = 8 - baseTop;
        const maxX = desktopRect.width - baseLeft - widgetRect.width - 8;
        const maxY = desktopRect.height - baseTop - widgetRect.height - bottomClearance;
        const nextX = Utils.clamp(originX + event.clientX - startX, minX, Math.max(minX, maxX));
        const nextY = Utils.clamp(originY + event.clientY - startY, minY, Math.max(minY, maxY));

        widget.dataset.widgetX = String(nextX);
        widget.dataset.widgetY = String(nextY);
        widget.style.setProperty("--widget-x", `${nextX}px`);
        widget.style.setProperty("--widget-y", `${nextY}px`);
        event.preventDefault();
      });

      function finishWidgetDrag(event) {
        if (event.pointerId !== pointerId) return;
        widget.releasePointerCapture?.(pointerId);
        widget.classList.remove("is-widget-dragging");
        pointerId = null;
        layer = null;
      }

      widget.addEventListener("pointerup", finishWidgetDrag);
      widget.addEventListener("pointercancel", finishWidgetDrag);
    });
  }

  /** On desktop the four folders live inside the movable compartment. On
   * mobile every icon is restored as a direct desktop child in its original
   * order, so the existing phone layout stays exactly the same. */
  function syncProjectCompartment() {
    if (!projectsWidgetGrid) return;

    if (usesResponsiveGrid()) {
      DESKTOP_ITEMS.forEach((item) => {
        if (item.__el) desktopEl.appendChild(item.__el);
      });
      return;
    }

    DESKTOP_ITEMS
      .filter((item) => item.kind === "project" && item.__el)
      .forEach((item) => projectsWidgetGrid.appendChild(item.__el));
  }

  function keepProjectsWidgetVisible() {
    if (!projectsCluster || usesResponsiveGrid()) return;

    const desktopRect = desktopEl.getBoundingClientRect();
    const widgetRect = projectsCluster.getBoundingClientRect();
    const currentLeft = widgetRect.left - desktopRect.left;
    const currentTop = widgetRect.top - desktopRect.top;
    const maxLeft = Math.max(8, desktopRect.width - widgetRect.width - 8);
    const maxTop = Math.max(8, desktopRect.height - widgetRect.height - 82);
    const nextLeft = Utils.clamp(currentLeft, 8, maxLeft);
    const nextTop = Utils.clamp(currentTop, 8, maxTop);

    if (nextLeft !== currentLeft) projectsCluster.style.left = nextLeft + "px";
    if (nextTop !== currentTop) projectsCluster.style.top = nextTop + "px";
  }

  function bindProjectsWidgetDrag() {
    if (!projectsCluster || !projectsWidget) return;

    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let originLeft = 0;
    let originTop = 0;

    projectsCluster.addEventListener("pointerdown", (event) => {
      if (usesResponsiveGrid() || event.button !== 0 || !event.target.closest(".projects-widget") || event.target.closest(".icon")) return;

      const desktopRect = desktopEl.getBoundingClientRect();
      const widgetRect = projectsCluster.getBoundingClientRect();
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      originLeft = widgetRect.left - desktopRect.left;
      originTop = widgetRect.top - desktopRect.top;
      projectsCluster.setPointerCapture?.(pointerId);
      projectsWidget.classList.add("is-dragging");
      event.preventDefault();
    });

    projectsCluster.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;

      const desktopRect = desktopEl.getBoundingClientRect();
      const widgetRect = projectsCluster.getBoundingClientRect();
      const maxLeft = Math.max(8, desktopRect.width - widgetRect.width - 8);
      const maxTop = Math.max(8, desktopRect.height - widgetRect.height - 82);
      const nextLeft = Utils.clamp(originLeft + event.clientX - startX, 8, maxLeft);
      const nextTop = Utils.clamp(originTop + event.clientY - startY, 8, maxTop);
      projectsCluster.style.left = nextLeft + "px";
      projectsCluster.style.top = nextTop + "px";
      event.preventDefault();
    });

    function finishWidgetDrag(event) {
      if (event.pointerId !== pointerId) return;
      projectsCluster.releasePointerCapture?.(pointerId);
      projectsWidget.classList.remove("is-dragging");
      pointerId = null;
    }

    projectsCluster.addEventListener("pointerup", finishWidgetDrag);
    projectsCluster.addEventListener("pointercancel", finishWidgetDrag);
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

  /** Match the reference desktop: the creative apps form a row beside the
   * projects and clock, while Resume and Archives sit below Contact.
   * Mobile keeps using its existing CSS grid and never enters this function.
   */
  function getDefaultGridPositions() {
    const rect = desktopEl.getBoundingClientRect();
    const projectsClusterRect = projectsCluster?.getBoundingClientRect();
    const contactRect = contactWidget?.getBoundingClientRect();
    const iconWidth = 92;
    const result = {};

    const clusterRight = projectsClusterRect
      ? projectsClusterRect.right - rect.left
      : 688;
    const contactLeft = contactRect
      ? contactRect.left - rect.left
      : rect.width - 238;
    const appCorridor = Math.max(0, contactLeft - clusterRight);
    const appsLeftGap = Utils.clamp((appCorridor - iconWidth - 300) / 5, 8, 66);
    const appsLeft = clusterRight + appsLeftGap;
    const appStep = Utils.clamp(
      (contactLeft - appsLeft - iconWidth - 8) / 3,
      82,
      126
    );
    const appsTop = 43;

    ["font-book", "color-lab", "experiments", "play"].forEach((id, index) => {
      result[id] = { x: appsLeft + index * appStep, y: appsTop };
    });

    const filesLeft = Utils.clamp(contactLeft, 16, Math.max(16, rect.width - iconWidth * 2 - 32));
    const filesTop = contactRect ? contactRect.bottom - rect.top + 35 : 204;
    result.cv = { x: filesLeft, y: filesTop };
    result.archives = { x: filesLeft + 101, y: filesTop };
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
    if (item.kind === "project" && projectsWidget?.contains(item.__el)) return;

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
    syncProjectCompartment();

    // Under 800px the CSS already switches the desktop icons to a responsive
    // grid. When returning to desktop mode, their saved positions are restored.
    if (usesResponsiveGrid()) return;

    keepProjectsWidgetVisible();

    const defaultPositions = getDefaultGridPositions();

    DESKTOP_ITEMS.forEach((item) => {
      if (item.kind === "project" && projectsWidget?.contains(item.__el)) return;

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
      if (item.kind === "project" && projectsWidget?.contains(node)) return;
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
      if (item.kind === "project" && projectsWidget?.contains(node)) return;

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
