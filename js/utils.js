/* =========================================================================
   utils.js — small shared utility functions
   ========================================================================= */

const Utils = (() => {

  /** Clamp a value between min and max */
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /** Reads a JSON value from localStorage, with a fallback default */
  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      console.warn("Could not read localStorage for", key, err);
      return fallback;
    }
  }

  /** Writes a JSON value to localStorage */
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn("Could not write to localStorage for", key, err);
    }
  }

  /** Small global z-index counter, shared by windows/icons */
  let topZ = 10;
  function nextZIndex() {
    topZ += 1;
    return topZ;
  }

  return { clamp, readStorage, writeStorage, nextZIndex };
})();
