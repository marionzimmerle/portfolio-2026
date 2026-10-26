const SYSTEM_ITEMS = {
  about: {
    id: "about-terminal",
    name: "ABOUT",
    window: {
      title: "Terminal — About",
      width: 610,
      height: 430,
      content: `
        <div class="terminal-about">
          <p><span class="terminal-about__prompt">marion@portfolio</span>:<span class="terminal-about__path">~</span>$ whoami</p>
          <p class="terminal-about__answer">Marion Zimmerlé Izquierdo<br>Graphic &amp; Multimedia Designer</p>
          <p><span class="terminal-about__prompt">marion@portfolio</span>:<span class="terminal-about__path">~</span>$ cat about.txt</p>
          <p class="terminal-about__answer">I design coherent visual identities and digital experiences, from logo to supports, from interface to 3D. Each project starts from a clear concept and a bold graphic stance, with constant attention to detail.</p>
          <p><span class="terminal-about__prompt">marion@portfolio</span>:<span class="terminal-about__path">~</span>$ status</p>
          <p class="terminal-about__answer">Available for freelance work.</p>
          <p><span class="terminal-about__prompt">marion@portfolio</span>:<span class="terminal-about__path">~</span>$ <span class="terminal-about__cursor" aria-hidden="true"></span></p>
        </div>
      `
    }
  },
  contact: {
    id: "contact-mail",
    name: "CONTACT",
    window: {
      title: "New Message — Contact",
      width: 590,
      height: 465,
      centered: true,
      content: `
        <div class="contact-panel">
          <form class="contact-form" data-contact-form>
            <div class="contact-form__heading">
              <span class="contact-form__envelope" aria-hidden="true">✉</span>
              <strong>New Message</strong>
            </div>
            <div class="contact-form__row">
              <span class="contact-form__label">To</span>
              <span class="contact-form__recipient">Marion Zimmerlé Izquierdo</span>
            </div>
            <label class="contact-form__row">
              <span class="contact-form__label">From</span>
              <input type="email" name="from_email" placeholder="Your email address" autocomplete="email" spellcheck="false" required>
            </label>
            <label class="contact-form__row">
              <span class="contact-form__label">Subject</span>
              <input type="text" name="subject" placeholder="What would you like to talk about?" required>
            </label>
            <div class="contact-form__message" data-contact-message contenteditable="true" role="textbox" aria-multiline="true" aria-label="Message" data-placeholder="Write your message…"></div>
            <div class="contact-form__tools" role="toolbar" aria-label="Message formatting">
              <button type="button" class="contact-form__tool" data-format="removeFormat" title="Clear formatting" aria-label="Clear formatting">Aa</button>
              <button type="button" class="contact-form__tool" data-format="bold" title="Bold" aria-label="Bold"><strong>B</strong></button>
              <button type="button" class="contact-form__tool" data-format="italic" title="Italic" aria-label="Italic"><i>I</i></button>
              <button type="button" class="contact-form__tool" data-format="underline" title="Underline" aria-label="Underline"><u>U</u></button>
              <button type="button" class="contact-form__tool contact-form__tool--symbol contact-form__tool--link" data-contact-link title="Add link" aria-label="Add link">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </button>
              <div class="contact-form__emoji-wrap">
                <button type="button" class="contact-form__tool contact-form__tool--symbol" data-contact-emoji title="Emoji" aria-label="Emoji">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.2"></circle>
                    <circle class="contact-form__emoji-eye" cx="9" cy="10" r="0.9"></circle>
                    <circle class="contact-form__emoji-eye" cx="15" cy="10" r="0.9"></circle>
                    <path d="M8.6 14.1c.9 1.25 2.05 1.9 3.4 1.9s2.5-.65 3.4-1.9"></path>
                  </svg>
                </button>
                <div class="contact-form__emoji-picker" data-contact-emoji-picker hidden>
                  <button type="button" data-emoji="😀">😀</button><button type="button" data-emoji="😃">😃</button><button type="button" data-emoji="😄">😄</button><button type="button" data-emoji="😁">😁</button><button type="button" data-emoji="😆">😆</button><button type="button" data-emoji="😂">😂</button>
                  <button type="button" data-emoji="🙂">🙂</button><button type="button" data-emoji="😊">😊</button><button type="button" data-emoji="🥰">🥰</button><button type="button" data-emoji="😍">😍</button><button type="button" data-emoji="😘">😘</button><button type="button" data-emoji="😉">😉</button>
                  <button type="button" data-emoji="😎">😎</button><button type="button" data-emoji="🤩">🤩</button><button type="button" data-emoji="🥳">🥳</button><button type="button" data-emoji="🤔">🤔</button><button type="button" data-emoji="😅">😅</button><button type="button" data-emoji="😌">😌</button>
                  <button type="button" data-emoji="🥲">🥲</button><button type="button" data-emoji="😢">😢</button><button type="button" data-emoji="😭">😭</button><button type="button" data-emoji="😴">😴</button><button type="button" data-emoji="🙃">🙃</button><button type="button" data-emoji="🤍">🤍</button>
                  <button type="button" data-emoji="❤️">❤️</button><button type="button" data-emoji="🧡">🧡</button><button type="button" data-emoji="💛">💛</button><button type="button" data-emoji="💚">💚</button><button type="button" data-emoji="💙">💙</button><button type="button" data-emoji="💜">💜</button>
                  <button type="button" data-emoji="👍">👍</button><button type="button" data-emoji="👎">👎</button><button type="button" data-emoji="👏">👏</button><button type="button" data-emoji="🙌">🙌</button><button type="button" data-emoji="🤝">🤝</button><button type="button" data-emoji="🙏">🙏</button>
                  <button type="button" data-emoji="👌">👌</button><button type="button" data-emoji="✌️">✌️</button><button type="button" data-emoji="🤞">🤞</button><button type="button" data-emoji="💪">💪</button><button type="button" data-emoji="✨">✨</button><button type="button" data-emoji="⭐">⭐</button>
                  <button type="button" data-emoji="🔥">🔥</button><button type="button" data-emoji="🎉">🎉</button><button type="button" data-emoji="🎨">🎨</button><button type="button" data-emoji="💡">💡</button><button type="button" data-emoji="🚀">🚀</button><button type="button" data-emoji="💻">💻</button>
                </div>
              </div>
            </div>
            <div class="contact-form__footer">
              <p class="contact-form__status" data-contact-status aria-live="polite"></p>
              <button class="contact-form__submit" type="submit">Send Email</button>
            </div>
          </form>
        </div>
      `
    }
  },
  help: {
    id: "help-navigation",
    name: "HELP",
    window: {
      title: "Help — How to Navigate",
      width: 540,
      height: 470,
      centered: true,
      content: `
        <div class="help-panel">
          <div class="help-panel__header">
            <span class="help-panel__icon" aria-hidden="true">?</span>
            <div>
              <strong>How to Navigate</strong>
              <span>A quick guide to exploring my portfolio.</span>
            </div>
          </div>

          <div class="help-panel__list">
            <div class="help-panel__item">
              <span class="help-panel__symbol" aria-hidden="true">↗</span>
              <div><strong>Open</strong><span>Double-click a desktop icon to open a project, my resume, or Games.</span></div>
            </div>
            <div class="help-panel__item">
              <span class="help-panel__symbol" aria-hidden="true">↔</span>
              <div><strong>Move</strong><span>Drag a window by its title bar, or drag desktop icons to arrange them.</span></div>
            </div>
            <div class="help-panel__item">
              <span class="help-panel__symbol" aria-hidden="true">⌟</span>
              <div><strong>Resize</strong><span>Drag the lower-right corner of a window to resize it.</span></div>
            </div>
            <div class="help-panel__item">
              <span class="help-panel__symbol help-panel__symbol--brand" aria-hidden="true">
                <span class="help-panel__brand-mark help-panel__brand-mark--small"></span>
              </span>
              <div><strong>Menu bar</strong><span>Use File to open my resume or archive, or to reset the desktop. Click my name for About and Contact, and use EN/FR in the menu bar to switch languages.</span></div>
            </div>
            <div class="help-panel__item">
              <span class="help-panel__symbol" aria-hidden="true">◉</span>
              <div><strong>Dock</strong><span>The Dock shows the software I use. Terminal and Trash are interactive.</span></div>
            </div>
          </div>
        </div>
      `
    }
  },

  shortcuts: {
    id: "help-shortcuts",
    name: "SHORTCUTS",
    window: {
      title: "Help — Keyboard Shortcuts",
      width: 520,
      height: 555,
      centered: true,
      content: `
        <div class="help-panel">
          <div class="help-panel__header">
            <span class="help-panel__icon" aria-hidden="true">⌨</span>
            <div>
              <strong>Keyboard Shortcuts</strong>
              <span>Common shortcuts for navigating the portfolio.</span>
            </div>
          </div>

          <div class="shortcut-list">
            <div class="shortcut-row shortcut-row--fullscreen">
              <span>Enter / Exit Full Screen</span>
              <div class="shortcut-platforms">
                <div class="shortcut-platform">
                  <span>Windows</span>
                  <div class="shortcut-keys">
                    <kbd>F11</kbd>
                  </div>
                </div>
                <div class="shortcut-platform">
                  <span>Mac</span>
                  <div class="shortcut-keys">
                    <kbd>⌃</kbd><kbd>⌘</kbd><kbd>F</kbd>
                  </div>
                </div>
              </div>
            </div>
            <div class="shortcut-row">
              <span>Contact</span>
              <div class="shortcut-keys">
                <kbd>Alt / ⌥</kbd><kbd>1</kbd>
              </div>
            </div>
            <div class="shortcut-row">
              <span>About</span>
              <div class="shortcut-keys">
                <kbd>Alt / ⌥</kbd><kbd>2</kbd>
              </div>
            </div>
            <div class="shortcut-row">
              <span>Open Resume</span>
              <div class="shortcut-keys">
                <kbd>Alt / ⌥</kbd><kbd>3</kbd>
              </div>
            </div>
            <div class="shortcut-row">
              <span>Close all windows</span>
              <div class="shortcut-keys">
                <kbd>Alt / ⌥</kbd><kbd>4</kbd>
              </div>
            </div>
            <div class="shortcut-row">
              <span>Reset Desktop</span>
              <div class="shortcut-keys">
                <kbd>Alt / ⌥</kbd><kbd>0</kbd>
              </div>
            </div>
            <div class="shortcut-row">
              <span>Close Menu / Active Window</span>
              <div class="shortcut-keys">
                <kbd>Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      `
    }
  },
  trash: {
    id: "trash-window",
    name: "TRASH",
    window: {
      title: "Trash",
      width: 520,
      height: 360,
      content: `
        <div class="trash-window">
          <img src="assets/icons/bin.png" alt="" aria-hidden="true">
          <strong>Trash is empty</strong>
          <span>There are no items in the Trash.</span>
        </div>
      `
    }
  }
};

const PortfolioInterface = (() => {
  const EMAIL = "marionzimmerle@outlook.fr";
  const EMAILJS_SERVICE_ID = "service_ddm5964";
  const EMAILJS_TEMPLATE_ID = "template_p65yrmf";
  const EMAILJS_PUBLIC_KEY = "K2Wd6VDtXpfo439v1";

  function openItem(item, event) {
    WindowManager.open(item, event || null);
  }

  function initMenu() {
    const nameButton = document.getElementById("menubarName");
    const nameMenu = document.getElementById("menubarDropdown");
    const contact = nameMenu?.querySelector('[data-menubar-action="contact"]');
    const about = nameMenu?.querySelector('[data-menubar-action="about"]');

    const fileButton = document.getElementById("menubarFileButton");
    const fileMenu = document.getElementById("menubarFileDropdown");
    const openCv = fileMenu?.querySelector('[data-file-action="open-cv"]');
    const downloadCv = fileMenu?.querySelector('[data-file-action="download-cv"]');
    const openArchive = fileMenu?.querySelector('[data-file-action="open-archive"]');
    const resetDesktop = fileMenu?.querySelector('[data-file-action="reset-desktop"]');

    const helpButton = document.getElementById("menubarHelpButton");
    const helpMenu = document.getElementById("menubarHelpDropdown");
    const howToNavigate = helpMenu?.querySelector('[data-help-action="navigate"]');
    const keyboardShortcuts = helpMenu?.querySelector('[data-help-action="shortcuts"]');

    if (!nameButton || !nameMenu || !contact || !about) return;

    const closeNameMenu = () => {
      nameMenu.hidden = true;
      nameButton.setAttribute("aria-expanded", "false");
    };

    const closeFileMenu = () => {
      if (!fileMenu || !fileButton) return;
      fileMenu.hidden = true;
      fileButton.setAttribute("aria-expanded", "false");
    };

    const closeHelpMenu = () => {
      if (!helpMenu || !helpButton) return;
      helpMenu.hidden = true;
      helpButton.setAttribute("aria-expanded", "false");
    };

    const closeAllMenus = () => {
      closeNameMenu();
      closeFileMenu();
      closeHelpMenu();
    };

    nameButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = nameMenu.hidden;
      closeFileMenu();
      closeHelpMenu();
      nameMenu.hidden = !willOpen;
      nameButton.setAttribute("aria-expanded", String(willOpen));
      if (willOpen) about.focus();
    });

    contact.addEventListener("click", (event) => {
      closeAllMenus();
      openItem(SYSTEM_ITEMS.contact, event);
    });

    about.addEventListener("click", (event) => {
      closeAllMenus();
      openItem(SYSTEM_ITEMS.about, event);
    });

    if (fileButton && fileMenu && openCv && downloadCv && openArchive && resetDesktop) {
      fileButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = fileMenu.hidden;
        closeNameMenu();
        closeHelpMenu();
        fileMenu.hidden = !willOpen;
        fileButton.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) openCv.focus();
      });

      openCv.addEventListener("click", () => {
        closeAllMenus();
        Desktop.openById("cv");
      });

      downloadCv.addEventListener("click", () => {
        closeAllMenus();
        const language = window.PortfolioI18n?.getLanguage?.() || "en";
        const isFrench = language === "fr";
        const link = document.createElement("a");
        link.href = isFrench ? "assets/cv/cv-fr.pdf" : "assets/cv/cv-en.pdf";
        link.download = isFrench ? "CV_Marion_Zimmerle_FR.pdf" : "Marion_Zimmerle_Resume_EN.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
      });

      openArchive.addEventListener("click", () => {
        closeAllMenus();
        window.open("https://readymag.website/u111931852/4005346/", "_blank", "noopener,noreferrer");
      });

      resetDesktop.addEventListener("click", () => {
        closeAllMenus();
        localStorage.removeItem("portfolio.iconPositions.v2");
        localStorage.removeItem("portfolio.iconPositions.v3");
        localStorage.removeItem("portfolio.iconPositions.touch.v1");
        window.location.reload();
      });
    }

    if (helpButton && helpMenu && howToNavigate && keyboardShortcuts) {
      helpButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const willOpen = helpMenu.hidden;
        closeNameMenu();
        closeFileMenu();
        helpMenu.hidden = !willOpen;
        helpButton.setAttribute("aria-expanded", String(willOpen));
        if (willOpen) howToNavigate.focus();
      });

      howToNavigate.addEventListener("click", (event) => {
        closeAllMenus();
        openItem(SYSTEM_ITEMS.help, event);
      });

      keyboardShortcuts.addEventListener("click", (event) => {
        closeAllMenus();
        openItem(SYSTEM_ITEMS.shortcuts, event);
      });
    }

    document.addEventListener("click", (event) => {
      const clickedNameMenu = nameMenu.contains(event.target) || event.target === nameButton;
      const clickedFileMenu = fileMenu?.contains(event.target) || event.target === fileButton;
      const clickedHelpMenu = helpMenu?.contains(event.target) || event.target === helpButton;

      if (!clickedNameMenu) closeNameMenu();
      if (!clickedFileMenu) closeFileMenu();
      if (!clickedHelpMenu) closeHelpMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        const helpWasOpen = helpButton?.getAttribute("aria-expanded") === "true";
        const fileWasOpen = fileButton?.getAttribute("aria-expanded") === "true";
        const nameWasOpen = nameButton.getAttribute("aria-expanded") === "true";
        const anyMenuOpen = helpWasOpen || fileWasOpen || nameWasOpen;

        if (anyMenuOpen) {
          event.preventDefault();
          closeAllMenus();
          if (helpWasOpen) helpButton?.focus();
          else if (fileWasOpen) fileButton?.focus();
          else if (nameWasOpen) nameButton.focus();
          return;
        }

        const activeWindow = document.querySelector('.window.is-active');
        if (activeWindow?.dataset.id) {
          event.preventDefault();
          WindowManager.close(activeWindow.dataset.id);
        }
        return;
      }

      const target = event.target;
      const isEditing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable;

      if (isEditing) return;
      if (!event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.code === "Digit1") {
        event.preventDefault();
        closeAllMenus();
        openItem(SYSTEM_ITEMS.contact);
      } else if (event.code === "Digit2") {
        event.preventDefault();
        closeAllMenus();
        openItem(SYSTEM_ITEMS.about);
      } else if (event.code === "Digit3") {
        event.preventDefault();
        closeAllMenus();
        Desktop.openById("cv");
      } else if (event.code === "Digit4") {
        event.preventDefault();
        closeAllMenus();
        WindowManager.getOpenIds().forEach((id) => WindowManager.close(id));
      } else if (event.code === "Digit0") {
        event.preventDefault();
        closeAllMenus();
        localStorage.removeItem("portfolio.iconPositions.v2");
        localStorage.removeItem("portfolio.iconPositions.v3");
        localStorage.removeItem("portfolio.iconPositions.touch.v1");
        window.location.reload();
      }
    });
  }

  function initDock() {
    document.getElementById("aboutDockButton")?.addEventListener("click", (event) => {
      openItem(SYSTEM_ITEMS.about, event);
    });
    document.getElementById("trashDockButton")?.addEventListener("click", (event) => {
      openItem(SYSTEM_ITEMS.trash, event);
    });
  }

  function bindContactForm(root) {
    const form = root.querySelector("[data-contact-form]");
    if (!form || form.dataset.ready) return;
    form.dataset.ready = "true";

    const editor = form.querySelector("[data-contact-message]");
    const tools = [...form.querySelectorAll("[data-format]")];
    const linkButton = form.querySelector("[data-contact-link]");
    const emojiButton = form.querySelector("[data-contact-emoji]");
    const emojiPicker = form.querySelector("[data-contact-emoji-picker]");
    const status = form.querySelector("[data-contact-status]");
    let savedRange = null;

    const focusEditor = () => editor?.focus({ preventScroll: true });

    const saveSelection = () => {
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount || !editor?.contains(selection.anchorNode)) return;
      savedRange = selection.getRangeAt(0).cloneRange();
    };

    const restoreSelection = () => {
      if (!savedRange || !editor) {
        focusEditor();
        return;
      }
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange);
    };

    const runCommand = (command, value = null) => {
      restoreSelection();
      document.execCommand(command, false, value);
      saveSelection();
      updateToolStates();
      focusEditor();
    };

    const updateToolStates = () => {
      tools.forEach((button) => {
        const command = button.dataset.format;
        const active = command !== "removeFormat" && document.queryCommandState(command);
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    };

    const insertText = (text) => {
      restoreSelection();
      if (!document.execCommand("insertText", false, text)) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const node = document.createTextNode(text);
          range.insertNode(node);
          range.setStartAfter(node);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      saveSelection();
      focusEditor();
    };


    editor?.addEventListener("mouseup", saveSelection);
    editor?.addEventListener("keyup", () => {
      saveSelection();
      updateToolStates();
    });
    editor?.addEventListener("focus", updateToolStates);
    editor?.addEventListener("input", () => {
      if (status) status.textContent = "";
    });

    tools.forEach((button) => {
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", () => runCommand(button.dataset.format));
    });

    linkButton?.addEventListener("mousedown", (event) => event.preventDefault());
    linkButton?.addEventListener("click", () => {
      restoreSelection();
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || "";
      const url = window.prompt(window.PortfolioI18n?.t?.("Enter the link URL:") || "Enter the link URL:", "https://");
      if (!url || url === "https://") return;
      if (selectedText) {
        document.execCommand("createLink", false, url);
      } else {
        const label = window.prompt(window.PortfolioI18n?.t?.("Text to display:") || "Text to display:", url) || url;
        document.execCommand("insertHTML", false, `<a href="${url.replace(/"/g, "&quot;")}" target="_blank" rel="noopener">${label.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</a>`);
      }
      saveSelection();
      focusEditor();
    });

    emojiButton?.addEventListener("mousedown", (event) => {
      event.preventDefault();
      saveSelection();
    });
    emojiButton?.addEventListener("click", () => {
      if (!emojiPicker) return;
      emojiPicker.hidden = !emojiPicker.hidden;
    });
    emojiPicker?.querySelectorAll("[data-emoji]").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", () => {
        insertText(button.dataset.emoji || "");
        emojiPicker.hidden = true;
      });
    });

    document.addEventListener("click", (event) => {
      if (!emojiPicker || emojiPicker.hidden) return;
      if (!emojiPicker.contains(event.target) && event.target !== emojiButton) emojiPicker.hidden = true;
    });


    const sanitizeMessageHtml = () => {
      if (!editor) return "";
      const allowedTags = new Set(["A", "B", "BR", "DIV", "EM", "I", "P", "STRONG", "U"]);
      const source = editor.cloneNode(true);

      source.querySelectorAll("*").forEach((node) => {
        if (!allowedTags.has(node.tagName)) {
          node.replaceWith(...node.childNodes);
          return;
        }

        [...node.attributes].forEach((attribute) => {
          if (node.tagName === "A" && ["href", "target", "rel"].includes(attribute.name)) return;
          node.removeAttribute(attribute.name);
        });

        if (node.tagName === "A") {
          const href = node.getAttribute("href") || "";
          if (!/^(https?:|mailto:)/i.test(href)) {
            node.removeAttribute("href");
          } else {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noopener noreferrer");
          }
        }
      });

      return source.innerHTML.trim();
    };

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const fromEmail = String(data.get("from_email") || "").trim();
      const subject = String(data.get("subject") || (window.PortfolioI18n?.t?.("Portfolio contact") || "Portfolio contact")).trim();
      const body = editor?.innerText.trim() || "";
      const messageHtml = sanitizeMessageHtml();
      const submitButton = form.querySelector(".contact-form__submit");

      if (!body) {
        if (status) status.textContent = "Please write a message first.";
        focusEditor();
        return;
      }

      if (!window.emailjs) {
        if (status) status.textContent = "Email service unavailable. Please try again.";
        return;
      }

      if (status) {
        status.textContent = "Sending…";
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending…";
      }

      try {
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          to_name: "Marion Zimmerlé Izquierdo",
          subject,
          message: body,
          message_html: messageHtml,
          from_name: fromEmail,
          from_email: fromEmail,
          reply_to: fromEmail
        });

        if (status) status.textContent = "Message sent ✓";

        form.reset();
        if (editor) editor.innerHTML = "";
        savedRange = null;
        updateToolStates();
      } catch (error) {
        console.error("EmailJS send failed:", error);
        if (status) status.textContent = "Message could not be sent. Please try again.";
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Send Email";
        }
      }
    });
  }

  function init() {
    if (window.emailjs) {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }
    initMenu();
    initDock();
    document.addEventListener("portfolio:window-opened", (event) => {
      if (event.detail?.id === SYSTEM_ITEMS.contact.id) bindContactForm(event.detail.element);
    });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => PortfolioInterface.init());
