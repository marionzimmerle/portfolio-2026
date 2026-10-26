/* Chess versus computer — uses chess.js for legal chess rules. */
const PortfolioGames = (() => {
  const instances = new Map();
  const pieces = {k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟',K:'♔',Q:'♕',R:'♖',B:'♗',N:'♘',P:'♙'};
  const points = {p:100,n:320,b:335,r:500,q:900,k:20000};
  const french = () => window.PortfolioI18n?.getLanguage?.() === 'fr';
  const say = (en,fr) => french()?fr:en;
  function create(windowEl) {
    const root = windowEl.querySelector('[data-chess]');
    if (!root) return {destroy(){}};
    const board=root.querySelector('[data-chess-board]'), status=root.querySelector('[data-chess-status]');
    const last=root.querySelector('[data-chess-last]'), level=root.querySelector('[data-chess-level]');
    const promo=root.querySelector('[data-chess-promotion]');
    let chess=typeof Chess==='function'?new Chess():null, selected=null, waiting=false, destroyed=false, timer=null, lastMove=null;
    function gameOver() {return chess.game_over();}
    function evaluate() {
      let score=0;
      chess.board().forEach((row,r)=>row.forEach((piece,c)=>{
        if(!piece)return;
        const center=3.5-Math.abs(3.5-c)+3.5-Math.abs(3.5-r);
        const val=points[piece.type]+(piece.type==='p'?center*4:center*2);
        score+=(piece.color==='b'?val:-val);
      }));
      return score;
    }
    function search(depth,alpha,beta) {
      if(chess.in_checkmate())return chess.turn()==='b'?-100000-depth:100000+depth;
      if(chess.in_draw())return 0;
      if(!depth)return evaluate();
      let moves=chess.moves({verbose:true});
      moves.sort((a,b)=>(!!b.captured?points[b.captured]:0)-(!!a.captured?points[a.captured]:0));
      if(chess.turn()==='b'){
        let best=-Infinity;
        for(const m of moves){chess.move(m);const v=search(depth-1,alpha,beta);chess.undo();best=Math.max(best,v);alpha=Math.max(alpha,best);if(beta<=alpha)break;}
        return best;
      }
      let best=Infinity;
      for(const m of moves){chess.move(m);const v=search(depth-1,alpha,beta);chess.undo();best=Math.min(best,v);beta=Math.min(beta,best);if(beta<=alpha)break;}
      return best;
    }
    function computerMove(){
      if(destroyed||!chess||gameOver()||chess.turn()!=='b')return;
      const depth=Number(level.value);
      const moves=chess.moves({verbose:true});
      let best=-Infinity, candidates=[];
      for(const m of moves){
        chess.move(m);
        const score=depth===1?evaluate()+Math.random()*90:search(depth-1,-Infinity,Infinity);
        chess.undo();
        if(score>best+0.01){best=score;candidates=[m];}
        else if(Math.abs(score-best)<0.01)candidates.push(m);
      }
      const move=candidates[Math.floor(Math.random()*candidates.length)];
      if(move){lastMove=chess.move(move);}
      waiting=false;render();
    }
    function move(from,to,promotion){
      const legal=chess.moves({square:from,verbose:true}).filter(m=>m.to===to);
      if(!legal.length)return;
      if(legal.some(m=>m.flags.includes('p'))&&!promotion){
        promo.hidden=false;
        promo.innerHTML='<span>'+say('Promote to:','Promotion :')+'</span>';
        for(const type of ['q','r','b','n']){
          const b=document.createElement('button');b.type='button';b.textContent=pieces[type.toUpperCase()];b.addEventListener('click',()=>{promo.hidden=true;move(from,to,type);});promo.appendChild(b);
        }
        return;
      }
      lastMove=chess.move({from,to,promotion:promotion||'q'});
      selected=null;waiting=true;render();
      timer=setTimeout(()=>{timer=null;computerMove();},220);
    }
    function choose(square){
      if(!chess||waiting||gameOver()||chess.turn()!=='w'||!promo.hidden)return;
      const p=chess.get(square);
      if(selected&&selected!==square&&chess.moves({square:selected,verbose:true}).some(m=>m.to===square)){move(selected,square);return;}
      selected=p?.color==='w'?(selected===square?null:square):null;
      render();
    }
    function render(){
      if(!chess){status.textContent=say('Unable to load chess rules. Check your internet connection.','Impossible de charger les règles. Vérifiez votre connexion Internet.');return;}
      board.innerHTML='';
      const targets=selected?chess.moves({square:selected,verbose:true}).map(m=>m.to):[];
      for(let rank=8;rank>=1;rank--)for(const file of 'abcdefgh'){
        const square=file+rank,p=chess.get(square),light=(file.charCodeAt(0)-97+rank)%2===0;
        const cell=document.createElement('button');cell.type='button';cell.className='chess-square '+(light?'chess-square--light':'chess-square--dark');
        if(selected===square)cell.classList.add('is-selected');
        if(targets.includes(square))cell.classList.add('is-target');
        if(lastMove&&(lastMove.from===square||lastMove.to===square))cell.classList.add('is-last');
        cell.setAttribute('aria-label',square+(p?' '+(p.color==='w'?'White ':'Black ')+p.type:''));
        if(p){const span=document.createElement('span');span.className='chess-piece '+(p.color==='w'?'chess-piece--white':'chess-piece--black');span.textContent=pieces[p.color==='w'?p.type.toUpperCase():p.type];cell.appendChild(span);}
        if(file==='a'){const label=document.createElement('small');label.className='chess-rank';label.textContent=rank;cell.appendChild(label);}
        if(rank===1){const label=document.createElement('small');label.className='chess-file';label.textContent=file;cell.appendChild(label);}
        cell.addEventListener('click',()=>choose(square));board.appendChild(cell);
      }
      if(chess.in_checkmate())status.textContent=chess.turn()==='w'?say('Checkmate — computer wins.','Échec et mat — l’ordinateur gagne.'):say('Checkmate — you win!','Échec et mat — vous gagnez !');
      else if(chess.in_draw())status.textContent=say('Draw game.','Partie nulle.');
      else if(waiting||chess.turn()==='b')status.textContent=say('Computer is thinking…','L’ordinateur réfléchit…');
      else status.textContent=chess.in_check()?say('Check! Your turn.','Échec ! À vous de jouer.'):say('Your turn — White','À vous de jouer — Blancs');
      last.textContent=lastMove?say('Last move: ','Dernier coup : ')+lastMove.san:say('Select a white piece to begin.','Sélectionnez une pièce blanche pour commencer.');
      root.querySelector('[data-chess-subtitle]').textContent=say('Play against the computer','Jouez contre l’ordinateur');
    }
    root.querySelector('[data-chess-restart]').addEventListener('click',()=>{if(timer)clearTimeout(timer);timer=null;chess?.reset();selected=null;waiting=false;lastMove=null;promo.hidden=true;render();});
    root.querySelector('[data-chess-undo]').addEventListener('click',()=>{if(!chess)return;if(timer)clearTimeout(timer);timer=null;chess.undo();if(chess.turn()==='b')chess.undo();selected=null;waiting=false;lastMove=null;promo.hidden=true;render();});
    const lang=()=>render();document.addEventListener('portfolio:language-changed',lang);
    render();
    return {destroy(){destroyed=true;if(timer)clearTimeout(timer);document.removeEventListener('portfolio:language-changed',lang);}};
  }
  document.addEventListener('portfolio:window-opened',e=>{if(e.detail.id==='play'){instances.get('play')?.destroy();instances.set('play',create(e.detail.element));}});
  document.addEventListener('portfolio:window-closing',e=>{if(e.detail.id==='play'){instances.get('play')?.destroy();instances.delete('play');}});
  return {};
})();
