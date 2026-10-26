/* =========================================================================
   windows.js — window system (open, drag, resize, minimize, maximize,
   stacking, multiple windows at once)
   ========================================================================= */

const WindowManager = (() => {

  const layer = document.getElementById("windowLayer");
  const tplWindow = document.getElementById("tpl-window");

  // Currently open windows, indexed by item id
  const openWindows = new Map();

  // Optional callback fired on every state change (open, close, minimize...)
  // so other modules can react if needed.
  let onStateChange = () => {};
  function setOnStateChange(fn) {
    onStateChange = fn;
  }

  function isOpen(id) {
    return openWindows.has(id);
  }

  /**
   * Opens a window for the given item (see data.js for the shape).
   * If it's already open: brings it to the front (and restores it if
   * minimized).
   */
  function open(item, originEvent) {
    if (!item.window) return;

    if (openWindows.has(item.id)) {
      const existing = openWindows.get(item.id);
      if (existing.minimized) {
        restore(item.id);
      }
      focus(item.id);
      return;
    }

    const node = tplWindow.content.firstElementChild.cloneNode(true);
    const cfg = item.window;

    node.dataset.id = item.id;
    node.querySelector(".window__title").textContent = cfg.title || item.name;
    node.querySelector(".window__content-inner").innerHTML = cfg.content || "";

    // Initial size and position (slightly offset if several windows are
    // opened, cascade-style, to stay readable).
    const cascadeOffset = (openWindows.size % 8) * 26;
    let width = cfg.width || 520;
    let height = cfg.height || 400;

    // The CV window keeps its comfortable desktop size on large screens,
    // but scales down on laptop / smaller viewports so it never dominates
    // the screen or extends beyond the usable area.
    if (item.kind === "cv") {
      width = Math.min(width, Math.max(620, window.innerWidth - 160));
      height = Math.min(height, Math.max(520, window.innerHeight - 180));
    }

    // Project case studies open as large, centered windows while retaining
    // enough space around them for the desktop and title bar to remain visible.
    if (item.kind === "project") {
      width = Math.min(width, Math.max(720, window.innerWidth - 120));
      height = Math.min(height, Math.max(520, window.innerHeight - 130));
    }

    const maxX = Math.max(20, window.innerWidth - width - 20);
    const maxY = Math.max(20, window.innerHeight - height - 100);
    const shouldCenter = cfg.centered || item.kind !== "project";
    const position = cfg.position || {};
    const positionedX = Number.isFinite(position.x)
      ? position.x
      : 20 + (maxX - 20) * (position.xRatio ?? 0);
    const positionedY = Number.isFinite(position.y)
      ? position.y
      : 20 + (maxY - 20) * (position.yRatio ?? 0);

    const startX = shouldCenter
      ? Utils.clamp((window.innerWidth - width) / 2, 20, maxX)
      : Utils.clamp(cfg.position ? positionedX : 120 + cascadeOffset, 20, maxX);
    const availableHeight = window.innerHeight - (window.__menubarHeight || 0);
    const startY = shouldCenter
      ? Utils.clamp((availableHeight - height) / 2, 20, maxY)
      : Utils.clamp(cfg.position ? positionedY : 70 + cascadeOffset, 20, maxY);

    Object.assign(node.style, {
      width: width + "px",
      height: height + "px",
      left: startX + "px",
      top: startY + "px"
    });

    // Opening-animation origin = position of the clicked icon, for a
    // simplified "genie effect".
    if (originEvent && originEvent.currentTarget) {
      const rect = originEvent.currentTarget.getBoundingClientRect();
      const originX = ((rect.left + rect.width / 2 - startX) / width) * 100;
      const originY = ((rect.top + rect.height / 2 - startY) / height) * 100;
      node.style.setProperty("--origin-x", originX + "%");
      node.style.setProperty("--origin-y", originY + "%");
    }

    layer.appendChild(node);

    const state = {
      id: item.id,
      el: node,
      minimized: false,
      maximized: false,
      prevRect: null
    };
    openWindows.set(item.id, state);

    bindWindowEvents(state);
    focus(item.id);
    document.dispatchEvent(new CustomEvent("portfolio:window-opened", {
      detail: { id: item.id, element: node }
    }));
    onStateChange();
  }

  function close(id) {
    const state = openWindows.get(id);
    if (!state) return;
    state.el.classList.add("is-closing");
    document.dispatchEvent(new CustomEvent("portfolio:window-closing", {
      detail: { id, element: state.el }
    }));
    state.el.addEventListener("animationend", () => {
      state.el.remove();
      openWindows.delete(id);
      onStateChange();
    }, { once: true });
  }

  function minimize(id) {
    const state = openWindows.get(id);
    if (!state || state.minimized) return;
    state.minimized = true;
    state.el.classList.remove("is-restoring");
    state.el.classList.add("is-minimized");
    onStateChange();
  }

  function restore(id) {
    const state = openWindows.get(id);
    if (!state || !state.minimized) return;
    state.minimized = false;
    state.el.classList.remove("is-minimized");
    state.el.classList.add("is-restoring");
    state.el.addEventListener("animationend", () => {
      state.el.classList.remove("is-restoring");
    }, { once: true });
    focus(id);
    onStateChange();
  }

  function toggleMaximize(id) {
    const state = openWindows.get(id);
    if (!state) return;
    const el = state.el;

    if (!state.maximized) {
      state.prevRect = {
        left: el.style.left,
        top: el.style.top,
        width: el.style.width,
        height: el.style.height
      };
      Object.assign(el.style, {
        left: "0px",
        top: "0px",
        width: "100%",
        height: "100%"
      });
      el.classList.add("is-maximized");
      state.maximized = true;
    } else {
      if (state.prevRect) {
        Object.assign(el.style, state.prevRect);
      }
      el.classList.remove("is-maximized");
      state.maximized = false;
    }
  }

  function focus(id) {
    openWindows.forEach((state) => state.el.classList.remove("is-active"));
    const state = openWindows.get(id);
    if (!state) return;
    state.el.style.zIndex = Utils.nextZIndex();
    state.el.classList.add("is-active");
  }

  function bindWindowEvents(state) {
    const el = state.el;
    const id = state.id;

    el.addEventListener("mousedown", () => focus(id));

    el.querySelector('[data-action="close"]').addEventListener("click", (e) => {
      e.stopPropagation();
      close(id);
    });
    el.querySelector('[data-action="minimize"]').addEventListener("click", (e) => {
      e.stopPropagation();
      minimize(id);
    });
    el.querySelector('[data-action="maximize"]').addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMaximize(id);
    });

    // Double-click on the titlebar = maximize/restore, just like on Mac
    const titlebar = el.querySelector(".window__titlebar");
    titlebar.addEventListener("dblclick", (e) => {
      if (e.target.closest(".window__btn")) return;
      toggleMaximize(id);
    });

    makeDraggable(el, titlebar, state);
    makeResizable(el, state);
  }

  function makeDraggable(el, handle, state) {
    let startX, startY, startLeft, startTop;

    function onPointerDown(e) {
      if (e.target.closest(".window__btn")) return;
      if (state.maximized) return;
      focus(state.id);

      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top - (window.__menubarHeight || 26);

      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      e.preventDefault();
    }

    function onPointerMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.left = (startLeft + dx) + "px";
      el.style.top = (startTop + dy) + "px";
    }

    function onPointerUp() {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
    }

    handle.addEventListener("mousedown", onPointerDown);
  }

  function makeResizable(el, state) {
    const handle = el.querySelector(".window__resize-handle");
    let startX, startY, startWidth, startHeight;

    function onPointerDown(e) {
      if (state.maximized) return;
      focus(state.id);
      startX = e.clientX;
      startY = e.clientY;
      const rect = el.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;

      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      e.preventDefault();
      e.stopPropagation();
    }

    function onPointerMove(e) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const minW = parseInt(getComputedStyle(el).minWidth) || 280;
      const minH = parseInt(getComputedStyle(el).minHeight) || 180;
      el.style.width = Math.max(minW, startWidth + dx) + "px";
      el.style.height = Math.max(minH, startHeight + dy) + "px";
    }

    function onPointerUp() {
      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
    }

    handle.addEventListener("mousedown", onPointerDown);
  }

  function getOpenIds() {
    return Array.from(openWindows.keys());
  }

  function isMinimized(id) {
    const state = openWindows.get(id);
    return state ? state.minimized : false;
  }

  return {
    open, close, minimize, restore, toggleMaximize, focus,
    isOpen, isMinimized, getOpenIds, setOnStateChange
  };
})();
