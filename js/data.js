/* =========================================================================
   data.js
   -------------------------------------------------------------------------
   THIS IS THE ONLY PLACE WHERE YOU ADD / EDIT YOUR PROJECTS.

   To add a new project: copy one of the "type: 'folder'" objects in the
   DESKTOP_ITEMS array, change its id and name, and fill in its HTML
   content under "content". The rest of the system (icons, windows,
   dragging, saving) adapts automatically — you don't need to touch
   anything else.

   Fields available on each item:
   - id        : unique identifier (string, no spaces) -> used as the key
                 for saving icon position. Don't change it once published
                 if you want to keep the saved position.
   - name      : name shown under the icon.
   - type      : "folder" (project folder) or "file" (simple file icon).
   - kind      : sub-category used to pick the default icon glyph/color:
                 "project" | "about" | "cv" | "contact" | "archive" |
                 "trash". Ignored once "icon" (below) is set.
   - icon      : OPTIONAL. Path to your own image (e.g.
                 "assets/icons/project-01.png"). When set, the default
                 glossy background and glyph are dropped entirely and
                 your image is shown as-is, at its own shape — nothing
                 else is drawn behind or around it.
   - x, y      : default position on the desktop (in pixels), used only
                 the very first time (after that, the real position is
                 remembered in the visitor's localStorage).
   - window    : configuration for the window that opens on double-click.
       - title      : title shown in the titlebar.
       - width      : default width in pixels.
       - height     : default height in pixels.
       - content    : HTML content shown inside the window. Keep the
                      existing placeholder for now — you'll fill it in
                      yourself later (text, images, videos, free HTML).
   ========================================================================= */

const DESKTOP_ITEMS = [

  // ---------------------------------------------------------------------
  // PROJECT FOLDERS
  // Just add a new object here for a PROJECT 05, 06, etc.
  // ---------------------------------------------------------------------
  {
    id: "project-01",
    name: "evo",
    type: "folder",
    kind: "project",
    icon: "assets/icons/folder.png", 
    x: 320,
    y: 60,
    window: {
      title: "EVO — ELECTRIC BIKE",
      width: 1050,
      height: 760,
      centered: true,
      content: `
        <article class="project-case" data-project-gallery>
          <header class="project-case__header">
            <div>
              <p class="project-case__eyebrow">CONCEPT PROJECT · BRAND IDENTITY &amp; 3D</p>
              <h2>EVO — Electric Bike</h2>
              <p class="project-case__lead">A complete visual identity for an urban electric bike brand, designed to feel minimal, accessible, and forward-looking.</p>
            </div>
            <dl class="project-case__meta">
              <div><dt>Role</dt><dd>Art direction, branding &amp; 3D</dd></div>
              <div><dt>Tools</dt><dd>Blender, Illustrator, Photoshop</dd></div>
              <div><dt>Context</dt><dd>Concept project</dd></div>
            </dl>
          </header>

          <section class="project-pdf" aria-label="Complete EVO project">
            <div class="project-pdf__toolbar">
              <span>Complete project · 12 pages</span>
              <div>
                <a href="assets/projects/evo/evo-project.pdf" target="_blank" rel="noopener">Open full PDF</a>
                <a href="assets/projects/evo/evo-project.pdf" download="EVO_Marion_Zimmerle.pdf">Download PDF</a>
              </div>
            </div>
            <iframe src="assets/projects/evo/evo-project.pdf#view=FitH" title="Complete EVO project PDF"></iframe>
          </section>

          <section class="project-gallery project-gallery--extracts" aria-label="EVO project gallery">
            <div class="project-gallery__stage">
              <button class="project-gallery__arrow project-gallery__arrow--prev" type="button" data-gallery-prev aria-label="Previous image">‹</button>
              <div class="project-gallery__slides" data-page-prefix="assets/projects/evo/evo-final-" data-page-count="12" data-page-label="EVO">
                <figure class="project-gallery__slide is-active"><img src="assets/projects/evo/evo-01.jpg" alt="EVO electric bike brand cover"><figcaption>Brand identity</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-02.jpg" alt="EVO visual moodboard"><figcaption>Moodboard</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-03.jpg" alt="EVO logo research"><figcaption>Logo research</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-06.jpg" alt="EVO colors and typography"><figcaption>Visual system</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-07.jpg" alt="EVO brand concept"><figcaption>Brand concept</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-08.jpg" alt="EVO electric bike 3D model"><figcaption>3D product design</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-09.jpg" alt="EVO electric bike color variations"><figcaption>Color variations</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-10.jpg" alt="EVO advertising poster"><figcaption>Advertising application</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-11.jpg" alt="EVO billboard mockup"><figcaption>Billboard mockup</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/evo/evo-12.jpg" alt="EVO social media mockup"><figcaption>Social media</figcaption></figure>
              </div>
              <button class="project-gallery__arrow project-gallery__arrow--next" type="button" data-gallery-next aria-label="Next image">›</button>
            </div>
            <div class="project-gallery__footer">
              <span data-gallery-counter>1 / 10</span>
              <div class="project-gallery__dots" data-gallery-dots aria-label="Choose an image"></div>
            </div>
          </section>

          <section class="project-case__story">
            <h3>The project</h3>
            <p>EVO, for evolution: a brand designed for beginners and experienced cyclists alike. The challenge: make the electric bike desirable, with a slim, simple and elegant design.</p>
            <h3>Identity and product</h3>
            <p>The logo is built on wide, rounded letters that evoke fluidity and speed. The visual identity combines black and white, Helvetica typography and motion blur effects, for a sober yet dynamic image. The battery is integrated at the front of the frame and LEDs are built into the rims. The bike comes in several pastel colors, so everyone can find theirs.</p>
            <h3>Communication</h3>
            <p>A metro advertising campaign and an Instagram account extend the brand universe around the tagline “Ride long, ride always”.</p>
          </section>
        </article>
      `
    }
  },
  {
    id: "project-02",
    name: "fudgee",
    type: "folder",
    kind: "project",
    icon: "assets/icons/folder.png", 
    x: 320,
    y: 200,
    window: {
      title: "FUDGEE — COFFEE BRAND",
      width: 1050,
      height: 760,
      centered: true,
      content: `
        <article class="project-case project-case--fudgee" data-project-gallery>
          <header class="project-case__header">
            <div>
              <p class="project-case__eyebrow">CONCEPT PROJECT · BRAND IDENTITY &amp; PACKAGING</p>
              <h2>Fudgee Coffee</h2>
              <p class="project-case__lead">A warm and playful identity for a contemporary coffee and sweet-treat concept combining food, work, music, and relaxed social spaces.</p>
            </div>
            <dl class="project-case__meta">
              <div><dt>Role</dt><dd>Art direction, branding &amp; packaging</dd></div>
              <div><dt>Tools</dt><dd>Illustrator, Photoshop</dd></div>
              <div><dt>Context</dt><dd>Concept project</dd></div>
            </dl>
          </header>

          <section class="project-pdf" aria-label="Complete Fudgee Coffee project">
            <div class="project-pdf__toolbar">
              <span>Complete project · 37 pages</span>
              <div>
                <a href="assets/projects/fudgee/fudgee-coffee-project.pdf" target="_blank" rel="noopener">Open full PDF</a>
                <a href="assets/projects/fudgee/fudgee-coffee-project.pdf" download="Fudgee_Coffee_Marion_Zimmerle.pdf">Download PDF</a>
              </div>
            </div>
            <iframe src="assets/projects/fudgee/fudgee-coffee-project.pdf#view=FitH" title="Complete Fudgee Coffee project PDF"></iframe>
          </section>

          <section class="project-gallery project-gallery--extracts" aria-label="Fudgee Coffee project gallery">
            <div class="project-gallery__stage">
              <button class="project-gallery__arrow project-gallery__arrow--prev" type="button" data-gallery-prev aria-label="Previous image">‹</button>
              <div class="project-gallery__slides" data-page-prefix="assets/projects/fudgee/fudgee-" data-page-count="37" data-page-label="Fudgee Coffee">
                <figure class="project-gallery__slide is-active"><img src="assets/projects/fudgee/fudgee-01.jpg" alt="Fudgee Coffee brand cover"><figcaption>Brand identity</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-03.jpg" alt="Fudgee Coffee moodboard"><figcaption>Moodboard</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-04.jpg" alt="Fudgee Coffee first logo explorations"><figcaption>Early explorations</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-05.jpg" alt="Fudgee Coffee logo concept"><figcaption>Logo concept</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-12.jpg" alt="Fudgee Coffee typography"><figcaption>Typography</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-13.jpg" alt="Fudgee Coffee color palette"><figcaption>Color palette</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-14.jpg" alt="Fudgee Coffee geometric pattern"><figcaption>Graphic pattern</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-16.jpg" alt="Fudgee Coffee storefront sign"><figcaption>Signage</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-17.jpg" alt="Fudgee Coffee takeaway packaging"><figcaption>Takeaway packaging</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-18.jpg" alt="Fudgee Coffee cup designs"><figcaption>Cup design</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-20.jpg" alt="Fudgee Coffee stationery"><figcaption>Stationery</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-22.jpg" alt="Fudgee Coffee tote bag"><figcaption>Tote bag</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-24.jpg" alt="Fudgee Coffee summer identity"><figcaption>Summer edition</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-27.jpg" alt="Fudgee Coffee summer packaging"><figcaption>Summer packaging</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-31.jpg" alt="Fudgee Coffee holiday identity"><figcaption>Holiday edition</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-34.jpg" alt="Fudgee Coffee holiday cups"><figcaption>Holiday packaging</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-36.jpg" alt="Fudgee Coffee holiday bag"><figcaption>Seasonal packaging</figcaption></figure>
                <figure class="project-gallery__slide"><img src="assets/projects/fudgee/fudgee-37.jpg" alt="Fudgee Coffee holiday tote bag"><figcaption>Seasonal tote bag</figcaption></figure>
              </div>
              <button class="project-gallery__arrow project-gallery__arrow--next" type="button" data-gallery-next aria-label="Next image">›</button>
            </div>
            <div class="project-gallery__footer">
              <span data-gallery-counter>1 / 18</span>
              <div class="project-gallery__dots" data-gallery-dots aria-label="Choose an image"></div>
            </div>
          </section>

          <section class="project-case__story">
            <h3>The project</h3>
            <p>Fudgee Coffee is a concept launched by two investors around small, melting sweet pleasures. Its shops, in tune with the times, blend workspace, relaxation, music and interior architecture. The challenge: create a warm, recognizable logo and graphic identity that adapts to every medium.</p>
            <h3>Logo</h3>
            <p>The logo pairs a rounded typeface with a pictogram of three stacked cups, built from simple geometric shapes (square, circle). It exists in several colorways to suit every background and medium.</p>
            <h3>Graphic universe</h3>
            <p>A warm palette evokes coffee, caramel and vanilla. A pattern made only of geometric shapes dresses the packaging, cups, tote bags, aprons and business cards. The typefaces are Righteous for headings and Azo Sans for text.</p>
            <h3>Seasonal editions</h3>
            <p>The pattern evolves through the year: a summer edition in bright colors (blue, turquoise) and a year-end edition (green, red, gold). Only the secondary colors change; the main colors stay constant to preserve the brand identity.</p>
          </section>
        </article>
      `
    }
  },
  {
    id: "project-03",
    name: "ELLE",
    type: "folder",
    kind: "project",
    icon: "assets/icons/folder.png", 
    x: 320,
    y: 340,
    window: {
      title: "INTERNSHIP REPORT — EDITORIAL DESIGN",
      width: 1050,
      height: 760,
      centered: true,
      content: `
        <article class="project-case project-case--stage" data-project-magazine>
          <header class="project-case__header">
            <div>
              <p class="project-case__eyebrow">EDITORIAL DESIGN · INTERNSHIP REPORT</p>
              <h2>Internship Report</h2>
              <p class="project-case__lead">An internship report conceived as a magazine issue, presenting the company, its teams and the work carried out.</p>
            </div>
            <dl class="project-case__meta">
              <div><dt>Format</dt><dd>Editorial report · selected spreads</dd></div>
              <div><dt>Role</dt><dd>Art direction, layout &amp; production</dd></div>
              <div><dt>Tools</dt><dd>InDesign, Illustrator, Photoshop</dd></div>
            </dl>
          </header>

          <section class="project-magazine" aria-label="Complete internship report">
            <div class="project-magazine__stage">
              <button class="project-gallery__arrow project-gallery__arrow--prev" type="button" data-magazine-prev aria-label="Previous spread">‹</button>
              <div class="project-magazine__slides" data-page-prefix="assets/projects/stage-report/stage-" data-page-count="63" data-page-list="1,4,5,6,7,8,9,10,blank,14,15,16,17,18,19,20,21,24,25,26,27,28,29,32,33,36,37,38,39,40,41,42,43,48,49,56,57,58,59,62,63" data-page-label="Internship report"></div>
              <button class="project-gallery__arrow project-gallery__arrow--next" type="button" data-magazine-next aria-label="Next spread">›</button>
            </div>
            <div class="project-magazine__footer">
              <div class="project-magazine__status">
                <span data-magazine-counter>Page 1</span>
                <div class="project-magazine__zoom" aria-label="Magazine zoom controls">
                  <button type="button" data-magazine-zoom-out aria-label="Zoom out">−</button>
                  <button type="button" data-magazine-zoom-reset aria-label="Reset zoom">100 %</button>
                  <button type="button" data-magazine-zoom-in aria-label="Zoom in">+</button>
                </div>
              </div>
              <div class="project-gallery__dots" data-magazine-dots aria-label="Choose a spread"></div>
            </div>
          </section>

          <section class="project-case__story">
            <h3>About the report</h3>
            <p>Instead of a standard document, the internship report is designed as a magazine issue. Cover, contents, chapter openers and spreads borrow the codes of fashion press: large italic headlines, scale contrasts, full-page photography.</p>
            <h3>Approach</h3>
            <p>The report draws on the ELLE identity, pairing an elegant serif typeface with a clean sans-serif, to present the company, its teams and the work carried out, from the Versailles seminar to the print layouts. This portfolio version brings together a selection of spreads.</p>
          </section>
        </article>
      `
    }
  },
  {
    id: "project-04",
    name: "app’art",
    type: "folder",
    kind: "project",
    icon: "assets/icons/folder.png", 
    x: 320,
    y: 480,
    window: {
      title: "APP’ART — MOBILE APP",
      width: 1050,
      height: 760,
      centered: true,
      content: `
        <article class="project-case project-case--appart" data-project-gallery>
          <header class="project-case__header">
            <div>
              <p class="project-case__eyebrow">CONCEPT PROJECT · MOBILE APP</p>
              <h2>App’Art</h2>
              <p class="project-case__lead">A mobile application dedicated to an illustrator, allowing visitors to discover her universe and purchase artworks or creative goods.</p>
            </div>
            <dl class="project-case__meta">
              <div><dt>Role</dt><dd>UI/UX design, visual identity &amp; prototype</dd></div>
              <div><dt>Tools</dt><dd>Figma</dd></div>
              <div><dt>Illustrations</dt><dd>Ana Miminoshvili</dd></div>
              <div><dt>Context</dt><dd>Concept project</dd></div>
            </dl>
          </header>

          <div class="project-case__actions">
            <a class="project-case__prototype" href="https://www.figma.com/proto/aj03wH3d51VSyItVjAhryn/App-artist---Marion-Zimmerl%C3%A9?page-id=0%3A1&amp;node-id=20%3A63&amp;starting-point-node-id=20%3A63" target="_blank" rel="noopener">View interactive prototype ↗</a>
          </div>

          <section class="project-gallery project-gallery--extracts" aria-label="App’Art project gallery">
            <div class="project-gallery__stage">
              <button class="project-gallery__arrow project-gallery__arrow--prev" type="button" data-gallery-prev aria-label="Previous page">‹</button>
              <div class="project-gallery__slides" data-page-prefix="assets/projects/appart/appart-page-" data-page-count="4" data-page-label="App’Art"></div>
              <button class="project-gallery__arrow project-gallery__arrow--next" type="button" data-gallery-next aria-label="Next page">›</button>
            </div>
            <div class="project-gallery__footer">
              <span data-gallery-counter>1 / 4</span>
              <div class="project-gallery__dots" data-gallery-dots aria-label="Choose a page"></div>
            </div>
          </section>
          <div class="appart-pdf-links">
            <a href="assets/projects/appart/appart-project.pdf" target="_blank" rel="noopener">Open full PDF</a>
            <a href="assets/projects/appart/appart-project.pdf" download="AppArt_Marion_Zimmerle.pdf">Download PDF</a>
          </div>

          <section class="project-case__story">
            <h3>The project</h3>
            <p>App’Art is an app concept dedicated to the illustrator Ana Miminoshvili. The challenge: give her a space that suits her to present her work, share her news and sell her creations directly, without going through a generic platform.</p>
            <h3>Approach</h3>
            <p>Ana’s illustrations are colorful, teeming, almost dreamlike. The interface therefore makes the opposite choice: a sober black and white that steps back to give the artworks the whole stage. Light and dark modes adapt the experience to every use. The identity pairs Montserrat for headings with Roboto for body text.</p>
            <h3>An app in four spaces</h3>
            <p><strong>Gallery.</strong> An image feed to browse like an exhibition, with the artist’s latest posts.</p>
            <p><strong>Shop.</strong> Detailed pages for each artwork (format, print run, price), with delivery and payment.</p>
            <p><strong>Events.</strong> A calendar of her meetings, exhibitions and classes.</p>
            <p><strong>About Ana.</strong> A presentation of the artist, with links to her social networks (Instagram, Behance, Dribbble).</p>
            <p>A fixed navigation bar at the bottom of the screen gives permanent access to home, favorites and cart, so that buying stays within thumb’s reach.</p>
          </section>
        </article>
      `
    }
  },

  // ---------------------------------------------------------------------
  // FILES / ICONS (cv, archives, game)
  // ---------------------------------------------------------------------
  {
    id: "cv",
    name: "RESUME",
    type: "file",
    kind: "cv",
    icon: "assets/icons/txt.png", 
    x: 440,
    y: 180,
    window: {
      title: "RESUME",
      width: 900,
      height: 700,
      content: `
        <div class="cv-viewer" data-cv-viewer>
          <div class="cv-viewer__toolbar">
            <div class="cv-viewer__languages" aria-label="Resume language">
              <button type="button" class="is-active" data-cv-language="fr" aria-pressed="true">FR</button>
              <button type="button" data-cv-language="en" aria-pressed="false">EN</button>
            </div>
            <div class="cv-viewer__actions">
              <a href="assets/cv/cv-fr.pdf" target="_blank" rel="noopener" data-cv-open>Open PDF</a>
              <a href="assets/cv/cv-fr.pdf" download="CV_Marion_Zimmerle_FR.pdf" data-cv-download>Download</a>
            </div>
          </div>
          <iframe
            class="cv-viewer__frame"
            src="assets/cv/cv-fr.pdf#view=FitH"
            title="Marion Zimmerlé Resume — French"
            data-cv-frame
          ></iframe>
        </div>
      `
    }
  },
  {
    id: "archives",
    name: "ARCHIVES",
    type: "file",
    kind: "archive",
    icon: "assets/icons/archive.png", 
    x: 440,
    y: 420,
    url: "https://readymag.website/u111931852/4005346/",
    window: null
  },
  {
    id: "play",
    name: "PLAY",
    type: "file",
    kind: "game",
    icon: "assets/icons/game.png",
    x: 560,
    y: 60,
    window: {
      title: "GAMES",
      width: 452,
      height: 640,
      content: `
        <div class="games-hub" data-games>
          <section class="games-launcher" data-games-launcher>
            <div class="games-launcher__intro">
              <span class="game-card__eyebrow">PLAY</span>
              <h3 class="games-launcher__title">Choose a game</h3>
              <p class="games-launcher__subtitle">Pick one to start playing.</p>
            </div>

            <div class="games-launcher__grid">
              <button class="games-launcher__card" type="button" data-launch-game="snake">
                <span class="games-launcher__preview games-launcher__preview--snake" aria-hidden="true">
                  <span class="preview-snake__pixel preview-snake__pixel--1"></span>
                  <span class="preview-snake__pixel preview-snake__pixel--2"></span>
                  <span class="preview-snake__pixel preview-snake__pixel--3"></span>
                  <span class="preview-snake__pixel preview-snake__pixel--4"></span>
                  <span class="preview-snake__food"></span>
                </span>
                <span class="games-launcher__meta">
                  <strong>SNAKE</strong>
                  <small>Classic arcade</small>
                </span>
              </button>

              <button class="games-launcher__card" type="button" data-launch-game="runner">
                <span class="games-launcher__preview games-launcher__preview--runner" aria-hidden="true">
                  <span class="preview-cat">
                    <span class="preview-cat__tail"></span>
                    <span class="preview-cat__body"></span>
                    <span class="preview-cat__head"></span>
                    <span class="preview-cat__ear preview-cat__ear--left"></span>
                    <span class="preview-cat__ear preview-cat__ear--right"></span>
                    <span class="preview-cat__mask"></span>
                    <span class="preview-cat__eye"></span>
                  </span>
                  <span class="preview-runner__box"></span>
                </span>
                <span class="games-launcher__meta">
                  <strong>CAT RUNNER</strong>
                  <small>Pixel runner</small>
                </span>
              </button>

              <button class="games-launcher__card" type="button" data-launch-game="breakout">
                <span class="games-launcher__preview games-launcher__preview--breakout" aria-hidden="true">
                  <span class="preview-breakout__brick preview-breakout__brick--1"></span>
                  <span class="preview-breakout__brick preview-breakout__brick--2"></span>
                  <span class="preview-breakout__brick preview-breakout__brick--3"></span>
                  <span class="preview-breakout__brick preview-breakout__brick--4"></span>
                  <span class="preview-breakout__brick preview-breakout__brick--5"></span>
                  <span class="preview-breakout__brick preview-breakout__brick--6"></span>
                  <span class="preview-breakout__ball"></span>
                  <span class="preview-breakout__paddle"></span>
                </span>
                <span class="games-launcher__meta">
                  <strong>BREAKOUT</strong>
                  <small>Brick breaker</small>
                </span>
              </button>

              <button class="games-launcher__card" type="button" data-launch-game="2048">
                <span class="games-launcher__preview games-launcher__preview--2048" aria-hidden="true">
                  <span class="preview-2048__tile preview-2048__tile--1">2</span>
                  <span class="preview-2048__tile preview-2048__tile--2">4</span>
                  <span class="preview-2048__tile preview-2048__tile--3">8</span>
                  <span class="preview-2048__tile preview-2048__tile--4">16</span>
                </span>
                <span class="games-launcher__meta">
                  <strong>2048</strong>
                  <small>Merge the tiles</small>
                </span>
              </button>
            </div>
          </section>

          <section class="games-hub__panel" data-game-panel="snake" hidden>
            <div class="snake-game" data-snake-game>
              <div class="game-card__hero">
                <div class="game-card__title-wrap">
                  <span class="game-card__eyebrow">PLAY</span>
                  <h3 class="game-card__title">SNAKE</h3>
                </div>
                <div class="game-card__actions">
                  <button class="game-card__back" type="button" data-games-back>Games</button>
                  <button class="game-card__restart" type="button" data-snake-restart>Restart</button>
                </div>
              </div>

              <div class="game-card__stats">
                <div class="game-card__stat">
                  <span>Score:</span>
                  <strong data-snake-score>0</strong>
                </div>
                <div class="game-card__stat">
                  <span>High score:</span>
                  <strong data-snake-best>0</strong>
                </div>
              </div>

              <div class="game-card__board-wrap game-card__board-wrap--square">
                <canvas class="game-card__board" data-snake-canvas width="320" height="320" aria-label="Snake game"></canvas>
                <div class="game-card__message" data-snake-message>
                  <strong>SNAKE</strong>
                  <span>Use the arrow keys or WASD to play</span>
                </div>
              </div>

              <div class="game-card__footer">
                <span class="game-card__hint">Use the arrow keys or WASD to play</span>
              </div>

              <div class="game-card__controls" aria-label="Touch controls">
                <button type="button" data-snake-direction="up" aria-label="Up">▲</button>
                <button type="button" data-snake-direction="left" aria-label="Left">◀</button>
                <button type="button" data-snake-direction="down" aria-label="Down">▼</button>
                <button type="button" data-snake-direction="right" aria-label="Right">▶</button>
              </div>
            </div>
          </section>

          <section class="games-hub__panel" data-game-panel="runner" hidden>
            <div class="runner-game" data-runner-game>
              <div class="game-card__hero">
                <div class="game-card__title-wrap">
                  <span class="game-card__eyebrow">PLAY</span>
                  <h3 class="game-card__title">CAT RUNNER</h3>
                </div>
                <div class="game-card__actions">
                  <button class="game-card__back" type="button" data-games-back>Games</button>
                  <button class="game-card__restart" type="button" data-runner-restart>Restart</button>
                </div>
              </div>

              <div class="game-card__stats">
                <div class="game-card__stat">
                  <span>Score:</span>
                  <strong data-runner-score>0</strong>
                </div>
                <div class="game-card__stat">
                  <span>High score:</span>
                  <strong data-runner-best>0</strong>
                </div>
              </div>

              <div class="game-card__board-wrap game-card__board-wrap--runner">
                <canvas class="game-card__board" data-runner-canvas width="320" height="240" aria-label="Cat runner game"></canvas>
                <div class="game-card__message" data-runner-message>
                  <strong>CAT RUNNER</strong>
                  <span>Press Space, ↑, or click to jump</span>
                </div>
              </div>

              <div class="game-card__footer">
                <span class="game-card__hint">Press Space, ↑, or click to jump</span>
              </div>

              <div class="runner-game__controls" aria-label="Touch controls">
                <button type="button" data-runner-jump>Jump</button>
              </div>
            </div>
          </section>

          <section class="games-hub__panel" data-game-panel="breakout" hidden>
            <div class="breakout-game" data-breakout-game>
              <div class="game-card__hero">
                <div class="game-card__title-wrap">
                  <span class="game-card__eyebrow">PLAY</span>
                  <h3 class="game-card__title">BREAKOUT</h3>
                </div>
                <div class="game-card__actions">
                  <button class="game-card__back" type="button" data-games-back>Games</button>
                  <button class="game-card__restart" type="button" data-breakout-restart>Restart</button>
                </div>
              </div>

              <div class="game-card__stats">
                <div class="game-card__stat">
                  <span>Score:</span>
                  <strong data-breakout-score>0</strong>
                </div>
                <div class="game-card__stat">
                  <span>High score:</span>
                  <strong data-breakout-best>0</strong>
                </div>
              </div>

              <div class="game-card__board-wrap game-card__board-wrap--breakout">
                <canvas class="game-card__board" data-breakout-canvas width="320" height="240" aria-label="Breakout game"></canvas>
                <div class="game-card__message" data-breakout-message>
                  <strong>BREAKOUT</strong>
                  <span>Click to launch • use ← → or A/D to move</span>
                </div>
              </div>

              <div class="game-card__footer">
                <span class="game-card__hint">Click to launch • use ← → or A/D to move</span>
              </div>

              <div class="breakout-game__controls" aria-label="Touch controls">
                <button type="button" data-breakout-direction="left" aria-label="Left">◀</button>
                <button type="button" data-breakout-launch>Launch</button>
                <button type="button" data-breakout-direction="right" aria-label="Right">▶</button>
              </div>
            </div>
          </section>

          <section class="games-hub__panel" data-game-panel="2048" hidden>
            <div class="game-2048" data-2048-game>
              <div class="game-card__hero">
                <div class="game-card__title-wrap">
                  <span class="game-card__eyebrow">PLAY</span>
                  <h3 class="game-card__title">2048</h3>
                </div>
                <div class="game-card__actions">
                  <button class="game-card__back" type="button" data-games-back>Games</button>
                  <button class="game-card__restart" type="button" data-2048-restart>Restart</button>
                </div>
              </div>

                            <div class="game-card__stats game-2048__stats">
                <div class="game-card__stat">
                  <span>Score:</span>
                  <strong data-2048-score>0</strong>
                </div>
                <div class="game-card__stat">
                  <span>Moves:</span>
                  <strong data-2048-moves>0</strong>
                </div>
                <div class="game-card__stat">
                  <span>High score:</span>
                  <strong data-2048-best>0</strong>
                </div>
              </div>

              <div class="game-2048__board-wrap">
                <div class="game-2048__board" data-2048-board aria-label="2048 game"></div>
                <div class="game-card__message game-2048__message is-hidden" data-2048-message>
                  <strong>GAME OVER</strong>
                  <span>Score: 0</span>
                </div>
              </div>

              <div class="game-card__footer">
                <span class="game-card__hint">Use the arrow keys or swipe</span>
              </div>
            </div>
          </section>
        </div>
      `
    }
  },
  {
    id: "color-lab",
    name: "COLOR LAB",
    type: "file",
    kind: "colorlab",
    icon: "assets/icons/colorlab.png",
    x: 560,
    y: 200,
    window: {
      title: "Color Lab",
      width: 780,
      height: 560,
      centered: true,
      content: `
        <div class="color-lab" data-color-lab>
          <header class="color-lab__header">
            <div>
              <span class="color-lab__eyebrow">COLOR LAB</span>
              <h2>Create your palette</h2>
              <p>Generate a combination, lock the colors you love, then copy their HEX codes.</p>
            </div>
            <div class="color-lab__actions">
              <label>
                <span>Harmony</span>
                <select data-color-harmony aria-label="Color harmony">
                  <option value="curated">Curated</option>
                  <option value="analogous">Analogous</option>
                  <option value="complementary">Complementary</option>
                  <option value="monochrome">Monochrome</option>
                </select>
              </label>
              <button type="button" class="color-lab__generate" data-color-generate>Generate palette</button>
            </div>
          </header>

          <div class="color-lab__palette" data-color-palette aria-label="Generated color palette"></div>

          <footer class="color-lab__footer">
            <span data-color-status aria-live="polite">Click a HEX code to copy it.</span>
            <button type="button" data-color-copy-all>Copy all</button>
          </footer>
        </div>
      `
    }
  }
];
