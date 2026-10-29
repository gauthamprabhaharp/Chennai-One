(()=>{
"use strict";
const KEY="chennaipulse_reports_v1";
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
let photoData=null,lastId=null,timer=null;
const samples=[
{id:"CHP-2081",category:"Road damage / pothole",area:"Anna Nagar",street:"Near a main-road bus stop",description:"Sample report showing how a road-surface concern appears on the community board.",status:"Under review",date:"2026-10-25",photo:null},
{id:"CHP-2082",category:"Garbage / illegal dumping",area:"Adyar",street:"Near a neighbourhood park entrance",description:"Sample report reminding residents to provide a clear location and useful details.",status:"Submitted",date:"2026-10-26",photo:null},
{id:"CHP-2083",category:"Streetlight not working",area:"T. Nagar",street:"Near a residential street junction",description:"Sample report for a streetlight that may need inspection. Illustrative content only.",status:"Resolved",date:"2026-10-20",photo:null}
];
function read(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return []}}
function save(a){try{localStorage.setItem(KEY,JSON.stringify(a));return true}catch(e){toast("Browser storage is full. Try removing the photo or using a smaller image.");return false}}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(s){const t=$("#toast");if(!t)return;t.textContent=s;t.classList.add("show");clearTimeout(timer);timer=setTimeout(()=>t.classList.remove("show"),3200)}
function openModal(){$("#modal").hidden=false;document.body.style.overflow="hidden"}
function closeModal(){$("#modal").hidden=true;document.body.style.overflow=""}
function dateLabel(d){const x=new Date(d);return isNaN(x)?"Date unavailable":x.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
function allReports(){return [...read(),...samples]}
function render(){
 let all=allReports(),cat=$("#filterCategory").value,status=$("#filterStatus").value;
 all=all.filter(r=>(cat==="all"||r.category===cat)&&(status==="all"||r.status===status));
 $("#count").textContent=String(read().length+samples.length);
 $("#reportList").innerHTML=all.length?all.map(r=>`<article class="report-card"><div class="report-photo">${r.photo?`<img src="${r.photo}" alt="Uploaded issue photo">`:"📍　No photo attached"}</div><div class="report-body"><div class="report-top"><span class="tag">${esc(r.category)}</span><span class="status ${r.status.toLowerCase().replace(/\s+/g,"-")}">${esc(r.status)}</span></div><h3>${esc(r.area)}</h3><p><b>${esc(r.street)}</b></p><p>${esc(r.description)}</p><div class="meta"><span>${esc(r.id)}</span><span>${esc(dateLabel(r.date))}</span></div></div></article>`).join(""):'<div class="empty">No reports match these filters. Try another category or status.</div>';
}
function categories(){
 const s=$("#filterCategory"),old=s.value,cats=[...new Set(allReports().map(r=>r.category))].sort();
 s.innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
 if(cats.includes(old))s.value=old;
}
function findTrackedReport(id){
 const normalized=String(id||"").trim().toUpperCase();
 return allReports().find(r=>String(r.id).trim().toUpperCase()===normalized);
}
function renderTrackedReport(r){
 const out=$("#trackingResult");
 if(!r){
  out.innerHTML='<span class="tracker-symbol">?</span><div><b>No report found</b><p>Check the reference ID and try again. Reports submitted on another device are not available in this local demo.</p></div>';
  return;
 }
 const stages=["Submitted","Under review","In progress","Resolved"];
 const current=Math.max(0,stages.indexOf(r.status));
 const timeline=stages.map((s,i)=>`<div class="timeline-item ${i<=current?"":"pending"}"><span class="timeline-dot">${i<current?"✓":i===current?"●":"·"}</span><span><b>${s}</b><small>${i<current?"Previous step completed":i===current?"Current status":"Next step"}</small></span></div>`).join("");
 out.innerHTML=`<span class="tracker-symbol">✓</span><div><b>${esc(r.category)}</b><p>${esc(r.area)} · ${esc(r.street)}</p><p>Reference: <b>${esc(r.id)}</b> · Submitted ${esc(dateLabel(r.date))}</p><p>${esc(r.description)}</p><span class="status ${r.status.toLowerCase().replace(/\s+/g,"-")}">${esc(r.status)}</span><div class="timeline">${timeline}</div>${r.photo?`<p><b>Uploaded photo</b><br><img src="${r.photo}" alt="Report photo" style="display:block;max-width:220px;max-height:160px;object-fit:cover;border-radius:8px;margin-top:8px"></p>`:""}</div>`;
}
$$("[data-open]").forEach(b=>b.addEventListener("click",openModal));
$("#close").addEventListener("click",closeModal);
$("#modal").addEventListener("click",e=>{if(e.target===$("#modal"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#modal").hidden)closeModal()});
$("#filterCategory").addEventListener("change",render);
$("#filterStatus").addEventListener("change",render);
$("#photo").addEventListener("change",()=>{
 const f=$("#photo").files[0];photoData=null;
 if(!f){$("#preview").hidden=true;return}
 if(!["image/jpeg","image/png","image/webp"].includes(f.type)){$("#photo").value="";toast("Choose a JPG, PNG, or WebP image.");return}
 if(f.size>5*1024*1024){$("#photo").value="";toast("Please choose an image smaller than 5 MB.");return}
 const reader=new FileReader();
 reader.onload=()=>{photoData=reader.result;$("#previewImg").src=photoData;$("#fileName").textContent=f.name;$("#fileSize").textContent=Math.round(f.size/1024)+" KB";$("#preview").hidden=false};
 reader.onerror=()=>toast("Could not read that image.");
 reader.readAsDataURL(f);
});
$("#remove").addEventListener("click",()=>{photoData=null;$("#photo").value="";$("#previewImg").removeAttribute("src");$("#preview").hidden=true});
function idFor(a){let id;do{id="CHP-"+Math.floor(1000+Math.random()*9000)}while(a.some(r=>r.id===id));return id}
$("#issueForm").addEventListener("submit",e=>{
 e.preventDefault();
 const a=read(),r={id:idFor([...a,...samples]),category:$("#category").value,area:$("#area").value.trim(),pincode:$("#pincode").value.trim(),street:$("#street").value.trim(),description:$("#description").value.trim(),reporter:$("#reporter").value.trim(),status:"Submitted",date:new Date().toISOString(),photo:photoData};
 a.unshift(r);if(!save(a))return;
 lastId=r.id;$("#reference").textContent=r.id;$("#issueForm").hidden=true;$("#success").hidden=false;
 categories();render();toast("Report saved in this browser.");
});
$("#viewReport").addEventListener("click",()=>{
 closeModal();
 $("#trackingId").value=lastId||"";
 $("#tracking").scrollIntoView({behavior:"smooth"});
 if(lastId)renderTrackedReport(findTrackedReport(lastId));
});
$("#trackingForm").addEventListener("submit",e=>{e.preventDefault();renderTrackedReport(findTrackedReport($("#trackingId").value));});
$("#sampleTracking").addEventListener("click",()=>{$("#trackingId").value="CHP-2081";renderTrackedReport(findTrackedReport("CHP-2081"));});
$("#menu").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$('#nav a').forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));
if("IntersectionObserver"in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)$$('#nav a').forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id))}),{rootMargin:"-35% 0px -55% 0px"});
 ["home","how","updates","tracking","reports"].forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});
}
categories();render();
})();