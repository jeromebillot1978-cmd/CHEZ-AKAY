// chatbot.js – Votre Enseigne – Pizzeria d'Origny-Sainte-Benoîte
(function() {

  const REPONSES = [
    {
      keys: ['menu','carte','pizza','pizzas','manger','plat','prix'],
      rep: `🍕 Voici nos spécialités :<br><br>
• <b>Bruschetta</b> – à partir de 8 €<br>
• <b>Pizzas Base Tomate</b> – de 10 à 14 €<br>
• <b>Pizzas Base Crème</b> – de 8 à 13 €<br>
• <b>Pizzas Spéciales</b> – 15 €<br>
• <b>Pâtes</b> – de 10 à 12 €<br>
• <b>Salades</b> – de 10 à 11 €<br><br>
<a href="menu.html" style="color:#c9a84c">→ Voir toute la carte</a>`
    },
    {
      keys: ['horaire','heure','ouvert','ferme','disponible','soir'],
      rep: `⏰ Nos horaires :<br><br>
• <b>Mardi – Vendredi</b> : 18h30 – 22h30<br>
• <b>Samedi</b> : 12h00 – 14h00 et 18h30 – 23h00<br>
• <b>Dimanche</b> : 12h00 – 14h00 et 18h30 – 22h00<br>
• <b>Lundi</b> : Fermé`
    },
    {
      keys: ['commander','commande','comment','passer','telephone','contact','appeler','numero'],
      rep: `📞 Pour passer commande ou nous joindre, retrouvez notre numéro sur la page <a href="index.html#contact" style="color:#c9a84c">Contact</a>.`
    },
    {
      keys: ['bruschetta'],
      rep: `🥖 Nos Bruschetta :<br><br>
• 3 Fromages – 8 €<br>
• La Piquante – 8 €<br>
• Chèvre Miel – 8 €<br>
• La Carbo – 8 €<br>
• Le Perso (4 ingrédients au choix) – 10 €`
    },
    {
      keys: ['pate','pates','spaghetti','carbonara','bolo'],
      rep: `🍝 Nos Pâtes :<br><br>
• La Carbo – 10 €<br>
• La Bolo – 10 €<br>
• Les Fromagères – 10 €<br>
• La Vague (saumon) – 11 €<br>
• La Bourguignonne – 12 €`
    },
    {
      keys: ['salade','cesar','ch ti','chti','bivague','bergere'],
      rep: `🥗 Nos Salades :<br><br>
• La Bivague (thon, saumon) – 11 €<br>
• La César – 10 €<br>
• La Ch'ti (maroille) – 11 €<br>
• La Bergère (chèvre) – 11 €`
    },
    {
      keys: ['enfant','enfants','menu enfant'],
      rep: `👶 Menu Enfant – <b>10 €</b><br><br>1 caprisun + 1 surprise + 1 sucette + 1 glace<br>+ 1 pizza de la carte ou pâte au jambon`
    },
    {
      keys: ['calzone'],
      rep: `📦 Toutes nos pizzas sont disponibles en <b>calzone</b> au même prix que la pizza choisie !`
    },
    {
      keys: ['supplement','extra','fromage','croute'],
      rep: `➕ Nos suppléments :<br><br>
• Supplément EXTRA (garnitures) : <b>2,50 €</b><br>
• Supplément croûte au fromage : <b>1,50 €</b>`
    },
    {
      keys: ['allergen','allergene','gluten','lactose','ingredient'],
      rep: `🥗 Nos plats sont préparés à la commande avec des produits frais.<br><br>Pour toute question sur les allergènes, n'hésitez pas à nous contacter directement via la page <a href="index.html#contact" style="color:#c9a84c">Contact</a>.`
    },
  ];

  const DEFAUT = `Je ne suis pas sûre de comprendre 😊<br><br>
Vous pouvez me demander des infos sur notre <b>menu</b>, nos <b>horaires</b>, nos <b>pizzas</b>, <b>pâtes</b>, <b>salades</b> ou nos <b>suppléments</b> !`;

  function getReponse(msg) {
    const m = msg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    for (const r of REPONSES) {
      if (r.keys.some(k => m.includes(k.normalize('NFD').replace(/[\u0300-\u036f]/g,'')))) return r.rep;
    }
    return DEFAUT;
  }

  // ── STYLES ──
  const style = document.createElement('style');
  style.textContent = `
    #fb-chat-bubble {
      position:fixed;bottom:28px;right:28px;z-index:9999;
      width:58px;height:58px;border-radius:50%;
      background:linear-gradient(135deg,#7a5c18,#c9a84c,#f0d080,#c9a84c,#7a5c18);
      background-size:200% 100%;background-position:right;
      border:none;cursor:pointer;
      box-shadow:0 4px 20px rgba(201,168,76,0.5);
      display:flex;align-items:center;justify-content:center;font-size:1.5rem;
      transition:transform 0.3s,box-shadow 0.3s,background-position 0.4s;
    }
    #fb-chat-bubble:hover{transform:scale(1.1);box-shadow:0 6px 30px rgba(201,168,76,0.7);background-position:left;}
    #fb-notif{position:absolute;top:-3px;right:-3px;width:16px;height:16px;background:#c62828;border-radius:50%;border:2px solid #0a0a08;display:none;animation:notifPulse 1.5s ease infinite;}
    #fb-notif.show{display:block;}
    @keyframes notifPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.3);}}
    #fb-chat-window{position:fixed;bottom:100px;right:28px;z-index:9998;width:340px;max-width:calc(100vw - 40px);background:#13130d;border:1px solid rgba(201,168,76,0.3);border-radius:4px;box-shadow:0 16px 48px rgba(0,0,0,0.7);display:flex;flex-direction:column;max-height:500px;opacity:0;pointer-events:none;transform:translateY(16px) scale(0.96);transition:all 0.3s cubic-bezier(0.16,1,0.3,1);}
    #fb-chat-window.open{opacity:1;pointer-events:all;transform:translateY(0) scale(1);}
    .fb-head{padding:14px 16px;border-bottom:1px solid rgba(201,168,76,0.15);display:flex;align-items:center;gap:12px;background:linear-gradient(135deg,#1c1c12,#222217);border-radius:4px 4px 0 0;flex-shrink:0;}
    .fb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#7a5c18,#c9a84c);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;}
    .fb-info{flex:1;}
    .fb-name{font-family:'Cinzel',serif;font-size:0.85rem;color:#c9a84c;letter-spacing:1px;}
    .fb-status{font-size:0.72rem;font-style:italic;color:#6a5a3a;margin-top:1px;}
    .fb-status::before{content:'●';color:#4caf50;margin-right:5px;font-style:normal;font-size:0.6rem;}
    .fb-close{background:transparent;border:none;color:#6a5a3a;font-size:1.1rem;cursor:pointer;padding:4px;transition:color 0.2s;line-height:1;}
    .fb-close:hover{color:#c9a84c;}
    .fb-deco{height:2px;background:linear-gradient(90deg,transparent,#c9a84c,#f0d080,#c9a84c,transparent);}
    .fb-messages{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin;scrollbar-color:#2a2618 transparent;}
    .fb-msg{display:flex;gap:8px;animation:msgIn 0.3s ease both;}
    .fb-msg.user{flex-direction:row-reverse;}
    @keyframes msgIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}
    .fb-msg-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#7a5c18,#c9a84c);display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0;margin-top:2px;}
    .fb-msg-av.u{background:linear-gradient(135deg,#2a2618,#3d3820);}
    .fb-bubble{max-width:80%;padding:10px 13px;font-family:'Cormorant Garamond',Georgia,serif;font-size:0.95rem;line-height:1.55;color:#f5ead0;}
    .fb-msg.bot .fb-bubble{background:#1c1c12;border:1px solid rgba(201,168,76,0.12);border-radius:3px 12px 12px 3px;}
    .fb-msg.user .fb-bubble{background:linear-gradient(135deg,#7a5c18,#8a6820);border-radius:12px 3px 3px 12px;}
    .fb-typing{display:flex;gap:4px;align-items:center;padding:4px 2px;}
    .fb-typing span{width:6px;height:6px;border-radius:50%;background:#6a5a3a;animation:dot 1.2s ease infinite;}
    .fb-typing span:nth-child(2){animation-delay:0.2s;}.fb-typing span:nth-child(3){animation-delay:0.4s;}
    @keyframes dot{0%,60%,100%{transform:translateY(0);opacity:0.4;}30%{transform:translateY(-4px);opacity:1;}}
    .fb-suggestions{display:flex;flex-wrap:wrap;gap:6px;padding:6px 12px 10px;flex-shrink:0;}
    .fb-sugg{font-family:'Cinzel',serif;font-size:0.56rem;letter-spacing:1px;padding:5px 10px;border-radius:2px;border:1px solid rgba(201,168,76,0.2);color:#6a5a3a;background:transparent;cursor:pointer;transition:all 0.2s;}
    .fb-sugg:hover{border-color:#c9a84c;color:#c9a84c;background:rgba(201,168,76,0.05);}
    .fb-input-wrap{padding:10px 12px;border-top:1px solid rgba(201,168,76,0.12);display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:#0a0a08;border-radius:0 0 4px 4px;}
    #fb-input{flex:1;background:#1c1c12;border:1px solid #2a2618;border-radius:2px;padding:9px 12px;color:#f5ead0;font-size:0.95rem;font-family:'Cormorant Garamond',Georgia,serif;outline:none;resize:none;line-height:1.4;transition:border-color 0.3s;}
    #fb-input:focus{border-color:#c9a84c;}
    #fb-input::placeholder{color:#6a5a3a;font-style:italic;}
    #fb-send{width:36px;height:36px;flex-shrink:0;background:linear-gradient(135deg,#7a5c18,#c9a84c);border:none;border-radius:2px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0a0a08;font-size:1rem;transition:opacity 0.2s,transform 0.1s;}
    #fb-send:hover{opacity:0.85;}#fb-send:active{transform:scale(0.95);}
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="fb-chat-bubble" aria-label="Chat Votre Enseigne">🍕<div id="fb-notif"></div></button>
    <div id="fb-chat-window" role="dialog" aria-label="Chat Leila">
      <div class="fb-deco"></div>
      <div class="fb-head">
        <div class="fb-avatar">👩‍🍳</div>
        <div class="fb-info">
          <div class="fb-name">Leila – Votre Enseigne</div>
          <div class="fb-status">En ligne</div>
        </div>
        <button class="fb-close" id="fb-close">✕</button>
      </div>
      <div class="fb-messages" id="fb-messages"></div>
      <div class="fb-suggestions" id="fb-suggs">
        <button class="fb-sugg" onclick="fbSugg(this)">Voir le menu</button>
        <button class="fb-sugg" onclick="fbSugg(this)">Horaires</button>
        <button class="fb-sugg" onclick="fbSugg(this)">Pizzas spéciales</button>
        <button class="fb-sugg" onclick="fbSugg(this)">Menu enfant</button>
      </div>
      <div class="fb-input-wrap">
        <textarea id="fb-input" placeholder="Votre question…" rows="1"></textarea>
        <button id="fb-send">➤</button>
      </div>
    </div>
  `);

  let isOpen = false;

  function botMsg(text) {
    const msgs = document.getElementById('fb-messages');
    const el = document.createElement('div');
    el.className='fb-msg bot';
    el.innerHTML=`<div class="fb-msg-av">👩‍🍳</div><div class="fb-bubble">${text}</div>`;
    msgs.appendChild(el); msgs.scrollTop=msgs.scrollHeight;
  }
  function userMsg(text) {
    const msgs = document.getElementById('fb-messages');
    const el = document.createElement('div');
    el.className='fb-msg user';
    el.innerHTML=`<div class="fb-bubble">${text}</div><div class="fb-msg-av u">🙂</div>`;
    msgs.appendChild(el); msgs.scrollTop=msgs.scrollHeight;
  }
  function typing() {
    const msgs = document.getElementById('fb-messages');
    const el = document.createElement('div');
    el.className='fb-msg bot'; el.id='fb-typing-el';
    el.innerHTML=`<div class="fb-msg-av">👩‍🍳</div><div class="fb-bubble"><div class="fb-typing"><span></span><span></span><span></span></div></div>`;
    msgs.appendChild(el); msgs.scrollTop=msgs.scrollHeight;
  }
  function send() {
    const input=document.getElementById('fb-input');
    const text=input.value.trim(); if(!text) return;
    input.value=''; input.style.height='auto';
    userMsg(text);
    document.getElementById('fb-suggs').style.display='none';
    typing();
    setTimeout(()=>{
      const el=document.getElementById('fb-typing-el'); if(el) el.remove();
      botMsg(getReponse(text));
      if(!isOpen) document.getElementById('fb-notif').classList.add('show');
    }, 700);
  }
  window.fbSugg = btn => { document.getElementById('fb-input').value=btn.textContent; send(); };
  document.getElementById('fb-send').addEventListener('click',send);
  document.getElementById('fb-input').addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();} });
  function toggleChat() {
    isOpen=!isOpen;
    document.getElementById('fb-chat-window').classList.toggle('open',isOpen);
    document.getElementById('fb-chat-bubble').innerHTML=isOpen?'✕<div id="fb-notif"></div>':'🍕<div id="fb-notif"></div>';
    if(isOpen){document.getElementById('fb-notif').classList.remove('show');document.getElementById('fb-input').focus();}
  }
  document.getElementById('fb-chat-bubble').addEventListener('click',toggleChat);
  document.getElementById('fb-close').addEventListener('click',toggleChat);
  setTimeout(()=>{
    botMsg("Bonjour ! Je suis Leila 👩‍🍳 Comment puis-je vous aider ? Menu, horaires, pizzas… je réponds à tout !");
    if(!isOpen) document.getElementById('fb-notif').classList.add('show');
  }, 1200);
})();
