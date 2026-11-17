// Walks every screen/state of Terra and collects visible strings. Usage: node walk.js <lang> <out.json>
const {chromium}=require('playwright');
const LANG=process.argv[2]||'en', OUT=process.argv[3]||'strings.json';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript((lang)=>{ if(sessionStorage.getItem('seeded')) return; sessionStorage.setItem('seeded','1'); localStorage.clear();
  localStorage.setItem('terra.lang',lang);
  const dk=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const W=[],M=[];for(let i=40;i>=1;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dk(d);const tr=i%3===0;if(tr)W.push({id:'w'+i,d:k,type:['Run','Gym','Walk','Yoga'][i%4],mins:30,effort:['Easy','Medium','Hard'][i%3]});M.push({t:d.getTime(),d:k,m:['energized','happy','calm','tired','scattered','low'][i%6],src:i%5===0?'moment':'manual'});}
  localStorage.setItem('terra.v1',JSON.stringify({v:1,onboarded:true,toured:true,xp:340,name:'Roni',tab:'today',plan:'free',profile:{struggles:['Getting started','Remembering things'],dayStart:'07:00 to 09:00',goals:['Calmer mornings','Better sleep'],energy:'Some'},routines:[{id:'r1',name:'Gentle morning',slot:'morning',anchor:'After I turn off my alarm',steps:[{id:'s1',text:'Drink a glass of water',mins:1},{id:'s2',text:'Open the curtains',mins:1}]},{id:'r2',name:'Evening wind-down',slot:'evening',anchor:'After I brush my teeth',steps:[{id:'s3',text:'Dim the lights',mins:1}]}],reminders:[{id:'m1',text:'Start your morning steps',time:'08:00'}],log:{},skip:{},chat:[],settings:{sound:false,calm:true,banners:true,notify:'on',nudge:20},moment:{dur:1,pat:'calm'},notified:{},workouts:W,wGoal:3}));
  localStorage.setItem('terra.health.v1',JSON.stringify({consent:{mood:true,cycle:true,insights:true,aiSummary:false},asked:{mood:true},moods:M,cycle:{starts:[dk(new Date(Date.now()-20*864e5))],plen:5,len:28,sym:{}},screen:{},fb:{}}));
},LANG);
await p.goto('file:///home/claude/terra/test.html');await p.waitForTimeout(600);
const all=new Set();
const grab=async(tag)=>{const r=await p.evaluate(()=>{const out=new Set();const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){const pe=n.parentElement;if(!pe||pe.closest('script,style')||pe.closest('#tour .tip .tw'))continue;const t=n.nodeValue.trim();if(t)out.add(t);}document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>['placeholder','aria-label','title'].forEach(a=>{const v=e.getAttribute(a);if(v&&v.trim())out.add(v.trim())}));document.querySelectorAll('#tour .tip .tw').forEach(e=>out.add(e.getAttribute('aria-label')));return[...out];});r.forEach(x=>all.add(x));};
const ev=async(fn,arg)=>{try{await p.evaluate(fn,arg);}catch(e){errs.push('EV '+e.message)}await p.waitForTimeout(120);};
const close=async()=>{await ev(()=>{closeSheet();document.querySelectorAll('.celebrate,.toast').forEach(x=>x.remove());$('#paywall')?.remove();$('#tour')?.remove();});};
// main tabs
for(const t of ['today','routines','workouts','you','terra']){await ev(t=>{S.tab=t;S.youSec=null;render();},t);await grab(t);}
for(const sec of ['settings']){await ev(s=>{S.tab='you';S.youSec=s;render();},sec);await grab(sec);}
await ev(()=>{S.tab='routines';editRoutine=S.routines[0]?.id;render();});await grab();await ev(()=>{editRoutine=null;});
for(const sec of ['workouts','mood']){await ev(s=>{S.tab='you';S.youSec=s;render();},sec);await grab(sec);}
// consents off variants
await ev(()=>{H.consent={mood:false,cycle:false,insights:false,aiSummary:false};H.asked.mood=false;for(const s of ['workouts','mood','cycle','screen']){}S.tab='you';S.youSec='mood';render();});await grab();
await ev(()=>{H.moods=H.moods.map(m=>({...m,m:'low',t:Date.now()-864e5*2}));render();S.tab='today';render();});await grab();
await ev(()=>{H.consent.insights=true;H.moods=[];S.tab='you';S.youSec='mood';render();});await grab();
// today variants
await ev(()=>{S.tab='today';const r=S.routines;S.routines=[];render();window.__r=r;});await grab();
await ev(()=>{S.routines=window.__r;S.routines.forEach(r=>r.steps.forEach(s=>dayLog().s.push(s.id)));render();});await grab();
await ev(()=>{S.log={};S.reminders=[];render();});await grab();
// sheets
for(const f of ['routineSheet()','remSheet()','workoutSheet()',"moodSheet('moment')","moodConsentSheet('moment')","calSheet('routine','r1')","calSheet('reminder','x')"]){await ev(f=>{eval(f)},f);await grab();await close();}
await ev(()=>{S.reminders=[{id:'m1',text:'Start your morning steps',time:'08:00'}];calSheet('reminder','m1');});await grab();await close();
// routines states
await ev(()=>{S.tab='routines';openAdd='r1';confirmDel='r2';render();});await grab();
await ev(()=>{openAdd=null;confirmDel=null;S.plan='pro';render();});await grab();
// settings states
await ev(()=>{S.tab='prefs';confirmReset=true;privConfirm='mood';render();});await grab();
await ev(()=>{confirmReset=false;privConfirm='mood';render();});await grab();
await ev(()=>{privConfirm='health';S.settings.notify='off';render();});await grab();
await ev(()=>{privConfirm=null;S.plan='free';S.trial={start:Date.now(),end:Date.now()+5*864e5};render();});await grab();
await ev(()=>{S.trial=null;S.plan='ultimate';render();});await grab();
// terra
await ev(()=>{S.plan='free';S.trial=null;S.tab='terra';render();});await grab();
await ev(()=>{S.plan='pro';SAMPLE=null;SAMPLE_READY=true;render();});await grab();
await ev(()=>{SAMPLE=()=>{};S.chat=[];render();});await grab();
await ev(()=>{S.chat=[{role:'user',content:'hi'},{role:'assistant',content:'ok',added:'Added reminder: x at 09:00'}];aiBusy=true;render();aiBusy=false;});await grab();
// moment states
await ev(()=>{S.tab='moment';S.plan='free';render();});await grab();
// paywall
for(const st of [{plan:'free',trial:null,bill:'yearly'},{plan:'free',trial:null,bill:'monthly'},{plan:'free',trial:'active',bill:'monthly'},{plan:'free',trial:'used',bill:'yearly'},{plan:'pro',trial:'used',bill:'monthly'},{plan:'ultimate',trial:null,bill:'yearly'}]){
  await ev(st=>{S.plan=st.plan;S.trial=st.trial==='active'?{start:Date.now(),end:Date.now()+5*864e5}:st.trial==='used'?{start:0,end:1,endNotified:true}:null;openPaywall('Free includes 3 routines. Pro gives you as many as you need.');pwState.billing=st.bill;promoMsg=null;renderPaywall();document.querySelector('.promo-mini')?.setAttribute('open','');},st);await grab();}
await ev(()=>{promoMsg={ok:false,text:'That code doesn\'t match an active offer. Check the spelling and try again.'};renderPaywall();});await grab();
await ev(()=>{promoMsg={ok:true,text:'Pro is unlocked.'};renderPaywall();});await grab();await close();
// tour
await ev(()=>{S.plan='free';S.trial=null;startTour();});await p.waitForTimeout(500);
for(let i=0;i<9;i++){await grab();await ev(()=>tourGo(1));await p.waitForTimeout(250);}
await close();
// onboarding
await ev(()=>{S.onboarded=false;OB={i:0,a:{name:'Roni',struggles:['Getting started','Forgetting to eat or drink'],dayStart:'07:00 to 09:00',windDown:'22:00 to 23:30',goals:['Calmer mornings','Less stress'],nudges:'Keep me on track',energy:'Small'},plan:null,err:'',more:{struggles:true,goals:true}};render();});
for(let i=0;i<11;i++){await ev(i=>{if(OB_STEPS[i]==='building'){OB.i=i;}else{OB.plan=OB.plan||localPlan(OB.a);obGo(i);}},i);await p.waitForTimeout(300);await grab();}
await ev(()=>{OB.plan=localPlan(OB.a);obGo(OB_STEPS.indexOf('preview'));OB.unsure=true;renderOnboarding();});await grab();
await ev(()=>{OB.a.name='';obGo(2);});await grab();
await ev(()=>{OB.more={};obGo(3);});await grab();
await ev(()=>{const pb=document.querySelector('#ob .building');});
require('fs').writeFileSync(OUT,JSON.stringify([...all].sort(),null,1));
console.log(all.size,'strings; errors:',errs.slice(0,5));await b.close();})();
