/* Pastorando: site estático que lê os dados coletados pelos robôs (pasta dados/).
   Todo dado tem, ao lado, um ⓘ que leva à fonte oficial. */
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
  alerta:'<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
  aviao:'<path d="M21 15.5l-8-4.5V5a1.5 1.5 0 0 0-3 0v6l-8 4.5V17l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-4.5l8 2.5z"/>',
  presenca:'<rect x="3.5" y="4.5" width="17" height="16" rx="2"/><path d="M3.5 9h17M8 2.5v4M16 2.5v4"/><path d="M8.5 14.5l2.3 2.3 4.7-4.7"/>',
  mapa:'<path d="M9 4L3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  casa:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  promessa:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
  comparar:'<path d="M12 3v18M5 7h4M15 7h4M3 15l3-8 3 8a3 3 0 0 1-6 0zM15 15l3-8 3 8a3 3 0 0 1-6 0z"/>',
  dados:'<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  estrela:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  urnaN:'<rect x="3.5" y="11" width="17" height="9" rx="1.5"/><path d="M7.5 11V4.5h9V11"/><path d="M12 6.5v3M10.5 8h3"/>',
  dinheiro:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 9.5v5M18 9.5v5"/>',
  rss:'<path d="M5 19a1 1 0 1 0 0-.01M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/>',
  tel:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>',
  rede:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
function I(n){ return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(P[n]||P.info)+'</svg>'; }
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
const ANO = new Date().getFullYear();
const CASAS = {
  alece:{nome:"Assembleia",longo:"Assembleia Legislativa do Ceará",cargo:"Deputado(a) estadual",plural:"deputados estaduais",ic:"alece",cor:"c1",total:46,verba:"Verba de Desempenho Parlamentar",agora:"31ª legislatura (2023–2027)",prox:"32ª legislatura (2027–2031)"},
  camara:{nome:"Câmara",longo:"Câmara dos Deputados",cargo:"Deputado(a) federal",plural:"deputados federais",ic:"camara",cor:"c2",total:22,verba:"cota parlamentar",agora:"57ª legislatura (2023–2027)",prox:"58ª legislatura (2027–2031)"},
  senado:{nome:"Senado",longo:"Senado Federal",cargo:"Senador(a)",plural:"senadores",ic:"senado",cor:"c4",total:3,verba:"cota do Senado (CEAPS)",agora:"mandatos em curso",prox:"eleitos em 2026 (posse em 2027)"}
};
const NOMES_TEMA = {seguranca:"Segurança",saude:"Saúde",educacao:"Educação",economia:"Economia",desemprego:"Trabalho",corrupcao:"Corrupção",fome:"Fome",impostos:"Impostos"};
const CORES = ["#d9432b","#16302d","#0f7a70","#8a5a14","#3d4f9a","#9b3b6a"];
const MESES = ["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
const NUM = new Intl.NumberFormat("pt-BR");
const BRL = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const BRL2 = new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"});
function mil(v){ v = +v||0; return v>=1e9 ? "R$ "+(v/1e9).toFixed(1).replace(".",",")+" bi" : v>=1e6 ? "R$ "+(v/1e6).toFixed(1).replace(".",",")+" mi" : v>=1000 ? "R$ "+NUM.format(Math.round(v/1000))+" mil" : BRL.format(v); }
function pct(v){ return v==null ? "—" : String(Math.round(v*10)/10).replace(".",",")+"%"; }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
function semAc(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""); }
function cor(p){ let h=0; for (const c of String(p.id)) h = (h*31 + c.charCodeAt(0))|0; return CORES[Math.abs(h)%CORES.length]; }
function ini(p){ return String(p.nome||"?").replace(/^(Dra?\.?|Cel\.|Pastor|Capit[aã]o|Delegad[oa]|Professor[a]?|Senador[a]?) /i,"").split(" ").filter(Boolean).map(function(x){return x[0];}).slice(0,2).join("").toUpperCase(); }
function fotoDe(p){ return p.foto || p.foto_tse || null; }
function av(p,g){ const f = fotoDe(p); return '<div class="av'+(g?" g":"")+'" style="background:'+cor(p)+'" aria-hidden="true">'+(f ? '<img src="'+esc(f)+'" alt="" loading="lazy" onerror="this.remove()">' : '')+'<span>'+esc(ini(p))+'</span></div>'; }
function faixa(n){ return n==null ? {c:"",t:"Em observação"} : n>=80 ? {c:"f1",t:"Trabalha pro povo"} : n>=60 ? {c:"f2",t:"Dá pro gasto"} : n>=40 ? {c:"f3",t:"Tá devendo"} : {c:"f4",t:"Precisa pastorar de perto"}; }
function dataBR(d){ if (!d) return ""; const p = String(d).slice(0,10).split("-"); return p.length===3 ? p[2]+"/"+p[1]+"/"+p[0] : d; }
function votoTxt(v){ const x = semAc(v); return x.indexOf("sim")===0 ? "Sim" : (x.indexOf("n")===0 && x.length<=4) || x.indexOf("nao")===0 ? "Não" : x.indexOf("abst")===0 ? "Abstenção" : x.indexOf("obstr")===0 ? "Obstrução" : v || "Não votou"; }
function lado(n){ return n===1 ? '<span class="lado a">a favor do povo</span>' : n===-1 ? '<span class="lado c">contra o povo</span>' : ''; }
/* ⓘ: link para a fonte oficial */
function fi(f, rot){ if (!f) return ""; const u = typeof f==="string" ? f : f.u, n = typeof f==="string" ? (rot||"fonte oficial") : (f.n||rot||"fonte oficial"); if (!u) return ""; return '<a class="fi" href="'+esc(u)+'" target="_blank" rel="noopener" title="Conferir na fonte: '+esc(n)+'" aria-label="Conferir na fonte: '+esc(n)+'">'+I("info")+'</a>'; }
function fp(p,k){ return (p.fontes||{})[k]; }
const store = {get:function(k,def){ try{ const v = localStorage.getItem("pastorando:"+k); return v ? JSON.parse(v) : def; }catch(e){ return def; } }, set:function(k,v){ try{ localStorage.setItem("pastorando:"+k, JSON.stringify(v)); }catch(e){} }};
let seg = store.get("seg",[]), pendente = null, D = {pessoas:[], votacoes:[], meta:{}, gov:null, ele:null, porId:{}, votosDe:{}};
const app = document.getElementById("app");
function toast(m){ const t = document.getElementById("toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function(){ t.classList.remove("on"); },2800); }
function segue(id){ return seg.indexOf(id)>=0; }
function alterna(id){ seg = segue(id) ? seg.filter(function(x){return x!==id;}) : seg.concat([id]); store.set("seg",seg); if (segue(id)) marcaVisto(D.porId[id]); conta(); toast(segue(id) ? "Seguindo "+D.porId[id].nome+". As novidades aparecem no sino." : "Você deixou de seguir "+D.porId[id].nome+"."); }
function daCasa(c){ return D.pessoas.filter(function(p){return p.casa===c;}); }
function noMandato(c){ return daCasa(c).filter(function(p){return !p.fora_exercicio;}); }
function partido(p){ return p.partido ? esc(p.partido)+fi(fp(p,"partido")) : ""; }

/* ---------- novidades de quem você segue (guardadas só neste aparelho) ---------- */
function retrato(p){ return {v:(D.votosDe[p.id]||[]).map(function(v){return v.id;}), g:(p.gastos||{}).n||0, pr:(p.projetos||[]).length, vi:(p.viagens||{}).n||0}; }
function marcaVisto(p){ if (!p) return; const r = store.get("visto",{}); r[p.id] = retrato(p); store.set("visto", r); }
function novidades(p){ const r = (store.get("visto",{})||{})[p.id]; if (!r) return null; const a = retrato(p), out = [];
  const nv = a.v.filter(function(x){ return r.v.indexOf(x)<0; }).length; if (nv) out.push(nv+(nv>1?" votos novos":" voto novo"));
  if (a.g > r.g) out.push((a.g-r.g)+" gastos novos"); if (a.pr > r.pr) out.push((a.pr-r.pr)+(a.pr-r.pr>1?" projetos novos":" projeto novo")); if (a.vi > r.vi) out.push((a.vi-r.vi)+" viagens novas");
  return out.length ? out : null; }
function conta(){ const n = seg.filter(function(id){ return D.porId[id] && novidades(D.porId[id]); }).length, el = document.getElementById("nSeg"); el.textContent = n || seg.filter(function(id){return D.porId[id];}).length; el.classList.toggle("novo", n>0); }

/* ---------- carregar dados ---------- */
function carregar(){
  const j = function(n){ return fetch("dados/"+n, {cache:"no-cache"}).then(function(r){ if (!r.ok) throw new Error(n); return r.json(); }); };
  Promise.all([j("parlamentares.json"), j("votacoes.json").catch(function(){return [];}), j("meta.json").catch(function(){return {};}), j("governo.json").catch(function(){return null;}), j("eleicao.json").catch(function(){return null;})]).then(function(r){
    D.pessoas = r[0] || []; D.votacoes = r[1] || []; D.meta = r[2] || {}; D.gov = r[3]; D.ele = r[4];
    D.pessoas.forEach(function(p){ D.porId[p.id] = p; D.votosDe[p.id] = []; });
    D.votacoes.forEach(function(v){ Object.keys(v.votos||{}).forEach(function(id){ if (D.votosDe[id]) D.votosDe[id].push(v); }); });
    if (D.meta.atualizado) document.getElementById("atual").textContent = " Última atualização: "+D.meta.atualizado.replace("T"," às ")+".";
    conta(); avisoNavegador(); rota();
  }).catch(function(){
    topo(true);
    app.innerHTML = '<div class="vazio" style="margin-top:24px">'+I("alerta")+'<p><b>Os dados ainda estão sendo coletados.</b><br>Na primeira vez, o robô leva alguns minutos. Volte daqui a pouco.</p></div>';
  });
}
function avisoNavegador(){
  if (!("Notification" in window) || Notification.permission!=="granted") return;
  const n = seg.map(function(id){return D.porId[id];}).filter(function(p){ return p && novidades(p); });
  if (!n.length || sessionStorage.getItem("pastorando:avisou")) return;
  try{ new Notification("Pastorando", {body: n.slice(0,3).map(function(p){ return p.nome+": "+novidades(p).join(", "); }).join("\n"), icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23d9432b'/%3E%3C/svg%3E"}); sessionStorage.setItem("pastorando:avisou","1"); }catch(e){}
}

/* ---------- topo ---------- */
function topo(inicio){
  document.getElementById("heroi").innerHTML = inicio ? '<div class="heroi"><h1>O povo <mark>pastorando</mark> o poder.</h1><p>Deputados, senadores e governo do Ceará. O que gastam, como votam, o que propõem.</p></div><div style="height:46px"></div>' : '<div style="height:10px"></div>';
  document.getElementById("buscaTopo").innerHTML = inicio ? '<div class="busca-wrap"><div class="busca">'+I("lupa")+'<input id="sQ" type="search" placeholder="Procure um político ou uma cidade" aria-label="Procure um político ou uma cidade" autocomplete="off"><div class="sugest" id="sSug"></div></div></div>' : '';
  if (!inicio) return;
  const sQ = document.getElementById("sQ"), sSug = document.getElementById("sSug");
  sQ.oninput = function(){ const q = semAc(sQ.value.trim()); if (!q){ sSug.classList.remove("on"); return; }
    const r = D.pessoas.filter(function(p){ return semAc(p.nome).indexOf(q)>=0 || semAc(p.nome_civil).indexOf(q)>=0; }).slice(0,6);
    const cid = q.length>=3 ? D.pessoas.filter(function(p){ return ((p.votos||{}).municipios||[]).slice(0,5).some(function(m){ return semAc(m[0]).indexOf(q)===0; }); }).slice(0,4) : [];
    sSug.innerHTML = r.map(function(p){ return linhaP(p, CASAS[p.casa].cargo+(p.partido?' · '+esc(p.partido):'')); }).join("") +
      (cid.length ? '<div class="sug-tit">'+I("mapa")+' Mais votados em '+esc(sQ.value.trim())+'</div>'+cid.map(function(p){ const m = p.votos.municipios.find(function(m){ return semAc(m[0]).indexOf(q)===0; }); return linhaP(p, NUM.format(m[1])+' votos em '+esc(m[0])+' ('+p.votos.ano+')'); }).join("") : '') ||
      '<div class="vazio" style="border:none">Ninguém com esse nome.</div>';
    sSug.classList.add("on"); };
  sQ.onblur = function(){ setTimeout(function(){ sSug.classList.remove("on"); },200); };
}
function linhaP(p, meta, dir){ return '<a class="linha-dep" href="#p-'+esc(p.id)+'">'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+meta+'</div></div><div class="dir">'+(dir||I("seta"))+'</div></a>'; }

/* ---------- folha ---------- */
const veu = document.getElementById("veu"), folha = document.getElementById("folha");
let ultimoFoco = null;
function abreFolha(titulo, html){ ultimoFoco = document.activeElement; folha.innerHTML = '<div class="topo"><h2 id="fTit">'+titulo+'</h2><button class="fechar" id="fFechar" aria-label="Fechar">'+I("x")+'</button></div>'+html; veu.classList.add("on"); veu.setAttribute("aria-hidden","false"); document.getElementById("fFechar").onclick = fechaFolha; document.getElementById("fFechar").focus(); }
function fechaFolha(){ veu.classList.remove("on"); veu.setAttribute("aria-hidden","true"); if (ultimoFoco && document.body.contains(ultimoFoco)) ultimoFoco.focus(); }
veu.addEventListener("click",function(e){ if (e.target===veu) fechaFolha(); });
document.addEventListener("keydown",function(e){ if (e.key==="Escape" && veu.classList.contains("on")) fechaFolha(); });
const ACOES = {gastos:{t:"Gastos de quem?",sec:"c-gastos"}, votos:{t:"Votos de quem?",sec:"c-votos"}, projetos:{t:"Projetos de quem?",sec:"c-projetos"}, viagens:{t:"Viagens de quem?",sec:"c-viagens"},
  cobrar:{t:"Cobrar quem?",abre:"cobrar"}, story:{t:"Arte sobre quem?",abre:"story"}, comparar:{t:"Comparar quem?",comparar:true}};
function escolher(acao, depois){
  let filtro = "todos";
  abreFolha(ACOES[acao].t, '<div class="filtros" id="eF" style="margin:0 0 10px"></div><div class="busca" style="margin:0 0 10px">'+I("lupa")+'<input id="eQ" type="search" placeholder="Nome" aria-label="Nome" style="box-shadow:none;border-width:1.5px"></div><div class="lista" id="eLista"></div>');
  function chips(){ document.getElementById("eF").innerHTML = [["todos","Todos"],["alece","Assembleia"],["camara","Câmara"],["senado","Senado"]].map(function(x){ return '<button type="button" class="chipbtn" data-f="'+x[0]+'" aria-pressed="'+(filtro===x[0])+'">'+(x[0]==="todos"?"":I(CASAS[x[0]].ic))+x[1]+'</button>'; }).join(""); }
  function desenha(){ const q = semAc(document.getElementById("eQ").value);
    const L = D.pessoas.filter(function(p){ return (filtro==="todos"||filtro===p.casa) && semAc(p.nome).indexOf(q)>=0; }).sort(function(a,b){ return a.nome.localeCompare(b.nome); });
    document.getElementById("eLista").innerHTML = L.map(function(p){ return '<button type="button" class="linha-dep" data-id="'+esc(p.id)+'">'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+CASAS[p.casa].cargo+(p.partido?' · '+esc(p.partido):'')+'</div></div><div class="dir">'+I("seta")+'</div></button>'; }).join("") || '<div class="vazio">Ninguém aqui.</div>'; }
  chips(); desenha();
  document.getElementById("eF").onclick = function(e){ const b = e.target.closest("[data-f]"); if (b){ filtro = b.getAttribute("data-f"); chips(); desenha(); } };
  document.getElementById("eQ").oninput = desenha;
  document.getElementById("eLista").onclick = function(e){ const b = e.target.closest("[data-id]"); if (!b) return; const id = b.getAttribute("data-id"); fechaFolha();
    if (depois) return depois(id);
    if (ACOES[acao].comparar){ location.hash = "comparar-"+id; return; }
    pendente = ACOES[acao]; if (location.hash === "#p-"+id) rota(); else location.hash = "p-"+id; };
}

/* ---------- início ---------- */
function tile(ic,c,txt,a){ return '<button type="button" class="tile" data-a="'+a+'"><span class="ic '+c+'">'+I(ic)+'</span>'+txt+'</button>'; }
function resumoVotacao(v){ let s=0,n=0; Object.values(v.votos||{}).forEach(function(x){ const t = votoTxt(x); if (t==="Sim") s++; else if (t==="Não") n++; }); return {s:s,n:n}; }
function inicio(){
  topo(true);
  const ult = D.votacoes.filter(function(v){ return v.lado; }).slice(0,3).concat(D.votacoes.filter(function(v){ return !v.lado; })).slice(0,4);
  const g = D.gov && D.gov.governador;
  app.innerHTML =
  '<section style="margin-top:22px"><div class="sec-tit"><h2>Quem você quer pastorar?</h2></div><div class="esferas">'+
    ["alece","camara","senado"].map(function(c){ const n = noMandato(c).length; return '<a class="esfera" href="#'+c+'"><span class="ic '+CASAS[c].cor+'">'+I(CASAS[c].ic)+'</span><span><b>'+CASAS[c].nome+'</b><small>'+(n||CASAS[c].total)+' '+CASAS[c].plural+'</small></span></a>'; }).join("")+
    '<a class="esfera" href="#governo"><span class="ic c3">'+I("gov")+'</span><span><b>Governo</b><small>'+(g?esc(g.nome):'Governador e orçamento')+'</small></span></a>'+
  '</div></section><div class="renda" aria-hidden="true"></div>'+
  '<section style="margin-top:14px"><div class="sec-tit"><h2>O que dá pra fazer</h2></div><div class="grade" id="grade">'+
    tile("regua","c4","Régua do Povo","regua")+tile("moeda","c1","Gastos","gastos")+tile("urna","c4","Votos","votos")+
    tile("doc","c2","Projetos","projetos")+tile("megafone","c1","Cobrar","cobrar")+tile("sino","c3","Seguir","seguindo")+
    tile("aviao","c2","Viagens","viagens-todas")+tile("promessa","c3","Promessas","promessas")+tile("comparar","c4","Comparar","comparar")+
    tile("urnaN","c1","Eleitos 2026","eleitos")+tile("mapa","c2","Sua cidade","cidade")+tile("dados","c3","Dados abertos","dados")+
    '<button type="button" class="tile destaque" data-a="story"><span class="ic">'+I("story")+'</span><span>Criar arte pro story<small>Cobre um político ou mostre como ele votou</small></span></button>'+
  '</div></section>'+
  (ult.length ? '<div class="renda" aria-hidden="true"></div><section style="margin-top:14px"><div class="sec-tit"><h2>Últimas votações</h2><span class="carimbo">Fique de olho</span></div><div class="semana">'+
    ult.map(function(v){ const r = resumoVotacao(v); return '<div class="ev"><span class="ic '+CASAS[v.casa].cor+'">'+I("urna")+'</span><span>'+esc(v.titulo)+': <b>'+r.s+' sim, '+r.n+' não</b> entre os cearenses '+lado(v.lado)+'<small>'+CASAS[v.casa].nome+' · '+dataBR(v.data)+'</small></span>'+fi(v.url,"votação na página oficial")+'</div>'; }).join("")+'</div></section>' : '')+
  '<div class="lema"><b>Quem tem voto, tem voz.</b><span>Pastorar é tomar conta do que é nosso.</span></div>';
  document.getElementById("grade").onclick = function(e){ const b = e.target.closest("[data-a]"); if (!b) return; const a = b.getAttribute("data-a"); if (ACOES[a]) escolher(a); else location.hash = a; };
}

/* ---------- Casa ---------- */
function casaPag(c, ver){
  topo(false);
  const C = CASAS[c], prox = ver==="2026";
  const eleitos = ((D.ele||{}).eleitos2026||[]).filter(function(e){ return e.casa===c; });
  let lista;
  if (!prox){
    const L = daCasa(c).slice().sort(function(a,b){ const x = a.regua&&a.regua.nota, y = b.regua&&b.regua.nota; return (!!a.fora_exercicio - !!b.fora_exercicio) || (y==null?-1:y) - (x==null?-1:x) || a.nome.localeCompare(b.nome); });
    lista = L.length ? '<div class="lista" style="margin-top:14px">'+L.map(function(p){ const n = p.regua&&p.regua.nota, f = faixa(n);
      const m = (p.partido?esc(p.partido)+' · ':'')+(p.fora_exercicio?'fora do mandato agora (licenciado ou secretário)':p.gastos?mil(p.gastos.total)+' gastos em '+ANO:'sem gastos publicados');
      return linhaP(p, m, n!=null?'<span class="nota num '+f.c+'" title="Régua do Povo: '+f.t+'">'+n+'</span>':'<span class="chip cinza">'+(p.fora_exercicio?'licenciado':'em observação')+'</span>'); }).join("")+'</div>'
      : '<div class="vazio" style="margin-top:14px">Ainda sem dados desta Casa. Veja a situação das fontes em <a href="#sobre">Sobre</a>.</div>';
  } else {
    lista = eleitos.length ? '<div class="lista" style="margin-top:14px">'+eleitos.map(function(e){ const a = e.atual && D.porId[e.atual];
      const pseudo = {id:e.id, nome:e.nome, foto:e.foto_tse || (a&&fotoDe(a))};
      return '<a class="linha-dep" href="'+(a?'#p-'+esc(a.id):'#e-'+esc(e.id))+'">'+av(pseudo)+'<div><div class="nome">'+esc(e.nome)+'</div><div class="meta">'+esc(e.partido)+' · '+esc(e.situacao)+((e.votos||{}).total?' · '+NUM.format(e.votos.total)+' votos':'')+'</div></div><div class="dir">'+(a?'<span class="chip">reeleito(a)</span>':'<span class="chip sol">novo</span>')+'</div></a>'; }).join("")+'</div>'
      : '<div class="vazio" style="margin-top:14px">O resultado de 2026 ainda não está nos dados abertos do TSE. O robô confere toda semana.</div>';
  }
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a>'+
  '<div class="casa-topo"><span class="ic '+C.cor+'">'+I(C.ic)+'</span><div><h1>'+C.longo+'</h1><div class="sub">'+(prox?C.prox:C.agora)+'</div></div></div>'+
  '<div class="filtros"><div class="leg" role="group" aria-label="Legislatura"><button type="button" data-v="agora" aria-pressed="'+!prox+'">Agora <small>'+noMandato(c).length+'</small></button><button type="button" data-v="2026" aria-pressed="'+prox+'">Eleitos em 2026 <small>'+eleitos.length+'</small></button></div>'+
  '<a class="chipbtn" href="#regua" style="text-decoration:none;color:inherit" id="lReg">'+I("regua")+'Como a Régua funciona</a>'+(prox&&D.ele?fi((D.ele.fontes||{})["2026"]&&D.ele.fontes["2026"].candidatos,"TSE · candidatos 2026"):'')+'</div>'+lista;
  app.querySelector(".leg").onclick = function(e){ const b = e.target.closest("[data-v]"); if (b) location.hash = c+(b.getAttribute("data-v")==="2026"?"-2026":""); };
  document.getElementById("lReg").onclick = function(){ store.set("reguaCasa", c); };
}

/* ---------- eleito de 2026 que ainda não tem mandato ---------- */
function eleitoPag(id){
  topo(false);
  const e = ((D.ele||{}).eleitos2026||[]).find(function(x){ return x.id===id; }) || (D.gov&&D.gov.eleito2026&&D.gov.eleito2026.id===id?D.gov.eleito2026:null);
  if (!e){ app.innerHTML = '<a class="voltar" href="#eleitos">'+I("volta")+'Eleitos</a><div class="vazio">Não encontramos.</div>'; return; }
  const F = ((D.ele||{}).fontes||{})["2026"]||{}, p = {id:e.id, nome:e.nome, foto:e.foto_tse};
  app.innerHTML = '<a class="voltar" href="#eleitos">'+I("volta")+'Eleitos em 2026</a><div class="perfil">'+av(p,true)+'<div><span class="chip verm">'+I("urnaN")+esc(e.cargo)+' eleito(a) em 2026</span>'+fi(F.candidatos,"TSE · candidatos 2026")+'<h1 style="margin-top:6px">'+esc(e.nome)+'</h1><div class="meta">'+esc(e.partido)+fi(F.candidatos,"TSE · partido")+' · posse em 2027</div>'+redesHtml(e.redes, F.candidatos)+'</div></div>'+
  '<div class="perguntas">'+cardVotosTSE(e.votos, F.resultados)+cardBens(e.bens, F.candidatos)+cardReceitas(e.receitas, F.contas)+
  '<div class="info">'+I("info")+'<span>Quando o mandato começar, em fevereiro de 2027, o robô passa a trazer os gastos, votos e projetos.</span></div></div>';
}

/* ---------- pedaços do perfil ---------- */
function q(ic,c,txt,story,fonte){ return '<div class="q"><span class="ic '+c+'">'+I(ic)+'</span><span>'+txt+'</span>'+(fonte||'')+(story?'<button type="button" class="comp" data-story="'+story+'" aria-label="Criar arte pro story sobre isso" title="Criar arte pro story">'+I("story")+'</button>':'')+'</div>'; }
function rede(u){ const x = semAc(u); return x.indexOf("instagram")>=0 ? "Instagram" : x.indexOf("facebook")>=0||x.indexOf("fb.com")>=0 ? "Facebook" : x.indexOf("twitter")>=0||/\/\/(www\.)?x\.com/.test(x) ? "X" : x.indexOf("youtube")>=0||x.indexOf("youtu.be")>=0 ? "YouTube" : x.indexOf("tiktok")>=0 ? "TikTok" : x.indexOf("threads")>=0 ? "Threads" : x.indexOf("kwai")>=0 ? "Kwai" : x.indexOf("linkedin")>=0 ? "LinkedIn" : x.indexOf("bsky")>=0 ? "Bluesky" : x.indexOf("whatsapp")>=0||x.indexOf("wa.me")>=0 ? "WhatsApp" : x.indexOf("t.me")>=0 ? "Telegram" : "Site"; }
function redesHtml(lst, fonte){ if (!lst || !lst.length) return ''; return '<div class="redes">'+lst.slice(0,10).map(function(u){ return '<a class="rchip" href="'+esc(u)+'" target="_blank" rel="noopener">'+I("rede")+rede(u)+'</a>'; }).join("")+fi(fonte,"redes sociais declaradas")+'</div>'; }
function cardVotosTSE(v, fonte){ if (!v) return ''; return '<article class="cartao" id="c-eleicao">'+q("mapa","c2","Votos na eleição de "+v.ano,null,fi(fonte,"TSE · votação por município"))+'<div class="r num">'+NUM.format(v.total)+'</div><p class="frase">votos em '+v.n_municipios+' cidades'+(v.fortaleza_pct!=null?' · '+pct(v.fortaleza_pct)+' em Fortaleza':'')+(v.primeiro_turno?' · 2º turno':'')+'</p>'+
  '<details><summary>Onde foi mais votado(a)</summary><div class="det"><ul class="barras">'+v.municipios.slice(0,10).map(function(m){ return '<li><div class="top"><span>'+esc(m[0])+'</span><b class="num">'+NUM.format(m[1])+'</b></div><div class="medidor"><i class="bom" style="width:'+Math.max(2,100*m[1]/v.municipios[0][1])+'%"></i></div></li>'; }).join("")+'</ul></div></details></article>'; }
function cardBens(b, fonte){ if (!b) return ''; return '<article class="cartao" id="c-bens">'+q("casa","c3","Bens declarados ao TSE ("+b.ano+")",null,fi(fonte,"TSE · bens de candidatos"))+'<div class="r num">'+mil(b.total)+'</div><p class="frase">'+b.n+' bens declarados</p>'+
  '<details><summary>Ver a lista</summary><div class="det"><ul class="num">'+b.itens.slice(0,12).map(function(x){ return '<li><span>'+esc(x[0])+'<small>'+esc(x[1])+'</small></span><span>'+mil(x[2])+'</span></li>'; }).join("")+'</ul></div></details></article>'; }
function cardReceitas(r, fonte){ if (!r || !r.total) return ''; const t = r.total, fat = [["Doações pequenas (até "+BRL.format(r.limite_pequena)+")",r.pequenas,"bom"],["Doações médias",r.medias,""],["Grandes doadores",r.grandes,"alerta"],["Do próprio bolso",r.proprios,"alerta"],["Fundo eleitoral e partidário",r.publico,"sol"],["Outros (partido, outros candidatos)",r.outros,""]].filter(function(x){return x[1]>0;});
  return '<article class="cartao" id="c-campanha">'+q("dinheiro","c1","Quem bancou a campanha de "+r.ano,null,fi(fonte,"TSE · prestação de contas"))+'<div class="r num">'+mil(t)+'</div><p class="frase">'+r.n_doadores+' pessoas doaram</p>'+
  '<ul class="barras">'+fat.map(function(x){ return '<li><div class="top"><span>'+x[0]+'</span><b class="num">'+pct(100*x[1]/t)+'</b></div><div class="medidor"><i class="'+x[2]+'" style="width:'+(100*x[1]/t)+'%"></i></div></li>'; }).join("")+'</ul>'+
  (r.maiores&&r.maiores.length?'<details><summary>Maiores doadores</summary><div class="det"><ul class="num">'+r.maiores.map(function(x){ return '<li><span>'+esc(x[0])+'</span><span>'+mil(x[1])+'</span></li>'; }).join("")+'</ul><div class="fonte">Nomes como publicados pelo TSE. Só aparecem doações acima de 10 salários mínimos.</div></div></details>':'')+'</article>'; }
function cardPromessas(lista, titulo, fonte){ if (!lista || !lista.length) return ''; const st = {cumprida:["ok","Cumprida"],andamento:["sol","Em andamento"],parada:["aus","Parada"],contrariada:["contra","Fez o contrário"],aguardando:["aus","A checar"]};
  return '<article class="cartao" id="c-promessas">'+q("promessa","c3",titulo,null,fonte)+'<ul class="det" style="list-style:none;padding:0;margin:10px 0 0">'+lista.map(function(x){ const s = st[x.status||"aguardando"]||st.aguardando;
    return '<li><span>'+esc(x.promessa||x.texto)+(x.lado!=null?' '+lado(x.lado):'')+'<small>'+(x.data?dataBR(x.data)+' · ':'')+(x.fonte?'<a href="'+esc(x.fonte)+'" target="_blank" rel="noopener">onde prometeu</a>':'')+(x.prova_status?' · <a href="'+esc(x.prova_status)+'" target="_blank" rel="noopener">prova do status</a>':'')+'</small></span><span class="voto '+s[0]+'">'+s[1]+'</span></li>'; }).join("")+'</ul></article>'; }

/* ---------- perfil ---------- */
function perfil(id){
  topo(false);
  const p = D.porId[id];
  if (!p){ app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="vazio">Não encontramos esse político nos dados atuais.</div>'; return; }
  const C = CASAS[p.casa], g = p.gastos, r = p.regua, vots = D.votosDe[p.id] || [], pr = p.projetos, t = p.tse || {};
  const nov = segue(p.id) && novidades(p);
  let h = '<a class="voltar" href="#'+p.casa+'">'+I("volta")+C.longo+'</a>'+
  '<div class="perfil">'+av(p,true)+'<div><span class="chip verm">'+I(C.ic)+C.cargo+'</span>'+fi(fp(p,"perfil"))+'<h1 style="margin-top:6px">'+esc(p.nome)+(fp(p,"foto")?fi(fp(p,"foto"),"foto"):'')+'</h1><div class="meta">'+(p.partido?partido(p)+(p.partido_eleicao?' <small>(partido da eleição)</small>':'')+' · ':'')+'Ceará'+(p.fora_exercicio?' · <b>fora do mandato agora</b>':'')+'</div>'+redesHtml(p.redes, fp(p,"redes"))+'</div></div>'+
  (nov ? '<div class="info">'+I("sino")+'<span><b>Novidades desde sua última visita:</b> '+esc(nov.join(", "))+'.</span></div>' : '')+
  '<div class="acoes"><button class="btn" id="bSeg" aria-pressed="'+segue(p.id)+'">'+I(segue(p.id)?"ok":"mais")+(segue(p.id)?"Seguindo":"Seguir")+'</button><button class="btn cheio" id="bCob">'+I("megafone")+'Cobrar</button><button class="btn escuro" id="bSto">'+I("story")+'Story</button><a class="btn" href="#comparar-'+esc(p.id)+'">'+I("comparar")+'Comparar</a></div>'+
  (t.em2026!==undefined ? '<div class="olho" style="background:var(--anil-suave);border-color:var(--anil)">'+I("urnaN")+'<p>'+(t.em2026 ? '<b>Em 2026:</b> concorreu a '+esc(t.em2026.cargo.toLowerCase())+' pelo '+esc(t.em2026.partido)+' · <b>'+esc(t.em2026.situacao)+'</b>' : '<b>Em 2026:</b> não encontramos candidatura no Ceará.')+fi(((D.ele||{}).fontes||{})["2026"]&&D.ele.fontes["2026"].candidatos,"TSE · candidatos 2026")+'</p></div>' : '')+
  '<div class="perguntas">';
  /* Régua */
  if (r && !r.fora){ const f = faixa(r.nota);
    h += '<article class="cartao" id="c-regua">'+q("regua","c4","Régua do Povo",r.nota!=null?"regua":null,'<a class="fi" href="#regua" title="Como a nota é calculada" aria-label="Como a nota é calculada">'+I("info")+'</a>')+
      (r.nota!=null ? '<div class="regua"><div class="grande num '+f.c+'">'+r.nota+'</div><div><div class="faixa">'+f.t+'</div><p class="frase">'+r.pos+'º de '+r.de+' na '+C.nome+(r.parcial?' · faltam dados de: '+esc((r.faltam||[]).join(", ").toLowerCase()):'')+'</p></div></div>'
        : '<div class="r">Em observação</div><p class="frase">Ainda faltam dados para dar nota.</p>')+
      '<details><summary>Como chegamos nessa nota</summary><div class="det"><ul>'+r.dims.map(function(d){ const fo = d.fonte==="votos" ? '<a class="fi" href="#p-'+esc(p.id)+'" data-ir="c-votos" aria-label="Ver os votos">'+I("info")+'</a>' : fi(fp(p, d.fonte==="gastos"?"gastos":d.fonte)); return '<li style="display:block"><div style="display:flex;justify-content:space-between;gap:10px"><span>'+esc(d.nome)+(d.peso!=null?' <span class="pill">peso '+d.peso+'</span>':'')+fo+'</span><b class="num">'+d.valor+'</b></div><div class="medidor"><i class="'+(d.valor>=70?"bom":d.valor<40?"alerta":"")+'" style="width:'+d.valor+'%"></i></div><small>'+esc(d.detalhe)+'</small></li>'; }).join("")+'</ul><div class="fonte">Regras públicas: privilegia quem defende serviços públicos e direitos do povo. <a href="#regua">Veja as regras</a>.</div></div></details></article>';
  }
  /* Gastos */
  if (g){
    const ms = g.meses || [], meio = ms.length ? MESES[ms[0]-1]+" a "+MESES[ms[ms.length-1]-1] : "";
    const alerta = g.maior_fornecedor_pct >= 30 && g.fornecedores[0];
    h += (alerta ? '<div class="olho">'+I("olho")+'<p><b>Fique de olho:</b> um só fornecedor ('+esc(g.fornecedores[0][0])+') ficou com '+pct(g.maior_fornecedor_pct)+' dos gastos. Não é acusação; é algo que o gabinete pode explicar.'+fi(fp(p,"gastos"))+'</p></div>' : '')+
    '<article class="cartao" id="c-gastos">'+q("moeda","c1","Gastou da "+C.verba,"gasto",fi(fp(p,"gastos")))+'<div class="r num'+(g.pct_teto>85?" alerta":"")+'">'+mil(g.total)+'</div><p class="frase">'+meio+' de '+ANO+(g.pct_teto!=null?' · '+pct(g.pct_teto)+' do limite'+fi(fp(p,"teto"),"valor da verba"):'')+' · '+g.n+' lançamentos</p>'+
    (g.pct_teto!=null?'<div class="medidor"><i class="'+(g.pct_teto>85?"alerta":"")+'" style="width:'+Math.min(100,g.pct_teto)+'%"></i></div>':'')+
    '<details><summary>Com o quê e com quem</summary><div class="det"><ul class="num">'+g.por_categoria.slice(0,6).map(function(x){ return '<li><span>'+esc(x[0])+'</span><span>'+mil(x[1])+'</span></li>'; }).join("")+'</ul>'+
    '<p style="margin:12px 0 4px"><b>Quem mais recebeu</b></p><ul class="num">'+g.fornecedores.slice(0,6).map(function(x){ return '<li><span>'+esc(x[0])+(x[1]?'<small>CNPJ/CPF '+esc(x[1])+'</small>':'')+'</span><span>'+mil(x[2])+'</span></li>'; }).join("")+'</ul>'+
    (g.ultimos && g.ultimos.length ? '<p style="margin:12px 0 4px"><b>Últimos lançamentos</b></p><ul class="num">'+g.ultimos.slice(0,8).map(function(x){ return '<li><span>'+esc(x.fornecedor||x.categoria)+'<small>'+MESES[(x.mes||1)-1]+' · '+esc(x.categoria)+'</small></span><span>'+BRL2.format(x.valor)+fi(x.url||fp(p,"gastos"),"nota fiscal ou lançamento")+'</span></li>'; }).join("")+'</ul>' : '')+
    '<div class="fonte">Fonte: '+esc((fp(p,"gastos")||{}).n||"")+fi(fp(p,"gastos"))+(fp(p,"gastos_dados")?' · <a href="'+esc(fp(p,"gastos_dados").u)+'" target="_blank" rel="noopener">baixar os dados</a>':'')+'</div></div></details></article>';
  }
  /* Presença */
  if (p.presenca){ const x = p.presenca;
    h += '<article class="cartao" id="c-presenca">'+q("presenca","c2","Presença no plenário em "+ANO,null,fi(fp(p,"presenca")))+'<div class="r num'+(x.pct<75?" alerta":x.pct>=90?" bom":"")+'">'+pct(x.pct)+'</div><p class="frase">'+x.presencas+' presenças em '+x.sessoes+' sessões · '+x.nao_justificadas+' faltas sem justificativa</p><div class="medidor"><i class="'+(x.pct<75?"alerta":"bom")+'" style="width:'+x.pct+'%"></i></div></article>';
  }
  /* Votos */
  if (vots.length){
    const total = D.votacoes.filter(function(v){return v.casa===p.casa;}).length;
    const fav = vots.filter(function(v){ const x = votoTxt(v.votos[p.id]); return (v.lado===1&&x==="Sim")||(v.lado===-1&&x==="Não"); }).length, marc = vots.filter(function(v){ const x = votoTxt(v.votos[p.id]); return v.lado && (x==="Sim"||x==="Não"); }).length;
    h += '<article class="cartao" id="c-votos">'+q("urna","c4","Votações nominais","voto",fi(fp(p,"votos")))+'<div class="r num">votou em '+vots.filter(function(v){ const t = votoTxt(v.votos[p.id]); return t==="Sim"||t==="Não"||t==="Abstenção"||t==="Obstrução"; }).length+' de '+total+'</div><p class="frase">'+(marc?'a favor do povo em <b>'+fav+' de '+marc+'</b> votações sobre serviços públicos e direitos':'votações nominais recentes da '+C.nome)+'</p>'+
    '<details open><summary>Ver os votos</summary><div class="det"><ul>'+vots.slice(0,15).map(function(v){ const t = votoTxt(v.votos[p.id]); const bom = (v.lado===1&&t==="Sim")||(v.lado===-1&&t==="Não"), mau = (v.lado===1&&t==="Não")||(v.lado===-1&&t==="Sim");
      return '<li><span>'+esc(v.titulo)+' '+lado(v.lado)+'<small>'+dataBR(v.data)+(v.descricao&&v.descricao!==v.titulo?' · '+esc(v.descricao.slice(0,140)):'')+'</small></span><span><span class="voto '+(bom?"ok":mau?"contra":"aus")+'">'+esc(t)+'</span>'+fi(v.url,"votação na página oficial")+'</span></li>'; }).join("")+'</ul><div class="fonte">Verde: votou a favor do povo. Vermelho: votou contra. Cinza: votação sem relação direta com serviços públicos e direitos.</div></div></details></article>';
  }
  /* Projetos */
  if (pr){
    const hom = pr.filter(function(x){return x.homenagem;}).length, fav = pr.filter(function(x){return x.lado===1;}).length, con = pr.filter(function(x){return x.lado===-1;}).length;
    h += '<article class="cartao" id="c-projetos">'+q("doc","c2","Projetos apresentados em "+ANO,"projeto",fi(fp(p,"projetos")))+'<div class="r num">'+pr.length+'</div><p class="frase">'+fav+' a favor do povo · '+con+' contra · '+hom+' só de homenagem</p>'+
    (pr.length?'<details><summary>Ver os projetos</summary><div class="det"><ul>'+pr.slice(0,30).map(function(x){ return '<li><span><b>'+esc((x.tipo||"")+" "+(x.numero||"")+(x.ano&&String(x.numero).indexOf("/")<0?"/"+x.ano:""))+'</b>'+(x.homenagem?'<span class="pill">homenagem</span>':'')+' '+lado(x.lado)+'<small>'+esc(x.ementa)+'</small></span><span>'+fi(x.url,"texto do projeto")+'</span></li>'; }).join("")+'</ul></div></details>':'')+'</article>';
  }
  /* Emendas */
  if (p.emendas){ const e = p.emendas;
    h += '<article class="cartao" id="c-emendas">'+q("dinheiro","c3","Emendas desde "+e.anos[0],null,fi(fp(p,"emendas")))+'<div class="r num">'+mil(e.pago)+' pagos</div><p class="frase">'+mil(e.empenhado)+' empenhados · '+(e.pct_servicos!=null?'<b>'+pct(e.pct_servicos)+'</b> para saúde, educação, assistência e outros serviços':'')+'</p>'+
    '<details><summary>Para onde foi</summary><div class="det"><p style="margin:4px 0"><b>Por área</b></p><ul class="num">'+e.por_funcao.slice(0,6).map(function(x){ return '<li><span>'+esc(x[0])+'</span><span>'+mil(x[1])+'</span></li>'; }).join("")+'</ul>'+
    (e.por_municipio.length?'<p style="margin:12px 0 4px"><b>Por cidade</b></p><ul class="num">'+e.por_municipio.slice(0,8).map(function(x){ return '<li><span>'+esc(x[0])+'</span><span>'+mil(x[1])+'</span></li>'; }).join("")+'</ul>':'')+
    '<p style="margin:12px 0 4px"><b>Maiores emendas</b></p><ul class="num">'+e.maiores.slice(0,8).map(function(x){ return '<li><span>'+esc(x.funcao)+'<small>'+esc(x.local||"")+' · '+x.ano+' · código '+esc(x.codigo)+'</small></span><span>'+mil(x.pago)+fi("https://portaldatransparencia.gov.br/emendas/consulta?codigoEmenda="+encodeURIComponent(x.codigo),"emenda no Portal da Transparência")+'</span></li>'; }).join("")+'</ul></div></details></article>';
  }
  /* Viagens */
  if (p.viagens){ const v = p.viagens, u = v.ultimas[0];
    h += '<article class="cartao" id="c-viagens">'+q("aviao","c2","Viagens pagas com a cota",null,fi(fp(p,"viagens")))+'<div class="r num">'+v.n+' trechos</div><p class="frase">'+mil(v.total)+' em passagens'+(u?' · última: <b>'+esc(u.trecho)+'</b> em '+dataBR(u.data):'')+'</p>'+
    '<details><summary>Ver as viagens</summary><div class="det"><ul class="num">'+v.ultimas.slice(0,12).map(function(x){ return '<li><span>'+esc(x.trecho)+'<small>'+dataBR(x.data)+(x.empresa?' · '+esc(x.empresa):'')+(x.passageiro&&semAc(x.passageiro).indexOf(semAc(p.nome.split(" ")[0]))<0?' · passageiro: '+esc(x.passageiro):'')+'</small></span><span>'+BRL2.format(x.valor)+(x.url?fi(x.url,"bilhete"):'')+'</span></li>'; }).join("")+'</ul></div></details></article>';
  } else if (p.casa==="alece" && g){
    const desl = g.por_categoria.filter(function(x){ return /passag|combust|locomo|hosped|veic|aluguel de ve|transporte/i.test(semAc(x[0])); });
    if (desl.length) h += '<article class="cartao" id="c-viagens">'+q("aviao","c2","Deslocamentos pagos com a verba",null,fi(fp(p,"gastos")))+'<div class="r num">'+mil(desl.reduce(function(a,x){return a+x[1];},0))+'</div><p class="frase">'+desl.map(function(x){return esc(x[0]);}).join(", ")+'. A Assembleia não publica o destino de cada viagem em dados abertos.</p></article>';
  }
  /* TSE */
  h += cardVotosTSE(p.votos, fp(p,"votos")) + cardBens(p.bens, fp(p,"bens")) + cardReceitas(p.receitas, fp(p,"receitas"));
  h += cardPromessas(p.promessas, "Promessas de campanha", '<a class="fi" href="#promessas" aria-label="Como funciona o Prometômetro">'+I("info")+'</a>');
  /* Contato */
  h += '<article class="cartao" id="c-contato">'+q("megafone","c1","Contato oficial",null,fi(fp(p,"perfil")))+'<ul class="det" style="list-style:none;padding:0;margin:8px 0 0">'+
    (p.email?'<li><span>'+I("email")+' <a href="mailto:'+esc(p.email)+'">'+esc(p.email)+'</a></span>'+fi(fp(p,"partido"),"e-mail oficial")+'</li>':'')+
    (p.telefone?'<li><span>'+I("tel")+' <a href="tel:'+esc(p.telefone.replace(/\D/g,""))+'">'+esc(p.telefone)+'</a></span>'+fi(fp(p,"partido"),"telefone do gabinete")+'</li>':'')+
    (p.gabinete?'<li><span>'+esc(p.gabinete)+'</span></li>':'')+
    (!p.email && p.email_campanha?'<li><span>'+I("email")+' '+esc(p.email_campanha)+' <small>e-mail informado na campanha</small></span>'+fi(fp(p,"redes"),"TSE")+'</li>':'')+
    (p.link?'<li><span>'+I("link")+' <a href="'+esc(p.link)+'" target="_blank" rel="noopener">Página oficial</a></span></li>':'')+
    '<li><span>'+I("rss")+' <a href="feeds/'+esc(p.id)+'.xml">Feed de novidades (RSS)</a><small>Cole num leitor de RSS para receber avisos.</small></span></li></ul></article>';
  if (!g && !vots.length && !pr && !p.votos) h += '<div class="vazio">Ainda não há dados publicados para '+esc(p.nome)+'.</div>';
  h += '</div>';
  app.innerHTML = h;
  document.getElementById("bSeg").onclick = function(){ alterna(p.id); this.setAttribute("aria-pressed",segue(p.id)); this.innerHTML = I(segue(p.id)?"ok":"mais")+(segue(p.id)?"Seguindo":"Seguir"); };
  document.getElementById("bCob").onclick = function(){ abreCobrar(p); };
  document.getElementById("bSto").onclick = function(){ abreStory(p); };
  app.querySelector(".perguntas").onclick = function(e){ const b = e.target.closest("[data-story]"); if (b) abreStory(p, b.getAttribute("data-story"));
    const ir = e.target.closest("[data-ir]"); if (ir){ e.preventDefault(); const el = document.getElementById(ir.getAttribute("data-ir")); if (el) el.scrollIntoView({behavior:"smooth"}); } };
  if (segue(p.id)) setTimeout(function(){ marcaVisto(p); conta(); }, 1500);
  if (pendente){ const pe = pendente; pendente = null;
    if (pe.sec){ const el = document.getElementById(pe.sec); if (el){ const d = el.querySelector("details"); if (d) d.open = true; setTimeout(function(){ el.scrollIntoView({behavior:"smooth",block:"start"}); },60); } else toast("Ainda não há esse dado para "+p.nome+"."); }
    if (pe.abre==="cobrar") abreCobrar(p);
    if (pe.abre==="story") abreStory(p);
  }
}

/* ---------- cobrar ---------- */
function usuario(u){ const m = String(u).match(/(?:instagram\.com|twitter\.com|x\.com|tiktok\.com|threads\.net)\/@?([A-Za-z0-9_.]+)/i); return m ? m[1] : null; }
function abreCobrar(p){
  const C = CASAS[p.casa], temas = {}, vs = D.votosDe[p.id]||[], v = vs.find(function(x){ return x.lado; }) || vs[0];
  if (p.gastos) temas.gasto = ["moeda","Gastos",p.nome+", vi no Pastorando que seu gabinete gastou "+mil(p.gastos.total)+" da "+C.verba+" este ano"+(p.gastos.fornecedores[0]?", com "+p.gastos.fornecedores[0][0]+" como maior fornecedor":"")+". Com o quê? Por que esses fornecedores?"];
  if (v) temas.voto = ["urna","Um voto",p.nome+", na votação \""+v.titulo+"\" ("+dataBR(v.data)+"), seu voto foi \""+votoTxt(v.votos[p.id])+"\". Quero entender por quê."];
  if (p.presenca && p.presenca.nao_justificadas) temas.falta = ["presenca","Faltas",p.nome+", você faltou "+p.presenca.nao_justificadas+" sessões sem justificativa este ano. Quem te elegeu quer você trabalhando."];
  temas.pedido = ["doc","Um pedido",p.nome+", na minha cidade o problema é [descreva]. Peço que apresente um projeto ou cobre o governo sobre isso."];
  let atual = Object.keys(temas)[0];
  const redes = (p.redes||[]);
  abreFolha("Cobrar "+esc(p.nome), '<div class="temas" id="fTemas"></div><textarea id="fTxt" aria-label="Mensagem"></textarea>'+
    '<div class="acoes"><button class="btn cheio" id="fCopiar">'+I("copiar")+'Copiar</button>'+(p.email?'<a class="btn" id="fMail" href="#">'+I("email")+'E-mail</a>':'')+'<a class="btn" id="fZap" href="#" target="_blank" rel="noopener">'+I("partilhar")+'Mandar no WhatsApp</a><button class="btn" id="fSto">'+I("story")+'Virar story</button></div>'+
    (redes.length ? '<h3 style="margin:18px 0 6px">Cobre nas redes '+fi(fp(p,"redes"),"redes sociais declaradas")+'</h3><p class="sub" style="font-size:14px;margin:0 0 8px">Toque para copiar a mensagem e abrir o perfil.</p><div class="redes" id="fRedes">'+redes.map(function(u,i){ const us = usuario(u); return '<a class="rchip grande" data-r="'+i+'" href="'+esc(u)+'" target="_blank" rel="noopener">'+I("rede")+rede(u)+(us?' <small>@'+esc(us)+'</small>':'')+'</a>'; }).join("")+'</div>' : '<p class="sub" style="font-size:14px">Não achamos redes sociais registradas.</p>')+
    '<p class="sub" style="font-size:14px">'+(p.email?esc(p.email)+fi(fp(p,"partido"),"e-mail oficial"):'Contato do gabinete na <a href="'+esc(p.link)+'" target="_blank" rel="noopener">página oficial</a>')+(p.telefone?' · '+esc(p.telefone):'')+'</p>');
  const box = document.getElementById("fTemas"), txt = document.getElementById("fTxt"), mail = document.getElementById("fMail"), zap = document.getElementById("fZap");
  function desenha(){ box.innerHTML = Object.keys(temas).map(function(k){ return '<button type="button" data-t="'+k+'" aria-pressed="'+(k===atual)+'">'+I(temas[k][0])+temas[k][1]+'</button>'; }).join(""); txt.value = temas[atual][2]+"\n\n[seu nome], de [sua cidade]"; liga(); }
  function liga(){ if (mail) mail.href = "mailto:"+encodeURIComponent(p.email)+"?subject="+encodeURIComponent("Cobrança de eleitor(a)")+"&body="+encodeURIComponent(txt.value); zap.href = "https://wa.me/?text="+encodeURIComponent(txt.value+"\n\nVeja em: "+location.href.split("#")[0]+"#p-"+p.id); }
  function copia(cb){ const falha = function(){ txt.select(); toast("Texto selecionado. Use copiar do seu aparelho."); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt.value).then(function(){ toast("Mensagem copiada! Cole no comentário ou na mensagem."); if (cb) cb(); }, falha); else falha(); }
  txt.oninput = liga;
  box.onclick = function(e){ const b = e.target.closest("[data-t]"); if (b){ atual = b.getAttribute("data-t"); desenha(); } };
  desenha();
  document.getElementById("fCopiar").onclick = function(){ copia(); };
  const fr = document.getElementById("fRedes"); if (fr) fr.onclick = function(e){ if (e.target.closest("[data-r]")) copia(); };
  document.getElementById("fSto").onclick = function(){ abreStory(p, atual==="pedido"||atual==="falta"?null:atual); };
}

/* ---------- arte para story ---------- */
const FUNDOS = {chita:{bg:"#d9432b",fg:"#fbe9c9",sub:"#ffe2d6",acc:"#f1ad1b"}, noite:{bg:"#16302d",fg:"#fbe9c9",sub:"#bcd0cb",acc:"#f1ad1b"}, sol:{bg:"#f1ad1b",fg:"#16302d",sub:"#4a3a10",acc:"#d9432b"}, cal:{bg:"#fbf7ef",fg:"#16302d",sub:"#5d6b68",acc:"#d9432b"}};
function modelos(p){
  const C = CASAS[p.casa], m = {};
  if (p.gastos) m.gasto = {ic:"moeda",nome:"Gastos",fundo:"chita",kick:"COBRANÇA",tit:mil(p.gastos.total)+" da "+C.verba+" em "+ANO+".",sub:p.nome+", com o que foi gasto?"};
  if ((D.votosDe[p.id]||[]).length) m.voto = {ic:"urna",nome:"Um voto",fundo:"noite",kick:"COMO VOTOU",voto:true};
  if (p.regua && p.regua.nota!=null) m.regua = {ic:"regua",nome:"Régua do Povo",fundo:"cal",kick:"RÉGUA DO POVO",regua:true};
  if (p.projetos) m.projeto = {ic:"doc",nome:"Projetos",fundo:"sol",kick:"O QUE PROPÔS",tit:p.projetos.length+" projetos em "+ANO+".",sub:p.projetos.filter(function(x){return x.lado===1;}).length+" a favor do povo. "+p.projetos.filter(function(x){return x.homenagem;}).length+" só de homenagem."};
  if (p.presenca) m.falta = {ic:"presenca",nome:"Presença",fundo:"noite",kick:"PRESENÇA",tit:pct(p.presenca.pct)+" de presença no plenário.",sub:p.presenca.nao_justificadas+" faltas sem justificativa em "+ANO+"."};
  if (p.receitas && p.receitas.total) m.campanha = {ic:"dinheiro",nome:"Campanha",fundo:"sol",kick:"QUEM BANCOU",tit:pct(100*(p.receitas.grandes+p.receitas.proprios)/p.receitas.total)+" da campanha veio de grandes doadores e do próprio bolso.",sub:"Eleição de "+p.receitas.ano+", dados do TSE."};
  return m;
}
function quebra(ctx, texto, larg){ const pal = String(texto).split(" "), linhas = []; let l = ""; pal.forEach(function(w){ const t = l ? l+" "+w : w; if (ctx.measureText(t).width > larg && l){ linhas.push(l); l = w; } else l = t; }); if (l) linhas.push(l); return linhas; }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function desenhaStory(cv, p, m, votoId, foto){
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
  ctx.fillStyle = cor(p); ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.fill();
  if (foto){ ctx.save(); ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.clip(); ctx.drawImage(foto,90,490,140,140); ctx.restore(); }
  else { ctx.fillStyle = "#fff"; ctx.font = "800 56px 'Bricolage Grotesque', sans-serif"; ctx.textAlign = "center"; ctx.fillText(ini(p),160,580); ctx.textAlign = "left"; }
  ctx.strokeStyle = F.acc; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.stroke();
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
    quebra(ctx, p.regua.pos+"º lugar entre "+p.regua.de+" na "+C.nome+". A nota mede votos e projetos a favor dos serviços públicos e dos direitos do povo.", 900).forEach(function(l,i){ ctx.fillText(l,90,y+i*58); });
  } else {
    let tit = m.tit, sub = m.sub, selo = null, seloCor = F.acc;
    if (m.voto){ const vs = D.votosDe[p.id]||[], v = vs.find(function(x){return x.id===votoId;}) || vs[0], x = votoTxt(v.votos[p.id]);
      tit = (x==="Sim"?"Votou SIM: ":x==="Não"?"Votou NÃO: ":x+": ")+v.titulo+"."; sub = "Votação na "+C.nome+" em "+dataBR(v.data)+"."+(v.lado===1?" Votar SIM era a favor do povo.":v.lado===-1?" Votar NÃO era a favor do povo.":""); selo = x.toUpperCase(); seloCor = x==="Sim" ? "#4cc3b6" : x==="Não" ? "#f0654c" : "#9fb0ab"; }
    ctx.font = "400 46px 'Atkinson Hyperlegible', sans-serif"; const subL = quebra(ctx, sub, 900).slice(0,4);
    let tt = 104, ls; for (; tt >= 52; tt -= 4){ ctx.font = "800 "+tt+"px 'Bricolage Grotesque', sans-serif"; ls = quebra(ctx, tit, 900); if (tt + (ls.length-1)*tt*1.08 + 70 + (selo?150:0) + subL.length*62 <= 1580 - y && ls.length <= 6) break; }
    ctx.fillStyle = F.fg; ls.forEach(function(l,i){ ctx.fillText(l,90,y+tt+i*(tt*1.08)); }); y += tt + (ls.length-1)*tt*1.08 + 70;
    if (selo){ ctx.save(); ctx.translate(90,y); ctx.rotate(-0.04); ctx.font = "800 54px 'Bricolage Grotesque', sans-serif"; const sw = ctx.measureText(selo).width+70; ctx.strokeStyle = seloCor; ctx.lineWidth = 8; rr(ctx,0,0,sw,100,20); ctx.stroke(); ctx.fillStyle = seloCor; ctx.fillText(selo,35,70); ctx.restore(); y += 150; }
    ctx.fillStyle = F.sub; ctx.font = "400 46px 'Atkinson Hyperlegible', sans-serif"; subL.forEach(function(l,i){ ctx.fillText(l,90,y+46+i*62); });
  }
  ctx.strokeStyle = F.fg; ctx.globalAlpha = .35; ctx.lineWidth = 3; ctx.beginPath(); for (let x=90; x<990; x+=36){ ctx.moveTo(x,1620); ctx.quadraticCurveTo(x+9,1648,x+18,1620); ctx.quadraticCurveTo(x+27,1648,x+36,1620); } ctx.stroke(); ctx.globalAlpha = 1;
  ctx.fillStyle = F.fg; ctx.font = "800 46px 'Bricolage Grotesque', sans-serif"; ctx.fillText("Quem tem voto, tem voz.", 90, 1720);
  ctx.fillStyle = F.sub; ctx.font = "400 32px 'Atkinson Hyperlegible', sans-serif"; ctx.fillText(location.host+" · dados oficiais", 90, 1772);
  const fonte = m.campanha ? "Fonte: TSE, prestação de contas" : p.casa==="alece" ? "Fonte: Assembleia Legislativa do Ceará" : p.casa==="camara" ? "Fonte: dados abertos da Câmara" : "Fonte: dados abertos do Senado";
  ctx.fillText(fonte+" · "+((D.meta.atualizado||"").slice(0,10).split("-").reverse().join("/")), 90, 1830);
}
function abreStory(p, inicial){
  const M = modelos(p), chaves = Object.keys(M);
  if (!chaves.length){ toast("Ainda não há dados para criar uma arte sobre "+p.nome+"."); return; }
  let atual = (inicial && M[inicial]) ? inicial : chaves[0], votoId = (((D.votosDe[p.id]||[]).find(function(v){return v.lado;}))||(D.votosDe[p.id]||[])[0]||{}).id, foto = null;
  abreFolha("Arte pro story", '<div class="temas" id="sTemas"></div><div id="sVoto"></div><div class="previa"><img id="sImg" alt="Prévia da arte para story"></div>'+
    '<div class="acoes"><button class="btn cheio" id="sBaixar">'+I("baixar")+'Baixar JPG</button><button class="btn" id="sPart" hidden>'+I("partilhar")+'Compartilhar</button></div><p class="sub" style="font-size:14px;text-align:center">1080 × 1920, tamanho do story.</p>');
  const cv = document.createElement("canvas"), img = document.getElementById("sImg");
  function desenha(){
    document.getElementById("sTemas").innerHTML = chaves.map(function(k){ return '<button type="button" data-t="'+k+'" aria-pressed="'+(k===atual)+'">'+I(M[k].ic)+M[k].nome+'</button>'; }).join("");
    document.getElementById("sVoto").innerHTML = M[atual].voto ? '<select class="campo" id="sV" aria-label="Qual votação?">'+(D.votosDe[p.id]||[]).slice(0,30).map(function(v){ return '<option value="'+esc(v.id)+'"'+(v.id===votoId?" selected":"")+'>'+esc(dataBR(v.data)+" · "+v.titulo)+'</option>'; }).join("")+'</select>' : '';
    const sv = document.getElementById("sV"); if (sv) sv.onchange = function(){ votoId = sv.value; render(); };
    render(); }
  function render(){ desenhaStory(cv, p, M[atual], votoId, foto); try{ img.src = cv.toDataURL("image/jpeg", .9); }catch(e){ foto = null; desenhaStory(cv, p, M[atual], votoId, null); img.src = cv.toDataURL("image/jpeg", .9); } }
  document.getElementById("sTemas").onclick = function(e){ const b = e.target.closest("[data-t]"); if (b){ atual = b.getAttribute("data-t"); desenha(); } };
  const fontes = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("800 64px 'Bricolage Grotesque'"), document.fonts.load("400 40px 'Atkinson Hyperlegible'")]).catch(function(){}) : Promise.resolve();
  const carregaFoto = new Promise(function(ok){ const f = fotoDe(p); if (!f || /^https?:/.test(f)) return ok(); const im = new Image(); im.onload = function(){ foto = im; ok(); }; im.onerror = function(){ ok(); }; im.src = f; });
  desenha(); Promise.all([fontes, carregaFoto]).then(render);
  const nome = function(){ return "pastorando-"+semAc(p.nome).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+atual+".jpg"; };
  document.getElementById("sBaixar").onclick = function(){ cv.toBlob(function(b){ const u = URL.createObjectURL(b), a = document.createElement("a"); a.href = u; a.download = nome(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 4000); toast("Arte baixada. Agora é só postar."); }, "image/jpeg", .92); };
  const bp = document.getElementById("sPart");
  try { if (navigator.canShare && navigator.canShare({files:[new File([new Blob(["x"])], "t.jpg", {type:"image/jpeg"})]})) bp.hidden = false; } catch(e){}
  bp.onclick = function(){ cv.toBlob(function(b){ navigator.share({files:[new File([b], nome(), {type:"image/jpeg"})], title:"Pastorando"}).catch(function(){}); }, "image/jpeg", .92); };
}

/* ---------- Régua ---------- */
function regua(){
  topo(false);
  const c = store.get("reguaCasa","alece"), L = daCasa(c).filter(function(p){return p.regua && p.regua.nota!=null;}).sort(function(a,b){return b.regua.nota-a.regua.nota;});
  const R = D.meta.regua || {}, dims = R.dimensoes || {}, vc = (R.votacoes_classificadas||{})[c];
  const mapa = mapaRegua(L);
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Régua do Povo</h1><p class="sub">Nota de 0 a 100, calculada pelo robô com regras públicas. Vale mais quem defende serviços públicos e direitos do povo trabalhador. Não usa pesquisa de opinião nem a nossa opinião sobre cada pessoa.</p>'+
  '<div class="filtros" id="rF">'+["alece","camara","senado"].map(function(k){ return '<button type="button" class="chipbtn" data-c="'+k+'" aria-pressed="'+(k===c)+'">'+I(CASAS[k].ic)+CASAS[k].nome+'</button>'; }).join("")+'</div>'+
  (L.length ? '<div class="lista" style="margin-top:14px">'+L.map(function(p){ const f = faixa(p.regua.nota); return '<a class="linha-dep" href="#p-'+esc(p.id)+'"><span class="num" style="width:22px;color:var(--tinta-2);font-weight:700">'+p.regua.pos+'</span>'+av(p)+'<div><div class="nome">'+esc(p.nome)+'</div><div class="meta">'+(p.partido?esc(p.partido)+' · ':'')+f.t+(p.regua.parcial?' · dados parciais':'')+'</div></div><div class="dir"><span class="nota num '+f.c+'">'+p.regua.nota+'</span></div></a>'; }).join("")+'</div>' : '<div class="vazio" style="margin-top:14px">Ainda sem notas para esta Casa.</div>')+
  (mapa ? '<section><h2>Mapa: votos × dinheiro</h2><p class="sub">Cada ponto é um parlamentar. Mais à direita: vota mais a favor do povo. Mais acima: cuida melhor do dinheiro público.</p>'+mapa+'</section>' : '')+
  '<section><h2>As cinco partes da nota</h2><div class="cartao" style="margin-top:10px"><ul class="det" style="list-style:none;padding:0;margin:0">'+Object.keys(dims).map(function(k){ return '<li style="display:block"><div style="display:flex;justify-content:space-between"><b>'+esc(dims[k].nome)+'</b><span class="pill">peso '+dims[k].peso+'</span></div><small>'+esc(dims[k].explica)+'</small></li>'; }).join("")+'</ul>'+
  (vc ? '<p class="frase" style="margin-top:10px">Nesta Casa, das '+vc.total+' votações nominais recentes, '+vc.a_favor+' foram marcadas como "votar SIM é a favor do povo" e '+vc.contra+' como "votar NÃO é a favor do povo". As outras não entram na nota.</p>' : '')+
  '<p class="frase" style="margin-top:10px">A nota só aparece com pelo menos três partes calculadas. Cada um é comparado só com colegas da mesma Casa.</p></div></section>'+
  '<section><h2>As palavras que o robô usa</h2><div class="cartao" style="margin-top:10px"><p class="frase" style="margin:0">O robô lê o título e a descrição de cada votação e a ementa de cada projeto e procura estas palavras.</p><details><summary>Ver as palavras</summary><p class="frase"><span class="lado a">a favor do povo</span> '+esc((R.a_favor_do_povo||[]).join(" · "))+'</p><p class="frase" style="margin-top:10px"><span class="lado c">contra o povo</span> '+esc((R.contra_o_povo||[]).join(" · "))+'</p>'+
  '<p class="frase" style="margin-top:10px">Se o texto também diz '+esc((R.inversores||[]).map(function(x){return "“"+x.trim()+"”";}).join(", "))+', o sentido se inverte (ex.: “susta a privatização” é a favor do povo).</p></details>'+
  '<p class="frase" style="margin-top:10px">Errou a classificação de uma votação? A correção fica registrada, com o motivo, no arquivo público <code>config/votacoes_manuais.json</code>'+(D.meta.repositorio?' (<a href="https://github.com/'+esc(D.meta.repositorio)+'/blob/main/config/votacoes_manuais.json" target="_blank" rel="noopener">ver</a>)':'')+'.</p></div></section>';
  document.getElementById("rF").onclick = function(e){ const b = e.target.closest("[data-c]"); if (b){ store.set("reguaCasa", b.getAttribute("data-c")); regua(); } };
}
function mapaRegua(L){
  const pts = L.map(function(p){ const d = {}; p.regua.dims.forEach(function(x){ d[x.chave] = x.valor; }); return {p:p, x:d.votos_povo, y:d.dinheiro}; }).filter(function(o){ return o.x!=null && o.y!=null; });
  if (pts.length < 3) return "";
  const W = 320, Hh = 240, m = 28;
  return '<svg class="mapa-r" viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="Mapa dos parlamentares por votos e cuidado com o dinheiro">'+
    '<rect x="'+m+'" y="8" width="'+(W-m-8)+'" height="'+(Hh-m-8)+'" class="fundo-m"/><line x1="'+((W+m-8)/2)+'" y1="8" x2="'+((W+m-8)/2)+'" y2="'+(Hh-m)+'" class="eixo"/><line x1="'+m+'" y1="'+((Hh-m+8)/2)+'" x2="'+(W-8)+'" y2="'+((Hh-m+8)/2)+'" class="eixo"/>'+
    '<text x="'+m+'" y="'+(Hh-10)+'">vota contra o povo</text><text x="'+(W-8)+'" y="'+(Hh-10)+'" text-anchor="end">vota a favor</text><text x="'+(m-6)+'" y="16" text-anchor="end" transform="rotate(-90 '+(m-14)+' 16)">cuida do dinheiro</text>'+
    pts.map(function(o){ const x = m + (W-m-8)*o.x/100, y = 8 + (Hh-m-8)*(1-o.y/100); return '<a href="#p-'+esc(o.p.id)+'"><circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="6" fill="'+cor(o.p)+'"><title>'+esc(o.p.nome)+': votos '+o.x+', dinheiro '+o.y+'</title></circle></a>'; }).join("")+'</svg>';
}

/* ---------- Governo ---------- */
function governoPag(){
  topo(false);
  const G = D.gov || {}, g = G.governador, e = G.eleito2026, anos = Object.keys(G.orcamento||{}).sort().reverse(), F = (D.ele||{}).fontes||{};
  let h = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="casa-topo"><span class="ic c3">'+I("gov")+'</span><div><h1>Governo do Ceará</h1><div class="sub">Governador, orçamento e o que o Executivo manda para a Assembleia</div></div></div>';
  if (g){ const p = {id:g.id, nome:g.nome, foto:g.foto_tse};
    h += '<div class="perfil" style="margin-top:18px">'+av(p,true)+'<div><span class="chip verm">'+I("gov")+'Governador(a) · mandato 2023–2026</span>'+fi((G.fontes||{}).governador)+'<h1 style="margin-top:6px">'+esc(g.nome)+'</h1><div class="meta">'+esc(g.partido)+(g.vice?' · vice: '+esc(g.vice):'')+'</div>'+redesHtml(g.redes, (F["2022"]||{}).candidatos)+'</div></div>';
  } else h += '<div class="info">'+I("info")+'<span>Os dados do governador vêm do TSE e aparecem depois da primeira coleta completa.</span></div>';
  if (e) h += '<a class="ev" href="#e-'+esc(e.id)+'" style="margin-top:14px">'+av({id:e.id,nome:e.nome,foto:e.foto_tse})+'<span><b>Eleito(a) em 2026: '+esc(e.nome)+'</b> ('+esc(e.partido)+')<small>Posse em 1º de janeiro de 2027'+(e.votos?' · '+NUM.format(e.votos.total)+' votos':'')+'</small></span>'+fi((F["2026"]||{}).candidatos,"TSE · candidatos 2026")+'</a>';
  h += '<div class="perguntas">';
  if (anos.length){ const o = G.orcamento[anos[0]], maior = o.funcoes[0] ? o.funcoes[0][1] : 1;
    h += '<article class="cartao" id="c-orcamento">'+q("moeda","c1","Para onde vai o dinheiro do estado ("+o.ano+")",null,fi(o.fonte))+'<div class="r num">'+mil(o.total)+'</div><p class="frase">gastos até o '+o.bimestre+'º bimestre · <b>'+pct(o.pct_servicos)+'</b> em saúde, educação, assistência, moradia, saneamento e outros serviços</p>'+
      '<ul class="barras">'+o.funcoes.slice(0,12).map(function(f){ return '<li><div class="top"><span>'+esc(f[0])+(f[3]?' <span class="lado a">serviço público</span>':'')+'</span><b class="num">'+mil(f[1])+'</b></div><div class="medidor"><i class="'+(f[3]?"bom":"")+'" style="width:'+Math.max(1,100*f[1]/maior)+'%"></i></div></li>'; }).join("")+'</ul>'+
      (anos[1] ? '<p class="frase" style="margin-top:10px">Em '+anos[1]+': '+pct(G.orcamento[anos[1]].pct_servicos)+' em serviços públicos.'+fi(G.orcamento[anos[1]].fonte)+'</p>' : '')+
      '<div class="fonte">“Encargos especiais” é, na maior parte, pagamento de dívida. <a href="'+esc(o.dados)+'" target="_blank" rel="noopener">Baixar os dados</a> · <a href="'+esc(((G.fontes||{}).portal||{}).u||"#")+'" target="_blank" rel="noopener">Ceará Transparente</a></div></article>';
  }
  if (G.mensagens && G.mensagens.length){ const r = G.mensagens_resumo || {};
    h += '<article class="cartao" id="c-mensagens">'+q("doc","c2","Projetos que o governo mandou à Assembleia em "+ANO,null,fi((G.fontes||{}).mensagens))+'<div class="r num">'+r.total+'</div><p class="frase">'+r.a_favor+' a favor do povo · '+r.contra+' contra · o resto sem relação direta</p>'+
      '<details><summary>Ver os projetos</summary><div class="det"><ul>'+G.mensagens.slice(0,30).map(function(x){ return '<li><span><b>'+esc(x.tipo+" "+x.numero)+'</b> '+lado(x.lado)+'<small>'+esc(x.ementa)+'</small></span><span>'+fi(x.url,"texto do projeto")+'</span></li>'; }).join("")+'</ul></div></details></article>';
  }
  if (g && g.plano){ const pl = g.plano;
    h += cardPromessas((G.promessas_manuais||[]).concat((pl.promessas||[]).map(function(x){ return {promessa:x.texto, lado:x.lado, status:"aguardando"}; })), "Prometômetro: plano de governo "+pl.ano, fi(pl.fonte))+
      '<p class="sub" style="font-size:14px">As promessas foram tiradas automaticamente do <a href="'+esc(pl.pdf)+'" target="_blank" rel="noopener">plano registrado no TSE (PDF)</a>. A checagem de cada uma é feita à mão e fica registrada com link de prova.</p>';
  }
  if (g) h += cardVotosTSE(g.votos, (F["2022"]||{}).resultados) + cardBens(g.bens, (F["2022"]||{}).candidatos) + cardReceitas(g.receitas, (F["2022"]||{}).contas);
  if (e && e.plano) h += cardPromessas((e.plano.promessas||[]).slice(0,20).map(function(x){ return {promessa:x.texto, lado:x.lado, status:"aguardando"}; }), "O que "+esc(e.nome)+" promete para 2027–2030", fi(e.plano.fonte));
  h += '</div>';
  app.innerHTML = h;
}

/* ---------- Comparar ---------- */
function compararPag(a, b){
  topo(false);
  const A = D.porId[a], B = D.porId[b];
  if (!A){ app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Comparar</h1><p class="sub">Escolha dois políticos.</p><div class="acoes"><button class="btn cheio" id="cEsc">'+I("comparar")+'Escolher o primeiro</button></div>'; document.getElementById("cEsc").onclick = function(){ escolher("comparar"); }; return; }
  if (!B){ app.innerHTML = '<a class="voltar" href="#p-'+esc(a)+'">'+I("volta")+esc(A.nome)+'</a><h1>Comparar '+esc(A.nome)+' com…</h1><div class="acoes"><button class="btn cheio" id="cEsc">'+I("comparar")+'Escolher o segundo</button></div>'; document.getElementById("cEsc").onclick = function(){ escolher("comparar", function(id){ location.hash = "comparar-"+a+"-"+id; }); }; setTimeout(function(){ document.getElementById("cEsc").click(); }, 50); return; }
  function linha(rot, fa, fb, fonteA, fonteB){ return '<tr><th scope="row">'+rot+'</th><td>'+fa+fi(fonteA)+'</td><td>'+fb+fi(fonteB)+'</td></tr>'; }
  const n = function(p){ return p.regua&&p.regua.nota!=null ? '<span class="nota num '+faixa(p.regua.nota).c+'">'+p.regua.nota+'</span>' : '—'; };
  const g = function(p){ return p.gastos ? mil(p.gastos.total) : '—'; };
  const pre = function(p){ return p.presenca ? pct(p.presenca.pct) : '—'; };
  const pj = function(p){ return p.projetos ? p.projetos.filter(function(x){return x.lado===1;}).length+' a favor / '+p.projetos.length : '—'; };
  const vt = function(p){ return p.votos ? NUM.format(p.votos.total)+' ('+p.votos.ano+')' : '—'; };
  const bn = function(p){ return p.bens ? mil(p.bens.total) : '—'; };
  const em = function(p){ return p.emendas ? pct(p.emendas.pct_servicos)+' em serviços' : '—'; };
  const comuns = D.votacoes.filter(function(v){ return v.votos[a] && v.votos[b]; }), dif = comuns.filter(function(v){ return votoTxt(v.votos[a])!==votoTxt(v.votos[b]); });
  app.innerHTML = '<a class="voltar" href="#p-'+esc(a)+'">'+I("volta")+esc(A.nome)+'</a><h1>Comparar</h1>'+
  '<div class="cartao" style="margin-top:14px;overflow-x:auto"><table class="tab comp"><thead><tr><th></th><th><a href="#p-'+esc(a)+'">'+av(A)+esc(A.nome)+'</a></th><th><a href="#p-'+esc(b)+'">'+av(B)+esc(B.nome)+'</a></th></tr></thead><tbody>'+
    linha("Casa", CASAS[A.casa].nome, CASAS[B.casa].nome, fp(A,"perfil"), fp(B,"perfil"))+linha("Partido", esc(A.partido||"—"), esc(B.partido||"—"), fp(A,"partido"), fp(B,"partido"))+
    linha("Régua do Povo", n(A), n(B))+linha("Gastos em "+ANO, g(A), g(B), fp(A,"gastos"), fp(B,"gastos"))+linha("Presença", pre(A), pre(B), fp(A,"presenca"), fp(B,"presenca"))+
    linha("Projetos", pj(A), pj(B), fp(A,"projetos"), fp(B,"projetos"))+linha("Emendas", em(A), em(B), fp(A,"emendas"), fp(B,"emendas"))+linha("Votos na eleição", vt(A), vt(B), fp(A,"votos"), fp(B,"votos"))+linha("Bens declarados", bn(A), bn(B), fp(A,"bens"), fp(B,"bens"))+
  '</tbody></table></div>'+
  (comuns.length ? '<section><h2>Votaram diferente em '+dif.length+' de '+comuns.length+' votações</h2><div class="cartao" style="margin-top:10px"><ul class="det" style="list-style:none;padding:0;margin:0">'+dif.slice(0,15).map(function(v){ return '<li><span>'+esc(v.titulo)+' '+lado(v.lado)+'<small>'+dataBR(v.data)+'</small></span><span><span class="voto aus">'+esc(A.nome.split(" ")[0])+': '+votoTxt(v.votos[a])+'</span> <span class="voto aus">'+esc(B.nome.split(" ")[0])+': '+votoTxt(v.votos[b])+'</span>'+fi(v.url,"votação")+'</span></li>'; }).join("")+'</ul></div></section>' : '')+
  '<div class="acoes"><button class="btn" id="cTroca">'+I("comparar")+'Trocar o segundo</button></div>';
  document.getElementById("cTroca").onclick = function(){ escolher("comparar", function(id){ location.hash = "comparar-"+a+"-"+id; }); };
}

/* ---------- listas gerais ---------- */
function viagensTodas(){
  topo(false);
  const L = D.pessoas.filter(function(p){ return p.viagens && p.viagens.ultimas.length; }).map(function(p){ return {p:p, v:p.viagens.ultimas[0]}; }).sort(function(a,b){ return (b.v.data||"").localeCompare(a.v.data||""); });
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Viagens</h1><p class="sub">Última passagem paga com dinheiro público de cada deputado federal e senador. Mostra por onde andam.</p>'+
  (L.length ? '<div class="lista" style="margin-top:14px">'+L.map(function(o){ return linhaP(o.p, esc(o.v.trecho)+' · '+dataBR(o.v.data)+' · '+BRL2.format(o.v.valor), fi(fp(o.p,"viagens"))+I("seta")); }).join("")+'</div>' : '<div class="vazio" style="margin-top:14px">Ainda sem viagens nos dados.</div>')+
  '<div class="info">'+I("info")+'<span>A Assembleia Legislativa não publica o destino das viagens de cada deputado estadual em dados abertos. No perfil deles mostramos quanto da verba foi para deslocamento.</span></div>';
}
function promessasPag(){
  topo(false);
  const G = D.gov || {}, com = D.pessoas.filter(function(p){ return p.promessas && p.promessas.length; });
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Prometômetro</h1><p class="sub">O que prometeram e o que fizeram. Cada promessa tem o link de onde foi feita; cada status tem o link da prova.</p>'+
  '<div class="perguntas">'+(G.governador&&G.governador.plano ? '<a class="ev" href="#governo">'+I("gov")+'<span><b>Governador: '+esc(G.governador.nome)+'</b><small>'+(G.governador.plano.promessas||[]).length+' compromissos tirados do plano de governo registrado no TSE</small></span>'+I("seta")+'</a>' : '')+
  (G.eleito2026&&G.eleito2026.plano ? '<a class="ev" href="#governo">'+I("urnaN")+'<span><b>Eleito(a) em 2026: '+esc(G.eleito2026.nome)+'</b><small>'+(G.eleito2026.plano.promessas||[]).length+' compromissos para 2027–2030</small></span>'+I("seta")+'</a>' : '')+
  com.map(function(p){ return cardPromessas(p.promessas, '<a href="#p-'+esc(p.id)+'">'+esc(p.nome)+'</a>'); }).join("")+'</div>'+
  '<div class="info">'+I("info")+'<span>O TSE só guarda plano de governo de candidato a governador (e presidente). As promessas de deputados e senadores são registradas à mão a partir de vídeos, posts e entrevistas, sempre com link, no arquivo público <code>config/promessas.json</code>.</span></div>';
}
function eleitosPag(){
  topo(false);
  const E = (D.ele||{}).eleitos2026 || [], F = ((D.ele||{}).fontes||{})["2026"]||{};
  const grupo = function(c, tit){ const L = E.filter(function(e){return e.casa===c;}); if (!L.length) return ''; return '<section><h2>'+tit+' <small class="sub">'+L.length+'</small></h2><div class="lista" style="margin-top:8px">'+L.map(function(e){ const a = e.atual && D.porId[e.atual]; return '<a class="linha-dep" href="'+(c==="governo"?"#governo":a?'#p-'+esc(a.id):'#e-'+esc(e.id))+'">'+av({id:e.id,nome:e.nome,foto:e.foto_tse||(a&&fotoDe(a))})+'<div><div class="nome">'+esc(e.nome)+'</div><div class="meta">'+esc(e.partido)+((e.votos||{}).total?' · '+NUM.format(e.votos.total)+' votos':'')+'</div></div><div class="dir">'+(a?'<span class="chip">reeleito(a)</span>':'<span class="chip sol">novo</span>')+'</div></a>'; }).join("")+'</div></section>'; };
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Eleitos em 2026</h1><p class="sub">Quem assume em 2027. Comece a pastorar desde já.'+fi(F.candidatos,"TSE · candidatos 2026")+'</p>'+
  (E.length ? grupo("governo","Governo")+grupo("senado","Senado")+grupo("camara","Câmara dos Deputados (58ª legislatura)")+grupo("alece","Assembleia Legislativa (32ª legislatura)") : '<div class="vazio" style="margin-top:14px">O resultado de 2026 ainda não está nos dados abertos do TSE. O robô confere toda semana.</div>');
}
function cidadePag(){
  topo(false);
  const cidades = {}; D.pessoas.forEach(function(p){ ((p.votos||{}).municipios||[]).forEach(function(m){ cidades[m[0]] = 1; }); });
  const lista = Object.keys(cidades).sort(function(a,b){return a.localeCompare(b);});
  const atual = store.get("cidade","");
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Sua cidade</h1><p class="sub">Quem teve mais votos na sua cidade e quem mandou emendas para lá.</p>'+
  '<select class="campo" id="cSel" aria-label="Escolha a cidade" style="margin-top:14px"><option value="">Escolha a cidade</option>'+lista.map(function(c){ return '<option'+(c===atual?' selected':'')+'>'+esc(c)+'</option>'; }).join("")+'</select><div id="cRes"></div>';
  const sel = document.getElementById("cSel");
  function mostra(){ const c = sel.value; store.set("cidade", c); if (!c){ document.getElementById("cRes").innerHTML = ''; return; }
    const votados = D.pessoas.map(function(p){ const m = ((p.votos||{}).municipios||[]).find(function(x){ return x[0]===c; }); return m ? {p:p, n:m[1]} : null; }).filter(Boolean).sort(function(a,b){return b.n-a.n;});
    const emen = D.pessoas.map(function(p){ const m = ((p.emendas||{}).por_municipio||[]).find(function(x){ return semAc(x[0])===semAc(c); }); return m ? {p:p, v:m[1]} : null; }).filter(Boolean).sort(function(a,b){return b.v-a.v;});
    document.getElementById("cRes").innerHTML = '<section><h2>Mais votados em '+esc(c)+'</h2><div class="lista" style="margin-top:8px">'+votados.slice(0,15).map(function(o){ return linhaP(o.p, CASAS[o.p.casa].cargo+' · '+NUM.format(o.n)+' votos em '+o.p.votos.ano, fi(fp(o.p,"votos"))+I("seta")); }).join("")+'</div></section>'+
      (emen.length ? '<section><h2>Mandaram emendas para '+esc(c)+'</h2><div class="lista" style="margin-top:8px">'+emen.map(function(o){ return linhaP(o.p, mil(o.v)+' pagos desde '+o.p.emendas.anos[0], fi(fp(o.p,"emendas"))+I("seta")); }).join("")+'</div></section>' : '')+
      '<p class="sub" style="font-size:14px">Mostramos as 15 cidades onde cada um foi mais votado; quem teve poucos votos aqui pode não aparecer.</p>'; }
  sel.onchange = mostra; mostra();
}

/* ---------- seguindo ---------- */
function seguindo(){
  topo(false);
  const meus = seg.map(function(id){return D.porId[id];}).filter(Boolean), ev = [];
  meus.forEach(function(p){
    if (p.gastos && p.gastos.ultimos) p.gastos.ultimos.slice(0,2).forEach(function(x){ ev.push({o:x.mes*100, ic:"moeda", c:"c1", p:p, txt:BRL2.format(x.valor)+" com "+(x.fornecedor||x.categoria), q:MESES[(x.mes||1)-1], f:x.url||fp(p,"gastos")}); });
    (D.votosDe[p.id]||[]).slice(0,3).forEach(function(v){ ev.push({o:parseInt((v.data||"0000-00-00").slice(5,7),10)*100+parseInt((v.data||"0000-00-00").slice(8,10),10), ic:"urna", c:"c4", p:p, txt:"votou "+votoTxt(v.votos[p.id]).toLowerCase()+": "+v.titulo, q:dataBR(v.data), f:v.url}); });
    (p.projetos||[]).slice(0,2).forEach(function(x){ ev.push({o:x.data?parseInt(x.data.slice(5,7),10)*100+parseInt(x.data.slice(8,10),10):0, ic:"doc", c:"c2", p:p, txt:"apresentou "+(x.tipo||"")+" "+(x.numero||"")+": "+(x.ementa||"").slice(0,90), q:x.data?dataBR(x.data):String(x.ano||""), f:x.url}); });
  });
  ev.sort(function(a,b){return b.o-a.o;});
  const tg = D.meta.telegram;
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Seguindo</h1>'+
  (meus.length ? '<div class="lista" style="margin-top:14px">'+meus.map(function(p){ const n = novidades(p); return linhaP(p, n ? '<b style="color:var(--chita)">'+esc(n.join(", "))+'</b>' : CASAS[p.casa].cargo, '<a class="fi" href="feeds/'+esc(p.id)+'.xml" title="Feed RSS" aria-label="Feed RSS de '+esc(p.nome)+'">'+I("rss")+'</a>'+I("seta")); }).join("")+'</div>'
   : '<div class="vazio" style="margin-top:14px">'+I("vazio")+'<p>Abra um político e toque em <b>Seguir</b>. A lista fica guardada só neste aparelho.</p></div>')+
  (ev.length ? '<section><h2 style="margin-bottom:10px">Últimas de quem você segue</h2><div class="semana">'+ev.slice(0,15).map(function(e){ return '<div class="ev"><span class="ic '+e.c+'">'+I(e.ic)+'</span><span><a href="#p-'+esc(e.p.id)+'"><b>'+esc(e.p.nome)+'</b></a> '+esc(e.txt)+'<small>'+esc(e.q)+'</small></span>'+fi(e.f)+'</div>'; }).join("")+'</div></section>' : '')+
  '<section><h2>Receber avisos</h2><div class="perguntas" style="margin-top:10px">'+
    ('Notification' in window ? '<div class="cartao"><div class="q"><span class="ic c3">'+I("sino")+'</span><span>Avisar neste aparelho</span></div><p class="frase">Quando você abrir o Pastorando, mostramos um aviso com as novidades de quem você segue.</p><div class="acoes"><button class="btn" id="bNot">'+(Notification.permission==="granted"?I("ok")+"Avisos ligados":I("sino")+"Ligar avisos")+'</button></div></div>' : '')+
    (tg ? '<div class="cartao"><div class="q"><span class="ic c4">'+I("megafone")+'</span><span>Canal no Telegram</span></div><p class="frase">Todo dia, as novas votações e como os cearenses votaram.</p><div class="acoes"><a class="btn cheio" href="'+esc(tg)+'" target="_blank" rel="noopener">Entrar no canal</a></div></div>' : '')+
    '<div class="cartao"><div class="q"><span class="ic c2">'+I("rss")+'</span><span>Feed RSS de cada político</span></div><p class="frase">Cada perfil tem um feed com votos, projetos e gastos. Funciona em qualquer leitor de RSS (Feedly, Inoreader) e em bots de Telegram que leem RSS.</p></div>'+
  '</div></section>';
  const bn = document.getElementById("bNot"); if (bn) bn.onclick = function(){ Notification.requestPermission().then(function(r){ bn.innerHTML = r==="granted" ? I("ok")+"Avisos ligados" : I("sino")+"Ligar avisos"; if (r==="granted") toast("Pronto. Os avisos aparecem quando você abrir o site."); }); };
}

/* ---------- dados abertos ---------- */
function dadosPag(){
  topo(false);
  const F = (D.meta && D.meta.fontes) || {};
  const arq = [["parlamentares.json","Todos os parlamentares: gastos, projetos, presença, viagens, emendas, Régua, dados do TSE"],["votacoes.json","Votações nominais com o voto de cada cearense e a classificação da Régua"],["governo.json","Orçamento do estado por função, projetos do Executivo e plano de governo"],["eleicao.json","Eleitos de 2026 e governadores"],["meta.json","Situação das fontes e regras da Régua"]];
  const fontes = [["Câmara dos Deputados","https://dadosabertos.camara.leg.br/"],["Senado Federal","https://legis.senado.leg.br/dadosabertos/docs/"],["Assembleia Legislativa do Ceará · transparência","https://transparencia.al.ce.gov.br/"],["TSE · dados abertos","https://dadosabertos.tse.jus.br/"],["Portal da Transparência (CGU) · emendas","https://portaldatransparencia.gov.br/download-de-dados/emendas-parlamentares"],["Tesouro Nacional · Siconfi","https://apidatalake.tesouro.gov.br/docs/siconfi/"],["Ceará Transparente","https://cearatransparente.ce.gov.br/"]];
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Dados abertos</h1><p class="sub">Tudo o que o site mostra, para baixar e reusar (licença livre, cite a fonte).</p>'+
  '<div class="lista" style="margin-top:14px">'+arq.map(function(a){ return '<a class="linha-dep" href="dados/'+a[0]+'" download><span class="ic c3" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center">'+I("baixar")+'</span><div><div class="nome">'+a[0]+'</div><div class="meta">'+a[1]+'</div></div></a>'; }).join("")+'</div>'+
  '<section><h2>De onde vem cada dado</h2><div class="lista" style="margin-top:8px">'+fontes.map(function(f){ return '<a class="linha-dep" href="'+f[1]+'" target="_blank" rel="noopener"><span class="ic c2" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center">'+I("link")+'</span><div><div class="nome">'+f[0]+'</div><div class="meta">'+esc(f[1].replace(/^https:\/\//,""))+'</div></div></a>'; }).join("")+'</div></section>'+
  '<section><h2>Situação das fontes</h2>'+estadoFontes(F)+'</section>'+
  (D.meta.repositorio ? '<p class="sub">Código aberto: <a href="https://github.com/'+esc(D.meta.repositorio)+'" target="_blank" rel="noopener">github.com/'+esc(D.meta.repositorio)+'</a></p>' : '');
}
function estadoFontes(F){ return Object.keys(F).length ? Object.keys(F).map(function(k){ const f = F[k]; return '<div class="estado"><span class="bola '+(f.ok?"ok":"erro")+'"></span><span><b>'+esc(f.nome)+'</b><br><small style="color:var(--tinta-2)">'+(f.ok ? 'atualizada em '+esc((f.quando||"").replace("T"," às "))+(f.pessoas!=null?' · '+f.pessoas+' parlamentares · '+f.votacoes+' votações':'') : 'falhou na última tentativa'+(f.ultimo_sucesso?'; usando dados de '+esc(f.ultimo_sucesso.replace("T"," às ")):''))+'</small></span></div>'; }).join("") : '<p>Ainda sem informação.</p>'; }

/* ---------- sobre ---------- */
function sobre(){
  topo(false);
  const F = (D.meta && D.meta.fontes) || {};
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="texto"><h1>Sobre o Pastorando</h1>'+
  '<p style="margin-top:12px">No Ceará, <b>pastorar</b> é tomar conta. Este site junta os dados oficiais dos deputados estaduais, federais, senadores e do governo do Ceará e explica sem rodeio. Um robô atualiza tudo todo dia, de graça, e o código é aberto.</p>'+
  '<p>Ao lado de cada informação tem um '+I("info")+' que leva direto ao site oficial de onde ela saiu. Confira sempre.</p>'+
  '<h2 style="margin:22px 0 8px">Situação das fontes</h2>'+estadoFontes(F)+
  '<h2 style="margin:22px 0 8px">Nosso lado</h2><p>Somos uma iniciativa do campo popular e dizemos isso. A Régua do Povo mede o que importa para quem depende de serviço público: votos e projetos sobre saúde, educação, salário, moradia, direitos, privatização. As regras e as palavras que o robô usa são públicas.</p>'+
  '<h2 style="margin:22px 0 8px">Direito de resposta</h2><p>Gabinetes podem contestar qualquer dado ou classificação. A correção fica registrada, com o motivo, no código aberto.</p>'+
  '<h2 style="margin:22px 0 8px">Privacidade</h2><p>Não pedimos cadastro e não rastreamos ninguém. Quem você segue fica guardado só neste aparelho.</p></div>';
}

/* ---------- rotas ---------- */
function rota(){
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  let m;
  if (h.indexOf("p-")===0) perfil(h.slice(2));
  else if (h.indexOf("e-")===0) eleitoPag(h.slice(2));
  else if (CASAS[h]) casaPag(h);
  else if ((m = h.match(/^(alece|camara|senado)-2026$/))) casaPag(m[1], "2026");
  else if (h.indexOf("comparar")===0){ const ids = h.slice(9).split("-"); const pa = []; let cur = ""; ids.forEach(function(x){ cur = cur ? cur+"-"+x : x; if (D.porId[cur]){ pa.push(cur); cur = ""; } }); compararPag(pa[0], pa[1]); }
  else if (h==="seguindo") seguindo();
  else if (h==="sobre") sobre();
  else if (h==="regua") regua();
  else if (h==="governo") governoPag();
  else if (h==="viagens-todas") viagensTodas();
  else if (h==="promessas") promessasPag();
  else if (h==="eleitos") eleitosPag();
  else if (h==="cidade") cidadePag();
  else if (h==="dados") dadosPag();
  else inicio();
  if (!pendente) window.scrollTo(0,0);
}
window.addEventListener("hashchange", function(){ if (D.pessoas.length || location.hash==="#sobre") rota(); });
carregar();
})();
