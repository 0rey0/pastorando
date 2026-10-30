/* Pastorando: site estático que lê os dados coletados pelos robôs (pasta dados/). */
(function(){
"use strict";

/* ---------- ícones ---------- */
const P = {
  lupa:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  regua:'<rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M6 8v3M9 8v4.5M12 8v3M15 8v4.5M18 8v3"/>',
  moeda:'<circle cx="12" cy="12" r="9"/><path d="M15 9.3c-.6-.9-1.7-1.4-3-1.4-1.7 0-3 .9-3 2.1 0 3 6 1.6 6 4.5 0 1.3-1.3 2.2-3 2.2-1.4 0-2.6-.6-3.2-1.5M12 6v12"/>',
  urna:'<rect x="3.5" y="11" width="17" height="9" rx="1.5"/><path d="M7.5 11V4.5h9V11"/><path d="M9.8 8l1.6 1.6 3.1-3.1"/><path d="M8 15.5h8"/>',
  megafone:'<path d="M3 10v4h3l7 4.5v-13L6 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  story:'<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><circle cx="10.2" cy="8.3" r="1.4"/><path d="M8.5 16l2.3-3 2 2.2 1.4-1.6L16 16"/>',
  alece:'<path d="M3 21h18M5 21v-9M9 21v-9M15 21v-9M19 21v-9M3 12h18M12 3l9 6H3z"/>',
  camara:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M12 20v2M8 22h8"/><path d="M8 7l1.5 2M16 7l-1.5 2M12 5v3"/>',
  senado:'<path d="M3 15a9 9 0 0 1 18 0z"/><path d="M2 15h20M12 15v6M8 21h8M12 6V3"/>',
  gov:'<path d="M4 21V11h16v10M2 21h20M9 21v-5h6v5M12 11V3"/><path d="M12 3l5 2-5 2"/>',
  sino:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
  doc:'<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  olho:'<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
  seta:'<path d="M9 5l7 7-7 7"/>', volta:'<path d="M15 5l-7 7 7 7"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
  baixar:'<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  copiar:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  mais:'<path d="M12 5v14M5 12h14"/>', ok:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  sol:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  lua:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  partilhar:'<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6"/>',
  vazio:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20.5c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>',
  info2:'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/>'
};
function I(n){ return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+P[n]+'</svg>'; }
document.getElementById("icSino").innerHTML = I("sino");
document.getElementById("lSobre").innerHTML = I("info");

/* ---------- tema ---------- */
const raiz = document.documentElement, bTema = document.getElementById("bTema");
function temaAtual(){ const a = raiz.getAttribute("data-theme"); if (a==="dark"||a==="light") return a; return (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light"; }
function pintaTema(){ const t = temaAtual(); bTema.innerHTML = I(t==="dark"?"sol":"lua"); bTema.setAttribute("aria-label", t==="dark" ? "Mudar para a versão clara" : "Mudar para a versão noturna"); bTema.title = bTema.getAttribute("aria-label"); }
try{ const t = localStorage.getItem("pastorando:tema"); if (t) raiz.setAttribute("data-theme", t); }catch(e){}
bTema.onclick = function(){ const n = temaAtual()==="dark" ? "light" : "dark"; raiz.setAttribute("data-theme", n); try{ localStorage.setItem("pastorando:tema", n); }catch(e){} pintaTema(); };
pintaTema();

/* ---------- utilidades ---------- */
const CASAS = {
  alece:{nome:"Assembleia",longo:"Assembleia Legislativa do Ceará",cargo:"Deputado(a) estadual",plural:"deputados estaduais",ic:"alece",cor:"c1",total:46,verba:"Verba de Desempenho Parlamentar"},
  camara:{nome:"Câmara",longo:"Câmara dos Deputados",cargo:"Deputado(a) federal",plural:"deputados federais",ic:"camara",cor:"c2",total:22,verba:"cota parlamentar"},
  senado:{nome:"Senado",longo:"Senado Federal",cargo:"Senador(a)",plural:"senadores",ic:"senado",cor:"c4",total:3,verba:"cota do Senado (CEAPS)"}
};
const NOMES_TEMA = {seguranca:"Segurança",saude:"Saúde",educacao:"Educação",economia:"Economia",desemprego:"Trabalho",corrupcao:"Corrupção",fome:"Fome",impostos:"Impostos"};
const CORES = ["#d9432b","#16302d","#0f7a70","#8a5a14","#3d4f9a","#9b3b6a"];
const MESES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const NUM = new Intl.NumberFormat("pt-BR");
const BRL = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const BRL2 = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
function mil(v){ return v>=1e6 ? "R$ "+(v/1e6).toFixed(1).replace(".",",")+" mi" : v>=1000 ? "R$ "+NUM.format(Math.round(v/1000))+" mil" : BRL.format(v); }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
function cor(p){ let h=0; for (const c of p.id) h = (h*31 + c.charCodeAt(0))|0; return CORES[Math.abs(h)%CORES.length]; }
function ini(p){ return p.nome.replace(/^(Dra?\.|Cel\.|Pastor|Capit[aã]o|Delegad[oa]|Professor[a]?|Senador[a]?) /i,"").split(" ").filter(Boolean).map(function(x){return x[0];}).slice(0,2).join("").toUpperCase(); }
function av(p,g){ return '<div class="av'+(g?" g":"")+'" style="background:'+cor(p)+'" aria-hidden="true">'+(p.foto ? '<img src="'+esc(p.foto)+'" alt="" loading="lazy" onerror="this.remove()">' : '')+'<span style="position:absolute">'+esc(ini(p))+'</span></div>'; }
function faixa(n){ return n==null ? {c:"",t:"Em observação"} : n>=80 ? {c:"f1",t:"Trabalha pro povo"} : n>=60 ? {c:"f2",t:"Dá pro gasto"} : n>=40 ? {c:"f3",t:"Tá devendo"} : {c:"f4",t:"Precisa pastorar de perto"}; }
function dataBR(d){ if (!d) return ""; const p = d.split("-"); return p.length===3 ? p[2]+"/"+p[1]+"/"+p[0] : d; }
function votoTxt(v){ const x = (v||"").toLowerCase(); return x.indexOf("sim")===0 ? "Sim" : (x.indexOf("n")===0 && x.length<=4) || x.indexOf("não")===0 || x.indexOf("nao")===0 ? "Não" : x.indexOf("abst")===0 ? "Abstenção" : x.indexOf("obstr")===0 ? "Obstrução" : v || "Não votou"; }
const store = {get:function(k,def){ try{ const v = localStorage.getItem("pastorando:"+k); return v ? JSON.parse(v) : def; }catch(e){ return def; } }, set:function(k,v){ try{ localStorage.setItem("pastorando:"+k, JSON.stringify(v)); }catch(e){} }};
let seg = store.get("seg",[]), pendente = null, D = {pessoas:[], votacoes:[], meta:{}, porId:{}, votosDe:{}};
const app = document.getElementById("app");
function toast(m){ const t = document.getElementById("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function(){ t.classList.remove("on"); },2800); }
function segue(id){ return seg.indexOf(id)>=0; }
function alterna(id){ seg = segue(id) ? seg.filter(function(x){return x!==id;}) : seg.concat([id]); store.set("seg",seg); conta(); toast(segue(id) ? "Seguindo "+D.porId[id].nome+". As novidades aparecem em Seguindo." : "Você deixou de seguir "+D.porId[id].nome+"."); }
function conta(){ document.getElementById("nSeg").textContent = seg.filter(function(id){return D.porId[id];}).length; }
function daCasa(c){ return D.pessoas.filter(function(p){return p.casa===c;}); }

/* ---------- carregar dados ---------- */
function carregar(){
  const j = function(n){ return fetch("dados/"+n, {cache:"no-cache"}).then(function(r){ if (!r.ok) throw new Error(n); return r.json(); }); };
  Promise.all([j("parlamentares.json"), j("votacoes.json").catch(function(){return [];}), j("meta.json").catch(function(){return {};})]).then(function(r){
    D.pessoas = r[0] || []; D.votacoes = r[1] || []; D.meta = r[2] || {};
    D.pessoas.forEach(function(p){ D.porId[p.id] = p; D.votosDe[p.id] = []; });
    D.votacoes.forEach(function(v){ Object.keys(v.votos||{}).forEach(function(id){ if (D.votosDe[id]) D.votosDe[id].push(v); }); });
    if (D.meta.atualizado) document.getElementById("atual").textContent = " Última atualização: "+D.meta.atualizado.replace("T"," às ")+".";
    conta(); rota();
  }).catch(function(){
    topo(true);
    app.innerHTML = '<div class="vazio" style="margin-top:24px">'+I("info2")+'<p><b>Os dados ainda estão sendo coletados.</b><br>Na primeira vez, o robô leva alguns minutos. Volte daqui a pouco.</p></div>';
  });
}

/* ---------- topo ---------- */
function topo(inicio){
  document.getElementById("heroi").innerHTML = inicio ? '<div class="heroi"><h1>O povo <mark>pastorando</mark> o poder.</h1><p>Deputados e senadores do Ceará. O que gastam, como votam, o que propõem.</p></div><div style="height:46px"></div>' : '<div style="height:10px"></div>';
  document.getElementById("buscaTopo").innerHTML = inicio ? '<div class="busca-wrap"><div class="busca">'+I("lupa")+'<input id="sQ" type="search" placeholder="Procure um político" aria-label="Procure um político" autocomplete="off"><div class="sugest" id="sSug"></div></div></div>' : '';
  if (!inicio) return;
  const sQ = document.getElementById("sQ"), sSug = document.getElementById("sSug");
  sQ.oninput = function(){ const q = sQ.value.trim().toLowerCase(); if (!q){ sSug.classList.remove("on"); return; }
    const r = D.pessoas.filter(function(p){ return p.nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").indexOf(q.normalize("NFD").replace(/[̀-ͯ]/g,""))>=0; }).slice(0,6);
    sSug.innerHTML = r.map(function(p){ return '<a class="linha-dep" href="#p-'+esc(p.id)+'">'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+CASAS[p.casa].cargo+(p.partido?' · '+esc(p.partido):'')+'</div></div><div class="dir">'+I("seta")+'</div></a>'; }).join("") || '<div class="vazio" style="border:none">Ninguém com esse nome.</div>';
    sSug.classList.add("on"); };
  sQ.onblur = function(){ setTimeout(function(){ sSug.classList.remove("on"); },200); };
}

/* ---------- folha ---------- */
const veu = document.getElementById("veu"), folha = document.getElementById("folha");
let ultimoFoco = null;
function abreFolha(titulo, html){ ultimoFoco = document.activeElement; folha.innerHTML = '<div class="topo"><h2 id="fTit">'+titulo+'</h2><button class="fechar" id="fFechar" aria-label="Fechar">'+I("x")+'</button></div>'+html; veu.classList.add("on"); veu.setAttribute("aria-hidden","false"); document.getElementById("fFechar").onclick = fechaFolha; document.getElementById("fFechar").focus(); }
function fechaFolha(){ veu.classList.remove("on"); veu.setAttribute("aria-hidden","true"); if (ultimoFoco && document.body.contains(ultimoFoco)) ultimoFoco.focus(); }
veu.addEventListener("click",function(e){ if (e.target===veu) fechaFolha(); });
document.addEventListener("keydown",function(e){ if (e.key==="Escape" && veu.classList.contains("on")) fechaFolha(); });
const ACOES = {gastos:{t:"Gastos de quem?",sec:"c-gastos"}, votos:{t:"Votos de quem?",sec:"c-votos"}, projetos:{t:"Projetos de quem?",sec:"c-projetos"}, cobrar:{t:"Cobrar quem?",abre:"cobrar"}, story:{t:"Arte sobre quem?",abre:"story"}};
function escolher(acao){
  let filtro = "todos";
  abreFolha(ACOES[acao].t, '<div class="filtros" id="eF" style="margin:0 0 10px"></div><div class="busca" style="margin:0 0 10px">'+I("lupa")+'<input id="eQ" type="search" placeholder="Nome" aria-label="Nome" style="box-shadow:none;border-width:1.5px"></div><div class="lista" id="eLista"></div>');
  function chips(){ document.getElementById("eF").innerHTML = [["todos","Todos"],["alece","Assembleia"],["camara","Câmara"],["senado","Senado"]].map(function(x){ return '<button type="button" class="chipbtn" data-f="'+x[0]+'" aria-pressed="'+(filtro===x[0])+'">'+(x[0]==="todos"?"":I(CASAS[x[0]].ic))+x[1]+'</button>'; }).join(""); }
  function desenha(){ const q = (document.getElementById("eQ").value||"").toLowerCase();
    const L = D.pessoas.filter(function(p){ return (filtro==="todos"||filtro===p.casa) && p.nome.toLowerCase().indexOf(q)>=0; }).sort(function(a,b){ return a.nome.localeCompare(b.nome); });
    document.getElementById("eLista").innerHTML = L.map(function(p){ return '<button type="button" class="linha-dep" data-id="'+esc(p.id)+'">'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+CASAS[p.casa].cargo+'</div></div><div class="dir">'+I("seta")+'</div></button>'; }).join("") || '<div class="vazio">Ninguém aqui.</div>'; }
  chips(); desenha();
  document.getElementById("eF").onclick = function(e){ const b = e.target.closest("[data-f]"); if (b){ filtro = b.getAttribute("data-f"); chips(); desenha(); } };
  document.getElementById("eQ").oninput = desenha;
  document.getElementById("eLista").onclick = function(e){ const b = e.target.closest("[data-id]"); if (!b) return; const id = b.getAttribute("data-id"); fechaFolha(); pendente = ACOES[acao]; if (location.hash === "#p-"+id) rota(); else location.hash = "p-"+id; };
}

/* ---------- início ---------- */
function tile(ic,c,txt,a){ return '<button type="button" class="tile" data-a="'+a+'"><span class="ic '+c+'">'+I(ic)+'</span>'+txt+'</button>'; }
function resumoVotacao(v){ let s=0,n=0; Object.values(v.votos||{}).forEach(function(x){ const t = votoTxt(x); if (t==="Sim") s++; else if (t==="Não") n++; }); return {s:s,n:n}; }
function inicio(){
  topo(true);
  const ult = D.votacoes.slice(0,3);
  app.innerHTML =
  '<section style="margin-top:22px"><div class="sec-tit"><h2>Quem você quer pastorar?</h2></div><div class="esferas">'+
    ["alece","camara","senado"].map(function(c){ const n = daCasa(c).length; return '<a class="esfera" href="#'+c+'"><span class="ic '+CASAS[c].cor+'">'+I(CASAS[c].ic)+'</span><span><b>'+CASAS[c].nome+'</b><small>'+(n||CASAS[c].total)+' '+CASAS[c].plural+'</small></span></a>'; }).join("")+
    '<a class="esfera" href="#sobre" style="opacity:.7"><span class="ic c3">'+I("gov")+'</span><span><b>Governo</b><small>em breve</small></span></a>'+
  '</div></section><div class="renda" aria-hidden="true"></div>'+
  '<section style="margin-top:14px"><div class="sec-tit"><h2>O que dá pra fazer</h2></div><div class="grade" id="grade">'+
    tile("regua","c4","Régua do Povo","regua")+tile("moeda","c1","Gastos","gastos")+tile("urna","c4","Votos","votos")+
    tile("doc","c2","Projetos","projetos")+tile("megafone","c1","Cobrar","cobrar")+tile("sino","c3","Seguir","seguindo")+
    '<button type="button" class="tile destaque" data-a="story"><span class="ic">'+I("story")+'</span><span>Criar arte pro story<small>Cobre um político ou mostre como ele votou</small></span></button>'+
  '</div></section>'+
  (ult.length ? '<div class="renda" aria-hidden="true"></div><section style="margin-top:14px"><div class="sec-tit"><h2>Últimas votações</h2><span class="carimbo">Fique de olho</span></div><div class="semana">'+
    ult.map(function(v){ const r = resumoVotacao(v); return '<div class="ev"><span class="ic '+CASAS[v.casa].cor+'">'+I("urna")+'</span><span>'+esc(v.titulo)+': <b>'+r.s+' sim, '+r.n+' não</b> entre os cearenses<small>'+CASAS[v.casa].nome+' · '+dataBR(v.data)+'</small></span></div>'; }).join("")+'</div></section>' : '')+
  '<div class="lema"><b>Quem tem voto, tem voz.</b><span>Pastorar é tomar conta do que é nosso.</span></div>';
  document.getElementById("grade").onclick = function(e){ const b = e.target.closest("[data-a]"); if (!b) return; const a = b.getAttribute("data-a"); if (ACOES[a]) escolher(a); else location.hash = a; };
}

/* ---------- Casa ---------- */
function casaPag(c){
  topo(false);
  const C = CASAS[c], L = daCasa(c).slice().sort(function(a,b){ const x = a.regua&&a.regua.nota, y = b.regua&&b.regua.nota; return (y==null?-1:y) - (x==null?-1:x) || a.nome.localeCompare(b.nome); });
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a>'+
  '<div class="casa-topo"><span class="ic '+C.cor+'">'+I(C.ic)+'</span><div><h1>'+C.longo+'</h1><div class="sub">'+L.length+' '+C.plural+' com dados</div></div></div>'+
  '<div class="filtros"><a class="chipbtn" href="#regua" style="text-decoration:none;color:inherit" id="lReg">'+I("regua")+'Como a Régua funciona</a></div>'+
  (L.length ? '<div class="lista" style="margin-top:14px">'+L.map(function(p){ const n = p.regua&&p.regua.nota, f = faixa(n);
    return '<a class="linha-dep" href="#p-'+esc(p.id)+'">'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+(p.partido?esc(p.partido)+' · ':'')+(p.gastos?mil(p.gastos.total)+' gastos em '+new Date().getFullYear():'sem gastos publicados')+'</div></div><div class="dir">'+(n!=null?'<span class="nota num '+f.c+'" title="Régua do Povo: '+f.t+'">'+n+'</span>':'<span class="chip cinza">em observação</span>')+'</div></a>'; }).join("")+'</div>'
   : '<div class="vazio" style="margin-top:14px">Ainda sem dados desta Casa. Veja a situação das fontes em <a href="#sobre">Sobre</a>.</div>');
  document.getElementById("lReg").onclick = function(){ store.set("reguaCasa", c); };
}

/* ---------- perfil ---------- */
function q(ic,c,txt,story){ return '<div class="q"><span class="ic '+c+'">'+I(ic)+'</span>'+txt+(story?'<button type="button" class="comp" data-story="'+story+'" aria-label="Criar arte pro story sobre isso" title="Criar arte pro story">'+I("story")+'</button>':'')+'</div>'; }
function perfil(id){
  topo(false);
  const p = D.porId[id];
  if (!p){ app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="vazio">Não encontramos esse político nos dados atuais.</div>'; return; }
  const C = CASAS[p.casa], g = p.gastos, r = p.regua, vots = D.votosDe[p.id] || [], pr = p.projetos;
  let h = '<a class="voltar" href="#'+p.casa+'">'+I("volta")+C.longo+'</a>'+
  '<div class="perfil">'+av(p,true)+'<div><span class="chip verm">'+I(C.ic)+C.cargo+'</span><h1 style="margin-top:6px">'+esc(p.nome)+'</h1><div class="meta">'+(p.partido?esc(p.partido)+' · ':'')+'Ceará</div></div></div>'+
  '<div class="acoes"><button class="btn" id="bSeg" aria-pressed="'+segue(p.id)+'">'+I(segue(p.id)?"ok":"mais")+(segue(p.id)?"Seguindo":"Seguir")+'</button><button class="btn cheio" id="bCob">'+I("megafone")+'Cobrar</button><button class="btn escuro" id="bSto">'+I("story")+'Story</button>'+(p.link?'<a class="btn" href="'+esc(p.link)+'" target="_blank" rel="noopener">'+I("link")+'Página oficial</a>':'')+'</div><div class="perguntas">';
  /* Régua */
  if (r){ const f = faixa(r.nota);
    h += '<article class="cartao" id="c-regua">'+q("regua","c4","Régua do Povo",r.nota!=null?"regua":null)+
      (r.nota!=null ? '<div class="regua"><div class="grande num '+f.c+'">'+r.nota+'</div><div><div class="faixa">'+f.t+'</div><p class="frase">'+r.pos+'º de '+r.de+' na '+C.nome+(r.parcial?' · nota com dados parciais':'')+'</p></div></div>'
        : '<div class="r">Em observação</div><p class="frase">Ainda faltam dados para dar nota.</p>')+
      '<details><summary>Como chegamos nessa nota</summary><div class="det"><ul>'+r.dims.map(function(d){ return '<li style="display:block"><div style="display:flex;justify-content:space-between;gap:10px"><span>'+esc(d.nome)+(d.peso!=null?' <span class="pill">peso '+d.peso+'</span>':'')+'</span><b class="num">'+d.valor+'</b></div><div class="medidor"><i class="'+(d.valor>=70?"bom":d.valor<40?"alerta":"")+'" style="width:'+d.valor+'%"></i></div><small>'+esc(d.detalhe)+'</small></li>'; }).join("")+'</ul><div class="fonte">Pesos tirados de pesquisas de opinião. <a href="#regua">Veja como funciona</a>.</div></div></details></article>';
  }
  /* Gastos */
  if (g){
    const ms = g.meses || [], meio = ms.length ? MESES[ms[0]-1]+" a "+MESES[ms[ms.length-1]-1] : "";
    const alerta = g.maior_fornecedor_pct >= 30;
    h += (alerta ? '<div class="olho">'+I("olho")+'<p><b>Fique de olho:</b> um só fornecedor ('+esc(g.fornecedores[0][0])+') ficou com '+String(g.maior_fornecedor_pct).replace(".",",")+'% dos gastos. Não é acusação; é algo que o gabinete pode explicar.</p></div>' : '')+
    '<article class="cartao" id="c-gastos">'+q("moeda","c1","Gastou da "+C.verba,"gasto")+'<div class="r num'+(g.pct_teto>85?" alerta":"")+'">'+mil(g.total)+'</div><p class="frase">'+meio+' de '+new Date().getFullYear()+(g.pct_teto!=null?' · '+String(g.pct_teto).replace(".",",")+'% do limite':'')+' · '+g.n+' lançamentos</p>'+
    (g.pct_teto!=null?'<div class="medidor"><i class="'+(g.pct_teto>85?"alerta":"")+'" style="width:'+Math.min(100,g.pct_teto)+'%"></i></div>':'')+
    '<details><summary>Com o quê e com quem</summary><div class="det"><ul class="num">'+g.por_categoria.slice(0,6).map(function(x){ return '<li><span>'+esc(x[0])+'</span><span>'+mil(x[1])+'</span></li>'; }).join("")+'</ul>'+
    '<p style="margin:12px 0 4px"><b>Quem mais recebeu</b></p><ul class="num">'+g.fornecedores.slice(0,6).map(function(x){ return '<li><span>'+esc(x[0])+(x[1]?'<small>CNPJ/CPF '+esc(x[1])+'</small>':'')+'</span><span>'+mil(x[2])+'</span></li>'; }).join("")+'</ul>'+
    (g.ultimos && g.ultimos.length ? '<p style="margin:12px 0 4px"><b>Últimos lançamentos</b></p><ul class="num">'+g.ultimos.slice(0,8).map(function(x){ return '<li><span>'+esc(x.fornecedor||x.categoria)+'<small>'+MESES[(x.mes||1)-1]+' · '+esc(x.categoria)+'</small></span><span>'+(x.url?'<a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+BRL2.format(x.valor)+'</a>':BRL2.format(x.valor))+'</span></li>'; }).join("")+'</ul>' : '')+
    '<div class="fonte">Fonte: '+(p.casa==="alece"?'<a href="https://transparencia.al.ce.gov.br/despesas/verba-desempenho-parlamentar" target="_blank" rel="noopener">Portal da Transparência da ALECE</a>':p.casa==="camara"?'<a href="https://dadosabertos.camara.leg.br/" target="_blank" rel="noopener">Dados abertos da Câmara</a>':'<a href="https://www12.senado.leg.br/transparencia" target="_blank" rel="noopener">Transparência do Senado (CEAPS)</a>')+'</div></div></details></article>';
  }
  /* Votos */
  if (vots.length){
    const total = D.votacoes.filter(function(v){return v.casa===p.casa;}).length;
    h += '<article class="cartao" id="c-votos">'+q("urna","c4","Votações nominais","voto")+'<div class="r num">votou em '+vots.filter(function(v){ const t = votoTxt(v.votos[p.id]); return t==="Sim"||t==="Não"||t==="Abstenção"||t==="Obstrução"; }).length+' de '+total+'</div><p class="frase">votações nominais recentes da '+C.nome+'</p>'+
    '<details open><summary>Ver os votos</summary><div class="det"><ul>'+vots.slice(0,12).map(function(v){ const t = votoTxt(v.votos[p.id]); return '<li><span>'+esc(v.titulo)+'<small>'+dataBR(v.data)+(v.temas&&v.temas.length?' · '+v.temas.map(function(x){return NOMES_TEMA[x]||x;}).join(", "):'')+'</small></span><span class="voto '+(t==="Sim"?"ok":t==="Não"?"contra":"aus")+'">'+esc(t)+'</span></li>'; }).join("")+'</ul><div class="fonte">Sim e Não aparecem em cores diferentes só para leitura; a Régua não julga o mérito de cada voto.</div></div></details></article>';
  }
  /* Projetos */
  if (pr){
    const hom = pr.filter(function(x){return x.homenagem;}).length, porTema = {};
    pr.forEach(function(x){ (x.temas||[]).forEach(function(t){ porTema[t] = (porTema[t]||0)+1; }); });
    h += '<article class="cartao" id="c-projetos">'+q("doc","c2","Projetos apresentados em "+new Date().getFullYear(),"projeto")+'<div class="r num">'+pr.length+'</div><p class="frase">'+(hom?hom+' só de homenagem':'nenhum só de homenagem')+'</p>'+
    (Object.keys(porTema).length?'<div class="temas-chips">'+Object.keys(porTema).sort(function(a,b){return porTema[b]-porTema[a];}).map(function(t){ return '<span class="tchip">'+(NOMES_TEMA[t]||t)+' '+porTema[t]+'</span>'; }).join("")+'</div>':'')+
    (pr.length?'<details><summary>Ver os projetos</summary><div class="det"><ul>'+pr.slice(0,25).map(function(x){ return '<li><span><a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc((x.tipo||"")+" "+(x.numero||"")+(x.ano&&String(x.numero).indexOf("/")<0?"/"+x.ano:""))+'</a>'+(x.homenagem?'<span class="pill">homenagem</span>':'')+'<small>'+esc(x.ementa)+'</small></span></li>'; }).join("")+'</ul></div></details>':'')+'</article>';
  }
  if (!g && !vots.length && !pr) h += '<div class="vazio">Ainda não há dados publicados para '+esc(p.nome)+'.</div>';
  h += '</div>';
  app.innerHTML = h;
  document.getElementById("bSeg").onclick = function(){ alterna(p.id); this.setAttribute("aria-pressed",segue(p.id)); this.innerHTML = I(segue(p.id)?"ok":"mais")+(segue(p.id)?"Seguindo":"Seguir"); };
  document.getElementById("bCob").onclick = function(){ abreCobrar(p); };
  document.getElementById("bSto").onclick = function(){ abreStory(p); };
  app.querySelector(".perguntas").onclick = function(e){ const b = e.target.closest("[data-story]"); if (b) abreStory(p, b.getAttribute("data-story")); };
  if (pendente){ const pe = pendente; pendente = null;
    if (pe.sec){ const el = document.getElementById(pe.sec); if (el){ const d = el.querySelector("details"); if (d) d.open = true; setTimeout(function(){ el.scrollIntoView({behavior:"smooth",block:"start"}); },60); } else toast("Ainda não há esse dado para "+p.nome+"."); }
    if (pe.abre==="cobrar") abreCobrar(p);
    if (pe.abre==="story") abreStory(p);
  }
}

/* ---------- cobrar ---------- */
function abreCobrar(p){
  const C = CASAS[p.casa], temas = {}, v = (D.votosDe[p.id]||[])[0];
  if (p.gastos) temas.gasto = ["moeda","Gastos",p.nome+", vi no Pastorando que seu gabinete gastou "+mil(p.gastos.total)+" da "+C.verba+" este ano"+(p.gastos.fornecedores[0]?", com "+p.gastos.fornecedores[0][0]+" como maior fornecedor":"")+". Com o quê? Por que esses fornecedores?\n\n[seu nome], de [sua cidade]"];
  if (v) temas.voto = ["urna","Um voto",p.nome+", na votação \""+v.titulo+"\" ("+dataBR(v.data)+"), seu voto foi \""+votoTxt(v.votos[p.id])+"\". Quero entender por quê.\n\n[seu nome], de [sua cidade]"];
  temas.pedido = ["doc","Um pedido",p.nome+", na minha cidade o problema é [descreva]. Peço que apresente um projeto ou cobre o governo sobre isso.\n\n[seu nome], de [sua cidade]"];
  let atual = Object.keys(temas)[0];
  abreFolha("Cobrar "+esc(p.nome), '<div class="temas" id="fTemas"></div><textarea id="fTxt" aria-label="Mensagem"></textarea>'+
    '<div class="acoes"><button class="btn cheio" id="fCopiar">'+I("copiar")+'Copiar</button>'+(p.email?'<a class="btn" id="fMail" href="#">'+I("megafone")+'Abrir e-mail</a>':'')+'<button class="btn" id="fSto">'+I("story")+'Virar story</button></div>'+
    '<p class="sub" style="font-size:14px">'+(p.email?esc(p.email):'Contato do gabinete na <a href="'+esc(p.link)+'" target="_blank" rel="noopener">página oficial</a>')+'</p>');
  const box = document.getElementById("fTemas"), txt = document.getElementById("fTxt"), mail = document.getElementById("fMail");
  function desenha(){ box.innerHTML = Object.keys(temas).map(function(k){ return '<button type="button" data-t="'+k+'" aria-pressed="'+(k===atual)+'">'+I(temas[k][0])+temas[k][1]+'</button>'; }).join(""); txt.value = temas[atual][2]; liga(); }
  function liga(){ if (mail) mail.href = "mailto:"+encodeURIComponent(p.email)+"?subject="+encodeURIComponent("Cobrança de eleitor(a)")+"&body="+encodeURIComponent(txt.value); }
  txt.oninput = liga;
  box.onclick = function(e){ const b = e.target.closest("[data-t]"); if (b){ atual = b.getAttribute("data-t"); desenha(); } };
  desenha();
  document.getElementById("fCopiar").onclick = function(){ const falha = function(){ txt.select(); toast("Texto selecionado. Use copiar do seu aparelho."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt.value).then(function(){ toast("Copiado! Cole no e-mail ou no WhatsApp."); }, falha); else falha(); };
  document.getElementById("fSto").onclick = function(){ abreStory(p, atual==="pedido"?null:atual); };
}

/* ---------- arte para story ---------- */
const FUNDOS = {chita:{bg:"#d9432b",fg:"#fbe9c9",sub:"#ffe2d6",acc:"#f1ad1b"}, noite:{bg:"#16302d",fg:"#fbe9c9",sub:"#bcd0cb",acc:"#f1ad1b"}, sol:{bg:"#f1ad1b",fg:"#16302d",sub:"#4a3a10",acc:"#d9432b"}, cal:{bg:"#fbf7ef",fg:"#16302d",sub:"#5d6b68",acc:"#d9432b"}};
function modelos(p){
  const C = CASAS[p.casa], m = {};
  if (p.gastos) m.gasto = {ic:"moeda",nome:"Gastos",fundo:"chita",kick:"COBRANÇA",tit:mil(p.gastos.total)+" da "+C.verba+" em "+new Date().getFullYear()+".",sub:p.nome+", com o que foi gasto?"};
  if ((D.votosDe[p.id]||[]).length) m.voto = {ic:"urna",nome:"Um voto",fundo:"noite",kick:"COMO VOTOU",voto:true};
  if (p.regua && p.regua.nota!=null) m.regua = {ic:"regua",nome:"Régua do Povo",fundo:"cal",kick:"RÉGUA DO POVO",regua:true};
  if (p.projetos) m.projeto = {ic:"doc",nome:"Projetos",fundo:"sol",kick:"O QUE PROPÔS",tit:p.projetos.length+" projetos em "+new Date().getFullYear()+".",sub:p.projetos.filter(function(x){return x.homenagem;}).length+" deles só de homenagem."};
  return m;
}
function quebra(ctx, texto, larg){ const pal = String(texto).split(" "), linhas = []; let l = ""; pal.forEach(function(w){ const t = l ? l+" "+w : w; if (ctx.measureText(t).width > larg && l){ linhas.push(l); l = w; } else l = t; }); if (l) linhas.push(l); return linhas; }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function desenhaStory(cv, p, m, votoId){
  const W = 1080, H = 1920, ctx = cv.getContext("2d"), F = FUNDOS[m.fundo], C = CASAS[p.casa];
  cv.width = W; cv.height = H; ctx.fillStyle = F.bg; ctx.fillRect(0,0,W,H);
  ctx.globalAlpha = m.fundo==="cal" ? .3 : .2; ctx.fillStyle = F.acc;
  for (let k=0;k<16;k++){ const a = k*Math.PI/8, r2 = k%2?190:230; ctx.beginPath(); ctx.moveTo(960+Math.cos(a-.09)*120,300+Math.sin(a-.09)*120); ctx.lineTo(960+Math.cos(a)*r2,300+Math.sin(a)*r2); ctx.lineTo(960+Math.cos(a+.09)*120,300+Math.sin(a+.09)*120); ctx.fill(); }
  ctx.beginPath(); ctx.arc(960,300,110,0,7); ctx.fill(); ctx.globalAlpha = 1;
  ctx.fillStyle = m.fundo==="chita" ? "#16302d" : "#d9432b"; ctx.fillRect(0,0,W,56);
  for (let x=28; x<W; x+=56){ ctx.fillStyle = "#f1ad1b"; ctx.beginPath(); ctx.arc(x,28,9,0,7); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.85)"; [[0,-15],[0,15],[-15,0],[15,0]].forEach(function(o){ ctx.beginPath(); ctx.arc(x+o[0],28+o[1],6,0,7); ctx.fill(); }); }
  const lx = 90, ly = 170; ctx.strokeStyle = "#f1ad1b"; ctx.lineWidth = 7; ctx.lineCap = "round";
  for (let k=0;k<8;k++){ const a = k*Math.PI/4; ctx.beginPath(); ctx.moveTo(lx+Math.cos(a)*40, ly+Math.sin(a)*40); ctx.lineTo(lx+Math.cos(a)*52, ly+Math.sin(a)*52); ctx.stroke(); }
  ctx.fillStyle = "#fbe9c9"; ctx.strokeStyle = "#16302d"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lx-34,ly); ctx.quadraticCurveTo(lx,ly-34,lx+34,ly); ctx.quadraticCurveTo(lx,ly+34,lx-34,ly); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#d9432b"; ctx.beginPath(); ctx.arc(lx,ly,11,0,7); ctx.fill();
  ctx.fillStyle = F.fg; ctx.font = "800 64px 'Bricolage Grotesque', sans-serif"; ctx.textBaseline = "middle"; ctx.fillText("pastorando", 170, ly+2); ctx.textBaseline = "alphabetic";
  ctx.save(); ctx.translate(90,330); ctx.rotate(-0.03); ctx.font = "800 42px 'Bricolage Grotesque', sans-serif"; const kw = ctx.measureText(m.kick).width+60;
  ctx.fillStyle = F.acc; rr(ctx,0,0,kw,80,14); ctx.fill(); ctx.fillStyle = (m.fundo==="sol"||m.fundo==="cal") ? "#fbe9c9" : "#16302d"; ctx.fillText(m.kick,30,56); ctx.restore();
  ctx.fillStyle = cor(p); ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.fill(); ctx.strokeStyle = F.acc; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = "#fff"; ctx.font = "800 56px 'Bricolage Grotesque', sans-serif"; ctx.textAlign = "center"; ctx.fillText(ini(p),160,580); ctx.textAlign = "left";
  let t = 62; ctx.font = "800 "+t+"px 'Bricolage Grotesque', sans-serif"; while (ctx.measureText(p.nome).width > 760 && t > 30){ t -= 4; ctx.font = "800 "+t+"px 'Bricolage Grotesque', sans-serif"; }
  ctx.fillStyle = F.fg; ctx.fillText(p.nome, 260, 560);
  ctx.fillStyle = F.sub; ctx.font = "400 36px 'Atkinson Hyperlegible', sans-serif"; ctx.fillText(C.cargo+(p.partido?" · "+p.partido:"")+" · CE", 260, 612);
  let y = 760;
  if (m.regua){
    const f = faixa(p.regua.nota), cr = {f1:"#0f7a70",f2:"#16302d",f3:"#f1ad1b",f4:"#d9432b"}[f.c];
    ctx.fillStyle = cr; rr(ctx,90,y,380,380,70); ctx.fill();
    ctx.fillStyle = f.c==="f3" ? "#2a1d00" : "#fff"; ctx.font = "800 210px 'Bricolage Grotesque', sans-serif"; ctx.textAlign = "center"; ctx.fillText(String(p.regua.nota),280,y+265); ctx.textAlign = "left";
    ctx.fillStyle = F.sub; ctx.font = "400 36px 'Atkinson Hyperlegible', sans-serif"; ctx.fillText("de 100", 520, y+90);
    ctx.fillStyle = F.fg; ctx.font = "800 80px 'Bricolage Grotesque', sans-serif"; quebra(ctx, f.t+".", 470).forEach(function(l,i){ ctx.fillText(l,520,y+190+i*88); });
    y += 470; ctx.fillStyle = F.sub; ctx.font = "400 42px 'Atkinson Hyperlegible', sans-serif";
    quebra(ctx, p.regua.pos+"º lugar entre "+p.regua.de+" na "+C.nome+". Pesos tirados do que a população mais cobra.", 900).forEach(function(l,i){ ctx.fillText(l,90,y+i*58); });
  } else {
    let tit = m.tit, sub = m.sub, selo = null, seloCor = F.acc;
    if (m.voto){ const vs = D.votosDe[p.id]||[], v = vs.find(function(x){return x.id===votoId;}) || vs[0], x = votoTxt(v.votos[p.id]);
      tit = (x==="Sim"?"Votou SIM: ":x==="Não"?"Votou NÃO: ":x+": ")+v.titulo+"."; sub = "Votação na "+C.nome+" em "+dataBR(v.data)+"."; selo = x.toUpperCase(); seloCor = x==="Sim" ? "#4cc3b6" : x==="Não" ? "#f0654c" : "#9fb0ab"; }
    ctx.font = "400 46px 'Atkinson Hyperlegible', sans-serif"; const subL = quebra(ctx, sub, 900).slice(0,3);
    let tt = 104, ls; for (; tt >= 52; tt -= 4){ ctx.font = "800 "+tt+"px 'Bricolage Grotesque', sans-serif"; ls = quebra(ctx, tit, 900); if (tt + (ls.length-1)*tt*1.08 + 70 + (selo?150:0) + subL.length*62 <= 1580 - y && ls.length <= 6) break; }
    ctx.fillStyle = F.fg; ls.forEach(function(l,i){ ctx.fillText(l,90,y+tt+i*(tt*1.08)); }); y += tt + (ls.length-1)*tt*1.08 + 70;
    if (selo){ ctx.save(); ctx.translate(90,y); ctx.rotate(-0.04); ctx.font = "800 54px 'Bricolage Grotesque', sans-serif"; const sw = ctx.measureText(selo).width+70; ctx.strokeStyle = seloCor; ctx.lineWidth = 8; rr(ctx,0,0,sw,100,20); ctx.stroke(); ctx.fillStyle = seloCor; ctx.fillText(selo,35,70); ctx.restore(); y += 150; }
    ctx.fillStyle = F.sub; ctx.font = "400 46px 'Atkinson Hyperlegible', sans-serif"; subL.forEach(function(l,i){ ctx.fillText(l,90,y+46+i*62); });
  }
  ctx.strokeStyle = F.fg; ctx.globalAlpha = .35; ctx.lineWidth = 3; ctx.beginPath(); for (let x=90; x<990; x+=36){ ctx.moveTo(x,1620); ctx.quadraticCurveTo(x+9,1648,x+18,1620); ctx.quadraticCurveTo(x+27,1648,x+36,1620); } ctx.stroke(); ctx.globalAlpha = 1;
  ctx.fillStyle = F.fg; ctx.font = "800 46px 'Bricolage Grotesque', sans-serif"; ctx.fillText("Quem tem voto, tem voz.", 90, 1720);
  ctx.fillStyle = F.sub; ctx.font = "400 32px 'Atkinson Hyperlegible', sans-serif"; ctx.fillText(location.host+" · dados oficiais", 90, 1772);
  const fonte = p.casa==="alece" ? "Fonte: Portal da Transparência da ALECE" : p.casa==="camara" ? "Fonte: dados abertos da Câmara" : "Fonte: dados abertos do Senado";
  ctx.fillText(fonte+" · "+((D.meta.atualizado||"").slice(0,10).split("-").reverse().join("/")), 90, 1830);
}
function abreStory(p, inicial){
  const M = modelos(p), chaves = Object.keys(M);
  if (!chaves.length){ toast("Ainda não há dados para criar uma arte sobre "+p.nome+"."); return; }
  let atual = (inicial && M[inicial]) ? inicial : chaves[0], votoId = ((D.votosDe[p.id]||[])[0]||{}).id;
  abreFolha("Arte pro story", '<div class="temas" id="sTemas"></div><div id="sVoto"></div><div class="previa"><img id="sImg" alt="Prévia da arte para story"></div>'+
    '<div class="acoes"><button class="btn cheio" id="sBaixar">'+I("baixar")+'Baixar JPG</button><button class="btn" id="sPart" hidden>'+I("partilhar")+'Compartilhar</button></div><p class="sub" style="font-size:14px;text-align:center">1080 × 1920, tamanho do story.</p>');
  const cv = document.createElement("canvas"), img = document.getElementById("sImg");
  function desenha(){
    document.getElementById("sTemas").innerHTML = chaves.map(function(k){ return '<button type="button" data-t="'+k+'" aria-pressed="'+(k===atual)+'">'+I(M[k].ic)+M[k].nome+'</button>'; }).join("");
    document.getElementById("sVoto").innerHTML = M[atual].voto ? '<select class="campo" id="sV" aria-label="Qual votação?">'+(D.votosDe[p.id]||[]).slice(0,30).map(function(v){ return '<option value="'+esc(v.id)+'"'+(v.id===votoId?" selected":"")+'>'+esc(dataBR(v.data)+" · "+v.titulo)+'</option>'; }).join("")+'</select>' : '';
    const sv = document.getElementById("sV"); if (sv) sv.onchange = function(){ votoId = sv.value; render(); };
    render(); }
  function render(){ desenhaStory(cv, p, M[atual], votoId); img.src = cv.toDataURL("image/jpeg", .9); }
  document.getElementById("sTemas").onclick = function(e){ const b = e.target.closest("[data-t]"); if (b){ atual = b.getAttribute("data-t"); desenha(); } };
  const pronto = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("800 64px 'Bricolage Grotesque'"), document.fonts.load("400 40px 'Atkinson Hyperlegible'")]).catch(function(){}) : Promise.resolve();
  desenha(); pronto.then(render);
  const nome = function(){ return "pastorando-"+p.nome.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+atual+".jpg"; };
  document.getElementById("sBaixar").onclick = function(){ cv.toBlob(function(b){ const u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = nome(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 4000); toast("Arte baixada. Agora é só postar."); }, "image/jpeg", .92); };
  const bp = document.getElementById("sPart");
  try { if (navigator.canShare && navigator.canShare({files:[new File([new Blob(["x"])], "t.jpg", {type:"image/jpeg"})]})) bp.hidden = false; } catch(e){}
  bp.onclick = function(){ cv.toBlob(function(b){ navigator.share({files:[new File([b], nome(), {type:"image/jpeg"})], title:"Pastorando"}).catch(function(){}); }, "image/jpeg", .92); };
}

/* ---------- Régua ---------- */
function regua(){
  topo(false);
  const c = store.get("reguaCasa","camara"), L = daCasa(c).filter(function(p){return p.regua && p.regua.nota!=null;}).sort(function(a,b){return b.regua.nota-a.regua.nota;});
  const R = D.meta.regua || {}, dims = R.dimensoes || {}, tm = (R.temas||{})[c];
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Régua do Povo</h1><p class="sub">Nota de 0 a 100, calculada automaticamente. Os pesos vêm do que a população diz que mais importa.</p>'+
  '<div class="filtros" id="rF">'+["alece","camara","senado"].map(function(k){ return '<button type="button" class="chipbtn" data-c="'+k+'" aria-pressed="'+(k===c)+'">'+I(CASAS[k].ic)+CASAS[k].nome+'</button>'; }).join("")+'</div>'+
  (L.length ? '<div class="lista" style="margin-top:14px">'+L.map(function(p){ const f = faixa(p.regua.nota); return '<a class="linha-dep" href="#p-'+esc(p.id)+'"><span class="num" style="width:22px;color:var(--tinta-2);font-weight:700">'+p.regua.pos+'</span>'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+f.t+(p.regua.parcial?' · dados parciais':'')+'</div></div><div class="dir"><span class="nota num '+f.c+'">'+p.regua.nota+'</span></div></a>'; }).join("")+'</div>' : '<div class="vazio" style="margin-top:14px">Ainda sem notas para esta Casa.</div>')+
  '<section><h2>Como a nota é calculada</h2><div class="cartao" style="margin-top:10px"><table class="tab"><tbody>'+Object.keys(dims).map(function(k){ return '<tr><td>'+esc(dims[k].nome)+'</td><td class="r num">'+dims[k].peso+'</td></tr>'; }).join("")+'</tbody></table>'+
  '<p class="frase">Os pesos acima vêm de: '+(R.fonte_dimensoes?'<a href="'+esc(R.fonte_dimensoes.url)+'" target="_blank" rel="noopener">'+esc(R.fonte_dimensoes.texto)+'</a>':'pesquisa de opinião')+'.</p>'+
  (tm ? '<p class="frase" style="margin-top:10px"><b>Temas</b>: projetos sobre o que a população mais cobra valem mais. '+Object.keys(tm.itens).map(function(t){ return (NOMES_TEMA[t]||t)+' '+tm.itens[t]+'%'; }).join(" · ")+'. Fonte: <a href="'+esc(tm.url)+'" target="_blank" rel="noopener">'+esc(tm.fonte)+'</a>.</p>' : '')+
  '<ul class="frase" style="padding-left:18px;margin-top:10px"><li><b>Honestidade com o dinheiro público:</b> quanto gasta comparado aos colegas e se concentra os gastos num só fornecedor.</li><li><b>Compromisso e presença:</b> em quantas votações nominais votou.</li><li><b>Prioridades do povo:</b> projetos apresentados, com mais peso para os temas que a população mais cobra; homenagens valem zero.</li></ul>'+
  '<p class="frase">Ninguém escolhe os pesos à mão: quando sai uma pesquisa nova, os números são trocados e a nota se recalcula. Cada um é comparado só com colegas da mesma Casa.</p></div></section>';
  document.getElementById("rF").onclick = function(e){ const b = e.target.closest("[data-c]"); if (b){ store.set("reguaCasa", b.getAttribute("data-c")); regua(); } };
}

/* ---------- seguindo ---------- */
function seguindo(){
  topo(false);
  const meus = seg.map(function(id){return D.porId[id];}).filter(Boolean), ev = [];
  meus.forEach(function(p){
    if (p.gastos && p.gastos.ultimos) p.gastos.ultimos.slice(0,2).forEach(function(x){ ev.push({o:x.mes*100, ic:"moeda", c:"c1", p:p, txt:BRL2.format(x.valor)+" com "+(x.fornecedor||x.categoria), q:MESES[(x.mes||1)-1]}); });
    (D.votosDe[p.id]||[]).slice(0,2).forEach(function(v){ ev.push({o:parseInt((v.data||"0000-00-00").slice(5,7),10)*100+parseInt((v.data||"0000-00-00").slice(8,10),10), ic:"urna", c:"c4", p:p, txt:"votou "+votoTxt(v.votos[p.id]).toLowerCase()+": "+v.titulo, q:dataBR(v.data)}); });
  });
  ev.sort(function(a,b){return b.o-a.o;});
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Seguindo</h1>'+
  (meus.length ? '<div class="lista" style="margin-top:14px">'+meus.map(function(p){ return '<a class="linha-dep" href="#p-'+esc(p.id)+'">'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+CASAS[p.casa].cargo+'</div></div><div class="dir">'+I("seta")+'</div></a>'; }).join("")+'</div>'
   : '<div class="vazio" style="margin-top:14px">'+I("vazio")+'<p>Abra um político e toque em <b>Seguir</b>. A lista fica guardada neste aparelho.</p></div>')+
  (ev.length ? '<section><h2 style="margin-bottom:10px">Novidades</h2><div class="semana">'+ev.slice(0,12).map(function(e){ return '<a class="ev" href="#p-'+esc(e.p.id)+'"><span class="ic '+e.c+'">'+I(e.ic)+'</span><span><b>'+esc(e.p.nome)+'</b> '+esc(e.txt)+'<small>'+esc(e.q)+'</small></span></a>'; }).join("")+'</div></section>' : '')+
  '<section><div class="info">'+I("sino")+'<span>Avisos por Telegram e e-mail estão chegando. Por enquanto, volte aqui para ver as novidades de quem você segue.</span></div></section>';
}

/* ---------- sobre ---------- */
function sobre(){
  topo(false);
  const F = (D.meta && D.meta.fontes) || {};
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="texto"><h1>Sobre o Pastorando</h1>'+
  '<p style="margin-top:12px">No Ceará, <b>pastorar</b> é tomar conta. Este site junta os dados oficiais dos deputados estaduais, federais e senadores do Ceará e explica sem rodeio. Um robô atualiza tudo todo dia, de graça, e o código é aberto.</p>'+
  '<h2 style="margin:22px 0 8px">Situação das fontes</h2>'+
  (Object.keys(F).length ? Object.keys(F).map(function(k){ const f = F[k]; return '<div class="estado"><span class="bola '+(f.ok?"ok":"erro")+'"></span><span><b>'+esc(f.nome)+'</b><br><small style="color:var(--tinta-2)">'+(f.ok ? 'atualizada em '+esc((f.quando||"").replace("T"," às "))+' · '+f.pessoas+' parlamentares · '+f.votacoes+' votações' : 'falhou na última tentativa'+(f.ultimo_sucesso?'; dados de '+esc(f.ultimo_sucesso.replace("T"," às ")):''))+'</small></span></div>'; }).join("") : '<p>Ainda sem informação.</p>')+
  '<h2 style="margin:22px 0 8px">Nosso lado</h2><p>Somos uma iniciativa do campo popular e dizemos isso. A Régua do Povo, porém, não depende da nossa opinião: os pesos vêm de pesquisas sobre o que a população mais cobra.</p>'+
  '<h2 style="margin:22px 0 8px">Direito de resposta</h2><p>Gabinetes podem contestar qualquer dado. A correção aparece no próprio dado.</p>'+
  '<h2 style="margin:22px 0 8px">Em breve</h2><p>Governador, presença nas sessões, promessas de campanha, viagens, emendas por cidade e avisos por Telegram.</p></div>';
}

/* ---------- rotas ---------- */
function rota(){
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  if (h.indexOf("p-")===0) perfil(h.slice(2));
  else if (CASAS[h]) casaPag(h);
  else if (h==="seguindo") seguindo();
  else if (h==="sobre") sobre();
  else if (h==="regua") regua();
  else inicio();
  if (!pendente) window.scrollTo(0,0);
}
window.addEventListener("hashchange", function(){ if (D.pessoas.length || location.hash==="#sobre") rota(); });
carregar();
})();
