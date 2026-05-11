firebase.initializeApp({
  apiKey:"AIzaSyCe93JvddBAmv6BUwvkzSsCO1GAdqXRv4Q",
  authDomain:"lifestyle-matrix.firebaseapp.com",
  projectId:"lifestyle-matrix",
  storageBucket:"lifestyle-matrix.firebasestorage.app",
  messagingSenderId:"885705065634",
  appId:"1:885705065634:web:0e6ca7855628021ecbc3fb"
});
const db=firebase.firestore();
const auth=firebase.auth();
const BASE_URL='https://ritadigregorio.it/lifestyle-matrix/';
let currentCoacheeId='',currentSubmissions=[];

// AUTH
function doLogin(){auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());}
function doLogout(){auth.signOut();}
const ALLOWED_EMAILS = ['digregorio.rita@gmail.com', 'onoame72@gmail.com'];
let currentCoacheeName='';

auth.onAuthStateChanged(user=>{
  if(user && ALLOWED_EMAILS.includes(user.email)){
    document.getElementById('dashHeader').style.display='flex';
    document.getElementById('tabBar').style.display='flex';
    document.getElementById('dashUser').textContent=user.email;
    showMain();
  }
  else if(user){auth.signOut();alert('Accesso non autorizzato.');}
  else{
    document.getElementById('dashHeader').style.display='none';
    document.getElementById('tabBar').style.display='none';
    document.getElementById('breadcrumb').style.display='none';
    document.getElementById('sectionCorso').style.display='none';
    showScreen('loginScreen');
  }
});

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  updateBreadcrumb(id);
  window.scrollTo(0,0);
}

function updateBreadcrumb(screenId){
  let bc=document.getElementById('breadcrumb');
  if(screenId==='loginScreen'){bc.style.display='none';return;}
  bc.style.display='block';
  let parts=[];
  if(screenId==='mainScreen'){
    parts.push('<span>Coachee</span>');
  }else if(screenId==='addCoacheeScreen'){
    parts.push('<a onclick="showMain()">Coachee</a>');
    parts.push('<span>Nuovo</span>');
  }else if(screenId==='coacheeScreen'){
    parts.push('<a onclick="showMain()">Coachee</a>');
    parts.push('<span>'+currentCoacheeName+'</span>');
  }else if(screenId==='reportScreen'){
    parts.push('<a onclick="showMain()">Coachee</a>');
    parts.push('<a onclick="openCoachee(\''+currentCoacheeId+'\')">'+currentCoacheeName+'</a>');
    parts.push('<span>Report</span>');
  }
  bc.innerHTML=parts.join('<span class="sep">›</span>');
}

// TOAST
function showToast(msg){
  let t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3000);
}

// COACHEE LIST
let allCoacheesDocs=[];
async function loadCoachees(){
  let snap=await db.collection('coachees').orderBy('createdAt','desc').get();
  allCoacheesDocs=[];
  snap.forEach(doc=>{allCoacheesDocs.push({id:doc.id,...doc.data()});});
  filterCoachees();
}

function filterCoachees(){
  let q=(document.getElementById('coacheeSearch').value||'').toLowerCase();
  let filtered=allCoacheesDocs.filter(d=>{
    let text=[d.name,d.surname,d.email].filter(Boolean).join(' ').toLowerCase();
    return text.includes(q);
  });
  let html='';
  if(!allCoacheesDocs.length){html='<p style="color:rgba(255,255,255,0.5);margin:20px 0">Nessun coachee. Clicca "+ Nuovo Coachee" per iniziare.</p>';}
  else if(!filtered.length){html='<p style="color:rgba(255,255,255,0.5);margin:20px 0">Nessun risultato.</p>';}
  filtered.forEach(d=>{
    html+='<div class="card" onclick="openCoachee(\''+d.id+'\')">';
    html+='<div class="card-name">'+[d.name,d.surname].filter(Boolean).join(' ')+'</div>';
    html+='<div class="card-meta">'+(d.email||'')+(d.submissions?' · '+d.submissions+' valutazioni':'')+'</div>';
    html+='</div>';
  });
  document.getElementById('coacheeList').innerHTML=html;
}

function showMain(){showScreen('mainScreen');loadCoachees();}

// ADD COACHEE
function showAddCoachee(){
  document.getElementById('newName').value='';
  document.getElementById('newSurname').value='';
  document.getElementById('newEmail').value='';
  document.getElementById('newTokenResult').innerHTML='';
  showScreen('addCoacheeScreen');
}

function generateToken(){
  let chars='abcdefghijklmnopqrstuvwxyz0123456789';
  let t='';for(let i=0;i<16;i++)t+=chars[Math.floor(Math.random()*chars.length)];
  return t;
}

// Token validity: 30 days
const TOKEN_TTL_DAYS=30;
function tokenExpiresAt(){
  let d=new Date();d.setDate(d.getDate()+TOKEN_TTL_DAYS);
  return firebase.firestore.Timestamp.fromDate(d);
}

async function createCoachee(){
  let name=document.getElementById('newName').value.trim();
  let surname=document.getElementById('newSurname').value.trim();
  let email=document.getElementById('newEmail').value.trim();
  if(!name&&!surname){alert('Inserisci almeno il nome.');return;}
  if(!email){alert('Inserisci l\'email del coachee.');return;}
  let ref=await db.collection('coachees').add({name,surname,email,submissions:0,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
  let token=generateToken();
  await db.collection('tokens').doc(token).set({
    coacheeId:ref.id,name,surname,email,
    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
    expiresAt:tokenExpiresAt(),
    used:false,usedAt:null,submissionId:null
  });
  let link=BASE_URL+'?token='+token;
  let safeLink=link.replace(/'/g,"\\'");
  document.getElementById('newTokenResult').innerHTML=
    '<p style="color:#4CAF50;margin:10px 0">✅ Coachee creato!</p>'+
    '<p>Link per il test (valido 30 giorni, utilizzabile una sola volta):</p>'+
    '<div class="token-box">'+link+'</div>'+
    '<div class="nav" style="margin-top:10px">'+
    '<button class="btn btn-sm" onclick="navigator.clipboard.writeText(\''+safeLink+'\');this.textContent=\'Copiato!\'">📋 Copia link</button>'+
    '<button class="btn btn-sm" onclick="openCoachee(\''+ref.id+'\')">📂 Apri scheda</button>'+
    '<button class="btn btn-sm btn-outline" onclick="showAddCoachee()">+ Nuovo coachee</button>'+
    '<button class="btn btn-sm btn-outline" onclick="showMain()">← Lista coachee</button>'+
    '</div>';
}

// COACHEE DETAIL
function formatDate(ts){
  if(!ts)return '';
  let d=ts.toDate?ts.toDate():new Date(ts);
  return d.toLocaleDateString('it-IT');
}
function tokenStatus(t){
  // t is the token data
  let now=new Date();
  let exp=t.expiresAt&&t.expiresAt.toDate?t.expiresAt.toDate():null;
  if(t.used)return{label:'Usato'+(t.usedAt?' il '+formatDate(t.usedAt):''),color:'#888',cls:'used'};
  if(exp&&exp<now)return{label:'Scaduto il '+formatDate(t.expiresAt),color:'#e74c3c',cls:'expired'};
  if(exp)return{label:'Attivo · scade il '+formatDate(t.expiresAt),color:'#4CAF50',cls:'active'};
  return{label:'Legacy',color:'#c8a96a',cls:'legacy'};
}

async function openCoachee(id){
  currentCoacheeId=id;
  try{
  let doc=await db.collection('coachees').doc(id).get();
  let d=doc.data();
  currentCoacheeName=[d.name,d.surname].filter(Boolean).join(' ');
  let html='<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">';
  html+='<div><h2>'+currentCoacheeName+'</h2>';
  html+='<p class="card-meta">'+(d.email||'Nessuna email')+'</p></div>';
  html+='<div class="nav"><button class="btn btn-sm btn-outline" onclick="editCoachee()">✏️ Modifica</button>';
  html+='<button class="btn btn-sm btn-danger" onclick="deleteCoachee()">🗑️ Elimina</button></div>';
  html+='</div>';
  let tokens=await db.collection('tokens').where('coacheeId','==',id).get();
  html+='<div style="margin:15px 0"><strong style="color:#c8a96a">Link di accesso:</strong>';
  if(tokens.empty){
    html+='<p style="color:rgba(255,255,255,0.5);margin:8px 0">Nessun link. Clicca "Nuovo link" per generarne uno.</p>';
  }
  tokens.forEach(t=>{
    let td=t.data();
    let link=BASE_URL+'?token='+t.id;
    let safeLink=link.replace(/'/g,"\\'");
    let st=tokenStatus(td);
    html+='<div class="token-row">';
    html+='<div class="token-status" style="color:'+st.color+'">● '+st.label+'</div>';
    html+='<div class="token-box" style="display:flex;align-items:center;gap:8px;justify-content:space-between">';
    html+='<span>'+link+'</span>';
    html+='<div style="display:flex;gap:6px;flex-shrink:0">';
    html+='<button class="btn btn-sm" onclick="navigator.clipboard.writeText(\''+safeLink+'\');this.textContent=\'✓\'">📋</button>';
    if(st.cls==='active'){
      html+='<button class="btn btn-sm btn-danger" onclick="revokeToken(\''+t.id+'\')" title="Revoca questo link">🚫</button>';
    }
    html+='</div></div></div>';
  });
  html+='</div>';
  document.getElementById('coacheeDetail').innerHTML=html;
  let subs=await db.collection('submissions').where('coacheeId','==',id).get();
  currentSubmissions=[];
  let docs=[];subs.forEach(s=>{let sd=s.data();sd._id=s.id;docs.push(sd);});
  docs.sort((a,b)=>b.timestamp-a.timestamp);
  currentSubmissions=docs;
  let shtml='<h3 style="margin-top:20px">Valutazioni</h3>';
  if(!currentSubmissions.length){shtml+='<p style="color:rgba(255,255,255,0.5)">Nessuna valutazione ricevuta.</p>';}
  currentSubmissions.forEach((sd,i)=>{
    shtml+='<div class="sub-row"><input type="checkbox" class="sub-check" data-idx="'+i+'">';
    shtml+='<div class="sub-info"><strong style="color:#c8a96a">'+sd.date+'</strong> — Media: <span class="'+scoreClass(sd.totalAvg)+'">'+sd.totalAvg+'</span></div>';
    shtml+='<button class="btn btn-sm" onclick="viewReport('+i+')">📄 Report</button>';
    shtml+='<button class="btn btn-sm btn-danger" onclick="deleteSubmission(\''+sd._id+'\','+i+')">🗑️</button>';
    shtml+='</div>';
  });
  document.getElementById('submissionsList').innerHTML=shtml;
  document.getElementById('comparisonSection').style.display='none';
  showScreen('coacheeScreen');
  }catch(e){console.error(e);alert('Errore: '+e.message);}
}

async function generateNewToken(){
  let token=generateToken();
  let doc=await db.collection('coachees').doc(currentCoacheeId).get();
  let d=doc.data();
  await db.collection('tokens').doc(token).set({
    coacheeId:currentCoacheeId,name:d.name,surname:d.surname,
    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
    expiresAt:tokenExpiresAt(),
    used:false,usedAt:null,submissionId:null
  });
  let link=BASE_URL+'?token='+token;
  try{await navigator.clipboard.writeText(link);}catch(e){}
  showToast('✅ Nuovo link creato e copiato negli appunti');
  openCoachee(currentCoacheeId);
}

async function revokeToken(tokenId){
  if(!confirm('Revocare questo link? Non potrà più essere usato.'))return;
  try{
    await db.collection('tokens').doc(tokenId).update({
      used:true,
      usedAt:firebase.firestore.FieldValue.serverTimestamp(),
      revoked:true
    });
    showToast('🚫 Link revocato');
    openCoachee(currentCoacheeId);
  }catch(e){showToast('❌ Errore: '+e.message);}
}

async function editCoachee(){
  let doc=await db.collection('coachees').doc(currentCoacheeId).get();
  let d=doc.data();
  let name=prompt('Nome:',d.name||'');
  if(name===null)return;
  let surname=prompt('Cognome:',d.surname||'');
  if(surname===null)return;
  let email=prompt('Email:',d.email||'');
  if(email===null)return;
  await db.collection('coachees').doc(currentCoacheeId).update({name:name.trim(),surname:surname.trim(),email:email.trim()});
  showToast('✅ Dati aggiornati');
  openCoachee(currentCoacheeId);
}

async function deleteCoachee(){
  if(!confirm('Eliminare questo coachee e tutti i suoi dati (valutazioni, link)? Azione irreversibile.'))return;
  // Delete tokens
  let tokens=await db.collection('tokens').where('coacheeId','==',currentCoacheeId).get();
  let batch=db.batch();
  tokens.forEach(t=>batch.delete(t.ref));
  // Delete submissions
  let subs=await db.collection('submissions').where('coacheeId','==',currentCoacheeId).get();
  subs.forEach(s=>batch.delete(s.ref));
  // Delete coachee
  batch.delete(db.collection('coachees').doc(currentCoacheeId));
  await batch.commit();
  showToast('🗑️ Coachee eliminato');
  showMain();
}

async function deleteSubmission(subId,idx){
  if(!confirm('Eliminare questa valutazione?'))return;
  await db.collection('submissions').doc(subId).delete();
  openCoachee(currentCoacheeId);
}

function scoreClass(v){return v>=7?'score-high':v>=4?'score-mid':'score-low';}

// REPORT VIEW
let currentReportSub=null;
function viewReport(idx){
  currentReportSub=currentSubmissions[idx];
  let s=currentReportSub;
  // Populate report selector
  let sel=document.getElementById('reportSelector');
  sel.innerHTML='';
  currentSubmissions.forEach((sub,i)=>{
    let opt=document.createElement('option');
    opt.value=i;opt.textContent=sub.date+' — Media: '+sub.totalAvg;
    if(i===idx)opt.selected=true;
    sel.appendChild(opt);
  });
  let label=[s.name,s.surname].filter(Boolean).join(' ')+(s.age?' — Età: '+s.age:'')+(s.date?' — '+s.date:'');
  document.getElementById('reportName').textContent=label;
  let html='';
  let fIds=['F1','F2','F3','F4'];
  let fNames={F1:'Nutrizione',F2:'Nutraceutica',F3:'Allenamento Fisico',F4:'Lavoro Interiore'};
  let sectionNames={Com:'Competenze Base',R1:'Percezione',R2:'Interpretazione',R3:'Focalizzazione',R4:'Adattamento',R5:'Connessioni'};
  let secKeys=['Com','R1','R2','R3','R4','R5'];
  fIds.forEach((fid,fi)=>{
    html+='<div class="foundation-title">'+fid+' — '+fNames[fid]+'</div>';
    html+='<canvas id="reportRadar'+fi+'" width="500" height="500"></canvas>';
    html+='<table class="results-table"><tr><th>Sezione</th><th>Punteggio</th></tr>';
    secKeys.forEach(sk=>{
      let key=fid+sk;
      if(s.scores[key]!==undefined){
        let v=s.scores[key];
        html+='<tr><td>'+key+' '+sectionNames[sk]+'</td><td class="'+scoreClass(v)+'">'+v.toFixed(2)+'</td></tr>';
      }
    });
    html+='<tr><td><strong>'+fid+' Risorse</strong></td><td class="'+scoreClass(s.fScores[fid].risorse)+'"><strong>'+s.fScores[fid].risorse.toFixed(2)+'</strong></td></tr>';
    html+='<tr><td><strong>'+fid+' Totale</strong></td><td class="'+scoreClass(s.fScores[fid].total)+'"><strong>'+s.fScores[fid].total.toFixed(2)+'</strong></td></tr>';
    html+='</table>';
  });
  // Summary
  html+='<div class="foundation-title">Matrice Riassuntiva</div>';
  html+='<canvas id="reportRadarAll" width="600" height="600"></canvas>';
  html+='<table class="results-table"><tr><th>Area</th><th>Punteggio</th></tr>';
  fIds.forEach(id=>{
    html+='<tr><td>'+id+' Competenze</td><td class="'+scoreClass(s.fScores[id].com)+'">'+s.fScores[id].com.toFixed(2)+'</td></tr>';
    html+='<tr><td>'+id+' Risorse</td><td class="'+scoreClass(s.fScores[id].risorse)+'">'+s.fScores[id].risorse.toFixed(2)+'</td></tr>';
    html+='<tr><td><strong>'+id+' Totale</strong></td><td class="'+scoreClass(s.fScores[id].total)+'"><strong>'+s.fScores[id].total.toFixed(2)+'</strong></td></tr>';
  });
  html+='<tr><td><strong>Competenze Trasversali</strong></td><td class="'+scoreClass(s.comTrasv)+'"><strong>'+s.comTrasv.toFixed(2)+'</strong></td></tr>';
  let rNames=['R1','R2','R3','R4','R5'];
  rNames.forEach((rn,i)=>{html+='<tr><td>'+rn+' Trasversale</td><td class="'+scoreClass(s.rTrasv[i])+'">'+s.rTrasv[i].toFixed(2)+'</td></tr>';});
  html+='<tr><td><strong>Risorse Trasversali</strong></td><td class="'+scoreClass(s.risTrasv)+'"><strong>'+s.risTrasv.toFixed(2)+'</strong></td></tr>';
  html+='<tr><td><strong>Punteggio Medio Totale</strong></td><td class="'+scoreClass(s.totalAvg)+'"><strong>'+s.totalAvg.toFixed(2)+'</strong></td></tr>';
  html+='</table>';
  document.getElementById('reportContent').innerHTML=html;
  // Load notes
  document.getElementById('noteOsservazioni').value=s.notes?.osservazioni||'';
  document.getElementById('noteLimiti').value=s.notes?.limiti||'';
  document.getElementById('noteRisorse').value=s.notes?.risorse||'';
  document.getElementById('noteConsigli').value=s.notes?.consigli||'';
  showScreen('reportScreen');
  // Draw radars
  setTimeout(()=>{
    fIds.forEach((fid,fi)=>{
      let labels=secKeys.map(sk=>sectionNames[sk]);
      let values=secKeys.map(sk=>s.scores[fid+sk]||0);
      drawRadar('reportRadar'+fi,labels,values,500);
    });
    let allLabels=[],allValues=[];
    fIds.forEach(id=>{
      allLabels.push(id+' Competenze',id+' Risorse',id+' Totale');
      allValues.push(s.fScores[id].com,s.fScores[id].risorse,s.fScores[id].total);
    });
    allLabels.push('Comp. Trasversali');allValues.push(s.comTrasv);
    rNames.forEach((rn,i)=>{allLabels.push(rn+' Trasversale');allValues.push(s.rTrasv[i]);});
    allLabels.push('Ris. Trasversali','Media Totale');allValues.push(s.risTrasv,s.totalAvg);
    drawRadar('reportRadarAll',allLabels,allValues,600);
  },100);
}

async function saveNotes(){
  if(!currentReportSub||!currentReportSub._id)return;
  await db.collection('submissions').doc(currentReportSub._id).update({
    notes:{
      osservazioni:document.getElementById('noteOsservazioni').value,
      limiti:document.getElementById('noteLimiti').value,
      risorse:document.getElementById('noteRisorse').value,
      consigli:document.getElementById('noteConsigli').value
    }
  });
  showToast('✅ Note salvate');
}

function backToCoachee(){openCoachee(currentCoacheeId);}

// COMPARISON
function compareSelected(){
  let checks=document.querySelectorAll('.sub-check:checked');
  if(checks.length<2){alert('Seleziona almeno 2 valutazioni.');return;}
  let selected=Array.from(checks).map(c=>currentSubmissions[+c.dataset.idx]);
  selected.sort((a,b)=>a.timestamp-b.timestamp);
  let colors=['#c8a96a','#4CAF50','#e74c3c','#3498db','#9b59b6'];
  let fIds=['F1','F2','F3','F4'];
  let scoreKeys=[];
  fIds.forEach(id=>{
    scoreKeys.push({key:id+' Comp.',get:e=>e.fScores[id].com});
    scoreKeys.push({key:id+' Ris.',get:e=>e.fScores[id].risorse});
    scoreKeys.push({key:id+' Tot.',get:e=>e.fScores[id].total,bold:true});
  });
  scoreKeys.push({key:'Comp. Trasv.',get:e=>e.comTrasv,bold:true});
  ['R1','R2','R3','R4','R5'].forEach((rn,i)=>{scoreKeys.push({key:rn+' Trasv.',get:e=>e.rTrasv[i]});});
  scoreKeys.push({key:'Ris. Trasv.',get:e=>e.risTrasv,bold:true});
  scoreKeys.push({key:'Media Tot.',get:e=>e.totalAvg,bold:true});
  let thtml='<table class="results-table"><tr><th>Area</th>';
  selected.forEach((e,i)=>{thtml+='<th style="color:'+colors[i%colors.length]+'">'+e.date+'</th>';});
  if(selected.length===2)thtml+='<th>Δ</th>';
  thtml+='</tr>';
  scoreKeys.forEach(sk=>{
    let tag=sk.bold?'strong':'span';
    thtml+='<tr><td><'+tag+'>'+sk.key+'</'+tag+'></td>';
    selected.forEach((e,i)=>{let v=sk.get(e);thtml+='<td class="'+scoreClass(v)+'"><'+tag+'>'+v.toFixed(2)+'</'+tag+'></td>';});
    if(selected.length===2){
      let d=+(sk.get(selected[1])-sk.get(selected[0])).toFixed(2);
      let cls=d>0?'delta-pos':d<0?'delta-neg':'delta-zero';
      let arrow=d>0?'↑ +':d<0?'↓ ':'';
      thtml+='<td class="'+cls+'"><'+tag+'>'+arrow+d.toFixed(2)+'</'+tag+'></td>';
    }
    thtml+='</tr>';
  });
  thtml+='</table>';
  document.getElementById('compareTable').innerHTML=thtml;
  // Overlay radar
  let labels=scoreKeys.map(sk=>sk.key);
  let baseValues=scoreKeys.map(sk=>sk.get(selected[0]));
  drawRadar('compareRadar',labels,baseValues,600);
  let cc=document.getElementById('compareRadar');
  let ctx=cc.getContext('2d');
  let n=labels.length,cxR=cc.width/2,cyR=cc.height/2,rr=600/2-10;
  for(let si=1;si<selected.length;si++){
    let vals=scoreKeys.map(sk=>sk.get(selected[si]));
    let col=colors[si%colors.length];
    ctx.beginPath();
    for(let i=0;i<=n;i++){let idx=i%n;let a=Math.PI*2*idx/n-Math.PI/2;let v=Math.min(vals[idx],10)/10*rr;ctx.lineTo(cxR+v*Math.cos(a),cyR+v*Math.sin(a));}
    ctx.closePath();ctx.fillStyle=col+'33';ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();
    for(let i=0;i<n;i++){let a=Math.PI*2*i/n-Math.PI/2;let v=Math.min(vals[i],10)/10*rr;ctx.beginPath();ctx.arc(cxR+v*Math.cos(a),cyR+v*Math.sin(a),4,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();}
  }
  let ly=cc.height-10;
  selected.forEach((e,i)=>{ctx.fillStyle=colors[i%colors.length];ctx.font='12px -apple-system,sans-serif';ctx.textAlign='center';ctx.fillText('● '+e.date,cxR+(i-selected.length/2+0.5)*120,ly);});
  document.getElementById('comparisonSection').style.display='block';
  document.getElementById('comparisonSection').scrollIntoView({behavior:'smooth'});
}

// RADAR
function drawRadar(canvasId,labels,values,size,print){
  let c=document.getElementById(canvasId);
  c._radarData={labels,values,size};
  let ctx=c.getContext('2d'),n=labels.length;
  let fontSize=n>10?10:12;
  ctx.font=fontSize+'px -apple-system,sans-serif';
  let maxLabelW=0;labels.forEach(l=>{let w=ctx.measureText(l).width;if(w>maxLabelW)maxLabelW=w;});
  let labelMargin=maxLabelW/2+15;
  let total=size+labelMargin*2;
  c.width=total;c.height=total;
  let cx=total/2,cy=total/2,r=size/2-10;
  let gridCol=print?'rgba(0,0,0,0.15)':'rgba(255,255,255,0.1)';
  let axisCol=print?'rgba(0,0,0,0.25)':'rgba(255,255,255,0.15)';
  let labelCol=print?'#8a6d2b':'#c8a96a';
  let scaleCol=print?'rgba(0,0,0,0.35)':'rgba(255,255,255,0.3)';
  let dataFill=print?'rgba(200,169,106,0.25)':'rgba(200,169,106,0.2)';
  if(print){ctx.fillStyle='#fff';ctx.fillRect(0,0,total,total);}else{ctx.clearRect(0,0,total,total);}
  ctx.font=fontSize+'px -apple-system,sans-serif';
  for(let ring=1;ring<=5;ring++){
    ctx.beginPath();let rr=r*ring/5;
    for(let i=0;i<=n;i++){let a=Math.PI*2*i/n-Math.PI/2;ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}
    ctx.closePath();ctx.strokeStyle=gridCol;ctx.stroke();
  }
  for(let i=0;i<n;i++){
    let a=Math.PI*2*i/n-Math.PI/2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));ctx.strokeStyle=axisCol;ctx.stroke();
    let lx=cx+(r+14)*Math.cos(a),ly=cy+(r+14)*Math.sin(a);
    ctx.fillStyle=labelCol;ctx.font=fontSize+'px -apple-system,sans-serif';
    ctx.textAlign=Math.cos(a)<-0.1?'right':Math.cos(a)>0.1?'left':'center';
    ctx.textBaseline='middle';ctx.fillText(labels[i],lx,ly);
  }
  ctx.beginPath();
  for(let i=0;i<=n;i++){let idx=i%n;let a=Math.PI*2*idx/n-Math.PI/2;let v=Math.min(values[idx],10)/10*r;ctx.lineTo(cx+v*Math.cos(a),cy+v*Math.sin(a));}
  ctx.closePath();ctx.fillStyle=dataFill;ctx.fill();ctx.strokeStyle='#c8a96a';ctx.lineWidth=2;ctx.stroke();
  for(let i=0;i<n;i++){let a=Math.PI*2*i/n-Math.PI/2;let v=Math.min(values[i],10)/10*r;ctx.beginPath();ctx.arc(cx+v*Math.cos(a),cy+v*Math.sin(a),4,0,Math.PI*2);ctx.fillStyle='#c8a96a';ctx.fill();}
  for(let ring=1;ring<=5;ring++){let rr=r*ring/5;ctx.fillStyle=scaleCol;ctx.font='10px sans-serif';ctx.textAlign='left';ctx.fillText((ring*2).toString(),cx+3,cy-rr+3);}
}

// Print support
window.addEventListener('beforeprint',()=>{
  document.querySelectorAll('canvas').forEach(c=>{
    if(c._radarData)drawRadar(c.id,c._radarData.labels,c._radarData.values,c._radarData.size,true);
  });
  document.querySelectorAll('#notesSection textarea').forEach(ta=>{
    let div=document.createElement('div');
    div.className='print-note';
    div.style.whiteSpace='pre-wrap';
    div.style.padding='12px';
    div.style.minHeight='20px';
    div.textContent=ta.value;
    ta.style.display='none';
    ta.parentNode.insertBefore(div,ta.nextSibling);
  });
});
window.addEventListener('afterprint',()=>{
  document.querySelectorAll('canvas').forEach(c=>{
    if(c._radarData)drawRadar(c.id,c._radarData.labels,c._radarData.values,c._radarData.size,false);
  });
  document.querySelectorAll('.print-note').forEach(d=>d.remove());
  document.querySelectorAll('#notesSection textarea').forEach(ta=>{ta.style.display='';});
});

// === SII GUERRIERO SECTION ===
const CORSO_BASE_URL='https://ritadigregorio.it/videocorso/';
let allCorsoClients=[];

function switchTab(tab){
  document.getElementById('tabMatrix').classList.toggle('active',tab==='matrix');
  document.getElementById('tabCorso').classList.toggle('active',tab==='corso');
  document.getElementById('sectionMatrix').style.display=tab==='matrix'?'':'none';
  document.getElementById('sectionCorso').style.display=tab==='corso'?'':'none';
  if(tab==='matrix')showMain();
  else showCorsoMain();
}

function showCorsoScreen(id){
  document.querySelectorAll('#sectionCorso .screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function loadCorsoClients(){
  let snap=await db.collection('corsoClients').orderBy('createdAt','desc').get();
  allCorsoClients=[];
  snap.forEach(doc=>{allCorsoClients.push({id:doc.id,...doc.data()});});
  filterCorsoClients();
}

function filterCorsoClients(){
  let q=(document.getElementById('corsoSearch').value||'').toLowerCase();
  let filtered=allCorsoClients.filter(d=>{
    let text=[d.name,d.surname,d.email].filter(Boolean).join(' ').toLowerCase();
    return text.includes(q);
  });
  let html='';
  if(!allCorsoClients.length){html='<p style="color:rgba(255,255,255,0.5);margin:20px 0">Nessun cliente. Clicca "+ Nuovo Accesso" per iniziare.</p>';}
  else if(!filtered.length){html='<p style="color:rgba(255,255,255,0.5);margin:20px 0">Nessun risultato.</p>';}
  filtered.forEach(d=>{
    let st=corsoTokenStatus(d);
    html+='<div class="card" onclick="openCorsoClient(\''+d.id+'\')">';
    html+='<div class="card-name">'+[d.name,d.surname].filter(Boolean).join(' ')+'</div>';
    html+='<div class="card-meta">'+(d.email||'')+'<span style="color:'+st.color+';margin-left:8px">● '+st.label+'</span></div>';
    html+='</div>';
  });
  document.getElementById('corsoClientList').innerHTML=html;
}

function corsoTokenStatus(d){
  if(d.revoked)return{label:'Revocato',color:'#e74c3c'};
  if(d.expiresAt){
    let exp=d.expiresAt.toDate?d.expiresAt.toDate():new Date(d.expiresAt);
    if(exp<new Date())return{label:'Scaduto',color:'#e74c3c'};
  }
  return{label:'Attivo',color:'#4CAF50'};
}

function showCorsoMain(){showCorsoScreen('corsoMainScreen');loadCorsoClients();}

function showAddCorsoClient(){
  document.getElementById('corsoNewName').value='';
  document.getElementById('corsoNewSurname').value='';
  document.getElementById('corsoNewEmail').value='';
  document.getElementById('corsoNewResult').innerHTML='';
  showCorsoScreen('addCorsoClientScreen');
}

async function createCorsoClient(){
  let name=document.getElementById('corsoNewName').value.trim();
  let surname=document.getElementById('corsoNewSurname').value.trim();
  let email=document.getElementById('corsoNewEmail').value.trim();
  if(!name&&!surname){alert('Inserisci almeno il nome.');return;}
  let token=generateToken();
  await db.collection('corsoClients').doc(token).set({
    name,surname,email,
    createdAt:firebase.firestore.FieldValue.serverTimestamp(),
    revoked:false
  });
  let link=CORSO_BASE_URL+'?token='+token;
  let safeLink=link.replace(/'/g,"\\'");
  document.getElementById('corsoNewResult').innerHTML=
    '<p style="color:#4CAF50;margin:10px 0">✅ Accesso creato!</p>'+
    '<p>Link per il videocorso:</p>'+
    '<div class="token-box">'+link+'</div>'+
    '<div class="nav" style="margin-top:10px">'+
    '<button class="btn btn-sm" onclick="navigator.clipboard.writeText(\''+safeLink+'\');this.textContent=\'Copiato!\'">📋 Copia link</button>'+
    '<button class="btn btn-sm btn-outline" onclick="showAddCorsoClient()">+ Nuovo</button>'+
    '<button class="btn btn-sm btn-outline" onclick="showCorsoMain()">← Lista</button>'+
    '</div>';
}

async function openCorsoClient(id){
  let doc=await db.collection('corsoClients').doc(id).get();
  let d=doc.data();
  let name=[d.name,d.surname].filter(Boolean).join(' ');
  let link=CORSO_BASE_URL+'?token='+id;
  let safeLink=link.replace(/'/g,"\\'");
  let st=corsoTokenStatus(d);
  let html='<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">';
  html+='<div><h2>'+name+'</h2>';
  html+='<p class="card-meta">'+(d.email||'Nessuna email')+'</p></div>';
  html+='<div class="nav">';
  html+='<button class="btn btn-sm btn-outline" onclick="editCorsoClient(\''+id+'\')">✏️ Modifica</button>';
  html+='<button class="btn btn-sm btn-danger" onclick="deleteCorsoClient(\''+id+'\')">🗑️ Elimina</button>';
  html+='</div></div>';
  html+='<div style="margin:15px 0"><strong style="color:#c8a96a">Link di accesso:</strong>';
  html+='<div class="token-row"><div class="token-status" style="color:'+st.color+'">● '+st.label+'</div>';
  html+='<div class="token-box" style="display:flex;align-items:center;gap:8px;justify-content:space-between">';
  html+='<span>'+link+'</span>';
  html+='<div style="display:flex;gap:6px;flex-shrink:0">';
  html+='<button class="btn btn-sm" onclick="navigator.clipboard.writeText(\''+safeLink+'\');this.textContent=\'✓\'">📋</button>';
  if(!d.revoked){
    html+='<button class="btn btn-sm btn-danger" onclick="revokeCorsoClient(\''+id+'\')" title="Revoca accesso">🚫</button>';
  }else{
    html+='<button class="btn btn-sm" onclick="reactivateCorsoClient(\''+id+'\')" title="Riattiva accesso">✅</button>';
  }
  html+='</div></div></div></div>';
  html+='<div class="nav" style="margin-top:20px"><button class="btn btn-outline" onclick="showCorsoMain()">← Torna alla lista</button></div>';
  document.getElementById('corsoClientDetail').innerHTML=html;
  showCorsoScreen('corsoClientScreen');
}

async function editCorsoClient(id){
  let doc=await db.collection('corsoClients').doc(id).get();
  let d=doc.data();
  let name=prompt('Nome:',d.name||'');if(name===null)return;
  let surname=prompt('Cognome:',d.surname||'');if(surname===null)return;
  let email=prompt('Email:',d.email||'');if(email===null)return;
  await db.collection('corsoClients').doc(id).update({name:name.trim(),surname:surname.trim(),email:email.trim()});
  showToast('✅ Dati aggiornati');
  openCorsoClient(id);
}

async function deleteCorsoClient(id){
  if(!confirm('Eliminare questo cliente e il suo accesso?'))return;
  await db.collection('corsoClients').doc(id).delete();
  showToast('🗑️ Cliente eliminato');
  showCorsoMain();
}

async function revokeCorsoClient(id){
  if(!confirm('Revocare l\'accesso al videocorso?'))return;
  await db.collection('corsoClients').doc(id).update({revoked:true});
  showToast('🚫 Accesso revocato');
  openCorsoClient(id);
}

async function reactivateCorsoClient(id){
  await db.collection('corsoClients').doc(id).update({revoked:false});
  showToast('✅ Accesso riattivato');
  openCorsoClient(id);
}
