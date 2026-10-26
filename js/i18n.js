/* =========================================================================
   i18n.js — English / French portfolio translation
   ========================================================================= */

const PortfolioI18n = (() => {
  const STORAGE_KEY = "portfolio.language.v2";
  const supported = new Set(["en", "fr"]);
  let language = supported.has(localStorage.getItem(STORAGE_KEY))
    ? localStorage.getItem(STORAGE_KEY)
    : "fr";

  const textOriginals = new WeakMap();
  const attributeOriginals = new WeakMap();
  let observer = null;

  const fr = new Map(Object.entries({
    "About…": "À propos…",
    "Contact…": "Contact…",
    "File": "Fichier",
    "RESUME": "CV",
    "TOOLS": "OUTILS",
    "Ouvrir le dossier TOOLS": "Ouvrir le dossier OUTILS",
    "Open Resume": "Ouvrir le CV",
    "Download Resume": "Télécharger le CV",
    "Open Archive": "Ouvrir les archives",
    "Reset Desktop": "Réinitialiser le bureau",
    "Help": "Aide",
    "How to Navigate": "Comment naviguer",
    "Keyboard Shortcuts": "Raccourcis clavier",

    "Graphic & Multimedia Designer": "Designer graphique & multimédia",
    "WELCOME TO MY PORTFOLIO": "BIENVENUE SUR MON PORTFOLIO",
    "Welcome to my portfolio, a space where I share my world, my projects, and my creative experiments. Everything on this desktop is interactive—click, move, and explore the icons. For navigation tips, open Help in the top menu bar.": "Bienvenue dans mon portfolio, un espace où je partage mon univers, mes projets et mes expérimentations créatives. Tout ce bureau est interactif : cliquez, déplacez et explorez les icônes. Pour savoir comment naviguer, ouvrez Aide dans la barre supérieure.",
    "Double-click an icon to explore →": "Double-cliquez sur une icône pour explorer →",
    "CLOCK & CALENDAR": "HORLOGE & CALENDRIER",
    "LANGUAGES": "LANGUES",
    "French": "Français",
    "English": "Anglais",
    "Spanish": "Espagnol",
    "Italian": "Italien",
    "German": "Allemand",
    "Native": "Langue maternelle",

    "PROJECT CONTENT": "CONTENU DU PROJET",
    "CONCEPT PROJECT · BRAND IDENTITY & 3D": "PROJET CONCEPT · IDENTITÉ VISUELLE & 3D",
    "A complete visual identity for an urban electric bike brand, designed to feel minimal, accessible, and forward-looking.": "Une identité visuelle complète pour une marque de vélo électrique urbain, pensée pour être minimaliste, accessible et tournée vers l’avenir.",
    "Role": "Rôle",
    "Art direction, branding & 3D": "Direction artistique, identité visuelle & 3D",
    "Tools": "Logiciels",
    "Context": "Contexte",

    "EVO — ELECTRIC BIKE": "EVO — VÉLO ÉLECTRIQUE",
    "EVO — Electric Bike": "EVO — Vélo électrique",
    "FUDGEE — COFFEE BRAND": "FUDGEE — MARQUE DE COFFEE SHOP",
    "INTERNSHIP REPORT — EDITORIAL DESIGN": "RAPPORT DE STAGE — DESIGN ÉDITORIAL",
    "ANA’S GALLERY": "ANA’S GALLERY",
    "Tap an icon to explore my projects ↓": "Touchez une icône pour explorer mes projets ↓",
    "Welcome to my portfolio! Discover my creative projects in this macOS-inspired space. Tap the icons below to explore my work, learn about my background, and get to know my creative world. Enjoy your visit!": "Bienvenue dans mon portfolio ! Découvrez mes projets créatifs à travers cet espace inspiré de l’univers macOS. Touchez les icônes ci-dessous pour explorer mes réalisations, découvrir mon parcours et en apprendre davantage sur mon univers. Bonne visite !",
    "Tap an icon to explore ↓": "Touchez une icône pour explorer ↓",
    "Available for freelance work": "Disponible en freelance",
    "Available for freelance work.": "Disponible en freelance.",
    "I design coherent visual identities and digital experiences, from logo to supports, from interface to 3D. Each project starts from a clear concept and a bold graphic stance, with constant attention to detail.": "Je conçois des identités visuelles et des expériences numériques cohérentes, du logo aux supports, de l’interface à la 3D. Chaque projet part d’un concept clair et d’un parti pris graphique assumé, avec une attention constante aux détails.",

    "Identity and product": "Identité et produit",
    "Communication": "Communication",
    "EVO, for evolution: a brand designed for beginners and experienced cyclists alike. The challenge: make the electric bike desirable, with a slim, simple and elegant design.": "EVO, pour évolution : une marque pensée aussi bien pour les débutants que pour les cyclistes confirmés. L’enjeu : rendre le vélo électrique désirable, avec un design fin, simple et élégant.",
    "The logo is built on wide, rounded letters that evoke fluidity and speed. The visual identity combines black and white, Helvetica typography and motion blur effects, for a sober yet dynamic image. The battery is integrated at the front of the frame and LEDs are built into the rims. The bike comes in several pastel colors, so everyone can find theirs.": "Le logo repose sur des lettres larges aux formes arrondies, qui évoquent la fluidité et la vitesse. L’identité visuelle associe noir et blanc, typographie Helvetica et effets de flou de mouvement, pour une image sobre et dynamique. La batterie est intégrée à l’avant du cadre et des LED sont intégrées aux jantes. Le vélo se décline en plusieurs coloris pastel, pour que chacun trouve le sien.",
    "A metro advertising campaign and an Instagram account extend the brand universe around the tagline “Ride long, ride always”.": "Une campagne d’affichage dans le métro et un compte Instagram déclinent l’univers de la marque autour de la signature « Ride long, ride always ».",

    "Fudgee Coffee is a concept launched by two investors around small, melting sweet pleasures. Its shops, in tune with the times, blend workspace, relaxation, music and interior architecture. The challenge: create a warm, recognizable logo and graphic identity that adapts to every medium.": "Fudgee Coffee est un concept lancé par deux investisseurs autour des petits plaisirs sucrés et fondants. Ses boutiques, dans l’air du temps, mêlent espace de travail, détente, musique et architecture d’intérieur. L’enjeu : créer un logo et une identité graphique chaleureux, reconnaissables et déclinables sur tous les supports.",
    "Logo": "Logo",
    "The logo pairs a rounded typeface with a pictogram of three stacked cups, built from simple geometric shapes (square, circle). It exists in several colorways to suit every background and medium.": "Le logo associe une typographie arrondie à un pictogramme de trois tasses empilées, construit à partir de formes géométriques simples (carré, rond). Il existe en plusieurs déclinaisons de couleurs pour s’adapter à chaque fond et chaque support.",
    "Graphic universe": "Univers graphique",
    "A warm palette evokes coffee, caramel and vanilla. A pattern made only of geometric shapes dresses the packaging, cups, tote bags, aprons and business cards. The typefaces are Righteous for headings and Azo Sans for text.": "Une palette de couleurs chaudes évoque le café, le caramel et la vanille. Un motif composé uniquement de formes géométriques habille les emballages, gobelets, tote bags, tabliers et cartes de visite. Les typographies sont Righteous pour les titres et Azo Sans pour les textes.",
    "Seasonal editions": "Déclinaisons de saison",
    "The pattern evolves through the year: a summer edition in bright colors (blue, turquoise) and a year-end edition (green, red, gold). Only the secondary colors change; the main colors stay constant to preserve the brand identity.": "Le motif change au fil de l’année : une édition estivale aux couleurs vives (bleu, turquoise) et une édition de fin d’année (vert, rouge, doré). Seules les couleurs secondaires varient, les couleurs principales restent constantes pour garder l’identité de la marque.",

    "An internship report conceived as a magazine issue, presenting the company, its teams and the work carried out.": "Un rapport de stage conçu comme un numéro de magazine, présentant l’entreprise, ses équipes et les missions réalisées.",
    "Instead of a standard document, the internship report is designed as a magazine issue. Cover, contents, chapter openers and spreads borrow the codes of fashion press: large italic headlines, scale contrasts, full-page photography.": "Au lieu d’un document classique, le rapport de stage est conçu comme un numéro de magazine. Couverture, sommaire, ouvertures de chapitres et doubles pages reprennent les codes de la presse de mode : grands titres en italique, contrastes d’échelle, photographies en pleine page.",
    "Approach": "Parti pris",
    "The report draws on the ELLE identity, pairing an elegant serif typeface with a clean sans-serif, to present the company, its teams and the work carried out, from the Versailles seminar to the print layouts. This portfolio version brings together a selection of spreads.": "Le rapport s’inspire de l’identité de ELLE, une typographie à empattements élégante associée à un sans-serif sobre, pour présenter l’entreprise, ses équipes et les missions réalisées, du séminaire de Versailles aux maquettes print. Cette version réunit une sélection de doubles pages.",

    "Illustrations": "Illustrations",
    "Ana’s Gallery is an app concept dedicated to the illustrator Ana Miminoshvili. The challenge: give her a space that suits her to present her work, share her news and sell her creations directly, without going through a generic platform.": "Ana’s Gallery est un concept d’application dédiée à l’illustratrice Ana Miminoshvili. L’enjeu : lui offrir un espace qui lui ressemble pour présenter ses œuvres, partager son actualité et vendre ses créations directement, sans passer par une plateforme généraliste.",
    "Ana’s illustrations are colorful, teeming, almost dreamlike. The interface therefore makes the opposite choice: a sober black and white that steps back to give the artworks the whole stage. Light and dark modes adapt the experience to every use. The identity pairs Montserrat for headings with Roboto for body text.": "Les illustrations d’Ana sont colorées, foisonnantes, presque oniriques. L’interface fait donc le choix inverse : un noir et blanc sobre, qui s’efface pour laisser les œuvres prendre toute la place. Un mode clair et un mode sombre permettent d’adapter l’expérience à chaque usage. La charte associe Montserrat pour les titres et Roboto pour les textes courants.",
    "An app in four spaces": "Une application en quatre espaces",
    "Gallery.": "La galerie.",
    "An image feed to browse like an exhibition, with the artist’s latest posts.": "Un fil d’images à parcourir comme une exposition, avec les derniers posts de l’artiste.",
    "Shop.": "La boutique.",
    "Detailed pages for each artwork (format, print run, price), with delivery and payment.": "Des fiches détaillées pour chaque œuvre (format, tirage, prix), avec livraison et paiement.",
    "Events.": "Les événements.",
    "A calendar of her meetings, exhibitions and classes.": "Un agenda de ses rencontres, expositions et cours.",
    "About Ana.": "À propos d’Ana.",
    "A presentation of the artist, with links to her social networks (Instagram, Behance, Dribbble).": "Une présentation de l’artiste, avec des liens vers ses réseaux (Instagram, Behance, Dribbble).",
    "A fixed navigation bar at the bottom of the screen gives permanent access to home, favorites and cart, so that buying stays within thumb’s reach.": "Une barre de navigation fixe en bas de l’écran donne un accès permanent à l’accueil, aux favoris et au panier, pour que l’achat reste à portée de pouce.",
    "Page 10 + blank page": "Page 10 + page blanche",
    "Concept project": "Projet concept",
    "Brand identity": "Identité visuelle",
    "Moodboard": "Moodboard",
    "Logo research": "Recherches de logo",
    "Visual system": "Système graphique",
    "Brand concept": "Concept de marque",
    "3D product design": "Modélisation 3D",
    "Color variations": "Déclinaisons de couleurs",
    "Advertising application": "Application publicitaire",
    "Billboard mockup": "Mise en situation publicitaire",
    "Social media": "Réseaux sociaux",
    "The project": "Le projet",
    "Complete project · 12 pages": "Projet complet · 12 pages",
    "Complete project · 37 pages": "Projet complet · 37 pages",
    "Open full PDF": "Ouvrir le PDF complet",
    "Download PDF": "Télécharger le PDF",
    "Page": "Page",
    "CONCEPT PROJECT · BRAND IDENTITY & PACKAGING": "PROJET CONCEPT · IDENTITÉ VISUELLE & PACKAGING",
    "A warm and playful identity for a contemporary coffee and sweet-treat concept combining food, work, music, and relaxed social spaces.": "Une identité chaleureuse et ludique pour un concept contemporain de café et de douceurs mêlant restauration, travail, musique et espaces de détente.",
    "Art direction, branding & packaging": "Direction artistique, identité visuelle & packaging",
    "Early explorations": "Premières recherches",
    "Logo concept": "Concept du logo",
    "Typography": "Typographie",
    "Color palette": "Palette de couleurs",
    "Graphic pattern": "Motif graphique",
    "Signage": "Signalétique",
    "Takeaway packaging": "Packaging à emporter",
    "Cup design": "Design des gobelets",
    "Stationery": "Papeterie",
    "Tote bag": "Tote bag",
    "Summer edition": "Édition estivale",
    "Summer packaging": "Packaging estival",
    "Holiday edition": "Édition fêtes de fin d’année",
    "Holiday packaging": "Packaging de fêtes",
    "Seasonal packaging": "Packaging saisonnier",
    "Seasonal tote bag": "Tote bag saisonnier",
    "CONCEPT PROJECT · MOBILE APP": "PROJET CONCEPT · APPLICATION MOBILE",
    "A mobile application dedicated to an illustrator, allowing visitors to discover her universe and purchase artworks or creative goods.": "Une application mobile dédiée à une illustratrice, permettant de découvrir son univers et d’acheter des œuvres ou des produits créatifs.",
    "UI/UX design, visual identity & prototype": "Design UI/UX, identité visuelle & prototype",
    "View interactive prototype ↗": "Voir le prototype interactif ↗",
    "EDITORIAL DESIGN · INTERNSHIP REPORT": "DESIGN ÉDITORIAL · RAPPORT DE STAGE",
    "Internship Report": "Rapport de stage",
    "Format": "Format",
    "Editorial report · selected spreads": "Rapport éditorial · sélection de doubles pages",
    "Art direction, layout & production": "Direction artistique, mise en page & réalisation",
    "About the report": "À propos du rapport",
    "ARCHIVES": "ARCHIVES",
    "GAMES": "JEUX",
    "Choose a game": "Choisir un jeu",
    "Games": "Jeux",
    "Pixel runner": "Saut pixel",
    "Classic arcade": "Arcade classique",
    "Pick one to start playing.": "Choisissez un jeu pour commencer.",
    "Snake": "Snake",
    "Cat Runner": "Chat runner",
    "Press Space, ↑, or click to jump": "Appuyez sur Espace, ↑ ou cliquez pour sauter",
    "Jump": "Sauter",
    "PLAY": "JOUER",

    "Open PDF": "Ouvrir le PDF",
    "Download": "Télécharger",
    "Resume language": "Langue du CV",

    "Score:": "Score :",
    "Moves:": "Mouvements :",
    "Final score:": "Score final :",
    "High score:": "Meilleur score :",
    "Use the arrow keys or WASD to play": "Utilisez les flèches ou WASD pour jouer",
    "Restart": "Recommencer",
    "Touch controls": "Commandes tactiles",
    "Up": "Haut",
    "Down": "Bas",
    "Left": "Gauche",
    "Right": "Droite",
    "GAME OVER": "PARTIE TERMINÉE",
    "Use the arrow keys or swipe": "Utilisez les flèches ou glissez",
    "Merge the tiles": "Fusionnez les tuiles",
    "Brick breaker": "Casse-briques",
    "Click to launch • use ← → or A/D to move": "Cliquez pour lancer • utilisez ← → ou A/D pour bouger",
    "Launch": "Lancer",
    "YOU WIN!": "GAGNÉ !",

    "Terminal — About": "Terminal — À propos",
    "Marion Zimmerlé Izquierdo": "Marion Zimmerlé Izquierdo",

    "New Message — Contact": "Nouveau message — Contact",
    "New Message": "Nouveau message",
    "To": "À",
    "From": "De",
    "Your email address": "Votre adresse e-mail",
    "Subject": "Objet",
    "What would you like to talk about?": "De quoi souhaitez-vous parler ?",
    "Message": "Message",
    "Write your message…": "Écrivez votre message…",
    "Message formatting": "Mise en forme du message",
    "Clear formatting": "Effacer la mise en forme",
    "Bold": "Gras",
    "Italic": "Italique",
    "Underline": "Souligné",
    "Add link": "Ajouter un lien",
    "Emoji": "Emoji",
    "Send Email": "Envoyer",
    "Enter the link URL:": "Saisissez l’URL du lien :",
    "Text to display:": "Texte à afficher :",
    "Please write a message first.": "Veuillez d’abord écrire un message.",
    "Email service unavailable. Please try again.": "Service d’e-mail indisponible. Veuillez réessayer.",
    "Sending…": "Envoi…",
    "Message sent ✓": "Message envoyé ✓",
    "Message could not be sent. Please try again.": "Le message n’a pas pu être envoyé. Veuillez réessayer.",
    "Portfolio contact": "Contact portfolio",

    "Help — How to Navigate": "Aide — Comment naviguer",
    "A quick guide to exploring my portfolio.": "Un guide rapide pour explorer le portfolio.",
    "Open": "Ouvrir",
    "Double-click a desktop icon to open a project, my resume, or Games.": "Double-cliquez sur une icône du bureau pour ouvrir un projet, le CV ou Jouer.",
    "Move": "Déplacer",
    "Drag a window by its title bar, or drag desktop icons to arrange them.": "Faites glisser une fenêtre par sa barre de titre, ou déplacez les icônes du bureau pour les organiser.",
    "Resize": "Redimensionner",
    "Drag the lower-right corner of a window to resize it.": "Faites glisser le coin inférieur droit d’une fenêtre pour la redimensionner.",
    "Menu bar": "Barre de menus",
    "Use File to open my resume or archive, or to reset the desktop. Click my name for About and Contact, and use EN/FR in the menu bar to switch languages.": "Utilisez Fichier pour ouvrir le CV, les archives et réinitialiser le bureau. Cliquez sur mon nom pour À propos et Contact, et utilisez EN/FR dans la barre de menus pour changer la langue.",
    "Dock": "Dock",
    "The Dock shows the software I use. Terminal and Trash are interactive.": "Le dock présente les logiciels que j’utilise. Terminal et Corbeille sont fonctionnels.",

    "Help — Keyboard Shortcuts": "Aide — Raccourcis clavier",
    "Common shortcuts for navigating the portfolio.": "Des actions rapides pour naviguer dans le portfolio.",
    "Enter / Exit Full Screen": "Activer / quitter le plein écran",
    "About": "À propos",
    "Close all windows": "Fermer toutes les fenêtres",
    "Close Menu / Active Window": "Fermer le menu / la fenêtre active",

    "Trash": "Corbeille",
    "Trash is empty": "La corbeille est vide",
    "There are no items in the Trash.": "Il n’y a aucun élément dans la corbeille.",

    "Profile photo": "Photo de profil",
    "Profile information": "Informations du profil",
    "Portfolio introduction": "Introduction du portfolio",
    "Clock and calendar": "Horloge et calendrier",
    "Previous month": "Mois précédent",
    "Next month": "Mois suivant",
    "Return to today": "Revenir à aujourd’hui",
    "Monthly calendar": "Calendrier mensuel",
    "Languages": "Langues",
    "Portfolio widgets": "Widgets du portfolio",
    "Software used": "Logiciels utilisés",
    "Open About": "Ouvrir À propos",
    "Open Terminal": "Ouvrir Terminal",
    "Open Trash": "Ouvrir la corbeille",
    "Close": "Fermer",
    "Minimize": "Réduire",
    "Zoom": "Agrandir",
    "Search": "Rechercher",
    "Email me": "M’écrire",
    "Send an email": "Envoyer un e-mail",
    "View Marion's LinkedIn profile": "Voir le profil LinkedIn de Marion",
    "Resize": "Redimensionner",
    "Volume": "Volume"
  }));

  function t(value) {
    if (language !== "fr") return value;
    return fr.get(value) || value;
  }

  function isExcluded(node) {
    const parent = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return !!parent?.closest(
      ".menubar__language, input, textarea, select, option, [contenteditable='true'], script, style, iframe"
    );
  }

  function translateTextNode(node, refreshOriginal = false) {
    if (!node || node.nodeType !== Node.TEXT_NODE || isExcluded(node)) return;

    if (refreshOriginal || !textOriginals.has(node)) {
      textOriginals.set(node, node.nodeValue);
    }

    const original = textOriginals.get(node);
    const trimmed = original.trim();
    if (!trimmed) return;

    const translated = language === "fr" ? (fr.get(trimmed) || trimmed) : trimmed;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = `${leading}${translated}${trailing}`;
  }

  function translateAttributes(element) {
    if (!(element instanceof Element)) return;
    if (element.closest(".menubar__language, script, style, iframe")) return;

    const attrs = ["title", "aria-label", "placeholder", "data-placeholder", "data-name"];
    let originals = attributeOriginals.get(element);

    if (!originals) {
      originals = {};
      attributeOriginals.set(element, originals);
    }

    attrs.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      if (!(name in originals)) originals[name] = element.getAttribute(name);

      const original = originals[name];
      element.setAttribute(name, language === "fr" ? t(original) : original);
    });
  }

  function translateSubtree(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
      return;
    }

    if (root instanceof Element) translateAttributes(root);

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
    );

    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else translateAttributes(node);
      node = walker.nextNode();
    }
  }

  function applyDocument() {
    if (observer) observer.disconnect();

    document.documentElement.lang = language === "fr" ? "fr-FR" : "en-US";
    document.title = language === "fr"
      ? "Marion Zimmerlé — Designer graphique & multimédia"
      : "Marion Zimmerlé — Graphic & Multimedia Designer";
    translateSubtree(document.body);
    updateLanguageUi();

    if (observer) observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function updateLanguageUi() {
    const button = document.getElementById("menubarLanguageButton");
    const menu = document.getElementById("menubarLanguageMenu");
    if (button) button.textContent = language.toUpperCase();

    menu?.querySelectorAll("[data-language]").forEach((option) => {
      option.setAttribute("aria-checked", String(option.dataset.language === language));
    });
  }

  function setLanguage(nextLanguage) {
    if (!supported.has(nextLanguage) || nextLanguage === language) {
      closeMenu();
      return;
    }

    language = nextLanguage;
    localStorage.setItem(STORAGE_KEY, language);
    applyDocument();

    document.dispatchEvent(new CustomEvent("portfolio:language-changed", {
      detail: { language }
    }));

    closeMenu();
  }

  function getLanguage() {
    return language;
  }

  function closeMenu() {
    const button = document.getElementById("menubarLanguageButton");
    const menu = document.getElementById("menubarLanguageMenu");
    if (!button || !menu) return;
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
  }

  function initMenu() {
    const button = document.getElementById("menubarLanguageButton");
    const menu = document.getElementById("menubarLanguageMenu");
    if (!button || !menu) return;

    updateLanguageUi();

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const willOpen = menu.hidden;
      menu.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));
      if (willOpen) {
        menu.querySelector(`[data-language="${language}"]`)?.focus();
      }
    });

    menu.querySelectorAll("[data-language]").forEach((option) => {
      option.addEventListener("click", () => setLanguage(option.dataset.language));
    });

    document.addEventListener("pointerdown", (event) => {
      if (!menu.hidden && !event.target.closest(".menubar__language")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !menu.hidden) {
        closeMenu();
        button.focus();
      }
    });
  }

  function initObserver() {
    observer = new MutationObserver((mutations) => {
      observer.disconnect();

      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          translateTextNode(mutation.target, true);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) translateTextNode(node, true);
          else translateSubtree(node);
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function init() {
    initMenu();
    applyDocument();
    initObserver();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { t, setLanguage, getLanguage };
})();

window.PortfolioI18n = PortfolioI18n;
