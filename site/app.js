/* EspiaCE: site estático que lê os dados coletados pelos robôs (pasta dados/).
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
  radar:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/><circle cx="12" cy="12" r="1"/>',
  jornal:'<path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v10a2 2 0 0 1-2 2"/><path d="M7.5 9h6M7.5 12.5h6M7.5 16h4"/>',
  alvo:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>',
  grade:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  rede:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
function I(n){ return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">'+(P[n]||P.info)+'</svg>'; }
document.getElementById("icSino").innerHTML = I("sino");
document.getElementById("lSobre").innerHTML = I("info");

/* ---------- tema: só a versão clara ---------- */
document.documentElement.setAttribute("data-theme","light");
try{ localStorage.removeItem("espiace:tema"); }catch(e){}

/* ---------- utilidades ---------- */
const ANO = new Date().getFullYear();
const CASAS = {
  alece:{nome:"Assembleia",longo:"Assembleia Legislativa do Ceará",cargo:"Deputado(a) estadual",plural:"deputados estaduais",ic:"alece",cor:"c1",total:46,verba:"Verba de Desempenho Parlamentar",agora:"31ª legislatura (2023–2027)",prox:"32ª legislatura (2027–2031)"},
  camara:{nome:"Câmara",longo:"Câmara dos Deputados",cargo:"Deputado(a) federal",plural:"deputados federais",ic:"camara",cor:"c2",total:22,verba:"cota parlamentar",agora:"57ª legislatura (2023–2027)",prox:"58ª legislatura (2027–2031)"},
  senado:{nome:"Senado",longo:"Senado Federal",cargo:"Senador(a)",plural:"senadores",ic:"senado",cor:"c4",total:3,verba:"cota do Senado (CEAPS)",agora:"mandatos em curso",prox:"eleitos em 2026 (posse em 2027)"}
};
const NOMES_TEMA = {seguranca:"Segurança",saude:"Saúde",educacao:"Educação",economia:"Economia",desemprego:"Trabalho e emprego",corrupcao:"Corrupção e transparência",fome:"Fome",impostos:"Impostos",moradia:"Moradia",transporte:"Transporte",direitos:"Direitos",ambiente:"Meio ambiente",assistencia:"Assistência social",outros:"Outros assuntos"};
const CORES = ["#3f6f4f","#1f3a2b","#6f8f5a","#a07c1e","#3d4f9a","#9b3b6a"];
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
function faixa(n){ return n==null ? {c:"",t:"Em observação"} : n>=80 ? {c:"f1",t:"Trabalha pro povo"} : n>=60 ? {c:"f2",t:"Dá pro gasto"} : n>=40 ? {c:"f3",t:"Tá devendo"} : {c:"f4",t:"Espia de perto"}; }
function dataBR(d){ if (!d) return ""; const p = String(d).slice(0,10).split("-"); return p.length===3 ? p[2]+"/"+p[1]+"/"+p[0] : d; }
function votoTxt(v){ const x = semAc(v); return x.indexOf("sim")===0 ? "Sim" : (x.indexOf("n")===0 && x.length<=4) || x.indexOf("nao")===0 ? "Não" : x.indexOf("abst")===0 ? "Abstenção" : x.indexOf("obstr")===0 ? "Obstrução" : v || "Não votou"; }
function lado(){ return ''; }
function votoClasse(x){ return x==="Sim" ? "s" : x==="Não" ? "n" : "aus"; }
/* ⓘ: link para a fonte oficial */
function fi(f, rot){ if (!f) return ""; const u = typeof f==="string" ? f : f.u, n = typeof f==="string" ? (rot||"fonte oficial") : (f.n||rot||"fonte oficial"); if (!u) return ""; return '<a class="fi" href="'+esc(u)+'" target="_blank" rel="noopener" title="Conferir na fonte: '+esc(n)+'" aria-label="Conferir na fonte: '+esc(n)+'">'+I("info")+'</a>'; }
function fp(p,k){ return (p.fontes||{})[k]; }
const store = {get:function(k,def){ try{ const v = localStorage.getItem("espiace:"+k); return v ? JSON.parse(v) : def; }catch(e){ return def; } }, set:function(k,v){ try{ localStorage.setItem("espiace:"+k, JSON.stringify(v)); }catch(e){} }};
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

/* ---------- gráficos, tabelas e mapa (sem biblioteca) ---------- */
const chaveMun = function(s){ return semAc(s).replace(/[^a-z]/g,""); };
let MAPA = null, MAPA_IDX = {};
function prepMapa(m){ MAPA = m; MAPA_IDX = {}; if (m) Object.keys(m.municipios).forEach(function(n){ MAPA_IDX[chaveMun(n)] = n; }); }
/* dica (tooltip) que segue o mouse: qualquer elemento com data-dica */
const dica = document.createElement("div"); dica.className = "dica"; dica.setAttribute("role","tooltip"); document.body.appendChild(dica);
function mostraDica(el, x, y){ dica.innerHTML = el.getAttribute("data-dica"); dica.classList.add("on"); const r = dica.getBoundingClientRect(); let L = x + 14, T = y + 14; if (L + r.width > innerWidth - 8) L = x - r.width - 14; if (T + r.height > innerHeight - 8) T = y - r.height - 14; dica.style.left = Math.max(8,L)+"px"; dica.style.top = Math.max(8,T)+"px"; }
document.addEventListener("mousemove", function(e){ const el = e.target.closest && e.target.closest("[data-dica]"); if (el) mostraDica(el, e.clientX, e.clientY); else dica.classList.remove("on"); });
document.addEventListener("focusin", function(e){ const el = e.target.closest && e.target.closest("[data-dica]"); if (el){ const r = el.getBoundingClientRect(); mostraDica(el, r.left + r.width/2, r.bottom); } });
document.addEventListener("focusout", function(){ dica.classList.remove("on"); });
document.addEventListener("scroll", function(){ dica.classList.remove("on"); }, true);

/* quadro: cartão com título, ⓘ e conteúdo. tam: "" | "q2" (duas colunas) | "qt" (largura toda) */
function quadro(ic, c, titulo, corpo, fonte, tam, id){ return '<article class="cartao quadro '+(tam||"")+'"'+(id?' id="'+id+'"':'')+'>'+'<div class="q"><span class="ic '+c+'">'+I(ic)+'</span><span>'+titulo+'</span>'+(fonte||'')+'</div>'+corpo+'</article>'; }
/* placas de número (stat tiles) */
function kpis(lista){ return '<div class="kpis">'+lista.filter(Boolean).map(function(k){ return '<div class="kpi'+(k.tom?" "+k.tom:"")+'"'+(k.href?' role="link" tabindex="0" data-href="'+esc(k.href)+'"':'')+'><span class="kpi-r">'+(k.ic?I(k.ic):'')+esc(k.r)+(k.f?fi(k.f):'')+'</span><b class="kpi-v">'+k.v+'</b>'+(k.s?'<span class="kpi-s">'+k.s+'</span>':'')+'</div>'; }).join("")+'</div>'; }
document.addEventListener("click", function(e){ const k = e.target.closest && e.target.closest(".kpi[data-href]"); if (k && !e.target.closest("a")) location.hash = k.getAttribute("data-href"); });
/* barras horizontais: [{r, v, t (texto do valor), h (link), d (dica), s (subtítulo), tom}] */
function barrasH(itens, o){ o = o||{}; if (!itens.length) return '<p class="frase">Sem dados.</p>'; const max = o.max || Math.max.apply(null, itens.map(function(x){return x.v;})) || 1;
  return '<ul class="bh'+(o.empilha?" emp":"")+'">'+itens.map(function(x){ const w = Math.max(x.v>0?1.5:0, 100*x.v/max); const rot = x.h ? '<a href="'+esc(x.h)+'">'+esc(x.r)+'</a>' : esc(x.r);
    return '<li data-dica="'+esc(x.d || (x.r+": "+(x.t||x.v)))+'"><span class="bh-r">'+rot+(x.s?'<small>'+x.s+'</small>':'')+'</span><span class="bh-t"><i class="'+(x.tom||o.tom||"")+'" style="width:'+w.toFixed(1)+'%"></i></span><span class="bh-v num">'+(x.t!=null?x.t:x.v)+(x.f||'')+'</span></li>'; }).join("")+'</ul>'; }
/* colunas por mês (uma série) */
function colunas(serie, o){ o = o||{}; const W = 340, H = 170, ml = 44, mb = 22, mt = 14, n = serie.length; if (!n) return '';
  const max = Math.max.apply(null, serie.map(function(x){return x.v;})) || 1, passo = escalaPasso(max), topo = Math.ceil(max/passo)*passo;
  const bw = Math.min(24, (W-ml-8)/n*0.62), gap = (W-ml-8)/n;
  let s = '<svg class="col" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.rot||"Gráfico de colunas")+'">';
  for (let t = 0; t <= topo; t += passo){ const y = mt + (H-mt-mb)*(1-t/topo); s += '<line x1="'+ml+'" x2="'+(W-4)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'" class="grade"/><text x="'+(ml-6)+'" y="'+(y+3.5).toFixed(1)+'" text-anchor="end">'+(o.eixo?o.eixo(t):NUM.format(t))+'</text>'; }
  const imax = serie.reduce(function(a,x,i){ return x.v>serie[a].v?i:a; },0);
  serie.forEach(function(x,i){ const h = (H-mt-mb)*x.v/topo, X = ml + gap*i + (gap-bw)/2, Y = H-mb-h;
    s += '<g data-dica="'+esc(x.d||(x.r+": "+x.v))+'" tabindex="0"><rect x="'+(ml+gap*i)+'" y="'+mt+'" width="'+gap+'" height="'+(H-mt-mb)+'" fill="transparent"/><path class="barra'+(o.destaque===i?" dest":"")+'" d="'+colunaPath(X,Y,bw,h)+'"/></g><text x="'+(X+bw/2)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(x.r)+'</text>';
    if (i===imax && h>0) s += '<text x="'+(X+bw/2)+'" y="'+(Y-4)+'" text-anchor="middle" class="val">'+esc(x.t||x.v)+'</text>'; });
  return s+'<line x1="'+ml+'" x2="'+(W-4)+'" y1="'+(H-mb)+'" y2="'+(H-mb)+'" class="base"/></svg>'; }
function colunaPath(x,y,w,h){ if (h<=0) return ""; const r = Math.min(4,h,w/2); return "M"+x+" "+(y+h)+"V"+(y+r)+"Q"+x+" "+y+" "+(x+r)+" "+y+"H"+(x+w-r)+"Q"+(x+w)+" "+y+" "+(x+w)+" "+(y+r)+"V"+(y+h)+"Z"; }
function escalaPasso(max){ const bruto = max/4, p = Math.pow(10, Math.floor(Math.log10(bruto))), m = bruto/p; return (m<=1?1:m<=2?2:m<=5?5:10)*p; }
function milCurto(v){ return v>=1e9 ? (v/1e9).toFixed(1).replace(".",",")+" bi" : v>=1e6 ? (v/1e6).toFixed(v>=1e7?0:1).replace(".",",")+" mi" : v>=1000 ? Math.round(v/1000)+" mil" : String(Math.round(v)); }
/* barra segmentada (um todo dividido em partes): [{r, v, k: 1..4 | 0 (neutro)}] */
function segmentada(partes, o){ o = o||{}; const t = partes.reduce(function(a,x){return a+x.v;},0); if (!t) return ''; const ps = partes.filter(function(x){return x.v>0;});
  return '<div class="seg" role="img" aria-label="'+esc(ps.map(function(x){return x.r+" "+pct(100*x.v/t);}).join(", "))+'">'+ps.map(function(x){ const p = 100*x.v/t; return '<span class="k'+x.k+'" style="flex:'+x.v+'" data-dica="'+esc(x.r+": "+(o.fmt?o.fmt(x.v):x.v)+" ("+pct(p)+")")+'" tabindex="0">'+(p>=12?Math.round(p)+"%":"")+'</span>'; }).join("")+'</div>'+
  '<ul class="legenda-g">'+ps.map(function(x){ return '<li><i class="k'+x.k+'"></i>'+esc(x.r)+' <b class="num">'+pct(100*x.v/t)+'</b></li>'; }).join("")+'</ul>'; }
/* tabela ordenável. cols: [{t, k, num, fmt(v,linha), ord: valor para ordenar}] */
const TABS = {};
let nTab = 0;
function tabela(cols, linhas, o){ o = o||{}; const id = "tb"+(++nTab); TABS[id] = {cols:cols, linhas:linhas.slice(), o:o, ord:o.ord||null, dir:o.dir||-1, todas:false};
  const cart = cols.length>3||o.cartao;
  return (cart ? '<label class="tb-ord">Ordenar por <select data-tbs="'+id+'">'+cols.map(function(c,i){ return c.semOrd||!c.t ? '' : '<option value="'+i+'"'+(T0(id)===i?' selected':'')+'>'+esc(c.t)+'</option>'; }).join("")+'</select></label>' : '')+
  '<div class="tbw"><table class="tb'+(cart?' tb-cart':'')+'" id="'+id+'"><thead><tr>'+cols.map(function(c,i){ return '<th scope="col"'+(c.num?' class="n"':'')+'>'+(c.semOrd?esc(c.t):'<button type="button" data-tb="'+id+'" data-c="'+i+'">'+esc(c.t)+'<span class="ord"></span></button>')+'</th>'; }).join("")+'</tr></thead><tbody>'+corpoTab(id)+'</tbody></table></div>'+
  (linhas.length > (o.limite||12) ? '<button type="button" class="mais-linhas" data-tbm="'+id+'">Ver todos ('+linhas.length+')</button>' : ''); }
function T0(id){ const T = TABS[id]; return T.ord==null ? 0 : T.ord; }
document.addEventListener("change", function(e){ const s = e.target.closest && e.target.closest("[data-tbs]"); if (!s) return; const id = s.getAttribute("data-tbs"), T = TABS[id], c = +s.value;
  T.ord = c; T.dir = T.cols[c].num ? -1 : 1; document.getElementById(id).querySelector("tbody").innerHTML = corpoTab(id); });
function corpoTab(id){ const T = TABS[id], c = T.ord!=null ? T.cols[T.ord] : null; let L = T.linhas.slice();
  if (c){ const val = function(l){ return c.ordv ? c.ordv(l) : l[c.k]; }; L.sort(function(a,b){ const x = val(a), y = val(b); if (x==null) return 1; if (y==null) return -1; return (typeof x==="string" ? x.localeCompare(y) : x-y)*T.dir; }); }
  if (!T.todas) L = L.slice(0, T.o.limite||12);
  return L.map(function(l){ return '<tr>'+T.cols.map(function(c,i){ const v = c.fmt ? c.fmt(l[c.k], l) : esc(l[c.k]==null?"—":l[c.k]); return i===0 ? '<th scope="row">'+v+'</th>' : '<td'+(c.num?' class="n num"':'')+(c.t?' data-r="'+esc(c.t)+'"':' data-r=""')+'>'+v+'</td>'; }).join("")+'</tr>'; }).join(""); }
document.addEventListener("click", function(e){
  const b = e.target.closest && e.target.closest("[data-tb]");
  if (b){ const id = b.getAttribute("data-tb"), T = TABS[id], c = +b.getAttribute("data-c"); T.dir = T.ord===c ? -T.dir : (T.cols[c].num ? -1 : 1); T.ord = c; const tb = document.getElementById(id); tb.querySelector("tbody").innerHTML = corpoTab(id);
    tb.querySelectorAll("th button").forEach(function(x){ x.removeAttribute("aria-sort"); x.parentNode.removeAttribute("aria-sort"); }); b.parentNode.setAttribute("aria-sort", T.dir>0?"ascending":"descending"); return; }
  const m = e.target.closest && e.target.closest("[data-tbm]");
  if (m){ const id = m.getAttribute("data-tbm"); TABS[id].todas = !TABS[id].todas; document.getElementById(id).querySelector("tbody").innerHTML = corpoTab(id); m.textContent = TABS[id].todas ? "Ver menos" : "Ver todos ("+TABS[id].linhas.length+")"; }
});
/* mapa do Ceará: valores {nome do município: número} pintados em 5 faixas de uma só cor */
function mapaCE(valores, o){ o = o||{};
  if (!MAPA) return '<p class="frase">Mapa indisponível.</p>';
  const V = {}; Object.keys(valores||{}).forEach(function(n){ const k = MAPA_IDX[chaveMun(n)]; if (k) V[k] = (V[k]||0) + valores[n]; });
  const vals = Object.values(V).filter(function(v){return v>0;}).sort(function(a,b){return a-b;});
  if (!vals.length && !o.vazioOk) return '<p class="frase">Sem dados por cidade.</p>';
  const q = [0.2,0.4,0.6,0.8].map(function(p){ return vals[Math.min(vals.length-1, Math.floor(p*vals.length))]; });
  const faixa = function(v){ if (!v) return 0; let i = 1; q.forEach(function(x){ if (v > x) i++; }); return i; };
  const fmt = o.fmt || function(v){ return NUM.format(v); };
  let s = '<div class="mapa-ce'+(o.clique?" clic":"")+'"><svg viewBox="'+MAPA.viewBox+'" role="img" aria-label="'+esc(o.rot||"Mapa do Ceará por município")+'">';
  Object.keys(MAPA.municipios).forEach(function(n){ const m = MAPA.municipios[n], v = V[n]||0, sel = o.sel && chaveMun(o.sel)===chaveMun(n);
    s += '<path d="'+m.d+'" class="s'+faixa(v)+(sel?" sel":"")+'" data-dica="<b>'+esc(n)+'</b><br>'+esc(v?fmt(v):(o.semValor||"sem registro"))+'"'+(o.clique?' data-mun="'+esc(n)+'"':'')+'/>'; });
  if (o.sel && MAPA_IDX[chaveMun(o.sel)]){ const c = MAPA.municipios[MAPA_IDX[chaveMun(o.sel)]].c; s += '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="7" class="alvo"/>'; }
  const fz = MAPA.municipios["Fortaleza"]; if (fz) s += '<circle cx="'+fz.c[0]+'" cy="'+fz.c[1]+'" r="3.5" class="cap"/><text x="'+(fz.c[0]+8)+'" y="'+(fz.c[1]-6)+'" class="cap-t">Fortaleza</text>';
  s += '</svg>';
  const lim = [vals[0]].concat(q).concat([vals[vals.length-1]]);
  s += '<div class="mapa-leg"><span>'+(o.legenda||"")+'</span><ol>'+[1,2,3,4,5].map(function(i){ return '<li><i class="s'+i+'"></i>'+(i===1?esc((o.fmtLeg||milCurto)(lim[0])):i===5?esc((o.fmtLeg||milCurto)(lim[5])):"")+'</li>'; }).join("")+'</ol><span class="sem"><i class="s0"></i>sem registro</span></div>';
  const top = Object.keys(V).map(function(n){ return {n:n, v:V[n]}; }).sort(function(a,b){return b.v-a.v;});
  s += '<details class="como-tab"><summary>Ver como tabela</summary>'+tabela([{t:"Cidade",k:"n",fmt:function(v){ return o.clique?'<a href="#cidade-'+encodeURIComponent(v)+'">'+esc(v)+'</a>':esc(v); }},{t:o.colValor||"Valor",k:"v",num:true,fmt:function(v){return esc(fmt(v));}}], top, {ord:1, limite:10})+'</details></div>';
  return s; }
document.addEventListener("click", function(e){ const p = e.target.closest && e.target.closest("[data-mun]"); if (p) location.hash = "cidade-"+encodeURIComponent(p.getAttribute("data-mun")); });
/* dispersão: [{x, y, r (rótulo), h (link), id}] eixos 0–100 */
function dispersao(pts, o){ o = o||{}; const W = 360, H = 260, ml = 34, mb = 34, mt = 10, mr = 10;
  const X = function(v){ return ml + (W-ml-mr)*v/100; }, Y = function(v){ return mt + (H-mt-mb)*(1-v/100); };
  let s = '<svg class="disp" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.rot||"Gráfico de dispersão")+'">';
  [0,50,100].forEach(function(t){ s += '<line x1="'+ml+'" x2="'+(W-mr)+'" y1="'+Y(t)+'" y2="'+Y(t)+'" class="grade"/><text x="'+(ml-6)+'" y="'+(Y(t)+3.5)+'" text-anchor="end">'+t+'</text><line y1="'+mt+'" y2="'+(H-mb)+'" x1="'+X(t)+'" x2="'+X(t)+'" class="grade"/><text x="'+X(t)+'" y="'+(H-mb+14)+'" text-anchor="middle">'+t+'</text>'; });
  s += '<text x="'+((W+ml)/2)+'" y="'+(H-4)+'" text-anchor="middle" class="eixo-t">'+esc(o.ex||"")+' →</text><text x="12" y="'+((H-mb+mt)/2)+'" text-anchor="middle" transform="rotate(-90 12 '+((H-mb+mt)/2)+')" class="eixo-t">'+esc(o.ey||"")+' →</text>';
  pts.forEach(function(p){ s += '<a href="'+esc(p.h)+'"><circle cx="'+X(p.x).toFixed(1)+'" cy="'+Y(p.y).toFixed(1)+'" r="5" class="pt'+(o.sel===p.id?" sel":"")+'" data-dica="<b>'+esc(p.r)+'</b><br>'+esc(o.ex)+': '+p.x+'<br>'+esc(o.ey)+': '+p.y+'"/></a>'; });
  return s+'</svg>'; }
/* duas séries lado a lado por categoria (comparar) */
function barrasPar(cats, a, b, na, nb){ return '<ul class="legenda-g"><li><i class="k1"></i>'+esc(na)+'</li><li><i class="k3"></i>'+esc(nb)+'</li></ul><ul class="bp">'+cats.map(function(c,i){ const va = a[i], vb = b[i];
  return '<li><span class="bh-r">'+esc(c)+'</span><span class="bp-b"><span class="bh-t" data-dica="'+esc(na+": "+(va==null?"sem dado":va))+'"><i class="k1" style="width:'+(va||0)+'%"></i></span><span class="bh-t" data-dica="'+esc(nb+": "+(vb==null?"sem dado":vb))+'"><i class="k3" style="width:'+(vb||0)+'%"></i></span></span><span class="bh-v num">'+(va==null?"—":va)+' · '+(vb==null?"—":vb)+'</span></li>'; }).join("")+'</ul>'; }

/* ---------- carregar dados ---------- */
function carregar(){
  const E = window.__DADOS__;
  const j = function(n, pasta){ if (E && E[n]) return Promise.resolve(E[n]); return fetch((pasta==null?"dados/":pasta)+n, {cache:"no-cache"}).then(function(r){ if (!r.ok) throw new Error(n); return r.json(); }); };
  Promise.all([j("parlamentares.json"), j("votacoes.json").catch(function(){return [];}), j("meta.json").catch(function(){return {};}), j("governo.json").catch(function(){return null;}), j("eleicao.json").catch(function(){return null;}), j("mapa-ce.json","").catch(function(){return null;}), j("radar.json").catch(function(){return null;}), j("municipios.json").catch(function(){return null;}), j("noticias.json").catch(function(){return null;})]).then(function(r){
    D.pessoas = r[0] || []; D.votacoes = r[1] || []; D.meta = r[2] || {}; D.gov = r[3]; D.ele = r[4]; prepMapa(r[5]); D.radar = r[6] || {itens:[], temas:{}, etapas:[]}; D.mun = r[7] || {municipios:{}, indicadores:{}}; D.not = r[8] || {itens:[]};
    D.pessoas.forEach(function(p){ D.porId[p.id] = p; D.votosDe[p.id] = []; });
    D.votacoes.forEach(function(v){ Object.keys(v.votos||{}).forEach(function(id){ if (D.votosDe[id]) D.votosDe[id].push(v); }); });
    if (D.meta.atualizado) document.getElementById("atual").textContent = " Última atualização: "+D.meta.atualizado.replace("T"," às ")+".";
    if (D.meta.prototipo){ const a = document.createElement("div"); a.className = "aviso"; a.innerHTML = "<b>Protótipo:</b> nomes, números e mapas com dados fictícios, só para ver o visual."; document.body.insertBefore(a, document.body.firstChild); }
    montaMenu(); conta(); avisoNavegador(); rota();
  }).catch(function(e){
    if (window.console) console.error(e);
    topo(true);
    app.innerHTML = '<div class="vazio" style="margin-top:24px">'+I("alerta")+'<p><b>Os dados ainda estão sendo coletados.</b><br>Na primeira vez, o robô leva alguns minutos. Volte daqui a pouco.</p></div>';
  });
}
function avisoNavegador(){
  if (!("Notification" in window) || Notification.permission!=="granted") return;
  const n = seg.map(function(id){return D.porId[id];}).filter(function(p){ return p && novidades(p); });
  if (!n.length || sessionStorage.getItem("espiace:avisou")) return;
  try{ new Notification("EspiaCE", {body: n.slice(0,3).map(function(p){ return p.nome+": "+novidades(p).join(", "); }).join("\n"), icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23d9432b'/%3E%3C/svg%3E"}); sessionStorage.setItem("espiace:avisou","1"); }catch(e){}
}

/* ---------- topo, menu e busca ---------- */
const MENU = [["inicio","casa","Início"],["radar","radar","Radar"],["alece","alece","Assembleia"],["camara","camara","Câmara"],["senado","senado","Senado"],["governo","gov","Governo"],
  ["noticias","jornal","No noticiário"],["cidade","mapa","Sua cidade"],["prioridades","alvo","Áreas prioritárias"],["gastos-todos","moeda","Gastos"],["viagens-todas","aviao","Viagens"],["promessas","promessa","Promessas"],
  ["comparar","comparar","Comparar"],["eleitos","urnaN","Eleitos 2026"],["seguindo","sino","Seguindo"],["dados","dados","Dados abertos"],["sobre","info","Sobre"]];
const ABAS = [["inicio","casa","Início"],["politicos","vazio","Políticos"],["radar","radar","Radar"],["cidade","mapa","Cidades"],["mais","grade","Mais"]];
function montaMenu(){
  document.getElementById("abas").innerHTML = ABAS.map(function(m){ return m[0]==="mais" ? '<button type="button" id="abaMais">'+I("grade")+'<span>'+m[2]+'</span></button>' : '<a href="#'+m[0]+'" data-r="'+m[0]+'">'+I(m[1])+'<span>'+m[2]+'</span></a>'; }).join("");
  document.getElementById("abaMais").onclick = abreMais;
  montaBusca(document.getElementById("buscaBarra"), false);
}
function abreMais(){ abreFolha("Tudo o que dá pra fazer", '<div class="menu-folha">'+MENU.map(function(m){ return '<a href="#'+m[0]+'">'+I(m[1])+'<span>'+m[2]+'</span></a>'; }).join("")+'<button type="button" id="fStory">'+I("story")+'<span>Arte pro story</span></button></div>');
  folha.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", fechaFolha); }); document.getElementById("fStory").onclick = function(){ fechaFolha(); escolher("story"); }; }
function marcaMenu(h){ let raizR = h.split("-")[0]==="p" ? (D.porId[h.slice(2)]||{}).casa : (h.match(/^(alece|camara|senado)/)||[])[1] || h.split("-")[0];
  if (["alece","camara","senado","governo","eleitos","comparar","e"].indexOf(raizR)>=0) raizR = "politicos"; if (!raizR) raizR = "inicio";
  document.querySelectorAll("#abas a").forEach(function(a){ const r = a.getAttribute("data-r"); if (r===raizR || (r==="viagens-todas"&&h==="viagens-todas") || (r==="gastos-todos"&&h==="gastos-todos")) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); }); }
function montaBusca(el, grande){
  el.innerHTML = '<div class="busca'+(grande?" grande":"")+'">'+I("lupa")+'<input type="search" placeholder="'+(grande?"Procure político ou cidade":"Procurar político ou cidade")+'" aria-label="Procure um político ou uma cidade" autocomplete="off"><div class="sugest"></div></div>';
  const sQ = el.querySelector("input"), sSug = el.querySelector(".sugest");
  sQ.oninput = function(){ const q = semAc(sQ.value.trim()); if (!q){ sSug.classList.remove("on"); return; }
    const r = D.pessoas.filter(function(p){ return semAc(p.nome).indexOf(q)>=0 || semAc(p.nome_civil).indexOf(q)>=0; }).slice(0,6);
    const cidades = MAPA && q.length>=3 ? Object.keys(MAPA.municipios).filter(function(n){ return semAc(n).indexOf(q)===0; }).slice(0,3) : [];
    sSug.innerHTML = r.map(function(p){ return linhaP(p, CASAS[p.casa].cargo+(p.partido?', '+esc(p.partido):'')); }).join("") +
      cidades.map(function(c){ return '<a class="linha-dep" href="#cidade-'+encodeURIComponent(c)+'"><span class="ic-cid">'+I("mapa")+'</span><div><div class="nome">'+esc(c)+'</div><div class="meta">Quem foi votado e quem mandou emendas</div></div><div class="dir">'+I("seta")+'</div></a>'; }).join("") ||
      '<div class="vazio" style="border:none">Nada com esse nome.</div>';
    sSug.classList.add("on"); };
  sQ.onkeydown = function(e){ if (e.key==="Enter"){ const a = sSug.querySelector("a"); if (a){ location.hash = a.getAttribute("href"); sQ.blur(); } } };
  sQ.onblur = function(){ setTimeout(function(){ sSug.classList.remove("on"); },200); };
}
const ATALHOS = [["radar","radar","Radar"],["noticias","jornal","No noticiário"],["cobrar","megafone","Cobrar"],["prioridades","alvo","Áreas prioritárias"],["gastos","moeda","Gastos"],["votos","urna","Votos"],["projetos","doc","Projetos"],["cidade","mapa","Sua cidade"],["viagens-todas","aviao","Viagens"],["promessas","promessa","Promessas"],["comparar","comparar","Comparar"],["eleitos","urnaN","Eleitos 2026"]];
function topo(inicio){
  document.body.classList.toggle("na-inicio", !!inicio);
  document.getElementById("buscaTopo").innerHTML = "";
  document.getElementById("heroi").innerHTML = inicio ? '<section class="heroi" aria-labelledby="hTit"><div class="heroi-in">'+
    '<div class="heroi-txt"><h1 id="hTit" aria-label="Espia só o que teu político anda fazendo.">'+["Espia","só","o","que","teu"].map(function(w,i){ return '<span class="w" style="--i:'+i+'" aria-hidden="true">'+w+'</span> '; }).join("")+'<span class="w gira-caixa" style="--i:5" aria-hidden="true"><span class="gira" id="gira">político</span></span> '+["anda","fazendo."].map(function(w,i){ return '<span class="w" style="--i:'+(i+6)+'" aria-hidden="true">'+w+'</span> '; }).join("")+'</h1><p class="entra" style="--d:520ms">Gastos, votos e projetos de quem o Ceará elegeu. Tudo com dado oficial e de graça.</p><div id="buscaHeroi" class="entra" style="--d:640ms"></div>'+
    '<div class="atalhos entra" style="--d:760ms">'+ATALHOS.map(function(a){ return ACOES[a[0]] ? '<button type="button" class="pilula" data-a="'+a[0]+'">'+I(a[1])+a[2]+'</button>' : '<a class="pilula" href="#'+a[0]+'">'+I(a[1])+a[2]+'</a>'; }).join("")+'<button type="button" class="pilula story" id="hStory">'+I("story")+'Arte pro story</button></div></div>'+
    '<div class="losango" aria-hidden="true"><svg class="olhao" viewBox="0 0 220 220" aria-hidden="true"><circle cx="110" cy="110" r="104" class="o-fundo"/><path d="M22 112c26-42 56-62 88-62s62 20 88 62c-26 42-56 62-88 62s-62-20-88-62z" class="o-branco"/><g class="o-pupila"><circle cx="110" cy="112" r="36" class="o-iris"/><circle cx="110" cy="112" r="17" class="o-meio"/><circle cx="122" cy="99" r="8" class="o-brilho"/></g><path d="M22 112c26-42 56-62 88-62s62 20 88 62" class="o-palpebra"/></svg></div>'+
    '</div></section>' : '';
  if (!inicio) return;
  montaBusca(document.getElementById("buscaHeroi"), true);
  document.getElementById("hStory").onclick = function(){ escolher("story"); };
  document.querySelector(".atalhos").addEventListener("click", function(e){ const b = e.target.closest("[data-a]"); if (b) escolher(b.getAttribute("data-a")); });
  segueOlho(); giraPalavra();
}
/* a palavra que gira no título: político, deputado, senador, governador */
let giraT = null;
function giraPalavra(){
  clearInterval(giraT);
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ps = ["político","deputado","senador","governador"]; let i = 0;
  giraT = setInterval(function(){ const el = document.getElementById("gira"); if (!el){ clearInterval(giraT); return; }
    el.classList.add("sai"); setTimeout(function(){ i = (i+1) % ps.length; el.textContent = ps[i]; el.classList.remove("sai"); el.classList.add("chega"); setTimeout(function(){ el.classList.remove("chega"); }, 400); }, 260); }, 2400);
}
/* o olho do topo espia o mouse (ou o dedo) */
let olhoLigado = false;
function segueOlho(){
  if (olhoLigado || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches)) return; olhoLigado = true;
  const mexe = function(x, y){ const sv = document.querySelector(".olhao"); if (!sv) return; const r = sv.getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + r.height/2, dx = x-cx, dy = y-cy, d = Math.hypot(dx,dy) || 1, k = Math.min(1, d/300);
    sv.querySelector(".o-pupila").setAttribute("transform", "translate("+(dx/d*30*k).toFixed(1)+" "+(dy/d*18*k).toFixed(1)+")"); };
  document.addEventListener("pointermove", function(e){ mexe(e.clientX, e.clientY); }, {passive:true});
  document.addEventListener("focusin", function(e){ const r = e.target.getBoundingClientRect && e.target.getBoundingClientRect(); if (r) mexe(r.left + r.width/2, r.top + r.height/2); });
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
function somaEmendasCidade(){ const V = {}; D.pessoas.forEach(function(p){ ((p.emendas||{}).por_municipio||[]).forEach(function(m){ V[m[0]] = (V[m[0]]||0) + m[1]; }); }); return V; }
function gastoTotal(L){ return L.reduce(function(a,p){ return a + ((p.gastos||{}).total||0); },0); }
function quadroEmendasTop(L){ const X = L.filter(function(p){ return p.emendas && p.emendas.pago; }).sort(function(a,b){ return b.emendas.pago-a.emendas.pago; }).slice(0,8);
  if (!X.length) return ''; return quadro("dinheiro","c3","Quem mais mandou emendas", barrasH(X.map(function(p){ return {r:p.nome, v:p.emendas.pago, t:mil(p.emendas.pago), h:"#p-"+p.id, s:CASAS[p.casa].nome}; })), fi(fp(X[0],"emendas"))); }
/* letreiro de notícias passando, como nos telejornais */
function letreiro(){
  const N = ((D.not||{}).itens||[]).slice(0,10); if (!N.length) return '';
  const itens = N.map(function(n){ return '<a href="'+esc(n.link)+'" target="_blank" rel="noopener"><b>'+esc(n.fonte)+'</b>'+esc(n.titulo)+'</a><span class="lt-sep" aria-hidden="true">›››</span>'; }).join("");
  const letras = N.reduce(function(a,n){ return a + n.titulo.length + n.fonte.length + 6; }, 0);
  return '<div class="letreiro"><a class="lt-rot" href="#noticias">'+I("jornal")+'<span>No noticiário</span></a><div class="lt-trilho" role="region" aria-label="Últimas notícias sobre as pautas do Radar" tabindex="0">'+
    '<div class="lt-faixa" style="--dur:'+Math.max(30, Math.round(letras*0.17))+'s"><div class="lt-grupo">'+itens+'</div><div class="lt-grupo" aria-hidden="true">'+itens.replace(/<a /g,'<a tabindex="-1" ')+'</div></div></div></div>'; }
function faixaRadar(){
  const R = D.radar || {}, L = (R.itens||[]).slice(0,3); if (!L.length) return '';
  return '<section class="radar-faixa" aria-labelledby="rfTit"><div class="rf-cab"><span class="radar-ic">'+I("radar")+'</span><div><h2 id="rfTit">'+esc(R.titulo||"Radar do Retrocesso")+'</h2><p>'+(R.itens||[]).length+' projetos dessa agenda andando agora. Espia e cobra antes que vire lei.</p></div><a class="btn amarelo" href="#radar">Ver o Radar'+I("seta")+'</a></div>'+
    letreiro()+
    '<div class="radar-mini">'+L.map(function(it){ return cardRadar(it, true); }).join("")+'</div>'+'</section>'; }
function inicio(){
  topo(true);
  const ativos = D.pessoas.filter(function(p){return !p.fora_exercicio;}), g = D.gov && D.gov.governador;
  const emCid = somaEmendasCidade(), emTot = Object.values(emCid).reduce(function(a,b){return a+b;},0);
  const ult = D.votacoes.slice(0,6);
  app.innerHTML =
  '<h2 class="tit-sec">Quem você quer espiar?</h2><div class="esferas casas">'+
      ["alece","camara","senado"].map(function(c){ const n = noMandato(c).length; return '<a class="esfera" href="#'+c+'"><span class="ic '+CASAS[c].cor+'">'+I(CASAS[c].ic)+'</span><span><b>'+CASAS[c].nome+'</b><small>'+(n||CASAS[c].total)+' '+CASAS[c].plural+'</small></span></a>'; }).join("")+
      '<a class="esfera" href="#governo"><span class="ic c3">'+I("gov")+'</span><span><b>Governo</b><small>'+(g?esc(g.nome):'Governador e orçamento')+'</small></span></a></div>'+
  faixaRadar()+
  '<h2 class="tit-sec">Cobra agora</h2><div class="cobra-agora" id="cobraAgora">'+
    '<button type="button" data-ca="cobrar"><span class="ic c1">'+I("megafone")+'</span><b>Cobrar um político</b><small>Mensagem pronta para e-mail, WhatsApp e redes</small></button>'+
    '<a href="#radar"><span class="ic c4">'+I("radar")+'</span><b>Cobrar a bancada sobre um projeto</b><small>Antes que a pauta vire lei</small></a>'+
    '<button type="button" data-ca="story"><span class="ic c3">'+I("story")+'</span><b>Fazer arte pro story</b><small>Espalhe o que você espiou</small></button></div>'+
  '<h2 class="tit-sec">O Ceará em números</h2>'+kpis([{ic:"vazio", r:"Políticos acompanhados", v:NUM.format(ativos.length+(g?1:0)), s:"46 estaduais, 22 federais, 3 senadores e o governo"},
        {ic:"moeda", r:"Gastos com verba e cota em "+ANO, v:mil(gastoTotal(ativos)), s:"de todos os parlamentares do CE", href:"gastos-todos"},
        {ic:"urna", r:"Votações acompanhadas", v:NUM.format(D.votacoes.length), s:"votações nominais recentes com voto dos cearenses"},
        emTot ? {ic:"dinheiro", r:"Emendas pagas no Ceará", v:mil(emTot), s:"de deputados federais e senadores desde 2023", href:"cidade"} : null])+
  '<div class="quadros">'+
    (emTot ? quadro("mapa","c2","Emendas pagas por cidade", '<p class="frase">Toque numa cidade para ver quem mandou dinheiro e quem foi mais votado lá.</p>'+mapaCE(emCid, {fmt:mil, clique:true, legenda:"R$ pagos desde 2023", colValor:"Pago", rot:"Mapa do Ceará com o valor de emendas pagas por cidade"}), fi("https://portaldatransparencia.gov.br/emendas","Portal da Transparência · emendas"), "q2") : '')+
    (ult.length ? quadro("urna","c4","Últimas votações que importam", tabela([
        {t:"Votação", k:"titulo", fmt:function(v,l){ return esc(v)+'<small>'+CASAS[l.casa].nome+' · '+dataBR(l.data)+'</small>'; }},
        {t:"Como os cearenses votaram", k:"_s", semOrd:true, fmt:function(v,l){ const r = resumoVotacao(l); return segMini(r.s, r.n); }},
        {t:"", k:"url", semOrd:true, fmt:function(v){ return fi(v,"votação na página oficial"); }}], ult, {limite:6}), '', "qt") : '')+
    quadroEmendasTop(ativos)+
  '</div>';
  document.getElementById("cobraAgora").onclick = function(e){ const b = e.target.closest("[data-ca]"); if (b) escolher(b.getAttribute("data-ca")); };
}

/* ---------- políticos: as casas ---------- */
function politicosPag(){
  topo(false);
  const g = D.gov && D.gov.governador;
  app.innerHTML = '<h1>Políticos</h1><p class="sub">Escolha onde espiar.</p><div class="esferas grandes">'+
    ["alece","camara","senado"].map(function(c){ const n = noMandato(c).length; return '<a class="esfera" href="#'+c+'"><span class="ic '+CASAS[c].cor+'">'+I(CASAS[c].ic)+'</span><span><b>'+CASAS[c].longo+'</b><small>'+(n||CASAS[c].total)+' '+CASAS[c].plural+'</small></span></a>'; }).join("")+
    '<a class="esfera" href="#governo"><span class="ic c3">'+I("gov")+'</span><span><b>Governo do Ceará</b><small>'+(g?esc(g.nome):'Governador e orçamento')+'</small></span></a>'+
    '<a class="esfera" href="#eleitos"><span class="ic c1">'+I("urnaN")+'</span><span><b>Eleitos em 2026</b><small>Quem assume em 2027</small></span></a>'+
    '<a class="esfera" href="#comparar"><span class="ic c4">'+I("comparar")+'</span><span><b>Comparar dois</b><small>Lado a lado</small></span></a></div>';
}

/* ---------- Casa ---------- */
function participacao(p){ const vs = D.votacoes.filter(function(v){ return v.casa===p.casa; }); if (!vs.length) return null; const n = vs.filter(function(v){ return ["Sim","Não","Abstenção","Obstrução"].indexOf(votoTxt(v.votos[p.id]))>=0; }).length; return 100*n/vs.length; }
function casaPag(c, ver){
  topo(false);
  const C = CASAS[c], prox = ver==="2026", L = noMandato(c), todos = daCasa(c);
  const eleitos = ((D.ele||{}).eleitos2026||[]).filter(function(e){ return e.casa===c; });
  const pres = L.map(function(p){ return p.presenca ? p.presenca.pct : participacao(p); }).filter(function(x){ return x!=null; });
  let h = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a>'+
  '<div class="casa-topo"><span class="ic '+C.cor+'">'+I(C.ic)+'</span><div><h1>'+C.longo+'</h1><div class="sub">'+(prox?C.prox:C.agora)+'</div></div></div>'+
  '<div class="filtros"><div class="leg" role="group" aria-label="Legislatura"><button type="button" data-v="agora" aria-pressed="'+!prox+'">Agora <small>'+L.length+'</small></button><button type="button" data-v="2026" aria-pressed="'+prox+'">Eleitos em 2026 <small>'+eleitos.length+'</small></button></div>'+'</div>';
  if (prox){
    const novos = eleitos.filter(function(e){ return !e.atual; }).length;
    h += kpis([{r:"Eleitos para "+C.prox.split(" (")[0], v:eleitos.length}, {r:"Reeleitos", v:eleitos.length-novos}, {r:"Novos", v:novos}])+
    '<div class="quadros">'+quadro("urnaN","c1","Quem foi eleito", eleitos.length ? '<div class="lista">'+eleitos.map(function(e){ const a = e.atual && D.porId[e.atual];
      return '<a class="linha-dep" href="'+(a?'#p-'+esc(a.id):'#e-'+esc(e.id))+'">'+av({id:e.id, nome:e.nome, foto:e.foto_tse || (a&&fotoDe(a))})+'<div><div class="nome">'+esc(e.nome)+'</div><div class="meta">'+esc(e.partido)+((e.votos||{}).total?' · '+NUM.format(e.votos.total)+' votos':'')+'</div></div><div class="dir">'+(a?'<span class="chip">reeleito(a)</span>':'<span class="chip sol">novo</span>')+'</div></a>'; }).join("")+'</div>'
      : '<p class="frase">O resultado de 2026 ainda não está nos dados abertos do TSE.</p>', fi(((D.ele||{}).fontes||{})["2026"]&&D.ele.fontes["2026"].candidatos,"TSE · candidatos 2026"), "q2")+
    quadro("comparar","c4","Renovação por partido", barrasH(contaPartidos(eleitos)), '')+'</div>';
  } else {
    const ordGasto = L.filter(function(p){return p.gastos;}).sort(function(a,b){ return b.gastos.total-a.gastos.total; });
    h += kpis([{ic:"vazio", r:C.plural[0].toUpperCase()+C.plural.slice(1)+" no mandato", v:L.length, s:todos.length>L.length?(todos.length-L.length)+" licenciados":""},
               {ic:"moeda", r:"Gastaram da "+C.verba, v:mil(gastoTotal(L)), s:"em "+ANO+(ordGasto.length?" · média "+mil(gastoTotal(L)/ordGasto.length):""), f:ordGasto[0]&&fp(ordGasto[0],"gastos")},
               {ic:"presenca", r:L.some(function(p){return p.presenca;})?"Presença média":"Participação nas votações", v:pres.length?pct(pres.reduce(function(a,b){return a+b;},0)/pres.length):"—", s:"no plenário em "+ANO}])+
    '<div class="quadros">'+
    quadro("vazio","c2","Todos, lado a lado", '<div class="filtros" style="margin:0 0 8px" role="group" aria-label="Ver como"><button type="button" class="chipbtn" data-vista="tab" aria-pressed="true">Tabela</button><button type="button" class="chipbtn" data-vista="lista" aria-pressed="false">Lista</button></div><div id="vTab">'+
      tabela([{t:"Nome", k:"nome", fmt:function(v,p){ return '<a class="tb-p" href="#p-'+esc(p.id)+'">'+av(p)+'<span>'+esc(v)+(p.fora_exercicio?'<small>licenciado</small>':'')+'</span></a>'; }},
              {t:"Partido", k:"partido"},
              {t:"Gastos "+ANO, k:"_g", num:true, ordv:function(p){ return p.gastos&&p.gastos.total; }, fmt:function(v,p){ return p.gastos ? mil(p.gastos.total) : '—'; }},
              {t:L.some(function(p){return p.presenca;})?"Presença":"Participação", k:"_p", num:true, ordv:function(p){ return p.presenca?p.presenca.pct:participacao(p); }, fmt:function(v,p){ const x = p.presenca?p.presenca.pct:participacao(p); return x==null?'—':pct(x); }},
              {t:"Projetos de verdade", k:"_pr", num:true, ordv:function(p){ return (p.projetos||[]).filter(function(x){return !x.homenagem;}).length; }, fmt:function(v,p){ return p.projetos ? (p.projetos.filter(function(x){return !x.homenagem;}).length+' de '+p.projetos.length) : '—'; }}],
             todos, {ord:2, limite:15})+'</div><div id="vLista" hidden>'+listaCasa(todos)+'</div>', '', "qt")+
    quadro("moeda","c1","Quem mais gastou em "+ANO, barrasH(ordGasto.slice(0,12).map(function(p){ return {r:p.nome, v:p.gastos.total, t:mil(p.gastos.total), h:"#p-"+p.id, s:p.gastos.pct_teto!=null?pct(p.gastos.pct_teto)+" do limite":"", tom:p.gastos.pct_teto>85?"alerta":""}; })), fi(ordGasto[0]&&fp(ordGasto[0],"gastos")))+
    quadro("comparar","c2","Bancada por partido", barrasH(contaPartidos(L)), fi(L[0]&&fp(L[0],"partido")))+
    (D.votacoes.some(function(v){return v.casa===c;}) ? quadro("urna","c4","Votações recentes", tabela([
        {t:"Votação", k:"titulo", fmt:function(v,l){ return esc(v)+'<small>'+dataBR(l.data)+'</small>'; }},
        {t:"Como a bancada votou", k:"_r", semOrd:true, fmt:function(v,l){ const r = resumoVotacao(l); return segMini(r.s, r.n); }},
        {t:"", k:"url", semOrd:true, fmt:function(v){ return fi(v,"votação"); }}], D.votacoes.filter(function(v){return v.casa===c;}), {limite:8}), '', "qt") : '')+
    '</div>';
  }
  app.innerHTML = h;
  app.querySelector(".leg").onclick = function(e){ const b = e.target.closest("[data-v]"); if (b) location.hash = c+(b.getAttribute("data-v")==="2026"?"-2026":""); };
  app.querySelectorAll("[data-vista]").forEach(function(b){ b.onclick = function(){ const t = b.getAttribute("data-vista")==="tab"; document.getElementById("vTab").hidden = !t; document.getElementById("vLista").hidden = t; app.querySelectorAll("[data-vista]").forEach(function(x){ x.setAttribute("aria-pressed", x===b); }); }; });
}
function listaCasa(L){ return '<div class="lista">'+L.slice().sort(function(a,b){ return (!!a.fora_exercicio - !!b.fora_exercicio) || a.nome.localeCompare(b.nome); }).map(function(p){
  return linhaP(p, (p.partido?esc(p.partido):'')+(p.fora_exercicio?' · fora do mandato agora':''), p.gastos?'<span class="chip">'+mil(p.gastos.total)+'</span>':'<span class="chip cinza">'+(p.fora_exercicio?'licenciado':'sem gastos')+'</span>'); }).join("")+'</div>'; }
function contaPartidos(L){ const c = {}; L.forEach(function(p){ if (p.partido) c[p.partido] = (c[p.partido]||0)+1; }); return Object.keys(c).sort(function(a,b){ return c[b]-c[a]; }).map(function(k){ return {r:k, v:c[k], t:c[k], d:k+": "+c[k]+(c[k]>1?" parlamentares":" parlamentar")}; }); }
function mini(p){ return '<span class="mini" aria-hidden="true"><i class="'+(p>=60?"bom":p<40?"alerta":"")+'" style="width:'+p+'%"></i></span>'; }
function segMini(s, n){ const t = s+n || 1; return '<span class="segmini" data-dica="'+s+' sim, '+n+' não"><i class="k1" style="flex:'+s+'"></i><i class="k4" style="flex:'+n+'"></i></span><span class="sn"><b>'+s+'</b> sim · <b>'+n+'</b> não</span>'; }

/* ---------- eleito de 2026 que ainda não tem mandato ---------- */
function eleitoPag(id){
  topo(false);
  const e = ((D.ele||{}).eleitos2026||[]).find(function(x){ return x.id===id; }) || (D.gov&&D.gov.eleito2026&&D.gov.eleito2026.id===id?D.gov.eleito2026:null);
  if (!e){ app.innerHTML = '<a class="voltar" href="#eleitos">'+I("volta")+'Eleitos</a><div class="vazio">Não encontramos.</div>'; return; }
  const F = ((D.ele||{}).fontes||{})["2026"]||{}, p = {id:e.id, nome:e.nome, foto:e.foto_tse};
  app.innerHTML = '<a class="voltar" href="#eleitos">'+I("volta")+'Eleitos em 2026</a><div class="perfil">'+av(p,true)+'<div><span class="chip verm">'+I("urnaN")+esc(e.cargo)+' eleito(a) em 2026</span>'+fi(F.candidatos,"TSE · candidatos 2026")+'<h1 style="margin-top:6px">'+esc(e.nome)+'</h1><div class="meta">'+esc(e.partido)+fi(F.candidatos,"TSE · partido")+' · posse em 2027</div>'+redesHtml(e.redes, F.candidatos)+'</div></div>'+
  '<div class="quadros">'+quadroVotosTSE(e.votos, F.resultados)+quadroBens(e.bens, F.candidatos)+quadroReceitas(e.receitas, F.contas)+'</div>'+
  '<div class="info">'+I("info")+'<span>Quando o mandato começar, em 2027, o robô passa a trazer os gastos, votos e projetos.</span></div>';
}

/* ---------- pedaços do perfil ---------- */
function rede(u){ const x = semAc(u); return x.indexOf("instagram")>=0 ? "Instagram" : x.indexOf("facebook")>=0||x.indexOf("fb.com")>=0 ? "Facebook" : x.indexOf("twitter")>=0||/\/\/(www\.)?x\.com/.test(x) ? "X" : x.indexOf("youtube")>=0||x.indexOf("youtu.be")>=0 ? "YouTube" : x.indexOf("tiktok")>=0 ? "TikTok" : x.indexOf("threads")>=0 ? "Threads" : x.indexOf("kwai")>=0 ? "Kwai" : x.indexOf("linkedin")>=0 ? "LinkedIn" : x.indexOf("bsky")>=0 ? "Bluesky" : x.indexOf("whatsapp")>=0||x.indexOf("wa.me")>=0 ? "WhatsApp" : x.indexOf("t.me")>=0 ? "Telegram" : "Site"; }
function redesHtml(lst, fonte){ if (!lst || !lst.length) return ''; return '<div class="redes">'+lst.slice(0,10).map(function(u){ return '<a class="rchip" href="'+esc(u)+'" target="_blank" rel="noopener">'+I("rede")+rede(u)+'</a>'; }).join("")+fi(fonte,"redes sociais declaradas")+'</div>'; }
function votosMap(v){ const o = {}; (v.municipios||[]).forEach(function(m){ o[m[0]] = m[1]; }); return o; }
function quadroVotosTSE(v, fonte, tam){ if (!v) return ''; return quadro("mapa","c2","Onde foi votado(a) em "+v.ano,
  kpis([{r:"Votos", v:NUM.format(v.total)}, {r:"Cidades", v:v.n_municipios||(v.municipios||[]).length}, v.fortaleza_pct!=null?{r:"Em Fortaleza", v:pct(v.fortaleza_pct)}:null])+
  mapaCE(votosMap(v), {legenda:"votos por cidade", colValor:"Votos", rot:"Mapa do Ceará com os votos por cidade", clique:true}), fi(fonte,"TSE · votação por município"), tam||"q2", "c-eleicao"); }
function quadroBens(b, fonte){ if (!b) return ''; return quadro("casa","c3","Bens declarados ao TSE ("+b.ano+")", '<div class="r num">'+mil(b.total)+'</div><p class="frase">'+b.n+' bens declarados</p>'+
  tabela([{t:"Bem", k:0, fmt:function(v,l){ return esc(v)+'<small>'+esc(l[1])+'</small>'; }},{t:"Valor", k:2, num:true, fmt:function(v){ return mil(v); }}], b.itens, {ord:1, limite:6}), fi(fonte,"TSE · bens de candidatos"), "", "c-bens"); }
function quadroReceitas(r, fonte){ if (!r || !r.total) return ''; const t = r.total;
  return quadro("dinheiro","c1","Quem bancou a campanha de "+r.ano, '<div class="r num">'+mil(t)+'</div>'+(r.n_doadores?'<p class="frase">'+r.n_doadores+' pessoas doaram</p>':'')+
  segmentada([{r:"Doações pequenas (até "+BRL.format(r.limite_pequena)+")", v:r.pequenas, k:1},{r:"Grandes e médios doadores", v:(r.grandes||0)+(r.medias||0), k:2},{r:"Fundo eleitoral e partidário", v:r.publico, k:3},{r:"Do próprio bolso", v:r.proprios, k:4},{r:"Outros", v:r.outros, k:0}], {fmt:mil})+
  (r.maiores&&r.maiores.length?'<details><summary>Maiores doadores</summary><div class="det"><ul class="num">'+r.maiores.map(function(x){ return '<li><span>'+esc(x[0])+'</span><span>'+mil(x[1])+'</span></li>'; }).join("")+'</ul><div class="fonte">Nomes como publicados pelo TSE. Só aparecem doações acima de 10 salários mínimos.</div></div></details>':''), fi(fonte,"TSE · prestação de contas"), "", "c-campanha"); }
const ST_PROM = {cumprida:["ok","Cumprida"],andamento:["sol","Em andamento"],parada:["aus","Parada"],contrariada:["contra","Fez o contrário"],aguardando:["aus","A checar"]};
function quadroPromessas(lista, titulo, fonte, tam){ if (!lista || !lista.length) return '';
  const cont = {}; lista.forEach(function(x){ const s = x.status||"aguardando"; cont[s] = (cont[s]||0)+1; });
  return quadro("promessa","c3",titulo, segmentada([{r:"Cumpridas", v:cont.cumprida||0, k:1},{r:"Em andamento", v:cont.andamento||0, k:4},{r:"Paradas ou ao contrário", v:(cont.parada||0)+(cont.contrariada||0), k:2},{r:"A checar", v:cont.aguardando||0, k:0}])+
  tabela([{t:"Promessa", k:"_t", ordv:function(x){ return x.promessa||x.texto; }, fmt:function(v,x){ return esc(x.promessa||x.texto)+(x.lado?' '+lado(x.lado):'')+'<small>'+(x.data?dataBR(x.data)+' · ':'')+(x.fonte&&x.fonte!=="#"?'<a href="'+esc(x.fonte)+'" target="_blank" rel="noopener">onde prometeu</a>':'')+'</small>'; }},
          {t:"Situação", k:"status", fmt:function(v,x){ const s = ST_PROM[v||"aguardando"]||ST_PROM.aguardando; return '<span class="voto '+s[0]+'">'+s[1]+'</span>'+(x.prova_status&&x.prova_status!=="#"?fi(x.prova_status,"prova da situação"):''); }}], lista, {limite:8}), fonte, tam||"qt", "c-promessas"); }

/* ---------- perfil ---------- */
function perfil(id){
  topo(false);
  const p = D.porId[id];
  if (!p){ app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="vazio">Não encontramos esse político nos dados atuais.</div>'; return; }
  const C = CASAS[p.casa], g = p.gastos, vots = D.votosDe[p.id] || [], pr = p.projetos, t = p.tse || {};
  const nov = segue(p.id) && novidades(p), part = participacao(p);
  let h = '<a class="voltar" href="#'+p.casa+'">'+I("volta")+C.longo+'</a>'+
  '<div class="perfil-topo"><div class="perfil">'+av(p,true)+'<div><span class="chip verm">'+I(C.ic)+C.cargo+'</span>'+fi(fp(p,"perfil"))+'<h1 style="margin-top:6px">'+esc(p.nome)+(fp(p,"foto")?fi(fp(p,"foto"),"foto"):'')+'</h1><div class="meta">'+(p.partido?partido(p)+(p.partido_eleicao?' <small>(partido da eleição)</small>':'')+' · ':'')+'Ceará'+(p.fora_exercicio?' · <b>fora do mandato agora</b>':'')+'</div>'+redesHtml(p.redes, fp(p,"redes"))+'</div></div>'+
  '<div class="acoes"><button class="btn" id="bSeg" aria-pressed="'+segue(p.id)+'">'+I(segue(p.id)?"ok":"mais")+(segue(p.id)?"Seguindo":"Seguir")+'</button><button class="btn cheio" id="bCob">'+I("megafone")+'Cobrar</button><button class="btn escuro" id="bSto">'+I("story")+'Story</button><a class="btn" href="#comparar-'+esc(p.id)+'">'+I("comparar")+'Comparar</a></div></div>'+
  (nov ? '<div class="info">'+I("sino")+'<span><b>Novidades desde sua última visita:</b> '+esc(nov.join(", "))+'.</span></div>' : '')+
  (t.em2026!==undefined ? '<div class="olho" style="background:var(--anil-suave);border-color:var(--anil)">'+I("urnaN")+'<p>'+(t.em2026 ? '<b>Em 2026:</b> concorreu a '+esc(t.em2026.cargo.toLowerCase())+' pelo '+esc(t.em2026.partido)+' · <b>'+esc(t.em2026.situacao)+'</b>' : '<b>Em 2026:</b> não encontramos candidatura no Ceará.')+fi(((D.ele||{}).fontes||{})["2026"]&&D.ele.fontes["2026"].candidatos,"TSE · candidatos 2026")+'</p></div>' : '')+
  kpis([
        g ? {ic:"moeda", r:"Gastos em "+ANO, v:mil(g.total), s:g.pct_teto!=null?pct(g.pct_teto)+" do limite":g.n+" lançamentos", f:fp(p,"gastos"), tom:g.pct_teto>85?"alerta":""} : null,
        p.presenca ? {ic:"presenca", r:"Presença", v:pct(p.presenca.pct), s:p.presenca.nao_justificadas+" faltas sem justificativa", f:fp(p,"presenca"), tom:p.presenca.pct<75?"alerta":""} : part!=null ? {ic:"presenca", r:"Participação nas votações", v:pct(part), s:"votações nominais", f:fp(p,"votos")} : null,
        pr ? {ic:"doc", r:"Projetos de verdade em "+ANO, v:pr.filter(function(x){return !x.homenagem;}).length, s:pr.filter(function(x){return x.homenagem;}).length+" só de homenagem", f:fp(p,"projetos")} : null,
        p.votos ? {ic:"mapa", r:"Votos em "+p.votos.ano, v:NUM.format(p.votos.total), s:(p.votos.n_municipios||"")+" cidades", f:fp(p,"votos")} : null])+
  '<div class="quadros">';
  /* Gastos */
  if (g){
    const serie = MESES.slice(0, Math.max.apply(null, g.meses.concat([1]))).map(function(m,i){ const v = (g.por_mes||{})[String(i+1)]||0; return {r:m, v:v, t:mil(v), d:m+": "+BRL.format(v)}; });
    h += quadro("moeda","c1","Gastos mês a mês em "+ANO, colunas(serie, {eixo:milCurto, rot:"Gastos por mês"})+(g.teto_periodo?'<p class="frase">Limite da verba: '+mil(g.teto_periodo/Math.max(1,g.meses.length))+' por mês'+fi(fp(p,"teto"),"valor da verba")+'</p>':'')+
      (g.maior_fornecedor_pct >= 30 && g.fornecedores[0] ? '<div class="olho">'+I("olho")+'<p><b>Fique de olho:</b> um só fornecedor ('+esc(g.fornecedores[0][0])+') ficou com '+pct(g.maior_fornecedor_pct)+' dos gastos. Não é acusação; é algo que o gabinete pode explicar.</p></div>' : ''), fi(fp(p,"gastos")), "", "c-gastos");
    h += quadro("moeda","c1","Com o quê", barrasH(g.por_categoria.slice(0,7).map(function(x){ return {r:x[0], v:x[1], t:mil(x[1])}; })), fi(fp(p,"gastos")));
    h += quadro("moeda","c1","Quem mais recebeu", tabela([{t:"Fornecedor", k:0, fmt:function(v,l){ return esc(v)+(l[1]?'<small>CNPJ/CPF '+esc(l[1])+'</small>':''); }},{t:"Valor", k:2, num:true, fmt:function(v){ return mil(v); }},{t:"% do total", k:"_p", num:true, ordv:function(l){ return l[2]; }, fmt:function(v,l){ return pct(100*l[2]/g.total); }}], g.fornecedores, {ord:1, limite:6})+
      (fp(p,"gastos_dados")?'<p class="fonte"><a href="'+esc(fp(p,"gastos_dados").u)+'" target="_blank" rel="noopener">Baixar os dados oficiais</a></p>':''), fi(fp(p,"gastos")));
    if (g.ultimos && g.ultimos.length) h += quadro("doc","c1","Últimos lançamentos", tabela([{t:"Fornecedor", k:"fornecedor", fmt:function(v,l){ return esc(v||l.categoria)+'<small>'+esc(l.categoria)+'</small>'; }},{t:"Mês", k:"mes", num:true, fmt:function(v){ return MESES[(v||1)-1]; }},{t:"Valor", k:"valor", num:true, fmt:function(v,l){ return BRL2.format(v)+fi(l.url||fp(p,"gastos"),"nota fiscal ou lançamento"); }}], g.ultimos, {limite:6}), fi(fp(p,"gastos")));
  }
  /* Votos */
  if (vots.length){
    h += quadro("urna","c4","Como votou", 
      tabela([{t:"Votação", k:"titulo", fmt:function(v,l){ return esc(v)+' '+lado(l.lado)+'<small>'+dataBR(l.data)+(l.descricao&&l.descricao!==l.titulo?' · '+esc(l.descricao.slice(0,120)):'')+'</small>'; }},
              {t:"Data", k:"data", fmt:function(v){ return dataBR(v); }},
              {t:"Voto", k:"_v", ordv:function(l){ return votoTxt(l.votos[p.id]); }, fmt:function(v,l){ const x = votoTxt(l.votos[p.id]); return '<span class="voto '+votoClasse(x)+'">'+esc(x)+'</span>'; }},
              {t:"", k:"url", semOrd:true, fmt:function(v){ return fi(v,"votação na página oficial"); }}], vots, {limite:8})+
      '<p class="fonte">Aqui só mostramos o voto. Abra a votação no ⓘ para ler o que estava em jogo e cobrar o porquê.</p>', fi(fp(p,"votos")), "q2", "c-votos");
  }
  /* Projetos */
  if (pr){
    const hom = pr.filter(function(x){return x.homenagem;}).length, tc = {};
    pr.forEach(function(x){ if (!x.homenagem) (x.temas&&x.temas.length?x.temas:["outros"]).forEach(function(t){ tc[t] = (tc[t]||0)+1; }); });
    h += quadro("doc","c2","Projetos apresentados em "+ANO, segmentada([{r:"Projetos de verdade", v:pr.length-hom, k:1},{r:"Só homenagem", v:hom, k:4}])+
      (Object.keys(tc).length ? '<p style="margin:10px 0 0"><b>Sobre o quê</b></p>'+barrasH(Object.keys(tc).sort(function(a,b){return tc[b]-tc[a];}).slice(0,6).map(function(t){ return {r:NOMES_TEMA[t]||(t==="outros"?"Outros assuntos":t), v:tc[t], t:tc[t]}; })) : '')+
      (pr.length ? tabela([{t:"Projeto", k:"ementa", fmt:function(v,x){ return '<b>'+esc((x.tipo||"")+" "+(x.numero||"")+(x.ano&&String(x.numero).indexOf("/")<0?"/"+x.ano:""))+'</b> '+(x.homenagem?'<span class="pill">homenagem</span>':'')+lado(x.lado)+'<small>'+esc(v)+'</small>'; }},
                          {t:"Data", k:"data", fmt:function(v){ return v?dataBR(v):'—'; }},{t:"", k:"url", semOrd:true, fmt:function(v){ return fi(v,"texto do projeto"); }}], pr, {limite:6}) : ''), fi(fp(p,"projetos")), "q2", "c-projetos");
  }
  /* Emendas */
  if (p.emendas){ const e = p.emendas, em = {}; e.por_municipio.forEach(function(m){ em[m[0]] = m[1]; });
    h += quadro("dinheiro","c3","Emendas desde "+e.anos[0], kpis([{r:"Pagas", v:mil(e.pago)}, {r:"Empenhadas", v:mil(e.empenhado)}, {r:"Em serviços públicos", v:pct(e.pct_servicos), tom:e.pct_servicos>=60?"bom":""}])+
      mapaCE(em, {fmt:mil, legenda:"R$ pagos por cidade", colValor:"Pago", rot:"Mapa das emendas pagas por cidade", clique:true}), fi(fp(p,"emendas")), "", "c-emendas");
    h += quadro("dinheiro","c3","Emendas por área", barrasH(e.por_funcao.slice(0,8).map(function(x){ return {r:x[0], v:x[1], t:mil(x[1])}; }))+
      '<p style="margin:12px 0 4px"><b>Maiores emendas</b></p>'+tabela([{t:"Área", k:"funcao", fmt:function(v,x){ return esc(v)+'<small>'+esc(x.local||"")+' · '+x.ano+'</small>'; }},{t:"Pago", k:"pago", num:true, fmt:function(v,x){ return mil(v)+fi("https://portaldatransparencia.gov.br/emendas/consulta?codigoEmenda="+encodeURIComponent(x.codigo),"emenda no Portal da Transparência"); }}], e.maiores, {ord:1, limite:5}), fi(fp(p,"emendas")));
  }
  /* Viagens */
  if (p.viagens){ const v = p.viagens, u = v.ultimas[0], dest = {};
    v.ultimas.forEach(function(x){ (x.trecho||"").split(" · ").forEach(function(t){ const d = t.split("/")[1]; if (d) dest[d] = (dest[d]||0)+1; }); });
    h += quadro("aviao","c2","Viagens pagas com a cota", kpis([{r:v.ultimas.some(function(x){return x.trecho;})?"Trechos":"Passagens", v:v.n}, {r:"Em passagens", v:mil(v.total)}, u?{r:"Última", v:esc(u.trecho||u.empresa||"passagem aérea"), s:dataBR(u.data)}:null])+
      '<p style="margin:10px 0 4px"><b>Destinos mais frequentes</b></p>'+barrasH(Object.keys(dest).sort(function(a,b){return dest[b]-dest[a];}).slice(0,5).map(function(d){ return {r:AEROPORTOS[d]||d, v:dest[d], t:dest[d]+"×"}; }))+
      tabela([{t:"Trecho", k:"trecho", fmt:function(v,x){ return esc(v||"não informado pela Casa")+'<small>'+esc(x.empresa||"")+'</small>'; }},{t:"Data", k:"data", fmt:function(v){ return dataBR(v); }},{t:"Valor", k:"valor", num:true, fmt:function(v,x){ return BRL2.format(v)+(x.url?fi(x.url,"bilhete"):''); }}], v.ultimas, {limite:5}), fi(fp(p,"viagens")), "", "c-viagens");
  } else if (p.casa==="alece" && g){
    const desl = g.por_categoria.filter(function(x){ return /passag|combust|locomo|hosped|veic|aluguel de ve|transporte/i.test(semAc(x[0])); });
    if (desl.length) h += quadro("aviao","c2","Deslocamentos pagos com a verba", '<div class="r num">'+mil(desl.reduce(function(a,x){return a+x[1];},0))+'</div>'+barrasH(desl.map(function(x){ return {r:x[0], v:x[1], t:mil(x[1])}; }))+'<p class="frase">A Assembleia não publica o destino de cada viagem em dados abertos.</p>', fi(fp(p,"gastos")), "", "c-viagens");
  }
  /* Radar */
  const noRadar = ((D.radar||{}).itens||[]).filter(function(x){ return (x.autores_ce||[]).indexOf(p.id)>=0; });
  if (noRadar.length) h += quadro("radar","c1","Assina "+noRadar.length+(noRadar.length>1?" projetos":" projeto")+" do Radar do Retrocesso", '<div class="radar-mini col">'+noRadar.map(function(it){ return cardRadar(it, true); }).join("")+'</div>', '<a class="fi" href="#radar" aria-label="O que é o Radar">'+I("info")+'</a>', "q2", "c-radar");
  const naImprensa = ((D.not||{}).itens||[]).filter(function(n){ return (n.pessoas||[]).indexOf(p.id)>=0; });
  if (naImprensa.length) h += quadro("jornal","c1","Na imprensa, sobre as pautas do Radar", '<ul class="noticias">'+naImprensa.slice(0,6).map(function(n){ return linhaNoticia(n); }).join("")+'</ul>', '<a class="fi" href="#noticias" aria-label="De onde vêm as notícias">'+I("info")+'</a>', "q2", "c-imprensa");
  /* TSE */
  h += quadroVotosTSE(p.votos, fp(p,"votos")) + quadroReceitas(p.receitas, fp(p,"receitas")) + quadroBens(p.bens, fp(p,"bens"));
  h += quadroPromessas(p.promessas, "Promessas de campanha", '<a class="fi" href="#promessas" aria-label="Como funciona o Prometômetro">'+I("info")+'</a>');
  /* Contato */
  h += quadro("megafone","c1","Contato oficial", '<ul class="det" style="list-style:none;padding:0;margin:8px 0 0">'+
    (p.email?'<li><span>'+I("email")+' <a href="mailto:'+esc(p.email)+'">'+esc(p.email)+'</a></span>'+fi(fp(p,"partido"),"e-mail oficial")+'</li>':'')+
    (p.telefone?'<li><span>'+I("tel")+' <a href="tel:'+esc(p.telefone.replace(/\D/g,""))+'">'+esc(p.telefone)+'</a></span>'+fi(fp(p,"partido"),"telefone do gabinete")+'</li>':'')+
    (p.gabinete?'<li><span>'+esc(p.gabinete)+'</span></li>':'')+
    (!p.email && p.email_campanha?'<li><span>'+I("email")+' '+esc(p.email_campanha)+' <small>e-mail informado na campanha</small></span>'+fi(fp(p,"redes"),"TSE")+'</li>':'')+
    (p.link?'<li><span>'+I("link")+' <a href="'+esc(p.link)+'" target="_blank" rel="noopener">Página oficial</a></span></li>':'')+
    '<li><span>'+I("rss")+' <a href="feeds/'+esc(p.id)+'.xml">Feed de novidades (RSS)</a><small>Cole num leitor de RSS para receber avisos.</small></span></li></ul>'+redesHtml(p.redes, fp(p,"redes")), fi(fp(p,"perfil")), "", "c-contato");
  h += '</div>';
  if (!g && !vots.length && !pr && !p.votos) h += '<div class="vazio">Ainda não há dados publicados para '+esc(p.nome)+'.</div>';
  app.innerHTML = h;
  document.getElementById("bSeg").onclick = function(){ alterna(p.id); this.setAttribute("aria-pressed",segue(p.id)); this.innerHTML = I(segue(p.id)?"ok":"mais")+(segue(p.id)?"Seguindo":"Seguir"); };
  document.getElementById("bCob").onclick = function(){ abreCobrar(p); };
  document.getElementById("bSto").onclick = function(){ abreStory(p); };
  if (segue(p.id)) setTimeout(function(){ marcaVisto(p); conta(); }, 1500);
  if (pendente){ const pe = pendente; pendente = null;
    if (pe.sec){ const el = document.getElementById(pe.sec); if (el){ setTimeout(function(){ el.scrollIntoView({behavior:"smooth",block:"start"}); },60); } else toast("Ainda não há esse dado para "+p.nome+"."); }
    if (pe.abre==="cobrar") abreCobrar(p);
    if (pe.abre==="story") abreStory(p);
  }
}
const AEROPORTOS = {BSB:"Brasília", FOR:"Fortaleza", JDO:"Juazeiro do Norte", GRU:"São Paulo (Guarulhos)", CGH:"São Paulo (Congonhas)", GIG:"Rio de Janeiro", SDU:"Rio de Janeiro", REC:"Recife", SSA:"Salvador", NAT:"Natal", THE:"Teresina", SLZ:"São Luís", BEL:"Belém", CNF:"Belo Horizonte", POA:"Porto Alegre", JPA:"João Pessoa", MCZ:"Maceió", AJU:"Aracaju", MAO:"Manaus", CWB:"Curitiba", FLN:"Florianópolis", GYN:"Goiânia", VCP:"Campinas"};

/* ---------- cobrar ---------- */
function usuario(u){ const m = String(u).match(/(?:instagram\.com|twitter\.com|x\.com|tiktok\.com|threads\.net)\/@?([A-Za-z0-9_.]+)/i); return m ? m[1] : null; }
function abreCobrar(p){
  const C = CASAS[p.casa], temas = {}, vs = D.votosDe[p.id]||[], v = vs[0];
  if (p.gastos) temas.gasto = ["moeda","Gastos",p.nome+", vi no EspiaCE que seu gabinete gastou "+mil(p.gastos.total)+" da "+C.verba+" este ano"+(p.gastos.fornecedores[0]?", com "+p.gastos.fornecedores[0][0]+" como maior fornecedor":"")+". Com o quê? Por que esses fornecedores?"];
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
function salvarArquivo(blob, nome){
  const normal = function(){ const u = URL.createObjectURL(blob), a = document.createElement("a"); a.href = u; a.download = nome; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 4000); toast("Arte baixada. Agora é só postar."); };
  const c = window.claude;
  if (!c || !c.use) return normal();
  c.use("downloads").then(function(d){ if (!d) return normal(); return d.save({filename:nome, data:blob}).then(function(){ toast("Arte baixada. Agora é só postar."); }, function(){ return blob.arrayBuffer().then(function(ab){ return d.save({filename:nome, data:ab}); }).then(function(){ toast("Arte baixada."); }, function(){ toast("Download cancelado."); }); }); }, normal);
}
const FUNDOS = {luta:{bg:"#3f6f4f",fg:"#ffffff",sub:"#dce6cc",acc:"#f2d064",ink:"#1f3a2b"}, mar:{bg:"#1f3a2b",fg:"#faf7ee",sub:"#c5d6ae",acc:"#f2d064",ink:"#1f3a2b"}, luz:{bg:"#f2d064",fg:"#1f3a2b",sub:"#4a3f12",acc:"#3f6f4f",ink:"#ffffff"}, cal:{bg:"#faf7ee",fg:"#1f3a2b",sub:"#5b6a5c",acc:"#3f6f4f",ink:"#ffffff"}};
const VERBA_EXPLICA = {alece:"verba que a Assembleia paga, com dinheiro público, para as despesas do gabinete", camara:"cota parlamentar, paga com dinheiro público para as despesas do mandato", senado:"cota do Senado, paga com dinheiro público para as despesas do mandato"};
function modelos(p){
  const C = CASAS[p.casa], m = {};
  if (p.gastos){ const cat = (p.gastos.por_categoria||[])[0];
    m.gasto = {ic:"moeda",nome:"Gastos",fundo:"luta",kick:"Pra onde foi o dinheiro?",tit:"Gastou "+mil(p.gastos.total)+" de dinheiro público em "+ANO+".",
      sub:"É a "+VERBA_EXPLICA[p.casa]+"."+(cat?" O maior gasto foi com "+cat[0].toLowerCase()+" ("+mil(cat[1])+").":"")+" Pergunte: com o quê e por quê?"}; }
  if ((D.votosDe[p.id]||[]).length) m.voto = {ic:"urna",nome:"Um voto",fundo:"mar",kick:"Como votou",voto:true};
  if (p.projetos){ const n = p.projetos.length, h = p.projetos.filter(function(x){return x.homenagem;}).length;
    m.projeto = {ic:"doc",nome:"Projetos",fundo:"luz",kick:"O que propôs",tit:"Apresentou "+n+(n===1?" projeto":" projetos")+" em "+ANO+".",
      sub:(n-h)+(n-h===1?" propõe":" propõem")+" mudar alguma coisa de verdade. "+h+(h===1?" é só homenagem":" são só homenagens")+", como nome de rua ou título de cidadão. Cobre projetos que melhorem a vida do povo."}; }
  if (p.presenca) m.falta = {ic:"presenca",nome:"Presença",fundo:"mar",kick:"Presença",tit:"Foi a "+pct(p.presenca.pct)+" das sessões em "+ANO+".",
      sub:"Faltou "+p.presenca.nao_justificadas+(p.presenca.nao_justificadas===1?" vez":" vezes")+" sem justificativa. É nas sessões do plenário que as leis são discutidas e votadas."};
  if (p.receitas && p.receitas.total){ const r = p.receitas;
    m.campanha = {ic:"dinheiro",nome:"Campanha",fundo:"luz",kick:"Quem pagou a campanha",tit:pct(100*((r.grandes||0)+(r.proprios||0))/r.total)+" da campanha de "+r.ano+" veio de grandes doadores e do próprio bolso.",
      sub:"Só "+pct(100*(r.pequenas||0)/r.total)+" veio de pequenas doações de gente comum. Dados que o próprio candidato declarou ao TSE."}; }
  return m;
}
function quebra(ctx, texto, larg){ const pal = String(texto).split(" "), linhas = []; let l = ""; pal.forEach(function(w){ const t = l ? l+" "+w : w; if (ctx.measureText(t).width > larg && l){ linhas.push(l); l = w; } else l = t; }); if (l) linhas.push(l); return linhas; }
function rr(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function desenhaStory(cv, p, m, votoId, foto){
  const W = 1080, H = 1920, ctx = cv.getContext("2d"), F = FUNDOS[m.fundo], C = CASAS[p.casa];
  cv.width = W; cv.height = H; ctx.fillStyle = F.bg; ctx.fillRect(0,0,W,H);
  /* o olho que espia, no canto de cima */
  ctx.save(); ctx.translate(900,215); ctx.rotate(-0.12);
  ctx.fillStyle = m.fundo==="luz" ? "#1f3a2b" : "#f2d064"; ctx.beginPath(); ctx.arc(0,0,150,0,7); ctx.fill();
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#1f3a2b"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-122,4); ctx.quadraticCurveTo(0,-140,122,4); ctx.quadraticCurveTo(0,148,-122,4); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "#1f3a2b"; ctx.beginPath(); ctx.arc(-30,10,46,0,7); ctx.fill(); ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(-16,-6,12,0,7); ctx.fill();
  ctx.restore();
  /* marca */
  ctx.fillStyle = F.fg; ctx.font = "800 70px 'Bricolage Grotesque', sans-serif"; ctx.textBaseline = "alphabetic"; ctx.fillText("espia", 90, 200);
  const vw = ctx.measureText("espia").width, cw = ctx.measureText("CE").width; ctx.fillStyle = m.fundo==="luz" ? "#1f3a2b" : "#f2d064"; rr(ctx, 90+vw+10, 140, cw+28, 76, 16); ctx.fill();
  ctx.fillStyle = m.fundo==="luz" ? "#f2d064" : "#1f3a2b"; ctx.fillText("CE", 90+vw+24, 200);
  ctx.save(); ctx.translate(90,300); ctx.font = "800 44px 'Bricolage Grotesque', sans-serif"; const kw = ctx.measureText(m.kick).width+56;
  ctx.fillStyle = F.acc; rr(ctx,0,0,kw,78,39); ctx.fill(); ctx.fillStyle = F.ink; ctx.fillText(m.kick,28,54); ctx.restore();
  if (!m.semPessoa){
  ctx.fillStyle = cor(p); ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.fill();
  if (foto){ ctx.save(); ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.clip(); ctx.drawImage(foto,90,490,140,140); ctx.restore(); }
  else { ctx.fillStyle = "#fff"; ctx.font = "800 56px 'Bricolage Grotesque', sans-serif"; ctx.textAlign = "center"; ctx.fillText(ini(p),160,580); ctx.textAlign = "left"; }
  ctx.strokeStyle = F.acc; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(160,560,70,0,7); ctx.stroke();
  let t = 62; ctx.font = "800 "+t+"px 'Bricolage Grotesque', sans-serif"; while (ctx.measureText(p.nome).width > 760 && t > 30){ t -= 4; ctx.font = "800 "+t+"px 'Bricolage Grotesque', sans-serif"; }
  ctx.fillStyle = F.fg; ctx.fillText(p.nome, 260, 560);
  ctx.fillStyle = F.sub; ctx.font = "400 36px 'Atkinson Hyperlegible', sans-serif"; ctx.fillText(C.cargo+(p.partido?" · "+p.partido:"")+" · CE", 260, 612);
  }
  let y = m.semPessoa ? 520 : 760;
  {
    let tit = m.tit, sub = m.sub, selo = null, seloCor = F.acc;
    if (m.voto){ const vs = D.votosDe[p.id]||[], v = vs.find(function(x){return x.id===votoId;}) || vs[0], x = votoTxt(v.votos[p.id]);
      const desc = (v.descricao && v.descricao!==v.titulo) ? v.descricao.replace(/\.$/,"") : "";
      tit = "Votou "+(x==="Sim"||x==="Não" ? x.toUpperCase() : x.toLowerCase())+" no "+v.titulo+"."; sub = (desc ? "O que estava em votação: "+desc.slice(0,110)+(desc.length>110?"…":"")+". " : "")+"Plenário da "+C.nome+", "+dataBR(v.data)+". Pergunte o porquê."; selo = x.toUpperCase(); seloCor = "#f2d064"; }
    ctx.font = "400 46px 'Atkinson Hyperlegible', sans-serif"; const subL = quebra(ctx, sub, 900).slice(0,5);
    let tt = 104, ls; for (; tt >= 52; tt -= 4){ ctx.font = "800 "+tt+"px 'Bricolage Grotesque', sans-serif"; ls = quebra(ctx, tit, 900); if (tt + (ls.length-1)*tt*1.08 + 70 + (selo?150:0) + subL.length*62 <= 1580 - y && ls.length <= 6) break; }
    ctx.fillStyle = F.fg; ls.forEach(function(l,i){ ctx.fillText(l,90,y+tt+i*(tt*1.08)); }); y += tt + (ls.length-1)*tt*1.08 + 70;
    if (selo){ ctx.save(); ctx.translate(90,y); ctx.rotate(-0.04); ctx.font = "800 54px 'Bricolage Grotesque', sans-serif"; const sw = ctx.measureText(selo).width+70; ctx.strokeStyle = seloCor; ctx.lineWidth = 8; rr(ctx,0,0,sw,100,20); ctx.stroke(); ctx.fillStyle = seloCor; ctx.fillText(selo,35,70); ctx.restore(); y += 150; }
    ctx.fillStyle = F.sub; ctx.font = "400 46px 'Atkinson Hyperlegible', sans-serif"; subL.forEach(function(l,i){ ctx.fillText(l,90,y+46+i*62); });
  }
  ctx.fillStyle = F.acc; ctx.fillRect(90,1630,120,8);
  ctx.fillStyle = F.fg; ctx.font = "800 46px 'Bricolage Grotesque', sans-serif"; ctx.fillText("Espia, compartilha e cobra.", 90, 1720);
  ctx.fillStyle = F.sub; ctx.font = "400 32px 'Atkinson Hyperlegible', sans-serif"; ctx.fillText(location.host+" · dados oficiais", 90, 1772);
  const fonte = m.campanha ? "Fonte: TSE, prestação de contas" : p.casa==="alece" ? "Fonte: Assembleia Legislativa do Ceará" : p.casa==="camara" ? "Fonte: dados abertos da Câmara" : "Fonte: dados abertos do Senado";
  ctx.fillText(fonte+" · "+((D.meta.atualizado||"").slice(0,10).split("-").reverse().join("/")), 90, 1830);
}
function abreStory(p, inicial){
  const M = modelos(p), chaves = Object.keys(M);
  if (!chaves.length){ toast("Ainda não há dados para criar uma arte sobre "+p.nome+"."); return; }
  let atual = (inicial && M[inicial]) ? inicial : chaves[0], votoId = ((D.votosDe[p.id]||[])[0]||{}).id, foto = null;
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
  const nome = function(){ return "espiace-"+semAc(p.nome).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+atual+".jpg"; };
  document.getElementById("sBaixar").onclick = function(){ cv.toBlob(function(b){ salvarArquivo(b, nome()); }, "image/jpeg", .92); };
  const bp = document.getElementById("sPart");
  try { if (navigator.canShare && navigator.canShare({files:[new File([new Blob(["x"])], "t.jpg", {type:"image/jpeg"})]})) bp.hidden = false; } catch(e){}
  bp.onclick = function(){ cv.toBlob(function(b){ navigator.share({files:[new File([b], nome(), {type:"image/jpeg"})], title:"EspiaCE"}).catch(function(){}); }, "image/jpeg", .92); };
}

/* ---------- Radar do Retrocesso: ficar de olho e cobrar ---------- */
let segProj = store.get("segProj", []);
function itemRadar(id){ return ((D.radar||{}).itens||[]).find(function(x){ return x.id===id; }); }
function nomeTema(t){ return ((D.radar||{}).temas||{})[t] || t; }
function trilha(it){ const E = it.casa==="alece" ? ["Apresentado","Nas comissões","No plenário","Aprovado","Virou lei"] : ((D.radar||{}).etapas||["Apresentado","Nas comissões","No plenário","Aprovado na Câmara","Virou lei"]);
  return '<ol class="trilha" aria-label="Etapa: '+esc(it.etapa_txt)+'">'+E.map(function(e,i){ const n = i+1; return '<li class="'+(n<it.etapa?"feito":n===it.etapa?"agora":"")+'"><i></i><span>'+esc(e)+'</span></li>'; }).join("")+'</ol>'; }
function cardRadar(it, curto){
  const ce = (it.autores_ce||[]).map(function(id){ return D.porId[id]; }).filter(Boolean);
  const vot = (it.votacoes||[]).map(function(id){ return D.votacoes.find(function(v){ return v.id===id; }); }).filter(Boolean)[0];
  const seg = segProj.indexOf(it.id)>=0;
  return '<article class="cartao radar-card'+(it.etapa>=3?" quente":"")+'">'+
    '<div class="rc-topo">'+(it.temas||[]).map(function(t){ return '<span class="tag-r">'+esc(nomeTema(t))+'</span>'; }).join("")+'<span class="rc-casa">'+(it.casa==="alece"?"Assembleia":"Câmara")+'</span></div>'+
    '<h3>'+esc(it.tipo+" "+it.numero)+fi(it.url,"projeto na página oficial")+'</h3><p class="rc-em">'+esc(it.ementa)+'</p>'+trilha(it)+
    '<p class="rc-mov">'+I("sino")+'<span><b>'+esc(it.etapa_txt)+'</b>'+(it.ultimo_mov?' · última movimentação em '+dataBR(it.ultimo_mov):'')+(it.ultimo_txt&&!curto?'<small>'+esc(it.ultimo_txt.slice(0,160))+'</small>':'')+'</span></p>'+
    (!curto && it.autores && it.autores.length ? '<p class="rc-aut"><b>Autoria:</b> '+esc(it.autores.slice(0,4).join(", "))+(it.autores.length>4?' e outros':'')+'</p>' : '')+
    (ce.length ? '<p class="rc-ce">'+I("alerta")+'<span>Assinado por quem o Ceará elegeu: '+ce.map(function(p){ return '<a href="#p-'+esc(p.id)+'">'+esc(p.nome)+'</a>'; }).join(", ")+'</span></p>' : '')+
    (vot ? '<p class="rc-vot">Como a bancada do Ceará votou: '+segMini(resumoVotacao(vot).s, resumoVotacao(vot).n)+fi(vot.url,"votação")+'</p>' : '')+
    (function(){ const ns = ((D.not||{}).itens||[]).filter(function(n){ return (n.radar||[]).indexOf(it.id)>=0; }); return ns.length ? '<p class="rc-not">'+I("jornal")+'<span>Saiu na imprensa: '+ns.slice(0,2).map(function(n){ return '<a href="'+esc(n.link)+'" target="_blank" rel="noopener">'+esc(n.fonte)+'</a>'; }).join(", ")+(ns.length>2?' e mais '+(ns.length-2):'')+'</span></p>' : ''; })()+
    '<div class="rc-acoes"><button type="button" class="btn cheio" data-cobra-proj="'+esc(it.id)+'">'+I("megafone")+'Cobrar</button><button type="button" class="btn" data-seg-proj="'+esc(it.id)+'" aria-pressed="'+seg+'">'+I(seg?"ok":"olho")+(seg?"Espiando":"Espiar")+'</button><button type="button" class="btn escuro" data-story-proj="'+esc(it.id)+'" aria-label="Arte pro story">'+I("story")+'</button></div></article>'; }
document.addEventListener("click", function(e){
  const c = e.target.closest && e.target.closest("[data-cobra-proj]"); if (c){ abreCobrarProjeto(itemRadar(c.getAttribute("data-cobra-proj"))); return; }
  const s = e.target.closest && e.target.closest("[data-seg-proj]");
  if (s){ const id = s.getAttribute("data-seg-proj"), it = itemRadar(id); segProj = segProj.indexOf(id)>=0 ? segProj.filter(function(x){return x!==id;}) : segProj.concat([id]); store.set("segProj", segProj);
    const on = segProj.indexOf(id)>=0; document.querySelectorAll('[data-seg-proj="'+id+'"]').forEach(function(b){ b.setAttribute("aria-pressed", on); b.innerHTML = I(on?"ok":"olho")+(on?"Espiando":"Espiar"); });
    toast(on ? "Pronto: "+it.tipo+" "+it.numero+" está na sua lista. Veja em Seguindo." : "Você parou de espiar esse projeto."); return; }
  const st = e.target.closest && e.target.closest("[data-story-proj]"); if (st) abreStoryProjeto(itemRadar(st.getAttribute("data-story-proj")));
});
function radarPag(filtro){
  topo(false);
  const R = D.radar || {}, T = R.temas || {}, todos = R.itens || [];
  const L = filtro ? todos.filter(function(x){ return (x.temas||[]).indexOf(filtro)>=0; }) : todos;
  const cont = {}; todos.forEach(function(x){ (x.temas||[]).forEach(function(t){ cont[t] = (cont[t]||0)+1; }); });
  app.innerHTML = '<div class="radar-topo"><span class="radar-ic">'+I("radar")+'</span><div><h1>'+esc(R.titulo||"Radar do Retrocesso")+'</h1><p class="sub">Projetos dessa agenda que se mexeram nos últimos '+(R.dias||90)+' dias. Espia, compartilha e cobra quem te representa antes da votação.</p></div></div>'+
  kpis([{ic:"radar", r:"Projetos andando", v:todos.length, s:"na Câmara e na Assembleia"}, {ic:"alerta", r:"Já no plenário ou além", v:todos.filter(function(x){return x.etapa>=3;}).length, s:"perto de virar lei", tom:"alerta"},
        {ic:"vazio", r:"Com assinatura de cearense", v:todos.filter(function(x){return (x.autores_ce||[]).length;}).length, s:"deputados do Ceará entre os autores"}, {ic:"olho", r:"Você está espiando", v:segProj.filter(itemRadar).length, s:"projetos na sua lista", href:"seguindo"}])+
  '<div class="filtros rola" role="group" aria-label="Filtrar por tema"><a class="chipbtn" href="#radar" aria-pressed="'+(!filtro)+'">Todos <small>'+todos.length+'</small></a>'+Object.keys(T).filter(function(t){return cont[t];}).sort(function(a,b){return cont[b]-cont[a];}).map(function(t){ return '<a class="chipbtn" href="#radar-'+t+'" aria-pressed="'+(filtro===t)+'">'+esc(T[t])+' <small>'+cont[t]+'</small></a>'; }).join("")+'</div>'+
  (L.length ? '<div class="radar-grade">'+L.map(function(it){ return cardRadar(it); }).join("")+'</div>' : '<div class="vazio" style="margin-top:14px">Nenhum projeto desse tema se mexeu nos últimos '+(R.dias||90)+' dias.</div>')+
  '<div class="quadros">'+quadro("info","c2","Como o Radar escolhe", '<p class="frase">O robô procura, nos projetos que tiveram movimentação recente, palavras ligadas à agenda da extrema-direita: armas, ataque ao aborto legal, escola sem partido, anistia a golpistas, ataque a direitos LGBT, criminalização de movimentos sociais, retirada de direitos do trabalho, ataque ao meio ambiente e privatização.</p><p class="frase">É uma escolha editorial nossa, feita às claras. Se um projeto entrar por engano, ele sai da lista; os temas e as palavras ficam no arquivo público <code>config/radar.json</code>.</p>'+
    '<details><summary>Ver as palavras de cada tema</summary><ul class="det" style="list-style:none;padding:0">'+Object.keys(T).map(function(t){ return '<li><span><b>'+esc(T[t])+'</b><small>'+esc(((R.palavras||{})[t]||[]).join(", "))+'</small></span></li>'; }).join("")+'</ul></details>', fi((R.fontes||{}).camara), "q2")+'</div>';
}
function bancada(casa){ return D.pessoas.filter(function(p){ return p.casa===casa && !p.fora_exercicio; }).sort(function(a,b){ return a.nome.localeCompare(b.nome); }); }
function andamento(it){ if (it.casa==="alece") return "está andando na Assembleia"; return ["","acabou de ser apresentado na Câmara","está andando nas comissões da Câmara","está pronto para votação no plenário da Câmara","foi aprovado na Câmara e seguiu para o Senado","já virou lei"][it.etapa] || "está andando na Câmara"; }
function abreCobrarProjeto(it){
  if (!it) return;
  const L = bancada(it.casa), casaN = it.casa==="alece" ? "Assembleia" : "Câmara";
  let alvo = "todos";
  abreFolha("Cobrar sobre o "+esc(it.tipo+" "+it.numero), '<p class="sub" style="margin:0 0 10px">'+esc(it.ementa.slice(0,180))+(it.ementa.length>180?"…":"")+'</p>'+
    '<label class="rot" for="cpAlvo">Quem você vai cobrar?</label><select class="campo" id="cpAlvo"><option value="todos">Toda a bancada do Ceará na '+casaN+' ('+L.length+')</option>'+L.map(function(p){ return '<option value="'+esc(p.id)+'">'+esc(p.nome)+(p.partido?' ('+esc(p.partido)+')':'')+'</option>'; }).join("")+'</select>'+
    '<textarea id="cpTxt" aria-label="Mensagem"></textarea><div class="acoes"><button class="btn cheio" id="cpCopiar">'+I("copiar")+'Copiar</button><a class="btn" id="cpMail" href="#">'+I("email")+'E-mail</a><a class="btn" id="cpZap" href="#" target="_blank" rel="noopener">'+I("partilhar")+'Mandar no WhatsApp</a><button class="btn escuro" id="cpSto">'+I("story")+'Virar story</button></div><div id="cpRedes"></div>');
  const sel = document.getElementById("cpAlvo"), txt = document.getElementById("cpTxt"), mail = document.getElementById("cpMail"), zap = document.getElementById("cpZap");
  function texto(){ const p = D.porId[alvo]; const quem = p ? p.nome : (it.casa==="alece" ? "Deputadas e deputados estaduais do Ceará" : "Deputadas e deputados federais do Ceará");
    return quem+", o "+it.tipo+" "+it.numero+" ("+it.ementa.replace(/\.$/,"").slice(0,160)+") "+andamento(it)+". Esse projeto ameaça direitos do povo. "+(p?"Como você vai votar?":"Como vocês vão votar?")+" Estou espiando e vou cobrar.\n\n[seu nome], de [sua cidade]"; }
  function liga(){ const p = D.porId[alvo], emails = p ? [p.email].filter(Boolean) : L.map(function(x){return x.email;}).filter(Boolean);
    mail.href = "mailto:"+(p?encodeURIComponent(emails[0]||""):"")+"?"+(p?"":"bcc="+encodeURIComponent(emails.join(","))+"&")+"subject="+encodeURIComponent("Sobre o "+it.tipo+" "+it.numero)+"&body="+encodeURIComponent(txt.value);
    zap.href = "https://wa.me/?text="+encodeURIComponent(txt.value+"\n\nEspia: "+location.href.split("#")[0]+"#radar");
    document.getElementById("cpRedes").innerHTML = p && p.redes && p.redes.length ? '<h3 style="margin:16px 0 6px">Cobre nas redes de '+esc(p.nome)+fi(fp(p,"redes"),"redes sociais declaradas")+'</h3><div class="redes">'+p.redes.map(function(u){ const us = usuario(u); return '<a class="rchip grande" data-r href="'+esc(u)+'" target="_blank" rel="noopener">'+I("rede")+rede(u)+(us?' <small>@'+esc(us)+'</small>':'')+'</a>'; }).join("")+'</div>' :
      '<p class="sub" style="font-size:14px;margin-top:12px">Escolha uma pessoa na lista para ver as redes sociais dela. O e-mail para a bancada vai com todos em cópia oculta.</p>'; }
  function copia(){ if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt.value).then(function(){ toast("Mensagem copiada! Cole no comentário ou na mensagem."); }, function(){ txt.select(); }); else txt.select(); }
  sel.onchange = function(){ alvo = sel.value; txt.value = texto(); liga(); };
  txt.oninput = liga; txt.value = texto(); liga();
  document.getElementById("cpCopiar").onclick = copia;
  document.getElementById("cpRedes").onclick = function(e){ if (e.target.closest("[data-r]")) copia(); };
  document.getElementById("cpSto").onclick = function(){ abreStoryProjeto(it); };
}
function abreStoryProjeto(it){
  if (!it) return;
  const pseudo = {id:it.id, nome:"Radar", casa:it.casa==="alece"?"alece":"camara"};
  const m = {ic:"radar", nome:"Radar", fundo:"luta", kick:"Fica de olho", semPessoa:true, tit:it.tipo+" "+it.numero+" "+andamento(it).replace(/^está /,"")+".", sub:"O que propõe: "+it.ementa.replace(/\.$/,"").slice(0,140)+(it.ementa.length>140?"…":"")+". Cobre a bancada do Ceará antes da votação."};
  abreFolha("Arte pro story", '<div class="previa"><img id="sImg" alt="Prévia da arte para story"></div><div class="acoes"><button class="btn cheio" id="sBaixar">'+I("baixar")+'Baixar JPG</button></div><p class="sub" style="font-size:14px;text-align:center">1080 × 1920, tamanho do story.</p>');
  const cv = document.createElement("canvas"), img = document.getElementById("sImg");
  const render = function(){ desenhaStory(cv, pseudo, m, null, null); img.src = cv.toDataURL("image/jpeg", .9); };
  render(); if (document.fonts && document.fonts.load) Promise.all([document.fonts.load("800 64px 'Bricolage Grotesque'"), document.fonts.load("400 40px 'Atkinson Hyperlegible'")]).then(render, function(){});
  document.getElementById("sBaixar").onclick = function(){ cv.toBlob(function(b){ salvarArquivo(b, "espiace-radar-"+it.id+".jpg"); }, "image/jpeg", .92); };
}

/* ---------- Governo ---------- */
function governoPag(){
  topo(false);
  const G = D.gov || {}, g = G.governador, e = G.eleito2026, anos = Object.keys(G.orcamento||{}).sort().reverse(), F = (D.ele||{}).fontes||{};
  const o = anos.length ? G.orcamento[anos[0]] : null, o2 = anos[1] ? G.orcamento[anos[1]] : null;
  const prom = g && g.plano ? (G.promessas_manuais||[]).concat((g.plano.promessas||[]).filter(function(x){ return !(G.promessas_manuais||[]).some(function(m){ return m.promessa===x.texto; }); }).map(function(x){ return {promessa:x.texto, status:"aguardando"}; })) : [];
  let h = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><div class="casa-topo"><span class="ic c3">'+I("gov")+'</span><div><h1>Governo do Ceará</h1><div class="sub">Governador, orçamento e o que o Executivo manda para a Assembleia</div></div></div>';
  if (g){ const p = {id:g.id, nome:g.nome, foto:g.foto_tse};
    h += '<div class="perfil-topo"><div class="perfil">'+av(p,true)+'<div><span class="chip verm">'+I("gov")+'Governador(a) · mandato 2023–2026</span>'+fi((G.fontes||{}).governador)+'<h1 style="margin-top:6px">'+esc(g.nome)+'</h1><div class="meta">'+esc(g.partido)+(g.vice?' · vice: '+esc(g.vice):'')+'</div>'+redesHtml(g.redes, (F["2022"]||{}).candidatos)+'</div></div>'+
      (e ? '<a class="ev eleito" href="#e-'+esc(e.id)+'">'+av({id:e.id,nome:e.nome,foto:e.foto_tse})+'<span><b>Eleito(a) em 2026: '+esc(e.nome)+'</b> ('+esc(e.partido)+')<small>Posse em 1º de janeiro de 2027'+(e.votos?' · '+NUM.format(e.votos.total)+' votos':'')+'</small></span></a>' : '')+'</div>';
  } else h += '<div class="info">'+I("info")+'<span>Os dados do governador vêm do TSE e aparecem depois da primeira coleta completa.</span></div>';
  h += kpis([o ? {ic:"moeda", r:"Gasto do estado em "+o.ano, v:mil(o.total), s:"até o "+o.bimestre+"º bimestre", f:o.fonte} : null,
             o ? {ic:"casa", r:"Em serviços públicos", v:pct(o.pct_servicos), s:o2?"em "+o2.ano+": "+pct(o2.pct_servicos):"", tom:o.pct_servicos>=50?"bom":"", f:o.fonte} : null,
             G.mensagens ? {ic:"doc", r:"Projetos enviados à ALECE", v:(G.mensagens_resumo||{}).total||0, s:(((G.mensagens_resumo||{}).por_tema||[])[0]?"mais sobre "+(NOMES_TEMA[G.mensagens_resumo.por_tema[0][0]]||G.mensagens_resumo.por_tema[0][0]).toLowerCase():""), f:(G.fontes||{}).mensagens} : null,
             prom.length ? {ic:"promessa", r:"Promessas cumpridas", v:prom.filter(function(x){return x.status==="cumprida";}).length+" de "+prom.length, s:prom.filter(function(x){return x.status==="andamento";}).length+" em andamento", href:"promessas"} : null]);
  h += '<div class="quadros">';
  if (o){ const serv = o.funcoes.filter(function(f){return f[3];}).reduce(function(a,f){return a+f[1];},0), div = (o.funcoes.find(function(f){return f[0]==="Encargos Especiais";})||[0,0])[1];
    h += quadro("moeda","c1","Para onde vai o dinheiro do estado ("+o.ano+")", segmentada([{r:"Serviços públicos (saúde, educação, assistência…)", v:serv, k:1},{r:"Dívida e encargos", v:div, k:2},{r:"Segurança, administração e outros", v:o.total-serv-div, k:0}], {fmt:mil})+
      barrasH(o.funcoes.slice(0,14).map(function(f){ return {r:f[0], v:f[1], t:mil(f[1]), tom:f[3]?"bom":"", s:f[2]?"orçado: "+mil(f[2]):"", d:f[0]+": "+mil(f[1])+" gastos"+(f[2]?" de "+mil(f[2])+" orçados":"")}; }))+
      '<p class="fonte">Verde: serviço público direto. “Encargos especiais” é, na maior parte, pagamento de dívida. <a href="'+esc(o.dados)+'" target="_blank" rel="noopener">Baixar os dados</a> · <a href="'+esc(((G.fontes||{}).portal||{}).u||"#")+'" target="_blank" rel="noopener">Ceará Transparente</a></p>', fi(o.fonte), "q2", "c-orcamento");
    if (o2){ const nomes = o.funcoes.filter(function(f){return f[3];}).slice(0,7).map(function(f){return f[0];});
      const val = function(oo, n){ const f = oo.funcoes.find(function(x){return x[0]===n;}); return f ? f[1]/oo.total*100 : 0; };
      h += quadro("comparar","c4","Serviços: "+o2.ano+" × "+o.ano+" (% do gasto)", barrasPar(nomes, nomes.map(function(n){ return Math.round(val(o2,n)*10)/10; }), nomes.map(function(n){ return Math.round(val(o,n)*10)/10; }), o2.ano, o.ano)+'<p class="fonte">'+o.ano+' ainda não terminou: compara a fatia de cada área no total gasto.</p>', fi(o2.fonte));
    }
  }
  if (G.mensagens && G.mensagens.length) h += quadro("doc","c2","Projetos que o governo mandou à Assembleia em "+ANO, barrasH(((G.mensagens_resumo||{}).por_tema||[]).slice(0,6).map(function(x){ return {r:NOMES_TEMA[x[0]]||(x[0]==="outros"?"Outros assuntos":x[0]), v:x[1], t:x[1]}; }))+
    tabela([{t:"Projeto", k:"ementa", fmt:function(v,x){ return '<b>'+esc(x.tipo+" "+x.numero)+'</b> '+lado(x.lado)+'<small>'+esc(v)+'</small>'; }},{t:"Data", k:"data", fmt:function(v){ return dataBR(v); }},{t:"", k:"url", semOrd:true, fmt:function(v){ return fi(v,"texto do projeto"); }}], G.mensagens, {limite:6}), fi((G.fontes||{}).mensagens), "q2");
  if (prom.length) h += quadroPromessas(prom, "Prometômetro: plano de governo "+g.plano.ano, fi(g.plano.fonte), "q2")+'';
  if (g) h += quadroVotosTSE(g.votos, (F["2022"]||{}).resultados) + quadroReceitas(g.receitas, (F["2022"]||{}).contas) + quadroBens(g.bens, (F["2022"]||{}).candidatos);
  if (e && e.plano) h += quadroPromessas((e.plano.promessas||[]).slice(0,20).map(function(x){ return {promessa:x.texto, status:"aguardando"}; }), "O que "+esc(e.nome)+" promete para 2027–2030", fi(e.plano.fonte), "q2");
  if (e && e.votos && e.votos.municipios) h += quadroVotosTSE(e.votos, (F["2026"]||{}).resultados);
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
  const g = function(p){ return p.gastos ? mil(p.gastos.total) : '—'; };
  const pre = function(p){ const x = p.presenca ? p.presenca.pct : participacao(p); return x==null ? '—' : pct(x); };
  const pj = function(p){ return p.projetos ? p.projetos.filter(function(x){return !x.homenagem;}).length+' de verdade / '+p.projetos.length : '—'; };
  const vt = function(p){ return p.votos ? NUM.format(p.votos.total)+' ('+p.votos.ano+')' : '—'; };
  const bn = function(p){ return p.bens ? mil(p.bens.total) : '—'; };
  const em = function(p){ return p.emendas ? pct(p.emendas.pct_servicos)+' em serviços' : '—'; };
  const comuns = D.votacoes.filter(function(v){ return v.votos[a] && v.votos[b]; }), dif = comuns.filter(function(v){ return votoTxt(v.votos[a])!==votoTxt(v.votos[b]); });
  app.innerHTML = '<a class="voltar" href="#p-'+esc(a)+'">'+I("volta")+esc(A.nome)+'</a><h1>Comparar</h1><div class="quadros">'+
  quadro("comparar","c4","Lado a lado", '<div class="tbw"><table class="tb comp"><thead><tr><th></th><th><a href="#p-'+esc(a)+'">'+av(A)+esc(A.nome)+'</a></th><th><a href="#p-'+esc(b)+'">'+av(B)+esc(B.nome)+'</a></th></tr></thead><tbody>'+
    linha("Casa", CASAS[A.casa].nome, CASAS[B.casa].nome, fp(A,"perfil"), fp(B,"perfil"))+linha("Partido", esc(A.partido||"—"), esc(B.partido||"—"), fp(A,"partido"), fp(B,"partido"))+
    linha("Gastos em "+ANO, g(A), g(B), fp(A,"gastos"), fp(B,"gastos"))+linha("Presença", pre(A), pre(B), fp(A,"presenca"), fp(B,"presenca"))+
    linha("Projetos", pj(A), pj(B), fp(A,"projetos"), fp(B,"projetos"))+linha("Emendas", em(A), em(B), fp(A,"emendas"), fp(B,"emendas"))+linha("Votos na eleição", vt(A), vt(B), fp(A,"votos"), fp(B,"votos"))+linha("Bens declarados", bn(A), bn(B), fp(A,"bens"), fp(B,"bens"))+
    '</tbody></table></div>', '', "")+
  (comuns.length ? quadro("urna","c4","Votaram diferente em "+dif.length+" de "+comuns.length+" votações", tabela([{t:"Votação", k:"titulo", fmt:function(v,l){ return esc(v)+' '+lado(l.lado)+'<small>'+dataBR(l.data)+'</small>'; }},
      {t:A.nome.split(" ")[0], k:"_a", ordv:function(l){ return votoTxt(l.votos[a]); }, fmt:function(v,l){ return '<span class="voto aus">'+votoTxt(l.votos[a])+'</span>'; }},
      {t:B.nome.split(" ")[0], k:"_b", ordv:function(l){ return votoTxt(l.votos[b]); }, fmt:function(v,l){ return '<span class="voto aus">'+votoTxt(l.votos[b])+'</span>'; }},
      {t:"", k:"url", semOrd:true, fmt:function(v){ return fi(v,"votação"); }}], dif, {limite:8}), '', "qt") : '')+
  (A.votos && B.votos ? quadro("mapa","c2","Onde "+esc(A.nome)+" foi votado(a)", mapaCE(votosMap(A.votos), {colValor:"Votos", legenda:"votos por cidade"}), fp(A,"votos")?fi(fp(A,"votos")):'')+quadro("mapa","c2","Onde "+esc(B.nome)+" foi votado(a)", mapaCE(votosMap(B.votos), {colValor:"Votos", legenda:"votos por cidade"}), fp(B,"votos")?fi(fp(B,"votos")):'') : '')+
  '</div><div class="acoes"><button class="btn" id="cTroca">'+I("comparar")+'Trocar o segundo</button></div>';
  document.getElementById("cTroca").onclick = function(){ escolher("comparar", function(id){ location.hash = "comparar-"+a+"-"+id; }); };
}

/* ---------- listas gerais ---------- */
function gastosTodos(){
  topo(false);
  const L = D.pessoas.filter(function(p){ return p.gastos; });
  const cats = {}; L.forEach(function(p){ p.gastos.por_categoria.forEach(function(x){ const k = x[0].replace(/\s*-\s*sigepa/i,"").replace(/^Passagens? a[ée]reas?.*$/i,"Passagens aéreas"); cats[k] = (cats[k]||0)+x[1]; }); });
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Gastos</h1><p class="sub">Verba de gabinete e cota parlamentar em '+ANO+'.</p>'+
  kpis(["alece","camara","senado"].map(function(c){ const X = L.filter(function(p){return p.casa===c;}); return {ic:CASAS[c].ic, r:CASAS[c].longo, v:mil(gastoTotal(X)), s:X.length?"média de "+mil(gastoTotal(X)/X.length)+" por pessoa":"", href:c}; }))+
  '<div class="quadros">'+quadro("moeda","c1","Todos, do maior para o menor", tabela([{t:"Nome", k:"nome", fmt:function(v,p){ return '<a class="tb-p" href="#p-'+esc(p.id)+'">'+av(p)+'<span>'+esc(v)+'<small>'+CASAS[p.casa].nome+'</small></span></a>'; }},
      {t:"Gasto", k:"_g", num:true, ordv:function(p){ return p.gastos.total; }, fmt:function(v,p){ return mil(p.gastos.total)+fi(fp(p,"gastos")); }},
      {t:"Por mês", k:"_m", num:true, ordv:function(p){ return p.gastos.total/Math.max(1,p.gastos.meses.length); }, fmt:function(v,p){ return mil(p.gastos.total/Math.max(1,p.gastos.meses.length)); }},
      {t:"Maior fornecedor", k:"_f", num:true, ordv:function(p){ return p.gastos.maior_fornecedor_pct; }, fmt:function(v,p){ return pct(p.gastos.maior_fornecedor_pct); }}], L, {ord:1, limite:15}), '', "q2")+
  quadro("moeda","c1","Com o que mais se gasta", barrasH(Object.keys(cats).sort(function(a,b){return cats[b]-cats[a];}).slice(0,10).map(function(k){ return {r:k, v:cats[k], t:mil(cats[k])}; })), '')+'</div>';
}
function viagensTodas(){
  topo(false);
  const L = D.pessoas.filter(function(p){ return p.viagens && p.viagens.ultimas.length; }).map(function(p){ return {p:p, v:p.viagens.ultimas[0], n:p.viagens.n, t:p.viagens.total}; });
  const dest = {}; L.forEach(function(o){ o.p.viagens.ultimas.forEach(function(x){ (x.trecho||"").split(" · ").forEach(function(t){ const d = t.split("/")[1]; if (d) dest[d] = (dest[d]||0)+1; }); }); });
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Viagens</h1><p class="sub">Passagens pagas com dinheiro público. Mostra por onde andam os deputados federais e senadores.</p>'+
  kpis([{ic:"aviao", r:"Trechos em "+ANO, v:NUM.format(L.reduce(function(a,o){return a+o.n;},0))}, {ic:"moeda", r:"Gasto em passagens", v:mil(L.reduce(function(a,o){return a+o.t;},0))}])+
  '<div class="quadros">'+quadro("aviao","c2","Última viagem de cada um", L.length ? tabela([{t:"Nome", k:"_n", ordv:function(o){ return o.p.nome; }, fmt:function(v,o){ return '<a class="tb-p" href="#p-'+esc(o.p.id)+'">'+av(o.p)+'<span>'+esc(o.p.nome)+'<small>'+CASAS[o.p.casa].nome+'</small></span></a>'; }},
      {t:"Última", k:"_u", ordv:function(o){ return o.v.data; }, fmt:function(v,o){ return esc(o.v.trecho||o.v.empresa||"passagem aérea")+'<small>'+dataBR(o.v.data)+'</small>'; }},
      {t:"Trechos", k:"n", num:true}, {t:"Total", k:"t", num:true, fmt:function(v,o){ return mil(v)+fi(fp(o.p,"viagens")); }}], L, {ord:1, dir:-1, limite:15}) : '<p class="frase">Ainda sem viagens nos dados.</p>', '', "q2")+
  quadro("mapa","c2","Destinos mais frequentes", barrasH(Object.keys(dest).sort(function(a,b){return dest[b]-dest[a];}).slice(0,8).map(function(d){ return {r:AEROPORTOS[d]||d, v:dest[d], t:dest[d]+"×"}; })), '')+'</div>'+
  '<div class="info">'+I("info")+'<span>A Assembleia Legislativa não publica o destino das viagens de cada deputado estadual em dados abertos. No perfil deles mostramos quanto da verba foi para deslocamento.</span></div>';
}
function promessasPag(){
  topo(false);
  const G = D.gov || {}, com = D.pessoas.filter(function(p){ return p.promessas && p.promessas.length; });
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Prometômetro</h1><p class="sub">O que prometeram e o que fizeram. Cada promessa tem o link de onde foi feita; cada situação tem o link da prova.</p>'+
  '<div class="quadros">'+(G.governador&&G.governador.plano ? quadro("gov","c3","Governador: "+esc(G.governador.nome), '<p class="frase">'+(G.governador.plano.promessas||[]).length+' compromissos tirados do plano de governo registrado no TSE.</p><a class="ver-mais" href="#governo">Ver o Prometômetro do governo</a>', fi(G.governador.plano.fonte)) : '')+
  (G.eleito2026&&G.eleito2026.plano ? quadro("urnaN","c1","Eleito(a) em 2026: "+esc(G.eleito2026.nome), '<p class="frase">'+(G.eleito2026.plano.promessas||[]).length+' compromissos para 2027–2030.</p><a class="ver-mais" href="#governo">Ver as promessas</a>', fi(G.eleito2026.plano.fonte)) : '')+
  com.map(function(p){ return quadroPromessas(p.promessas, '<a href="#p-'+esc(p.id)+'">'+esc(p.nome)+'</a>', '', "q2"); }).join("")+'</div>'+
  '<div class="info">'+I("info")+'<span>O TSE só guarda plano de governo de candidato a governador. As promessas de deputados e senadores são registradas à mão a partir de vídeos, posts e entrevistas, sempre com link, no arquivo público <code>config/promessas.json</code>.</span></div>';
}
function eleitosPag(){
  topo(false);
  const E = (D.ele||{}).eleitos2026 || [], F = ((D.ele||{}).fontes||{})["2026"]||{};
  const grupo = function(c, tit){ const L = E.filter(function(e){return e.casa===c;}); if (!L.length) return ''; const novos = L.filter(function(e){return !e.atual;}).length;
    return quadro(c==="governo"?"gov":CASAS[c].ic, c==="governo"?"c3":CASAS[c].cor, tit+' · '+L.length, (L.length>2?segmentada([{r:"Reeleitos", v:L.length-novos, k:3},{r:"Novos", v:novos, k:4}]):'')+'<div class="lista">'+L.map(function(e){ const a = e.atual && D.porId[e.atual]; return '<a class="linha-dep" href="'+(c==="governo"?"#governo":a?'#p-'+esc(a.id):'#e-'+esc(e.id))+'">'+av({id:e.id,nome:e.nome,foto:e.foto_tse||(a&&fotoDe(a))})+'<div><div class="nome">'+esc(e.nome)+'</div><div class="meta">'+esc(e.partido)+((e.votos||{}).total?' · '+NUM.format(e.votos.total)+' votos':'')+'</div></div><div class="dir">'+(a?'<span class="chip">reeleito(a)</span>':'<span class="chip sol">novo</span>')+'</div></a>'; }).join("")+'</div>', fi(F.candidatos,"TSE · candidatos 2026")); };
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Eleitos em 2026</h1><p class="sub">Quem assume em 2027. Comece a espiar desde já.'+fi(F.candidatos,"TSE · candidatos 2026")+'</p>'+
  (E.length ? '<div class="quadros">'+grupo("governo","Governo")+grupo("senado","Senado")+grupo("camara","Câmara (58ª legislatura)")+grupo("alece","Assembleia (32ª legislatura)")+'</div>' : '<div class="vazio" style="margin-top:14px">O resultado de 2026 ainda não está nos dados abertos do TSE. O robô confere toda semana.</div>');
}
/* ---------- cidades: indicadores do IBGE, áreas prioritárias ---------- */
function dadosCidade(c){ const M = (D.mun||{}).municipios||{}; const k = Object.keys(M).find(function(n){ return chaveMun(n)===chaveMun(c); }); return k ? M[k] : null; }
function fmtInd(k, v){ if (v==null) return "—"; if (k.indexOf("idhm")===0) return String(v.toFixed(3)).replace(".",","); if (k==="pib_pc") return BRL.format(v); if (k==="renda_pc") return BRL.format(v); if (k==="pind" || k==="agua_esgoto") return pct(v); if (k==="pop") return NUM.format(Math.round(v)); if (k==="mort_inf") return String(v.toFixed(1)).replace(".",","); if (k==="escolar") return pct(v); if (k==="salario") return String(v.toFixed(1)).replace(".",",")+" sal. mín."; return NUM.format(v); }
function valoresInd(k){ const M = (D.mun||{}).municipios||{}, o = {}; Object.keys(M).forEach(function(n){ if (M[n][k]!=null) o[n] = M[n][k]; }); return o; }
function mediana(arr){ const a = arr.filter(function(x){return x!=null;}).sort(function(x,y){return x-y;}); return a.length ? a[Math.floor(a.length/2)] : null; }
function linkIBGE(c){ return "https://cidades.ibge.gov.br/brasil/ce/"+semAc(c).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"/panorama"; }
const MAPAS_CIDADE = {emendas:["Emendas pagas", function(){ return somaEmendasCidade(); }, mil, "R$ pagos desde 2023"], idhm:["IDHM", function(){ return valoresInd("idhm"); }, function(v){ return fmtInd("idhm",v); }, "IDHM: mais escuro, mais desenvolvido"],
  prioridade:["Prioridade", function(){ return valoresInd("prioridade"); }, function(v){ return String(Math.round(v)); }, "Prioridade: mais escuro, mais precisa de atenção"], mort_inf:["Mortalidade infantil", function(){ return valoresInd("mort_inf"); }, function(v){ return fmtInd("mort_inf",v)+" por mil"; }, "Mais escuro: mais bebês morrem"]};
function cidadePag(cid){
  topo(false);
  const nomes = MAPA ? Object.keys(MAPA.municipios).sort(function(a,b){return a.localeCompare(b);}) : [];
  const c = cid ? (MAPA_IDX[chaveMun(cid)] || cid) : store.get("cidade","");
  if (c) store.set("cidade", c);
  const m = c ? dadosCidade(c) : null, IND = (D.mun||{}).indicadores||{}, MM = (D.mun||{}).municipios||{}, total = Object.keys(MM).length;
  const votados = c ? D.pessoas.map(function(p){ const x = ((p.votos||{}).municipios||[]).find(function(y){ return chaveMun(y[0])===chaveMun(c); }); return x ? {p:p, n:x[1]} : null; }).filter(Boolean).sort(function(a,b){return b.n-a.n;}) : [];
  const emen = c ? D.pessoas.map(function(p){ const x = ((p.emendas||{}).por_municipio||[]).find(function(y){ return chaveMun(y[0])===chaveMun(c); }); return x ? {p:p, v:x[1]} : null; }).filter(Boolean).sort(function(a,b){return b.v-a.v;}) : [];
  const porCasa = function(casa){ return votados.filter(function(o){ return o.p.casa===casa; }); };
  const emTot = emen.reduce(function(a,o){return a+o.v;},0);
  const modo = store.get("mapaCidade","emendas"), MC = MAPAS_CIDADE[modo] || MAPAS_CIDADE.emendas, legCurta = modo==="idhm" ? function(v){ return fmtInd("idhm",v); } : modo==="emendas" ? null : function(v){ return String(Math.round(v)); };
  const med = function(k){ return mediana(Object.keys(MM).map(function(n){ return MM[n][k]; })); };
  const comp = function(k){ if (!m || m[k]==null) return ""; const md = med(k); if (md==null) return ""; const melhor = (IND[k]||{}).maior_melhor; const acima = m[k] > md; return (acima===!!melhor ? "melhor" : "pior")+" que a metade das cidades do CE"; };
  let h = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>'+(c?esc(c):'Sua cidade')+'</h1><p class="sub">Como vive o povo da cidade, quem foi mais votado e quem mandou dinheiro para lá. Toque no mapa ou escolha na lista.</p>'+
  '<select class="campo" id="cSel" aria-label="Escolha a cidade" style="margin-top:14px;max-width:420px"><option value="">Escolha a cidade</option>'+nomes.map(function(n){ return '<option'+(n===c?' selected':'')+'>'+esc(n)+'</option>'; }).join("")+'</select>';
  if (c && m){
    h += (m.pos_prioridade && m.pos_prioridade<=30 ? '<div class="olho" style="margin-top:6px">'+I("alvo")+'<p><b>Área prioritária:</b> '+esc(c)+' é a '+m.pos_prioridade+'ª cidade que mais precisa de atenção entre as '+total+' do Ceará, pelos números de desenvolvimento, renda, saúde e escola. <a href="#prioridades">Veja por quê</a>.</p></div>' : '')+
    kpis([{ic:"vazio", r:"População", v:fmtInd("pop",m.pop), s:((D.mun.anos||{}).pop==="2010"?"Censo 2010":"IBGE"+((D.mun.anos||{}).pop?" · "+D.mun.anos.pop:"")), f:linkIBGE(c)},
          {ic:"alvo", r:"IDHM", v:fmtInd("idhm",m.idhm), s:(m.faixa_idhm?"desenvolvimento "+m.faixa_idhm:"")+((D.mun.anos||{}).idhm?" · "+D.mun.anos.idhm:""), f:(D.mun.fontes||{}).idhm, tom:m.idhm!=null&&m.idhm<.6?"alerta":""},
          (m.pib_pc!=null ? {ic:"moeda", r:"PIB por pessoa", v:fmtInd("pib_pc",m.pib_pc), s:comp("pib_pc"), f:linkIBGE(c)} : {ic:"moeda", r:"Renda média por pessoa", v:fmtInd("renda_pc",m.renda_pc), s:"Censo 2010 · "+comp("renda_pc"), f:(D.mun.fontes||{}).idhm}),
          {ic:"dinheiro", r:"Emendas por habitante", v:m.emendas_pc!=null?BRL2.format(m.emendas_pc):"—", s:"pagas desde 2023 · "+mil(m.emendas||0)+" no total", f:"https://portaldatransparencia.gov.br/emendas"}]);
  } else if (c) h += kpis([{ic:"dinheiro", r:"Emendas pagas desde 2023", v:mil(emTot), s:emen.length+" parlamentares mandaram"}]);
  h += '<div class="quadros">'+quadro("mapa","c2","Mapa do Ceará", '<div class="filtros" id="mModo" style="margin:0 0 4px" role="group" aria-label="O que mostrar no mapa">'+Object.keys(MAPAS_CIDADE).map(function(k){ return '<button type="button" class="chipbtn" data-modo="'+k+'" aria-pressed="'+(k===modo)+'">'+MAPAS_CIDADE[k][0]+'</button>'; }).join("")+'</div>'+
    mapaCE(MC[1](), {fmt:MC[2], clique:true, sel:c, legenda:MC[3], colValor:MC[0], vazioOk:true, fmtLeg:legCurta}), fi(modo==="emendas"?"https://portaldatransparencia.gov.br/emendas":(D.mun.fontes||{}).ibge), "q2");
  if (c && m){
    const linhas = ["idhm_r","idhm_l","idhm_e"].filter(function(k){ return m[k]!=null; });
    h += quadro("alvo","c4","Como vive o povo de "+esc(c), (linhas.length ? '<p style="margin:2px 0 0"><b>As três partes do IDHM</b></p>'+barrasH(linhas.map(function(k){ return {r:{idhm_r:"Renda",idhm_l:"Saúde e vida longa",idhm_e:"Educação"}[k], v:m[k], t:fmtInd(k,m[k]), tom:m[k]>=.7?"bom":m[k]<.6?"alerta":"", d:IND[k].nome+": "+fmtInd(k,m[k])}; }), {max:1}) : '')+
      '<ul class="det" style="list-style:none;padding:0;margin:12px 0 0">'+["mort_inf","escolar","pind","renda_pc","salario"].filter(function(k){ return m[k]!=null; }).map(function(k){ return '<li><span>'+esc(IND[k].nome)+'<small>'+(IND[k].unidade==="%"?"":esc(IND[k].unidade))+(comp(k)?(IND[k].unidade==="%"?"":" · ")+comp(k):'')+'</small></span><span><b class="num">'+fmtInd(k,m[k])+'</b>'+fi(linkIBGE(c),"IBGE Cidades")+'</span></li>'; }).join("")+'</ul>'+
      '<p class="fonte">O IDHM vai de 0 a 1: quanto mais perto de 1, melhor. É calculado pelo PNUD com dados do Censo.</p>', fi(linkIBGE(c),"IBGE Cidades: "+c));
    h += quadro("urna","c4","Mais votados em "+esc(c)+" (2022)", ["alece","camara","senado"].map(function(casa){ const X = porCasa(casa).slice(0,5); return X.length ? '<p style="margin:10px 0 4px"><b>'+CASAS[casa].nome+'</b></p>'+barrasH(X.map(function(o){ return {r:o.p.nome, v:o.n, t:NUM.format(o.n), h:"#p-"+o.p.id, f:fi(fp(o.p,"votos"))}; })) : ''; }).join("") || '<p class="frase">Sem dados de votação.</p>', fi("https://dadosabertos.tse.jus.br/dataset/resultados-2022","TSE · resultados 2022"));
    h += quadro("dinheiro","c3","Quem mandou emendas para "+esc(c), (emen.length ? barrasH(emen.map(function(o){ return {r:o.p.nome, v:o.v, t:mil(o.v), h:"#p-"+o.p.id, s:CASAS[o.p.casa].nome}; })) : '<p class="frase">Nenhuma emenda paga registrada desde 2023.</p>')+
      '<div class="acoes"><button type="button" class="btn cheio" id="cCobra">'+I("megafone")+'Cobrar emendas para '+esc(c)+'</button></div>', fi("https://portaldatransparencia.gov.br/emendas","Portal da Transparência · emendas"));
  }
  h += '</div>';
  app.innerHTML = h;
  document.getElementById("cSel").onchange = function(){ location.hash = this.value ? "cidade-"+encodeURIComponent(this.value) : "cidade"; };
  document.getElementById("mModo").onclick = function(e){ const b = e.target.closest("[data-modo]"); if (b){ store.set("mapaCidade", b.getAttribute("data-modo")); cidadePag(c); } };
  const cb = document.getElementById("cCobra"); if (cb) cb.onclick = function(){ abreCobrarCidade(c); };
}
function prioridadesPag(){
  topo(false);
  const MM = (D.mun||{}).municipios||{}, IND = (D.mun||{}).indicadores||{};
  const L = Object.keys(MM).filter(function(n){ return MM[n].prioridade!=null; }).map(function(n){ return Object.assign({nome:n}, MM[n]); }).sort(function(a,b){ return b.prioridade-a.prioridade; });
  const comPop = L.filter(function(x){ return x.emendas_pc!=null; });
  const medEm = mediana(comPop.map(function(x){ return x.emendas_pc; }));
  const esquecidas = L.slice(0,40).filter(function(x){ return x.emendas_pc!=null && medEm!=null && x.emendas_pc < medEm; }).slice(0,12);
  app.innerHTML = '<h1>Áreas prioritárias</h1><p class="sub">As cidades do Ceará que mais precisam de atenção, pelos números oficiais de desenvolvimento humano, renda, mortalidade infantil, escola e salário. É para lá que o dinheiro público deveria ir primeiro.</p>'+
  kpis([{ic:"alvo", r:"Cidades avaliadas", v:L.length, s:"com dados do IBGE"}, {ic:"alerta", r:"Prioridade máxima", v:L[0]?esc(L[0].nome):"—", s:L[0]?"IDHM "+fmtInd("idhm",L[0].idhm):"", href:L[0]?"cidade-"+encodeURIComponent(L[0].nome):null, tom:"alerta"},
        {ic:"dinheiro", r:"Precisam mais e recebem menos", v:esquecidas.length, s:"entre as 40 mais prioritárias, recebem menos emenda por habitante que a média"}])+
  '<div class="quadros">'+quadro("mapa","c2","Onde está a prioridade", mapaCE(valoresInd("prioridade"), {fmt:function(v){ return "prioridade "+Math.round(v)+" de 100"; }, clique:true, legenda:"Mais escuro: mais precisa de atenção", colValor:"Prioridade", fmtLeg:function(v){ return String(Math.round(v)); }}), fi((D.mun.fontes||{}).ibge), "q2")+
  (esquecidas.length ? quadro("alerta","c1","Precisam mais e recebem menos", '<p class="frase">Estão entre as 40 cidades que mais precisam e receberam menos emenda por habitante que a média do Ceará. Cobre a bancada.</p>'+
    barrasH(esquecidas.map(function(x){ return {r:x.nome, v:x.emendas_pc||0, t:BRL.format(x.emendas_pc||0)+"/hab.", h:"#cidade-"+encodeURIComponent(x.nome), s:"prioridade "+x.pos_prioridade+"º · IDHM "+fmtInd("idhm",x.idhm), tom:"alerta"}; }))+
    '<div class="acoes"><button type="button" class="btn cheio" id="pCobra">'+I("megafone")+'Cobrar emendas para essas cidades</button></div>', fi("https://portaldatransparencia.gov.br/emendas","Portal da Transparência · emendas")) : '')+
  quadro("alvo","c4","As 184 cidades, da que mais precisa para a que menos precisa", tabela([{t:"Cidade", k:"nome", fmt:function(v,x){ return '<a href="#cidade-'+encodeURIComponent(v)+'"><b>'+esc(v)+'</b></a><small>'+x.pos_prioridade+'º em prioridade</small>'; }},
      {t:"IDHM", k:"idhm", num:true, fmt:function(v){ return fmtInd("idhm",v); }}, {t:"Mortalidade infantil", k:"mort_inf", num:true, fmt:function(v){ return fmtInd("mort_inf",v); }},
      {t:"Na escola (6-14)", k:"escolar", num:true, fmt:function(v){ return fmtInd("escolar",v); }}, {t:"Extrema pobreza", k:"pind", num:true, fmt:function(v){ return fmtInd("pind",v); }},
      {t:"Emendas por hab.", k:"emendas_pc", num:true, fmt:function(v){ return v==null?"—":BRL2.format(v); }}, {t:"", k:"_i", semOrd:true, fmt:function(v,x){ return fi(linkIBGE(x.nome),"IBGE Cidades"); }}], L, {limite:20}), '', "qt")+
  quadro("info","c2","Como calculamos a prioridade", '<p class="frase">Para cada cidade, vemos a posição dela entre as 184 do Ceará em cinco números oficiais: IDHM, IDHM Renda, mortalidade infantil, crianças na escola e pessoas em extrema pobreza. A prioridade é a média dessas posições, de 0 (melhor do estado) a 100 (pior do estado).</p><p class="frase">Fontes: IBGE Cidades e Atlas do Desenvolvimento Humano (PNUD). O IDHM disponível por cidade é do último Censo com esse cálculo.</p>', fi((D.mun.fontes||{}).api))+
  '</div>';
  const pc = document.getElementById("pCobra"); if (pc) pc.onclick = function(){ abreCobrarCidade(esquecidas.slice(0,5).map(function(x){return x.nome;}).join(", ")); };
}
function abreCobrarCidade(c){
  const L = D.pessoas.filter(function(p){ return (p.casa==="camara"||p.casa==="senado") && !p.fora_exercicio; }).sort(function(a,b){ return a.nome.localeCompare(b.nome); });
  const m = dadosCidade(c);
  let alvo = "todos";
  abreFolha("Cobrar emendas para "+esc(c), '<label class="rot" for="ccAlvo">Quem você vai cobrar?</label><select class="campo" id="ccAlvo"><option value="todos">Toda a bancada federal do Ceará ('+L.length+')</option>'+L.map(function(p){ return '<option value="'+esc(p.id)+'">'+esc(p.nome)+' ('+CASAS[p.casa].nome+')</option>'; }).join("")+'</select>'+
    '<textarea id="ccTxt" aria-label="Mensagem"></textarea><div class="acoes"><button class="btn cheio" id="ccCopiar">'+I("copiar")+'Copiar</button><a class="btn" id="ccMail" href="#">'+I("email")+'E-mail</a><a class="btn" id="ccZap" href="#" target="_blank" rel="noopener">'+I("partilhar")+'Mandar no WhatsApp</a></div>');
  const sel = document.getElementById("ccAlvo"), txt = document.getElementById("ccTxt");
  function texto(){ const p = D.porId[alvo], quem = p ? p.nome : "Deputadas, deputados e senadores do Ceará";
    const dado = m ? " tem IDHM "+fmtInd("idhm",m.idhm)+(m.mort_inf!=null?", mortalidade infantil de "+fmtInd("mort_inf",m.mort_inf)+" por mil nascidos vivos":"")+(m.emendas_pc!=null?" e recebeu "+(m.emendas_pc < (mediana(Object.values((D.mun||{}).municipios||{}).map(function(x){return x.emendas_pc;}))||0) ? "só " : "")+BRL2.format(m.emendas_pc)+" por habitante em emendas desde 2023":"")+"." : " está entre as cidades que mais precisam de atenção no Ceará.";
    return quem+", "+c+dado+" Peço que "+(p?"você mande":"vocês mandem")+" emendas para saúde, educação e saneamento lá. Estou espiando.\n\n[seu nome], de [sua cidade]"; }
  function liga(){ const p = D.porId[alvo], emails = p ? [p.email].filter(Boolean) : L.map(function(x){return x.email;}).filter(Boolean);
    document.getElementById("ccMail").href = "mailto:"+(p?encodeURIComponent(emails[0]||""):"")+"?"+(p?"":"bcc="+encodeURIComponent(emails.join(","))+"&")+"subject="+encodeURIComponent("Emendas para "+c)+"&body="+encodeURIComponent(txt.value);
    document.getElementById("ccZap").href = "https://wa.me/?text="+encodeURIComponent(txt.value); }
  sel.onchange = function(){ alvo = sel.value; txt.value = texto(); liga(); }; txt.oninput = liga; txt.value = texto(); liga();
  document.getElementById("ccCopiar").onclick = function(){ if (navigator.clipboard) navigator.clipboard.writeText(txt.value).then(function(){ toast("Mensagem copiada!"); }); else txt.select(); };
}

/* ---------- no noticiário: o que os jornais dizem das pautas da extrema-direita ---------- */
function linhaNoticia(n, curto){ const r = (n.radar||[]).map(itemRadar).filter(Boolean)[0], ps = (n.pessoas||[]).map(function(id){ return D.porId[id]; }).filter(Boolean);
  return '<li class="noticia"><a class="n-tit" href="'+esc(n.link)+'" target="_blank" rel="noopener">'+esc(n.titulo)+'</a><span class="n-meta"><b>'+esc(n.fonte)+'</b>'+(n.data?' · '+dataBR(n.data):'')+(n.temas||[]).map(function(t){ return ' <span class="tag-r">'+esc(((D.not||{}).temas||{})[t]||nomeTema(t))+'</span>'; }).join("")+'</span>'+
    (!curto && (r||ps.length) ? '<span class="n-liga">'+(r?'<a href="#radar">'+I("radar")+esc(r.tipo+" "+r.numero)+' no Radar</a>':'')+ps.map(function(p){ return '<a href="#p-'+esc(p.id)+'">'+I("vazio")+esc(p.nome)+'</a>'; }).join("")+'</span>' : '')+
    (!curto ? '<span class="n-acoes"><a href="https://wa.me/?text='+encodeURIComponent("Espia isso: "+n.titulo+" "+n.link)+'" target="_blank" rel="noopener">'+I("partilhar")+'Compartilhar</a></span>' : '')+'</li>'; }
function noticiasPag(filtro){
  topo(false);
  const N = (D.not||{}).itens||[], fontes = ((D.not||{}).fontes||[]).map(function(f){ return f.nome; });
  const L = filtro ? N.filter(function(n){ return n.fonte===filtro || (n.temas||[]).indexOf(filtro)>=0; }) : N;
  const cont = {}; N.forEach(function(n){ cont[n.fonte] = (cont[n.fonte]||0)+1; });
  const ct = {}; N.forEach(function(n){ (n.temas||[]).forEach(function(t){ ct[t] = (ct[t]||0)+1; }); });
  app.innerHTML = '<div class="radar-topo"><span class="radar-ic">'+I("jornal")+'</span><div><h1>No noticiário</h1><p class="sub">O que os principais jornais publicaram nos últimos '+((D.not||{}).dias||30)+' dias sobre as pautas da extrema-direita. Leia no site do jornal, compartilhe e cobre antes que a pauta avance.</p></div></div>'+
  kpis([{ic:"jornal", r:"Notícias", v:N.length, s:"de "+fontes.length+" jornais"}, {ic:"radar", r:"Citam projetos do Radar", v:N.filter(function(n){return (n.radar||[]).length;}).length, href:"radar"}, {ic:"vazio", r:"Citam políticos do Ceará", v:N.filter(function(n){return (n.pessoas||[]).length;}).length}])+
  '<div class="filtros rola" role="group" aria-label="Filtrar por jornal"><a class="chipbtn" href="#noticias" aria-pressed="'+(!filtro)+'">Todas <small>'+N.length+'</small></a>'+fontes.map(function(f){ return '<a class="chipbtn" href="#noticias-'+encodeURIComponent(f)+'" aria-pressed="'+(filtro===f)+'">'+esc(f)+' <small>'+(cont[f]||0)+'</small></a>'; }).join("")+'</div>'+
  '<div class="filtros" role="group" aria-label="Filtrar por tema">'+Object.keys(ct).sort(function(a,b){return ct[b]-ct[a];}).map(function(t){ return '<a class="chipbtn" href="#noticias-'+t+'" aria-pressed="'+(filtro===t)+'">'+esc(((D.not||{}).temas||{})[t]||t)+' <small>'+ct[t]+'</small></a>'; }).join("")+'</div>'+
  '<div class="quadros">'+quadro("jornal","c1",(filtro?esc(((D.not||{}).temas||{})[filtro]||filtro):"Últimas notícias"), L.length ? '<ul class="noticias">'+L.slice(0,80).map(function(n){ return linhaNoticia(n); }).join("")+'</ul>' : '<p class="frase">Nenhuma notícia nesse filtro.</p>', '', "q2")+
  quadro("info","c2","De onde vêm as notícias", '<p class="frase">O robô lê, todo dia, o RSS público dos jornais e a busca de notícias filtrada pelo site de cada um: '+esc(fontes.join(", "))+'. Nenhum deles tem uma API aberta de notícias.</p><p class="frase">Entram só as notícias que falam das pautas do Radar. Guardamos o título, o link e a data; a reportagem completa fica no site do jornal.</p><p class="frase">A lista de jornais e de palavras fica no arquivo público <code>config/noticias.json</code>.</p>', '')+'</div>';
}

/* ---------- seguindo ---------- */
function seguindo(){
  topo(false);
  const meus = seg.map(function(id){return D.porId[id];}).filter(Boolean), ev = [];
  meus.forEach(function(p){
    if (p.gastos && p.gastos.ultimos) p.gastos.ultimos.slice(0,2).forEach(function(x){ ev.push({o:x.mes*100, ic:"moeda", p:p, txt:BRL2.format(x.valor)+" com "+(x.fornecedor||x.categoria), q:MESES[(x.mes||1)-1], f:x.url||fp(p,"gastos")}); });
    (D.votosDe[p.id]||[]).slice(0,3).forEach(function(v){ ev.push({o:parseInt((v.data||"0000-00-00").slice(5,7),10)*100+parseInt((v.data||"0000-00-00").slice(8,10),10), ic:"urna", p:p, txt:"votou "+votoTxt(v.votos[p.id]).toLowerCase()+": "+v.titulo, q:dataBR(v.data), f:v.url}); });
    (p.projetos||[]).slice(0,2).forEach(function(x){ ev.push({o:x.data?parseInt(x.data.slice(5,7),10)*100+parseInt(x.data.slice(8,10),10):0, ic:"doc", p:p, txt:"apresentou "+(x.tipo||"")+" "+(x.numero||"")+": "+(x.ementa||"").slice(0,90), q:x.data?dataBR(x.data):String(x.ano||""), f:x.url}); });
  });
  ev.sort(function(a,b){return b.o-a.o;});
  const tg = D.meta.telegram;
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Seguindo</h1><div class="quadros">'+
  (segProj.filter(itemRadar).length ? quadro("radar","c1","Projetos que você está espiando", '<div class="radar-mini col">'+segProj.map(itemRadar).filter(Boolean).map(function(it){ return cardRadar(it, true); }).join("")+'</div>', '', "q2") : quadro("radar","c1","Projetos que você está espiando", '<p class="frase">Abra o <a href="#radar">Radar</a> e toque em <b>Espiar</b> nos projetos que você quer acompanhar.</p>', ''))+
  quadro("estrela","c3","Quem você segue", meus.length ? '<div class="lista">'+meus.map(function(p){ const n = novidades(p); return linhaP(p, n ? '<b style="color:var(--chita)">'+esc(n.join(", "))+'</b>' : CASAS[p.casa].cargo, '<a class="fi" href="feeds/'+esc(p.id)+'.xml" title="Feed RSS" aria-label="Feed RSS de '+esc(p.nome)+'">'+I("rss")+'</a>'+I("seta")); }).join("")+'</div>'
   : '<div class="vazio">'+I("vazio")+'<p>Abra um político e toque em <b>Seguir</b>. A lista fica guardada só neste aparelho.</p></div>', '')+
  (ev.length ? quadro("sino","c1","Últimas de quem você segue", tabela([{t:"O quê", k:"txt", fmt:function(v,e){ return '<a href="#p-'+esc(e.p.id)+'"><b>'+esc(e.p.nome)+'</b></a> '+esc(v)+'<small>'+esc(e.q)+'</small>'; }},{t:"", k:"f", semOrd:true, fmt:function(v){ return fi(v); }}], ev, {limite:10}), '', "q2") : '')+
  quadro("sino","c3","Receber avisos", ('Notification' in window ? '<p class="frase"><b>Neste aparelho:</b> quando você abrir o EspiaCE, mostramos um aviso com as novidades de quem você segue.</p><div class="acoes" style="margin-top:8px"><button class="btn" id="bNot">'+(Notification.permission==="granted"?I("ok")+"Avisos ligados":I("sino")+"Ligar avisos")+'</button></div>' : '')+
    (tg ? '<p class="frase" style="margin-top:14px"><b>Telegram:</b> todo dia, as novas votações e como os cearenses votaram.</p><div class="acoes" style="margin-top:8px"><a class="btn cheio" href="'+esc(tg)+'" target="_blank" rel="noopener">Entrar no canal</a></div>' : '')+
    '<p class="frase" style="margin-top:14px"><b>RSS:</b> cada perfil tem um feed com votos, projetos e gastos. Funciona em qualquer leitor de RSS e em bots de Telegram que leem RSS.</p>', '')+'</div>';
  const bn = document.getElementById("bNot"); if (bn) bn.onclick = function(){ Notification.requestPermission().then(function(r){ bn.innerHTML = r==="granted" ? I("ok")+"Avisos ligados" : I("sino")+"Ligar avisos"; if (r==="granted") toast("Pronto. Os avisos aparecem quando você abrir o site."); }); };
}

/* ---------- dados abertos ---------- */
function dadosPag(){
  topo(false);
  const F = (D.meta && D.meta.fontes) || {};
  const arq = [["parlamentares.json","Todos os parlamentares: gastos, projetos, presença, viagens, emendas, dados do TSE"],["votacoes.json","Votações nominais com o voto de cada cearense"],["governo.json","Orçamento do estado por função, projetos do Executivo e plano de governo"],["eleicao.json","Eleitos de 2026 e governadores"],["meta.json","Situação das fontes"]];
  const fontes = [["Câmara dos Deputados","https://dadosabertos.camara.leg.br/"],["Senado Federal","https://legis.senado.leg.br/dadosabertos/docs/"],["Assembleia Legislativa do Ceará","https://transparencia.al.ce.gov.br/"],["TSE · dados abertos","https://dadosabertos.tse.jus.br/"],["Portal da Transparência (CGU)","https://portaldatransparencia.gov.br/download-de-dados/emendas-parlamentares"],["Tesouro Nacional · Siconfi","https://apidatalake.tesouro.gov.br/docs/siconfi/"],["IBGE · malha municipal (mapa)","https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais.html"],["Ceará Transparente","https://cearatransparente.ce.gov.br/"]];
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Dados abertos</h1><p class="sub">Tudo o que o site mostra, para baixar e reusar (cite a fonte).</p><div class="quadros">'+
  quadro("baixar","c3","Baixar", '<div class="lista">'+arq.map(function(a){ return '<a class="linha-dep" href="dados/'+a[0]+'" download><div><div class="nome">'+a[0]+'</div><div class="meta">'+a[1]+'</div></div><div class="dir">'+I("baixar")+'</div></a>'; }).join("")+'</div>', '')+
  quadro("link","c2","De onde vem cada dado", '<div class="lista">'+fontes.map(function(f){ return '<a class="linha-dep" href="'+f[1]+'" target="_blank" rel="noopener"><div><div class="nome">'+f[0]+'</div><div class="meta">'+esc(f[1].replace(/^https:\/\//,""))+'</div></div><div class="dir">'+I("link")+'</div></a>'; }).join("")+'</div>', '')+
  quadro("info","c4","Situação das fontes", estadoFontes(F), '', "q2")+'</div>'+
  (D.meta.repositorio ? '<p class="sub">Código aberto: <a href="https://github.com/'+esc(D.meta.repositorio)+'" target="_blank" rel="noopener">github.com/'+esc(D.meta.repositorio)+'</a></p>' : '');
}
function estadoFontes(F){ return Object.keys(F).length ? Object.keys(F).map(function(k){ const f = F[k]; return '<div class="estado"><span class="bola '+(f.ok?"ok":"erro")+'"></span><span><b>'+esc(f.nome)+'</b><br><small style="color:var(--tinta-2)">'+(f.ok ? 'atualizada em '+esc((f.quando||"").replace("T"," às "))+(f.pessoas!=null?' · '+f.pessoas+' parlamentares · '+f.votacoes+' votações':'') : 'falhou na última tentativa'+(f.ultimo_sucesso?'; usando dados de '+esc(f.ultimo_sucesso.replace("T"," às ")):''))+'</small></span></div>'; }).join("") : '<p>Ainda sem informação.</p>'; }

/* ---------- sobre ---------- */
function sobre(){
  topo(false);
  const F = (D.meta && D.meta.fontes) || {};
  app.innerHTML = '<a class="voltar" href="#inicio">'+I("volta")+'Início</a><h1>Sobre o EspiaCE</h1><div class="quadros">'+
  quadro("olho","c1","O que é", '<p class="frase">No Ceará, <b>espiar</b> é olhar com atenção. O EspiaCE junta os dados oficiais dos deputados estaduais, federais, senadores e do governo do Ceará e explica sem rodeio. Um robô atualiza tudo todo dia, de graça, e o código é aberto.</p><p class="frase">Ao lado de cada informação tem um '+I("info")+' que leva direto ao site oficial de onde ela saiu. Confira sempre.</p>', '')+
  quadro("olho","c4","Nosso lado", '<p class="frase">Somos uma iniciativa do campo popular e dizemos isso. Os números vêm só de fontes oficiais. O Radar do Retrocesso é a nossa linha editorial: acompanha as pautas da extrema-direita que ameaçam direitos, com os temas e as palavras abertos para qualquer um conferir.</p>', '')+
  quadro("megafone","c1","Direito de resposta e privacidade", '<p class="frase">Gabinetes podem contestar qualquer dado ou classificação. A correção fica registrada, com o motivo, no código aberto.</p><p class="frase">Não pedimos cadastro e não rastreamos ninguém. Quem você segue fica guardado só neste aparelho.</p>', '')+
  quadro("info","c2","Situação das fontes", estadoFontes(F), '')+'</div>';
}

/* ---------- rotas ---------- */
/* páginas longas ganham um índice de seções que fica preso no alto da tela (celular) */
function indice(h){
  const qs = Array.prototype.slice.call(app.querySelectorAll(".quadros > .quadro"));
  if (h==="inicio" || h==="" || qs.length < 5) return;
  const itens = qs.map(function(q, i){ const t = q.querySelector(".q > span:nth-child(2)"); if (!t) return null; if (!q.id) q.id = "sec-"+i;
    let nome = t.textContent.replace(/\s+em \d{4}.*$/,"").replace(/\s*\(\d{4}\)$/,"").replace(/ ·.*$/,"").trim(); if (nome.length > 26) nome = nome.slice(0,24).replace(/\s\S*$/,"")+"…";
    return '<a href="#" data-sec="'+q.id+'">'+esc(nome)+'</a>'; }).filter(Boolean);
  const nav = document.createElement("nav"); nav.className = "indice"; nav.setAttribute("aria-label","Ir para a seção"); nav.innerHTML = itens.join("");
  const alvo = app.querySelector(".quadros"); alvo.parentNode.insertBefore(nav, alvo);
  nav.addEventListener("click", function(e){ const a = e.target.closest("[data-sec]"); if (!a) return; e.preventDefault(); const el = document.getElementById(a.getAttribute("data-sec"));
    window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 12, behavior:"smooth"}); });
  if ("IntersectionObserver" in window){ const ob = new IntersectionObserver(function(es){ es.forEach(function(en){ if (en.isIntersecting){ nav.querySelectorAll("a").forEach(function(a){ const on = a.getAttribute("data-sec")===en.target.id; a.classList.toggle("on", on); if (on && a.scrollIntoView && nav.scrollWidth > nav.clientWidth) nav.scrollTo({left:a.offsetLeft-16, behavior:"smooth"}); }); } }); }, {rootMargin:"-30% 0px -60% 0px"}); qs.forEach(function(q){ ob.observe(q); }); }
}
function rota(){
  const h = decodeURIComponent((location.hash || "#inicio").slice(1));
  let m;
  dica.classList.remove("on");
  marcaMenu(h);
  if (h.indexOf("p-")===0) perfil(h.slice(2));
  else if (h.indexOf("e-")===0) eleitoPag(h.slice(2));
  else if (CASAS[h]) casaPag(h);
  else if ((m = h.match(/^(alece|camara|senado)-2026$/))) casaPag(m[1], "2026");
  else if (h.indexOf("comparar")===0){ const ids = h.slice(9).split("-"); const pa = []; let cur = ""; ids.forEach(function(x){ cur = cur ? cur+"-"+x : x; if (D.porId[cur]){ pa.push(cur); cur = ""; } }); compararPag(pa[0], pa[1]); }
  else if (h.indexOf("cidade")===0) cidadePag(h.slice(7));
  else if (h==="prioridades") prioridadesPag();
  else if (h.indexOf("noticias")===0) noticiasPag(h.slice(9));
  else if (h==="politicos") politicosPag();
  else if (h.indexOf("radar")===0) radarPag(h.slice(6));
  else if (h==="seguindo") seguindo();
  else if (h==="sobre") sobre();
  else if (h==="governo") governoPag();
  else if (h==="viagens-todas") viagensTodas();
  else if (h==="gastos-todos") gastosTodos();
  else if (h==="promessas") promessasPag();
  else if (h==="eleitos") eleitosPag();
  else if (h==="dados") dadosPag();
  else inicio();
  indice(h);
  if (!pendente) window.scrollTo(0,0);
}
window.addEventListener("hashchange", function(){ if (D.pessoas.length || location.hash==="#sobre") rota(); });
carregar();
})();
