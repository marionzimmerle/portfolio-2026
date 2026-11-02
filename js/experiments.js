/* Independent experiments gallery: still artworks + HTML5 videos. */
const Experiments = (() => {
  const translations = {
    en: { close:"Close preview", previous:"Previous artwork", next:"Next artwork" },
    fr: { close:"Fermer l'aperçu", previous:"Création précédente", next:"Création suivante" }
  };
  function init(win) {
    const app=win.querySelector('[data-experiments-app]');
    if(!app || app.dataset.initialized) return;
    app.dataset.initialized='1';
    const all=Array.from(app.querySelectorAll('[data-exp-item]'));
    const viewer=app.querySelector('[data-exp-viewer]');
    const media=viewer.querySelector('[data-exp-media]');
    const title=viewer.querySelector('[data-exp-title]');
    const meta=viewer.querySelector('[data-exp-meta]');
    const closeButton=viewer.querySelector('[data-exp-close]');
    let category='all';
    let active=null;
    let previousFocus=null;
    let savedScrollTop=0;
    const scrollArea=win.querySelector('.window__content');
    const lang=()=>window.PortfolioI18n?.getLanguage() === 'fr' ? 'fr' : 'en';
    const visible=()=>all.filter(x=>!x.hidden);
    const labelFor=(element,key)=>element.dataset[key+(lang()==='fr'?'Fr':'En')] || '';

    function pauseMedia(){ media.querySelectorAll('video').forEach(video=>{video.pause(); video.removeAttribute('src');video.load();}); media.replaceChildren(); }
    function display(card){
      if(!card) return;
      pauseMedia();
      active=card;
      title.textContent=labelFor(card,'expTitle');
      meta.textContent=labelFor(card,'expMeta');
      const source=card.dataset.expSource;
      if(card.dataset.expKind==='video') {
        const video=document.createElement('video');
        video.src=source; video.controls=true; video.autoplay=true; video.playsInline=true; video.loop=true;
        video.preload='metadata';
        video.setAttribute('aria-label',title.textContent);
        media.appendChild(video);
        video.play().catch(()=>{});
      } else {
        const image=document.createElement('img'); image.src=source; image.alt=title.textContent; image.decoding='async';media.appendChild(image);
      }
    }
    function open(card){
      previousFocus=document.activeElement;
      savedScrollTop=scrollArea?.scrollTop || 0;
      if(scrollArea)scrollArea.scrollTop=0;
      app.classList.add('is-viewing');
      viewer.hidden=false;
      display(card);
      closeButton.focus();
    }
    function close(){
      if(viewer.hidden)return;
      pauseMedia();viewer.hidden=true;active=null;
      app.classList.remove('is-viewing');
      if(scrollArea)scrollArea.scrollTop=savedScrollTop;
      previousFocus?.focus?.();
    }
    function navigate(delta){const cards=visible();if(!cards.length)return;const idx=cards.indexOf(active);display(cards[(idx+delta+cards.length)%cards.length]);}
    function setCategory(next){
      category=next;
      all.forEach(card=>{card.hidden=category!=='all' && card.dataset.expFilter!==category;});
      app.querySelectorAll('[data-exp-category]').forEach(btn=>{
        const selected=btn.dataset.expCategory===category;
        btn.classList.toggle('is-active',selected);btn.setAttribute('aria-pressed',String(selected));
      });
      close();
    }
    app.querySelectorAll('[data-exp-category]').forEach(b=>b.addEventListener('click',()=>setCategory(b.dataset.expCategory)));
    all.forEach(card=>card.addEventListener('click',()=>open(card)));
    closeButton.addEventListener('click',close);
    viewer.querySelector('[data-exp-prev]').addEventListener('click',()=>navigate(-1));
    viewer.querySelector('[data-exp-next]').addEventListener('click',()=>navigate(1));
    viewer.addEventListener('click',event=>{if(event.target===viewer)close();});
    const onKey=(event)=>{
      if(viewer.hidden)return;
      if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();close();}
      if(event.key==='ArrowRight'){event.preventDefault();event.stopImmediatePropagation();navigate(1);}
      if(event.key==='ArrowLeft'){event.preventDefault();event.stopImmediatePropagation();navigate(-1);}
    };
    document.addEventListener('keydown',onKey,true);
    const onLanguage=()=>{
      if(active)display(active);
      const labels=translations[lang()];
      closeButton.setAttribute('aria-label',labels.close);
      viewer.querySelector('[data-exp-prev]').setAttribute('aria-label',labels.previous);
      viewer.querySelector('[data-exp-next]').setAttribute('aria-label',labels.next);
    };
    document.addEventListener('portfolio:language-changed',onLanguage);
    document.addEventListener('portfolio:window-closing',function cleanup(event){
      if(event.detail?.id!=='experiments'||event.detail?.element!==win)return;
      pauseMedia();document.removeEventListener('keydown',onKey,true);document.removeEventListener('portfolio:language-changed',onLanguage);document.removeEventListener('portfolio:window-closing',cleanup);
    });
    onLanguage();
  }
  document.addEventListener('portfolio:window-opened',event=>{
    if(event.detail?.id==='experiments')init(event.detail.element);
  });
  return {init};
})();
