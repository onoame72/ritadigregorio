let answers={},currentSection=0,allSections=[],userName='',userSurname='',userAge='',userDate='';
let tokenId='',coacheeId='';

async function init(){
  DATA.forEach(f=>{f.sections.forEach(s=>{allSections.push({...s,fId:f.fId,fName:f.fName});});});
  let d=new Date();document.getElementById('userDate').value=d.toLocaleDateString('it-IT');
  // Validate token
  let params=new URLSearchParams(window.location.search);
  tokenId=params.get('token')||'';
  if(!tokenId){showInvalid('Link mancante.');return;}
  try{
    let doc=await db.collection('tokens').doc(tokenId).get();
    if(!doc.exists){showInvalid('Questo link non è valido.');return;}
    let data=doc.data();
    if(data.used===true){showInvalid('Questo link è già stato utilizzato. Contatta il tuo coach per ricevere un nuovo link.');return;}
    let exp=data.expiresAt&&data.expiresAt.toDate?data.expiresAt.toDate():null;
    if(exp&&exp<new Date()){showInvalid('Questo link è scaduto. Contatta il tuo coach per ricevere un nuovo link.');return;}
    coacheeId=data.coacheeId||'';
    // Pre-fill and lock name/surname if present in token
    if(data.name){
      let el=document.getElementById('userName');
      el.value=data.name;el.readOnly=true;el.style.opacity='0.7';
    }
    if(data.surname){
      let el=document.getElementById('userSurname');
      el.value=data.surname;el.readOnly=true;el.style.opacity='0.7';
    }
  }catch(e){console.error(e);showInvalid('Impossibile verificare il link.');return;}
}
init();

function showInvalid(msg){
  let p=document.querySelector('#screen-invalid p');
  if(p&&msg)p.innerHTML=msg;
  showScreen('screen-invalid');
}

function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo(0,0);}

function updateProgress(){
  let total=0,done=0;
  allSections.forEach(s=>{total+=s.items.length;s.items.forEach((_,i)=>{if(answers[s.id]&&answers[s.id][i]!==undefined)done++;});});
  document.getElementById('progressBar').style.width=(done/total*100)+'%';
}

// LOCAL STORAGE AUTOSAVE
function storageKey(){return 'lm-progress-'+tokenId;}
function saveProgress(){
  try{localStorage.setItem(storageKey(),JSON.stringify({answers,currentSection}));}catch(e){}
}
function loadProgress(){
  try{
    let raw=localStorage.getItem(storageKey());
    if(!raw)return false;
    let saved=JSON.parse(raw);
    if(saved.answers)answers=saved.answers;
    if(typeof saved.currentSection==='number')currentSection=saved.currentSection;
    return true;
  }catch(e){return false;}
}
function clearProgress(){try{localStorage.removeItem(storageKey());}catch(e){}}

function startTest(){
  userName=document.getElementById('userName').value||'';
  userSurname=document.getElementById('userSurname').value||'';
  userAge=document.getElementById('userAge').value||'';
  userDate=document.getElementById('userDate').value||new Date().toLocaleDateString('it-IT');
  if(loadProgress()&&Object.keys(answers).length>0){
    renderSection();showScreen('screen-questions');
  }else{
    currentSection=0;renderSection();showScreen('screen-questions');
  }
}

function renderSection(){
  let s=allSections[currentSection];
  document.getElementById('sectionLabel').textContent=s.fId+' '+s.fName;
  document.getElementById('sectionTitle').textContent=s.name;
  let html='';
  s.items.forEach((q,i)=>{
    let val=answers[s.id]&&answers[s.id][i]!==undefined?answers[s.id][i]:-1;
    html+='<div class="question-card"><div class="question-text">'+(i+1)+'. '+q+'</div><div class="rating-row">';
    for(let n=0;n<=10;n++){html+='<button class="rating-btn'+(val===n?' selected':'')+'" onclick="rate(\''+s.id+'\','+i+','+n+',this)">'+n+'</button>';}
    html+='</div></div>';
  });
  document.getElementById('questionsContainer').innerHTML=html;
  document.getElementById('sectionCounter').textContent='Sezione '+(currentSection+1)+' di '+allSections.length;
  document.getElementById('prevBtn').style.visibility=currentSection>0?'visible':'hidden';
  document.getElementById('nextBtn').textContent=currentSection===allSections.length-1?'Invia risultati →':'Avanti →';
  updateProgress();
}

function rate(sId,idx,val,el){
  if(!answers[sId])answers[sId]=[];
  answers[sId][idx]=val;
  el.parentNode.querySelectorAll('.rating-btn').forEach(b=>b.classList.remove('selected'));
  el.classList.add('selected');
  el.closest('.question-card').style.borderColor='#333';
  updateProgress();
  saveProgress();
}

function calcScore(sId){
  let s=allSections.find(x=>x.id===sId);
  if(!answers[sId])return 0;
  let sum=0;s.items.forEach((_,i)=>{sum+=(answers[sId][i]||0);});
  return+(sum/s.div).toFixed(2);
}

function isEndOfFoundation(){
  let cur=allSections[currentSection];
  let next=allSections[currentSection+1];
  return !next||next.fId!==cur.fId;
}

function sectionComplete(){
  let s=allSections[currentSection];
  return answers[s.id]&&s.items.every((_,i)=>answers[s.id][i]!==undefined);
}

function nextSection(){
  if(!sectionComplete()){
    let s=allSections[currentSection];
    let first=null;
    document.querySelectorAll('.question-card').forEach((card,i)=>{
      if(!answers[s.id]||answers[s.id][i]===undefined){card.style.borderColor='#e74c3c';if(!first)first=card;}
      else card.style.borderColor='#333';
    });
    if(first)first.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  if(currentSection===allSections.length-1){submitResults();return;}
  currentSection++;saveProgress();renderSection();showScreen('screen-questions');
}

function prevSection(){
  if(currentSection>0){currentSection--;saveProgress();renderSection();showScreen('screen-questions');}
}

function showFoundationRadar(){
  let cur=allSections[currentSection];
  let fSections=allSections.filter(s=>s.fId===cur.fId);
  let labels=fSections.map(s=>s.name);
  let values=fSections.map(s=>calcScore(s.id));
  document.getElementById('radarLabel').textContent=cur.fId;
  document.getElementById('radarTitle').textContent=cur.fName;
  drawRadar('radarCanvas',labels,values,500);
  let html='<table class="results-table"><tr><th>Sezione</th><th>Punteggio</th></tr>';
  fSections.forEach((s,i)=>{html+='<tr><td>'+s.id+' '+s.name+'</td><td class="'+scoreClass(values[i])+'">'+values[i].toFixed(2)+'</td></tr>';});
  html+='</table>';
  document.getElementById('radarScores').innerHTML=html;
  showScreen('screen-radar');
}

function continueAfterRadar(){currentSection++;renderSection();showScreen('screen-questions');}

function scoreClass(v){return v>=7?'score-high':v>=4?'score-mid':'score-low';}

function drawRadar(canvasId,labels,values,size){
  let c=document.getElementById(canvasId);
  let ctx=c.getContext('2d'),n=labels.length;
  let fontSize=n>10?10:12;
  ctx.font=fontSize+'px -apple-system,sans-serif';
  let maxLabelW=0;labels.forEach(l=>{let w=ctx.measureText(l).width;if(w>maxLabelW)maxLabelW=w;});
  let labelMargin=maxLabelW/2+15;
  let total=size+labelMargin*2;
  c.width=total;c.height=total;
  let cx=total/2,cy=total/2,r=size/2-10;
  ctx.clearRect(0,0,total,total);
  ctx.font=fontSize+'px -apple-system,sans-serif';
  for(let ring=1;ring<=5;ring++){
    ctx.beginPath();let rr=r*ring/5;
    for(let i=0;i<=n;i++){let a=Math.PI*2*i/n-Math.PI/2;ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}
    ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.stroke();
  }
  for(let i=0;i<n;i++){
    let a=Math.PI*2*i/n-Math.PI/2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.stroke();
    let lx=cx+(r+14)*Math.cos(a),ly=cy+(r+14)*Math.sin(a);
    ctx.fillStyle='#c8a96a';ctx.font=fontSize+'px -apple-system,sans-serif';
    ctx.textAlign=Math.cos(a)<-0.1?'right':Math.cos(a)>0.1?'left':'center';
    ctx.textBaseline='middle';ctx.fillText(labels[i],lx,ly);
  }
  ctx.beginPath();
  for(let i=0;i<=n;i++){let idx=i%n;let a=Math.PI*2*idx/n-Math.PI/2;let v=Math.min(values[idx],10)/10*r;ctx.lineTo(cx+v*Math.cos(a),cy+v*Math.sin(a));}
  ctx.closePath();ctx.fillStyle='rgba(200,169,106,0.2)';ctx.fill();ctx.strokeStyle='#c8a96a';ctx.lineWidth=2;ctx.stroke();
  for(let i=0;i<n;i++){let a=Math.PI*2*i/n-Math.PI/2;let v=Math.min(values[i],10)/10*r;ctx.beginPath();ctx.arc(cx+v*Math.cos(a),cy+v*Math.sin(a),4,0,Math.PI*2);ctx.fillStyle='#c8a96a';ctx.fill();}
  for(let ring=1;ring<=5;ring++){let rr=r*ring/5;ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='10px sans-serif';ctx.textAlign='left';ctx.fillText((ring*2).toString(),cx+3,cy-rr+3);}
}

async function submitResults(){
  showScreen('screen-submitting');
  let scores={},fScores={};
  let fIds=['F1','F2','F3','F4'];
  allSections.forEach(s=>{scores[s.id]=calcScore(s.id);});
  fIds.forEach(id=>{
    let f=DATA.find(x=>x.fId===id);
    let rSc=f.sections.filter(s=>s.id!==id+'Com').map(s=>scores[s.id]);
    let rAvg=rSc.length?+(rSc.reduce((a,b)=>a+b,0)/rSc.length).toFixed(2):0;
    let com=scores[id+'Com'],tot=+((com+rAvg)/2).toFixed(2);
    fScores[id]={com:com,risorse:rAvg,total:tot};
  });
  let comTrasv=+(fIds.map(id=>fScores[id].com).reduce((a,b)=>a+b,0)/4).toFixed(2);
  let rNames=['R1','R2','R3','R4','R5'],rTrasv=[];
  rNames.forEach(rn=>{rTrasv.push(+(fIds.map(fid=>scores[fid+rn]).reduce((a,b)=>a+b,0)/4).toFixed(2));});
  let risTrasv=+(rTrasv.reduce((a,b)=>a+b,0)/5).toFixed(2);
  let vals=Object.values(scores);
  let totalAvg=+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2);
  try{
    // Atomic: consume the token and create the submission in one transaction.
    // If the token is already used or expired (race), the transaction fails and
    // nothing is persisted.
    let tokenRef=db.collection('tokens').doc(tokenId);
    let submissionRef=db.collection('submissions').doc();
    await db.runTransaction(async tx=>{
      let tSnap=await tx.get(tokenRef);
      if(!tSnap.exists)throw new Error('Link non valido.');
      let tData=tSnap.data();
      if(tData.used===true)throw new Error('Questo link è già stato utilizzato.');
      let exp=tData.expiresAt&&tData.expiresAt.toDate?tData.expiresAt.toDate():null;
      if(exp&&exp<new Date())throw new Error('Questo link è scaduto.');
      tx.update(tokenRef,{
        used:true,
        usedAt:firebase.firestore.FieldValue.serverTimestamp(),
        submissionId:submissionRef.id
      });
      tx.set(submissionRef,{
        token:tokenId,coacheeId:coacheeId,
        name:userName,surname:userSurname,age:userAge,date:userDate,
        timestamp:Date.now(),answers:answers,scores:scores,fScores:fScores,
        comTrasv:comTrasv,rTrasv:rTrasv,risTrasv:risTrasv,totalAvg:totalAvg
      });
    });
    clearProgress();
    showScreen('screen-thanks');
    fetch('https://script.google.com/macros/s/AKfycbydHUIzFMDdr3wUbi5tFG50GfTjMq7s06bweka25VuF4DIaqUH1O-Y1fgbbVLa-EmCL/exec',{
      method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},
      body:JSON.stringify({name:[userName,userSurname].filter(Boolean).join(' '),date:userDate,totalAvg:totalAvg})
    }).catch(()=>{});
  }catch(e){
    console.error(e);
    alert('Errore nell\'invio: '+(e.message||e));
    showScreen('screen-questions');
  }
}
