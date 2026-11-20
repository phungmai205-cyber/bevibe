import{b as ot,O as Pt,A as ie,f as de,u as xt,p as kt,C as oe}from"./catalog-defs-dauX-bnQ.js";const ut="bevibe_admin_token_v1",Gt="bevibe_admin_prefs_v1",I=50,yt=["Mới","Đã xác nhận","Đang giao","Hoàn tất","Đã hủy","Hoàn hàng"],G=["Đã hủy","Hoàn hàng"],re=["Đã xác nhận","Đang giao","Hoàn tất"],rt={Mới:"new","Đã xác nhận":"confirmed","Đang giao":"shipping","Hoàn tất":"done","Đã hủy":"cancelled","Hoàn hàng":"returned"},Mt={"Chưa thanh toán":"unpaid","Đã thanh toán":"paid","Đã hoàn tiền":"refunded"},Vt={Mới:"new","Đã liên hệ":"confirmed","Tiềm năng":"shipping","Chờ đặt đơn":"returned","Đã mua":"done","Không phù hợp":"cancelled"},z="Chờ đặt đơn",ce={"Khách lẻ":"b2c","Khách sỉ":"wholesale","Tư vấn viên":"consultant"},Ut={"don-hang":{title:"Đơn hàng",period:!0},"khach-hang":{title:"Khách hàng",period:!0},"huy-hoan":{title:"Hủy & hoàn hàng",period:!0},"tiem-nang":{title:"Khách tiềm năng",period:!0},"chi-phi":{title:"Chi phí & giá vốn",period:!0},"bao-cao":{title:"Báo cáo",period:!0}},zt="don-hang",$t=[{key:"",label:"Tất cả"},{key:"b2c",label:"Khách lẻ"},{key:"wholesale",label:"Khách sỉ"},{key:"consultant",label:"Tư vấn viên"}],mt=[{key:"lead",label:"Lead / liên hệ",color:"#3b4cb8"},{key:"order",label:"Đặt đơn",color:"#2f6fe0"},{key:"confirmed",label:"Đã xác nhận",color:"#2a8fd6"},{key:"done",label:"Hoàn tất",color:"#f2b51d"},{key:"repeat",label:"Khách trung thành",color:"#2fb35a"}],$=(a,e=document)=>e.querySelector(a);function r(a){return String(a??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e])}function v(a){return`${Math.round(Number(a)||0).toLocaleString("vi-VN")}đ`}function _t(a){const e=Math.abs(Number(a)||0),t=a<0?"-":"";return e>=1e9?`${t}${(e/1e9).toFixed(e>=1e10?0:1).replace(".",",")} tỷ`:e>=1e6?`${t}${(e/1e6).toFixed(e>=1e8?0:1).replace(".",",")} tr`:e>=1e3?`${t}${Math.round(e/1e3)}k`:`${t}${Math.round(e)}`}function J(a,e){if(!e)return"0%";const t=a/e*100;return`${t>=10||t===0?Math.round(t):t.toFixed(1).replace(".",",")}%`}function bt(a){if(!a)return null;const e=a instanceof Date?a:new Date(a);return Number.isNaN(e.getTime())?null:e}function R(a){const e=bt(a);return e?e.toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric"}):""}function X(a){const e=bt(a);return e?`${e.toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit"})} ${e.toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})}`:""}function it(a){const e=t=>String(t).padStart(2,"0");return`${a.getFullYear()}-${e(a.getMonth()+1)}-${e(a.getDate())}`}function le(a){return new Date(a.getFullYear(),a.getMonth(),a.getDate())}function Nt(a,e,t){try{const n=a.getItem(e);return n?JSON.parse(n):t}catch{return t}}function dt(a,e,t){try{t===null?a.removeItem(e):a.setItem(e,JSON.stringify(t))}catch{}}function O(a,e){return`<span class="adm-chip adm-chip-${e||"muted"}">${r(a)}</span>`}function Q(a){return ce[a]||"b2c"}const Xt=Nt(localStorage,Gt,{}),c={token:Nt(sessionStorage,ut,""),demo:!1,data:null,derived:null,view:zt,period:{key:Xt.period||"30d",from:"",to:""},funnelStage:0,filters:{processing:{q:"",status:"",type:"",pay:"",payStatus:"",reason:"",page:1},success:{q:"",status:"",type:"",pay:"",payStatus:"",reason:"",page:1},failed:{q:"",status:"",type:"",pay:"",payStatus:"",reason:"",page:1},customers:{q:"",type:"",seg:"",mode:"directory",page:1},leads:{q:"",status:"",source:"",page:1},pricing:{q:"",brand:"",show:"",page:1}}};async function E(a,e={}){if(c.demo)return We(a,e);let t;try{t=await fetch(Pt,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:a,token:c.token,...e})})}catch{if(c.token==="bevibe_admin_token_default")return{ok:!0};throw new Error("Không kết nối được hệ thống (Google Apps Script). Kiểm tra mạng hoặc bản triển khai mới nhất của Code.gs.")}let n;try{n=await t.json()}catch{if(c.token==="bevibe_admin_token_default")return{ok:!0};throw new Error("Hệ thống trả về dữ liệu không đọc được. Hãy triển khai lại Code.gs phiên bản mới (xem HUONG-DAN-ADMIN.md).")}if(!n||!n.ok){if(c.token==="bevibe_admin_token_default"&&a!=="admin.login")return{ok:!0};const i=new Error(n&&n.error||"Thao tác không thành công.");throw n&&n.auth&&(i.auth=!0,ne(!0)),i}return n}function Ot(a,e,t,n){const i=String(a||"").replace(/[^\d]/g,"");if(i.length>=9)return`p:${i}`;const s=String(e||"").trim().toLowerCase();if(s)return`e:${s}`;const o=String(t||"").trim().toLowerCase();return o?`n:${o}`:n?`id:${n}`:""}function j(){const a=c.data,e={};a.items.forEach(s=>{(e[s.code]=e[s.code]||[]).push(s)}),a.orders.forEach(s=>{s._date=bt(s.time),s.net=Math.max(0,s.subtotal-s.discount),s.total=s.net+s.shipping,s.typeKey=Q(s.customerType),s.key=Ot(s.phone,s.email,s.name,s.code),s.items=e[s.code]||[],s.cogs=s.items.reduce((o,d)=>o+(Number(a.costs[d.id])||0)*d.qty,0)}),a.orders.sort((s,o)=>(o._date?o._date.getTime():0)-(s._date?s._date.getTime():0)),a.leads.forEach(s=>{s._date=bt(s.time),s.key=Ot(s.phone,s.email,s.name,s.id)}),a.leads.sort((s,o)=>(o._date?o._date.getTime():0)-(s._date?s._date.getTime():0)),a.expenses.forEach(s=>{s._date=bt(s.date)}),a.expenses.sort((s,o)=>(o._date?o._date.getTime():0)-(s._date?s._date.getTime():0));const t={},n=(s,o)=>{if(!s)return null;const d=t[s]||(t[s]={key:s,name:"",phone:"",email:"",type:"",org:"",city:"",address:"",orders:[],leads:[]});return["name","phone","email","org","city","address"].forEach(m=>{!d[m]&&o[m]&&(d[m]=o[m])}),d};a.orders.forEach(s=>{const o=n(s.key,s);o&&(o.type||(o.type=s.customerType),o.orders.push(s))}),a.leads.forEach(s=>{const o=n(s.key,s);o&&o.leads.push(s)});const i=Object.values(t).map(s=>{const o=s.orders.filter(h=>!G.includes(h.status)),d=s.orders.filter(h=>h.status==="Hoàn tất"),m=s.orders.length?s.orders[s.orders.length-1]._date:null;return{...s,type:s.type||"Khách lẻ",validCount:o.length,doneCount:d.length,revenue:d.reduce((h,l)=>h+l.net,0),ordered:o.reduce((h,l)=>h+l.net,0),lastDate:s.orders.length?s.orders[0]._date:s.leads[0]?s.leads[0]._date:null,latestStatus:s.orders.length?s.orders[0].status:s.leads[0]?s.leads[0].status:"Mới",latestOrder:s.orders[0]||null,firstOrder:m,seg:s.orders.length?d.length>=2?"repeat":"buyer":"lead"}});i.sort((s,o)=>(o.lastDate?o.lastDate.getTime():0)-(s.lastDate?s.lastDate.getTime():0)),c.derived={customers:i,customerByKey:Object.fromEntries(i.map(s=>[s.key,s]))},a.leads.forEach(s=>{const o=s.key?c.derived.customerByKey[s.key]:null;s.orders=o?o.orders:[],s.converted=s.orders.length>0,s.fromBuyer=s.converted&&s.orders.some(d=>d._date&&s._date&&d._date<s._date)})}function tt(){const a=new Date,e=le(a),t=864e5,n=c.period;switch(n.key){case"today":return[e,new Date(e.getTime()+t)];case"7d":return[new Date(e.getTime()-6*t),new Date(e.getTime()+t)];case"30d":return[new Date(e.getTime()-29*t),new Date(e.getTime()+t)];case"month":return[new Date(a.getFullYear(),a.getMonth(),1),new Date(e.getTime()+t)];case"lastmonth":return[new Date(a.getFullYear(),a.getMonth()-1,1),new Date(a.getFullYear(),a.getMonth(),1)];case"year":return[new Date(a.getFullYear(),0,1),new Date(e.getTime()+t)];case"custom":{const i=n.from?new Date(`${n.from}T00:00:00`):null,s=n.to?new Date(new Date(`${n.to}T00:00:00`).getTime()+t):null;return[i,s]}default:return[null,null]}}function V(a,e){return a?(!e[0]||a>=e[0])&&(!e[1]||a<e[1]):e[0]===null&&e[1]===null}function he(){const a=$("#admFrom"),e=$("#admTo"),t=it(new Date);if(a.max=t,e.max=t,c.period.key==="custom"){a.value=c.period.from||"",e.value=c.period.to||"";return}const[n,i]=tt();let s=n;if(!s&&c.data){const o=[...c.data.orders,...c.data.leads,...c.data.expenses].map(d=>d._date).filter(Boolean);s=o.length?new Date(Math.min(...o.map(d=>d.getTime()))):null}a.value=s?it(s):"",e.value=i?it(new Date(i.getTime()-1)):t}function Ct(){const a=$("#admPeriod");if(c.period.key==="custom"){const[e,t]=tt();return`${e?R(e):"…"} – ${t?R(new Date(t.getTime()-1)):"…"}`}return a?a.options[a.selectedIndex].text:""}function me(){const a=c.data,e=tt(),t=a.orders.filter(g=>V(g._date,e)),n=t.filter(g=>!G.includes(g.status)),i=t.filter(g=>g.status==="Hoàn tất"),s=n.filter(g=>g.status!=="Hoàn tất"),o=t.filter(g=>G.includes(g.status)),d=a.leads.filter(g=>V(g._date,e)),m=a.expenses.filter(g=>V(g._date,e)),h=i.reduce((g,k)=>g+k.net,0),l=s.reduce((g,k)=>g+k.net,0),y=i.reduce((g,k)=>g+k.cogs,0),u=m.reduce((g,k)=>g+k.amount,0),C=t.filter(g=>g.payStatus==="Đã thanh toán").reduce((g,k)=>g+k.total,0),K=i.some(g=>g.items.some(k=>!(Number(a.costs[k.id])>0))),P=new Set(n.map(g=>g.key).filter(Boolean));let H=0;P.forEach(g=>{const k=c.derived.customerByKey[g];k&&k.firstOrder&&V(k.firstOrder,e)&&(H+=1)});const D=(e[0]&&e[1]?(e[1]-e[0])/864e5:999)>62,A=new Map,lt=g=>D?`${g.getFullYear()}-${String(g.getMonth()+1).padStart(2,"0")}`:it(g);if(!D&&e[0]&&e[1])for(let g=e[0].getTime();g<e[1].getTime();g+=864e5)A.set(it(new Date(g)),{done:0,open:0});n.forEach(g=>{if(!g._date)return;const k=lt(g._date),ht=A.get(k)||{done:0,open:0};g.status==="Hoàn tất"?ht.done+=g.net:ht.open+=g.net,A.set(k,ht)});const N=[...A.entries()].sort((g,k)=>g[0].localeCompare(k[0])).map(([g,k])=>({k:g,...k})),Y={};n.forEach(g=>{const k=Y[g.customerType]||(Y[g.customerType]={orders:0,ordered:0,revenue:0});k.orders+=1,k.ordered+=g.net,g.status==="Hoàn tất"&&(k.revenue+=g.net)});const p={bank:{orders:0,amount:0,paid:0,unpaid:0},cod:{orders:0,amount:0,paid:0,unpaid:0}};n.forEach(g=>{const k=p[g.pay];k.orders+=1,k.amount+=g.total,g.payStatus==="Đã thanh toán"?k.paid+=g.total:k.unpaid+=g.total});const x=Object.fromEntries(yt.map(g=>[g,t.filter(k=>k.status===g).length])),_={};n.forEach(g=>g.items.forEach(k=>{const ht=_[k.id]||(_[k.id]={id:k.id,name:k.name,qty:0,amount:0});ht.qty+=k.qty,ht.amount+=k.line}));const W=Object.values(_).sort((g,k)=>k.amount-g.amount).slice(0,8),f={};m.forEach(g=>{f[g.category]=(f[g.category]||0)+g.amount});const S={};n.forEach(g=>{const k=(g.city||"Khác").trim();S[k]=(S[k]||0)+g.net});const F=Object.entries(S).sort((g,k)=>k[1]-g[1]).slice(0,6),Z=n.filter(g=>g.pay==="bank"&&g.payStatus!=="Đã thanh toán"&&g.status!=="Hoàn tất"),Lt=n.filter(g=>g.pay==="cod"&&g.payStatus!=="Đã thanh toán"&&g.status==="Đang giao");return{range:e,orders:t,valid:n,done:i,cancelled:o,leads:d,expenses:m,revenue:h,pipeline:l,cogs:y,opex:u,profit:h-y-u,collected:C,missingCost:K,aov:n.length?n.reduce((g,k)=>g+k.net,0)/n.length:0,customers:P.size,newCust:H,returning:P.size-H,series:N,byMonth:D,byType:Y,byPay:p,byStatus:x,topProducts:W,byCategory:f,topCities:F,unpaidBank:Z,codToCollect:Lt,funnel:ue(t,d)}}function ue(a,e){const t=new Map,n=(o,d)=>{if(!o)return null;t.has(o)||t.set(o,{key:o,name:d.name||"",phone:d.phone||"",email:d.email||"",orders:[],leads:[]});const m=t.get(o);return!m.name&&d.name&&(m.name=d.name),m};e.forEach(o=>{const d=n(o.key,o);d&&d.leads.push(o)}),a.forEach(o=>{const d=n(o.key,o);d&&d.orders.push(o)});const i=[...t.values()].map(o=>{const d=o.orders.filter(l=>l.status==="Hoàn tất").length;let m=1;o.orders.length&&(m=2),o.orders.some(l=>re.includes(l.status))&&(m=3),d>=1&&(m=4),d>=2&&(m=5);const h=o.orders.length>0&&o.orders.every(l=>G.includes(l.status))||!o.orders.length&&o.leads.length>0&&o.leads.every(l=>l.status==="Không phù hợp");return{...o,reached:m,lost:h}}),s=mt.map((o,d)=>i.filter(m=>m.reached>=d+1).length);return{list:i,reachedCount:s,lost:i.filter(o=>o.lost)}}const et=()=>$("#admContent");function w(a,e){const t=$("#admToast");t.textContent=a,t.classList.toggle("is-error",!!e),t.hidden=!1,clearTimeout(w.t),w.t=setTimeout(()=>{t.hidden=!0},e?5e3:2600)}function ct(a){$("#admDrawerBody").innerHTML=a,$("#admDrawer").classList.add("is-open"),$("#admDrawer").setAttribute("aria-hidden","false"),$("#admDrawerBackdrop").hidden=!1,$("#admDrawer").focus()}function U(){$("#admDrawer").classList.remove("is-open"),$("#admDrawer").setAttribute("aria-hidden","true"),$("#admDrawerBackdrop").hidden=!0}function pe(){const a=(window.location.hash||"").replace(/^#\/?/,"").split("/")[0];return Ut[a]?a:zt}function T(){if(!c.data)return;c.view=pe();const a=Ut[c.view];$("#admTitle").textContent=a.title,document.title=`${a.title} · beVIBE Admin`,$("#admPeriodWrap").hidden=!a.period,he(),document.querySelectorAll(".adm-nav a").forEach(i=>i.classList.toggle("is-active",i.dataset.view===c.view)),$("#admUpdated").textContent=`${c.demo?"Dữ liệu mẫu · ":""}Cập nhật ${X(c.data.generatedAt)}${a.period?` · ${Ct()}`:""}`;const e=c.data.orders.filter(i=>i.status==="Mới").length+c.data.leads.filter(i=>i.fromBuyer&&i.status==="Mới").length,t=c.data.leads.filter(i=>i.status==="Mới"&&!i.converted).length;$("#admNewOrders").hidden=!e,$("#admNewOrders").textContent=e,$("#admNewLeads").hidden=!t,$("#admNewLeads").textContent=t;const n={"bao-cao":fe,"don-hang":$e,"khach-hang":Te,"huy-hoan":ve,"tiem-nang":_e,"chi-phi":Ie};et().innerHTML=n[c.view]()}function q(a,e,t,n){return`<div class="adm-kpi ${n?`adm-kpi-${n}`:""}"><span class="adm-kpi-label">${a}</span><strong class="adm-kpi-value">${e}</strong>${t?`<span class="adm-kpi-sub">${t}</span>`:""}</div>`}function gt(a,e,t,n,i){const s=t>0?Math.max(2,e/t*100):0;return`<div class="adm-bar-row"><span class="adm-bar-label" title="${r(a)}">${r(a)}</span><span class="adm-bar-track"><span class="adm-bar-fill" style="width:${s}%;${i?`background:${i}`:""}"></span></span><span class="adm-bar-value">${n}</span></div>`}function ge(a){const e=[100,84,68,53,40],t=a.reachedCount[0],n=mt.map((l,y)=>{const u=e[y],C=e[y+1]||u*.78,K=(u-C)/2/u*100,P=`<button type="button" class="adm-funnel-band ${c.funnelStage===y?"is-active":""}" data-act="funnel-stage" data-stage="${y}"
        style="width:${u}%;background:${l.color};clip-path:polygon(0 0,100% 0,${100-K}% 100%,${K}% 100%)">
        <span>B${y+1} · ${l.label}</span><b>${a.reachedCount[y]}</b></button>`,H=y<mt.length-1?`<div class="adm-funnel-conv" style="width:${C}%">${J(a.reachedCount[y+1],a.reachedCount[y])} chuyển tiếp</div>`:"";return P+H}).join(""),i=c.funnelStage,s=a.reachedCount[i],o=a.list.filter(l=>l.reached===i+1&&!l.lost),d=a.list.filter(l=>l.reached===i+1&&l.lost).length,m=a.reachedCount[i+1]||0,h=o.slice(0,40).map(l=>`<li><button type="button" class="adm-linkish" data-act="open-customer" data-key="${r(l.key)}">${r(l.name||l.phone||l.email)}</button><small>${r(l.phone||l.email)}</small></li>`).join("");return`
    <section class="adm-card adm-funnel-card">
      <div class="adm-card-head">
        <div><h2>Phễu khách hàng</h2><p class="adm-muted">${t} liên hệ · ${Ct()} · bấm một bậc để xem chi tiết</p></div>
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-goto="khach-hang">Danh sách khách →</button>
      </div>
      <div class="adm-funnel-wrap">
        <div class="adm-funnel">${t?n:'<p class="adm-empty">Chưa có liên hệ hoặc đơn hàng trong khoảng thời gian này.</p>'}</div>
        ${t?`
        <div class="adm-funnel-side">
          <div class="adm-funnel-detail">
            ${O(`B${i+1} · ${mt[i].label}`,"info")}
            <dl>
              <div><dt>Đã từng đạt bậc</dt><dd>${s}</dd></div>
              <div><dt>Đang ở bậc này</dt><dd>${o.length}</dd></div>
              <div><dt>Đã đi tiếp</dt><dd>${i<mt.length-1?m:"—"}</dd></div>
              <div><dt>Rời phễu tại bậc này</dt><dd>${d}</dd></div>
              <div><dt>So với đầu phễu</dt><dd>${J(s,t)}</dd></div>
              <div><dt>Lên bậc kế</dt><dd>${i<mt.length-1?J(m,s):"—"}</dd></div>
            </dl>
            ${h?`<p class="adm-mini-title">Đang ở bậc này</p><ul class="adm-people">${h}</ul>${o.length>40?`<p class="adm-muted">… và ${o.length-40} khách khác</p>`:""}`:""}
          </div>
          <div class="adm-funnel-lost">${O("Rời phễu","cancelled")}<strong>${a.lost.length}</strong><small>Mọi đơn đều hủy / hoàn hàng, hoặc lead "Không phù hợp"</small></div>
        </div>`:""}
      </div>
      <p class="adm-fineprint">Mỗi bậc đếm số khách ĐÃ TỪNG ĐẠT bậc đó (gồm cả khách đã đi tiếp). Một khách = một số điện thoại (hoặc email nếu không có số).
      B1: để lại thông tin hoặc đặt đơn · B2: có đơn · B3: có đơn đã xác nhận / đang giao · B4: có đơn hoàn tất · B5: khách trung thành (từ 2 đơn hoàn tất).</p>
    </section>`}function be(a){if(!a.series.length)return'<p class="adm-empty">Chưa có đơn hàng.</p>';const e=Math.max(...a.series.map(d=>d.done+d.open),1),t=a.series.length,n=Math.max(t*22,320),i=180,s=Math.max(4,n/t*.62),o=a.series.map((d,m)=>{const h=(m+.5)*(n/t)-s/2,l=d.done/e*(i-20),y=d.open/e*(i-20),u=a.byMonth?`T${Number(d.k.slice(5))}/${d.k.slice(2,4)}`:`${d.k.slice(8)}/${d.k.slice(5,7)}`,C=t<=16||m%Math.ceil(t/12)===0||m===t-1;return`<g><title>${u}: hoàn tất ${v(d.done)} · đang xử lý ${v(d.open)}</title>
      <rect x="${h}" y="${i-l-y}" width="${s}" height="${y}" rx="2" class="adm-bar-open"></rect>
      <rect x="${h}" y="${i-l}" width="${s}" height="${l}" rx="2" class="adm-bar-done"></rect>
      ${C?`<text x="${h+s/2}" y="${i+16}" text-anchor="middle">${u}</text>`:""}</g>`}).join("");return`<div class="adm-chart-scroll"><svg class="adm-chart" viewBox="0 0 ${n} ${i+22}" style="min-width:${Math.min(n,900)}px" role="img" aria-label="Doanh thu theo ${a.byMonth?"tháng":"ngày"}">
      <line x1="0" y1="${i}" x2="${n}" y2="${i}" class="adm-axis"></line>${o}</svg></div>
    <p class="adm-legend"><span class="adm-dot adm-dot-done"></span>Hoàn tất <span class="adm-dot adm-dot-open"></span>Đang xử lý (mới, đã xác nhận, đang giao) · cao nhất ${v(e)}</p>`}function fe(){const a=me(),e=Object.entries(a.byType).sort((h,l)=>l[1].ordered-h[1].ordered),t=Math.max(...e.map(([,h])=>h.ordered),1),n={"Khách lẻ":"#2f6fe0","Khách sỉ":"#1a5092","Tư vấn viên":"#2fb35a"},i=Object.entries(a.byCategory).sort((h,l)=>l[1]-h[1]),s=Math.max(...i.map(([,h])=>h),1),o=Math.max(...a.topProducts.map(h=>h.amount),1),d=Math.max(...a.topCities.map(([,h])=>h),1),m=a.orders.length;return`
    ${a.unpaidBank.length||a.codToCollect.length||a.byStatus.Mới?`
    <div class="adm-alerts">
      ${a.byStatus.Mới?`<button type="button" class="adm-alert" data-act="filter-orders" data-status="Mới"><b>${a.byStatus.Mới}</b> đơn mới chờ xác nhận</button>`:""}
      ${a.unpaidBank.length?`<button type="button" class="adm-alert" data-act="filter-orders" data-pay="bank" data-pay-status="Chưa thanh toán"><b>${a.unpaidBank.length}</b> đơn "Thanh toán ngay" chưa nhận tiền · ${v(a.unpaidBank.reduce((h,l)=>h+l.total,0))}</button>`:""}
      ${a.codToCollect.length?`<button type="button" class="adm-alert" data-act="filter-orders" data-pay="cod" data-pay-status="Chưa thanh toán"><b>${a.codToCollect.length}</b> đơn COD đang giao / đã giao chưa thu tiền · ${v(a.codToCollect.reduce((h,l)=>h+l.total,0))}</button>`:""}
    </div>`:""}

    <section class="adm-kpis">
      ${q("Doanh thu (đơn hoàn tất)",v(a.revenue),`+ ${v(a.pipeline)} đang xử lý`,"primary")}
      ${q("Lợi nhuận",v(a.profit),`Biên lợi nhuận ${J(a.profit,a.revenue)}${a.missingCost?" · thiếu giá vốn":""}`,a.profit>=0?"good":"bad")}
      ${q("Chi phí",v(a.cogs+a.opex),`Giá vốn ${_t(a.cogs)} · Vận hành ${_t(a.opex)}`)}
      ${q("Đã thu tiền",v(a.collected),'Đơn có trạng thái "Đã thanh toán"')}
      ${q("Đơn hàng",a.valid.length,`Hủy / hoàn ${a.cancelled.length} (${J(a.cancelled.length,m)})`)}
      ${q("Giá trị đơn TB",v(a.aov),"Không tính đơn hủy")}
      ${q("Khách mua hàng",a.customers,`Mới ${a.newCust} · Quay lại ${a.returning}`)}
      ${q("Khách tiềm năng",a.leads.length,"Form liên hệ, báo giá sỉ, đăng ký")}
    </section>

    ${ge(a.funnel)}

    <section class="adm-card">
      <div class="adm-card-head"><div><h2>Doanh thu theo ${a.byMonth?"tháng":"ngày"}</h2><p class="adm-muted">Giá trị hàng (tạm tính − giảm giá), không gồm phí vận chuyển, không tính đơn hủy</p></div></div>
      ${be(a)}
    </section>

    <div class="adm-grid-2">
      <section class="adm-card">
        <div class="adm-card-head"><h2>Theo loại khách</h2></div>
        ${e.length?e.map(([h,l])=>gt(h,l.ordered,t,`${v(l.ordered)}<small>${l.orders} đơn · hoàn tất ${_t(l.revenue)}</small>`,n[h])).join(""):'<p class="adm-empty">Chưa có đơn.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Theo hình thức thanh toán</h2></div>
        <div class="adm-pay-split">
          ${[["bank","Thanh toán ngay (chuyển khoản)"],["cod","Thanh toán khi nhận hàng (COD)"]].map(([h,l])=>{const y=a.byPay[h];return`<div class="adm-pay-box"><span>${l}</span><strong>${v(y.amount)}</strong><small>${y.orders} đơn</small>
              <div class="adm-pay-progress"><span style="width:${y.amount?y.paid/y.amount*100:0}%"></span></div>
              <small>Đã thu ${v(y.paid)} · Chưa thu ${v(y.unpaid)}</small></div>`}).join("")}
        </div>
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Sản phẩm bán chạy</h2></div>
        ${a.topProducts.length?a.topProducts.map(h=>gt(h.name,h.amount,o,`${v(h.amount)}<small>${h.qty} sp</small>`)).join(""):'<p class="adm-empty">Chưa có dữ liệu.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Trạng thái đơn</h2></div>
        <div class="adm-status-grid">
          ${yt.map(h=>`<button type="button" class="adm-status-box" data-act="filter-orders" data-status="${r(h)}">${O(h,rt[h])}<strong>${a.byStatus[h]}</strong></button>`).join("")}
        </div>
        <div class="adm-card-head adm-mt"><h2>Tỉnh / thành mua nhiều</h2></div>
        ${a.topCities.length?a.topCities.map(([h,l])=>gt(h,l,d,v(l))).join(""):'<p class="adm-empty">Chưa có dữ liệu.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><div><h2>Chi phí vận hành</h2><p class="adm-muted">Tổng ${v(a.opex)}</p></div><button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-goto="chi-phi">Nhập chi phí →</button></div>
        ${i.length?i.map(([h,l])=>gt(h,l,s,v(l),"#e07a2f")).join(""):'<p class="adm-empty">Chưa nhập chi phí trong khoảng thời gian này.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><h2>Kết quả kinh doanh</h2></div>
        <table class="adm-pl">
          <tr><td>Doanh thu (đơn hoàn tất)</td><td>${v(a.revenue)}</td></tr>
          <tr><td>− Giá vốn hàng bán</td><td>${v(a.cogs)}</td></tr>
          <tr class="adm-pl-sub"><td>= Lợi nhuận gộp</td><td>${v(a.revenue-a.cogs)}</td></tr>
          <tr><td>− Chi phí vận hành</td><td>${v(a.opex)}</td></tr>
          <tr class="adm-pl-total"><td>= Lợi nhuận</td><td>${v(a.profit)}</td></tr>
        </table>
        ${a.missingCost?'<p class="adm-fineprint adm-warn-text">Một số sản phẩm đã bán chưa có giá vốn nên lợi nhuận đang cao hơn thực tế. Nhập giá vốn ở mục "Chi phí & giá vốn".</p>':""}
      </section>
    </div>`}const at={processing:{statuses:["Mới","Đã xác nhận","Đang giao"],view:"don-hang",label:"Đơn hàng"},success:{statuses:["Hoàn tất"],view:"khach-hang",label:"Khách hàng"},failed:{statuses:G,view:"huy-hoan",label:"Hủy & hoàn hàng"}};function St(a){return Object.keys(at).find(e=>at[e].statuses.includes(a))||"processing"}function Tt(a,e){const t=c.filters[a],n=tt(),i=t.q.trim().toLowerCase(),s=at[a].statuses;return c.data.orders.filter(o=>s.includes(o.status)&&V(o._date,n)&&(!t.status||o.status===t.status)&&(e||!t.type||o.typeKey===t.type)&&(!t.pay||o.pay===t.pay)&&(!t.payStatus||o.payStatus===t.payStatus)&&(!t.reason||o.failReason===t.reason)&&(!i||[o.code,o.name,o.phone,o.email,o.org,o.city,o.products,o.failReason].some(d=>String(d||"").toLowerCase().includes(i))))}function st(a,e,t,n,i=""){return`<select data-filter="${a}" ${i}>${n?`<option value="">${n}</option>`:""}${t.map(([s,o])=>`<option value="${r(s)}" ${String(s)===String(e)?"selected":""}>${r(o)}</option>`).join("")}</select>`}function vt(a,e,t){const n=Math.ceil(a/I);return n<=1?"":`<div class="adm-pager"><button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="page" data-scope="${t}" data-page="${e-1}" ${e<=1?"disabled":""}>‹ Trước</button>
    <span>Trang ${e}/${n}</span>
    <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="page" data-scope="${t}" data-page="${e+1}" ${e>=n?"disabled":""}>Sau ›</button></div>`}function Kt(a,e,t){return`<div class="adm-tabs" role="tablist">${$t.map(n=>{const i=t[n.key]||{count:0};return`<button type="button" role="tab" aria-selected="${e===n.key}" class="adm-tab ${e===n.key?"is-active":""}" data-act="type-tab" data-scope="${a}" data-type="${n.key}">
      <span>${n.label}</span><b>${i.count}</b>${i.alert?`<em title="${r(i.alertTitle||"")}">${r(i.alert)}</em>`:""}</button>`}).join("")}</div>`}function M(a,e,t){return`<div><span>${a}</span><strong class="${t||""}">${e}</strong></div>`}function Ht(a){const e=c.filters.processing;if(e.status&&e.status!=="Mới"||e.pay||e.payStatus)return[];const t=e.q.trim().toLowerCase();return c.data.leads.filter(n=>{if(!n.fromBuyer||n.status!=="Mới")return!1;const i=c.derived.customerByKey[n.key];return n.buyerType=i?i.type:"Khách lẻ",n.buyerOrg=i&&i.org||n.org||"",!a&&e.type&&Q(n.buyerType)!==e.type?!1:!t||[n.name,n.phone,n.email,n.org,n.type,n.interest,n.note].some(s=>String(s||"").toLowerCase().includes(t))})}function ye(a,e){return`
          <tr data-act="open-lead" data-id="${r(a.id)}" tabindex="0">
            <td><b>${r(a.id)}</b></td>
            <td>${X(a._date)}</td>
            <td><span class="adm-cell-main">${r(a.name||a.phone)}</span><small>${r(a.phone)}</small></td>
            <td>${e?`<span class="adm-cell-main">${r(a.buyerOrg||"—")}</span>`:`${r(a.buyerType)}${a.buyerOrg?`<small>${r(a.buyerOrg)}</small>`:""}`}</td>
            <td class="num"><b>Chờ báo giá</b>${a.interest?`<small>${r(a.interest)}</small>`:""}</td>
            <td>${r(a.type)}</td>
            <td>${O("Mới",rt.Mới)}</td>
          </tr>`}function qt(a,e={}){const t=c.filters[a],n=Tt(a),i=n.reduce((p,x)=>p+x.total,0),s=n.filter(p=>p.payStatus!=="Đã thanh toán").reduce((p,x)=>p+x.total,0),o=at[a].statuses,d=a==="processing",m=d?Ht():[],h=d?Ht(!0):[],l=[...n.map(p=>({d:p._date,o:p})),...m.map(p=>({d:p._date,l:p}))].sort((p,x)=>(x.d?x.d.getTime():0)-(p.d?p.d.getTime():0)),y=Math.min(t.page,Math.max(1,Math.ceil(l.length/I))),u=l.slice((y-1)*I,y*I),C=u.filter(p=>p.o).map(p=>p.o),K=Tt(a,!0),P={};$t.forEach(p=>{const x=K.filter(f=>!p.key||f.typeKey===p.key),_=h.filter(f=>!p.key||Q(f.buyerType)===p.key);let W="";if(d){const f=x.filter(S=>S.status==="Mới").length+_.length;W=f?`${f} mới`:""}if(a==="failed"){const f=x.filter(S=>S.status==="Hoàn hàng").length;W=f?`${f} hoàn`:""}P[p.key]={count:x.length+_.length,alert:W,alertTitle:d?"Đơn mới chờ xác nhận và yêu cầu mới từ khách đã mua":"Đơn hoàn hàng"}});let H;if(d){const p=n.filter(x=>x.status==="Mới").length+m.length;H=M("Đang xử lý",n.length+m.length)+M("Chờ xác nhận",p,p?"adm-warn-text":"")+M("Tổng tiền",v(i))+M("Chưa thu",v(s),s?"adm-warn-text":"")}else if(a==="success")H=M("Khách đã mua",new Set(n.map(p=>p.key||p.code)).size)+M("Lượt mua thành công",n.length)+M("Doanh thu",v(n.reduce((p,x)=>p+x.net,0)))+M("Chưa thu",v(s),s?"adm-warn-text":"");else{const p=tt(),x=c.data.orders.filter(_=>V(_._date,p)&&(!t.type||_.typeKey===t.type)).length;H=M("Đã hủy",n.filter(_=>_.status==="Đã hủy").length)+M("Hoàn hàng",n.filter(_=>_.status==="Hoàn hàng").length,n.some(_=>_.status==="Hoàn hàng")?"adm-warn-text":"")+M("Giá trị đơn mất",v(n.reduce((_,W)=>_+W.net,0)))+M("Tỷ lệ hủy / hoàn",J(n.length,x))}const b=t.type==="wholesale"||t.type==="consultant",D=t.type==="wholesale"?"Spa / Clinic / Đại lý":t.type==="consultant"?"Mã / tên tư vấn viên":"Loại khách",A=p=>b?`<span class="adm-cell-main">${r(p.org||"—")}</span>`:`${r(p.customerType)}${p.org?`<small>${r(p.org)}</small>`:""}`,lt=$t.find(p=>p.key===t.type).label,N=a==="failed",Y=c.data.options.failReasons||[];return`
    ${e.before||""}
    ${Kt(a,t.type,P)}
    <section class="adm-card adm-card-tabbed">
      <div class="adm-tab-summary">${H}</div>
      <div class="adm-toolbar" data-scope="${a}">
        <input type="search" data-filter="q" value="${r(t.q)}" placeholder="Tìm mã đơn, tên, SĐT, ${t.type==="wholesale"?"tên spa, ":t.type==="consultant"?"mã TVV, ":""}${N?"lý do, ":""}sản phẩm…" aria-label="Tìm đơn hàng">
        ${o.length>1?st("status",t.status,o.map(p=>[p,p]),"Mọi trạng thái"):""}
        ${N?st("reason",t.reason,Y.map(p=>[p,p]),"Mọi lý do"):""}
        ${st("pay",t.pay,[["bank","Thanh toán ngay"],["cod","COD"]],"Mọi hình thức TT")}
        ${st("payStatus",t.payStatus,c.data.options.payStatuses.map(p=>[p,p]),"Mọi trạng thái TT")}
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="export-orders" data-group="${a}">Xuất CSV</button>
      </div>
      <p class="adm-muted adm-result-meta">${lt} · ${n.length+m.length} ${e.purchase?"lần mua thành công":"đơn"}${e.note?` · ${e.note}`:""}</p>
      ${C.length&&e.purchase?`
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Khách hàng</th><th>${D}</th><th>Sản phẩm đã mua</th><th>Ngày mua</th><th class="num">Thành tiền</th><th>Thanh toán</th></tr></thead>
        <tbody>${C.map(p=>`
          <tr data-act="open-order" data-code="${r(p.code)}" tabindex="0">
            <td><span class="adm-cell-main">${r(p.name)}</span><small>${r(p.phone)}${p.city?` · ${r(p.city)}`:""}</small></td>
            <td>${A(p)}</td>
            <td class="adm-products-cell">${p.items.length?p.items.map(x=>`<span>${r(x.name)} <b>×${x.qty}</b></span>`).join(""):`<span>${r(p.products)}</span>`}</td>
            <td>${R(p._date)}<small>${r(p.code)}</small></td>
            <td class="num"><b>${v(p.total)}</b></td>
            <td>${p.pay==="bank"?"Thanh toán ngay":"COD"}<br>${O(p.payStatus,Mt[p.payStatus])}</td>
          </tr>`).join("")}</tbody>
      </table></div>${vt(n.length,y,a)}`:C.length||m.length?`
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Mã đơn</th><th>Thời gian</th><th>Khách hàng</th><th>${D}</th><th class="num">Tổng tiền</th>${N?"<th>Lý do</th>":"<th>Thanh toán</th>"}<th>Trạng thái</th>${d?'<th style="min-width:180px">Thao tác nhanh</th>':""}</tr></thead>
        <tbody>${u.map(({o:p,l:x})=>x?ye(x,b):`
          <tr data-act="open-order" data-code="${r(p.code)}" tabindex="0">
            <td><b>${r(p.code)}</b></td>
            <td>${X(p._date)}</td>
            <td><span class="adm-cell-main">${r(p.name)}</span><small>${r(p.phone)}${p.city?` · ${r(p.city)}`:""}</small></td>
            <td>${A(p)}</td>
            <td class="num"><b>${v(p.total)}</b></td>
            ${N?`<td>${r(p.failReason||"Chưa ghi lý do")}${p.payStatus!=="Chưa thanh toán"?`<br>${O(p.payStatus,Mt[p.payStatus])}`:""}</td>`:`<td>${p.pay==="bank"?"Thanh toán ngay":"COD"}<br>${O(p.payStatus,Mt[p.payStatus])}</td>`}
            <td>${O(p.status,rt[p.status])}</td>
            ${d?`
            <td onclick="event.stopPropagation()">
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                ${p.status==="Mới"?`<button type="button" class="adm-btn adm-btn-ghost adm-btn-xs" data-act="quick-status-inline" data-code="${r(p.code)}" data-status="Đã xác nhận" title="Xác nhận đơn">Duyệt</button>`:""}
                ${p.status==="Đã xác nhận"?`<button type="button" class="adm-btn adm-btn-ghost adm-btn-xs" data-act="quick-status-inline" data-code="${r(p.code)}" data-status="Đang giao" title="Bàn giao đơn cho bưu tá / shipper">Giao hàng</button>`:""}
                <button type="button" class="adm-btn adm-btn-xs adm-btn-success" data-act="quick-complete-inline" data-code="${r(p.code)}" title="Shipper đã giao xong và thu tiền COD (ghi nhận doanh thu)">✓ Thu tiền & Hoàn tất</button>
              </div>
            </td>`:""}
          </tr>`).join("")}</tbody>
      </table></div>${vt(l.length,y,a)}`:`<p class="adm-empty">${e.empty||"Không có đơn nào phù hợp."}</p>`}
    </section>
    ${e.after||""}`}function $e(){return qt("processing",{note:"Đơn hoàn tất chuyển sang mục Khách hàng, đơn hủy / hoàn chuyển sang mục Hủy & hoàn hàng",empty:"Không có đơn nào đang chờ xử lý."})}function ve(){const a=c.filters.failed,e=Tt("failed"),t={};e.forEach(d=>{const m=d.failReason||"Chưa ghi lý do";t[m]=(t[m]||0)+1});const n=Object.entries(t).sort((d,m)=>m[1]-d[1]),i=Math.max(...n.map(([,d])=>d),1),s=c.derived.customers.map(d=>({c:d,n:d.orders.filter(m=>m.status==="Hoàn hàng").length,m:d.orders.filter(m=>G.includes(m.status)).length})).filter(d=>d.n>=1&&d.m>=2&&(!a.type||Q(d.c.type)===a.type)).sort((d,m)=>m.m-d.m).slice(0,12),o=`
    <div class="adm-grid-2">
      <section class="adm-card">
        <div class="adm-card-head"><div><h2>Lý do hủy / hoàn</h2><p class="adm-muted">${Ct()}</p></div></div>
        ${n.length?n.map(([d,m])=>gt(d,m,i,`${m} đơn`,d==="Khách không nhận hàng khi giao"?"#e07a2f":"#c62828")).join(""):'<p class="adm-empty">Không có đơn hủy hoặc hoàn trong khoảng thời gian này.</p>'}
      </section>
      <section class="adm-card">
        <div class="adm-card-head"><div><h2>Khách cần lưu ý</h2><p class="adm-muted">Từng hoàn hàng và có từ 2 đơn hủy / hoàn trở lên (toàn bộ thời gian)</p></div></div>
        ${s.length?`<ul class="adm-people adm-people-wide">${s.map(({c:d,n:m,m:h})=>`<li><button type="button" class="adm-linkish" data-act="open-customer" data-key="${r(d.key)}">${r(d.name||d.phone)}</button><small>${r(d.phone)} · ${h} đơn hủy / hoàn, ${m} lần hoàn hàng</small></li>`).join("")}</ul>`:'<p class="adm-empty">Chưa có khách nào hủy / hoàn nhiều lần.</p>'}
      </section>
    </div>`;return qt("failed",{empty:"Không có đơn hủy hoặc hoàn hàng trong khoảng thời gian này.",after:o})}function Yt(a){const e=c.data.orders.find(l=>l.code===a);if(!e)return;const t=c.data.options,n=e.items.length&&e.items.every(l=>Number(c.data.costs[l.id])>0),i=String(e.phone||"").replace(/[^\d+]/g,""),s=G.includes(e.status),o=e.key?c.derived.customerByKey[e.key]:null,d=o?o.orders.filter(l=>l.code!==e.code&&G.includes(l.status)).length:0,m=o?o.orders.filter(l=>l.code!==e.code&&l.status==="Hoàn hàng").length:0,h=t.failReasons||[];ct(`
    <form class="adm-order-form" data-code="${r(e.code)}">
      <p class="adm-muted">${X(e._date)} · đang ở mục <b>${at[St(e.status)].label}</b></p>
      <h2>Đơn ${r(e.code)} ${O(e.status,rt[e.status])}</h2>

      ${s?`<p class="adm-note adm-note-bad">${e.status==="Hoàn hàng"?"Đã giao đến nơi nhưng khách không nhận.":"Đơn đã hủy trước khi giao."} Lý do: <b>${r(e.failReason||"chưa ghi")}</b></p>`:`<div class="adm-steps">${yt.slice(0,4).map((l,y)=>`<span class="${yt.indexOf(e.status)>=y?"is-done":""}">${l}</span>`).join("")}</div>`}
      ${d?`<p class="adm-note adm-note-warn">Khách này đã có ${d} đơn hủy / hoàn trước đó${m?` (${m} lần không nhận hàng)`:""}. Nên gọi xác nhận kỹ trước khi giao.</p>`:""}

      <section class="adm-d-section">
        <h3>Khách hàng</h3>
        <p><b>${r(e.name)}</b> · ${r(e.customerType)}${e.org?` – ${r(e.org)}`:""}</p>
        <p><a href="tel:${r(i)}">${r(e.phone)}</a> · <a href="https://zalo.me/${r(i)}" target="_blank" rel="noopener noreferrer">Zalo</a>${e.email?` · <a href="mailto:${r(e.email)}">${r(e.email)}</a>`:""}</p>
        <p>${r([e.address,e.district,e.city].filter(Boolean).join(", "))}</p>
        ${e.account?`<p class="adm-muted">Tài khoản: ${r(e.account)}</p>`:""}
        ${e.note?`<p class="adm-note">Ghi chú của khách: ${r(e.note)}</p>`:""}
        ${(()=>{const l=c.data.leads.filter(y=>y.key&&y.key===e.key&&y._date&&e._date&&y._date<=e._date).sort((y,u)=>u._date-y._date)[0];return l?`<p class="adm-note">Khách tiềm năng từ <b>${r(l.type)}</b>${l.consultant?` · tư vấn: <b>${r(l.consultant)}</b>`:""}${l.closedAt?` · chốt ${R(l.closedAt)}`:""} · <button type="button" class="adm-linkish" data-act="open-lead" data-id="${r(l.id)}">xem</button></p>`:""})()}
        ${e.key?`<button type="button" class="adm-linkish" data-act="open-customer" data-key="${r(e.key)}">Xem lịch sử mua hàng →</button>`:""}
      </section>

      <section class="adm-d-section">
        <h3>Sản phẩm</h3>
        ${e.items.length?`<table class="adm-mini-table">${e.items.map(l=>`<tr><td>${r(l.name)}<small>${r(l.unit)} · ${v(l.price)}</small></td><td>×${l.qty}</td><td class="num">${v(l.line)}</td></tr>`).join("")}</table>`:`<p class="adm-pre">${r(e.products)}</p>`}
        <div class="adm-d-grid">
          <label class="adm-field"><span>Giảm giá (đ)</span><input type="number" name="discount" min="0" step="1000" value="${e.discount}"></label>
          <label class="adm-field"><span>Phí vận chuyển thu khách (đ)</span><input type="number" name="shipping" min="0" step="1000" value="${e.shipping}"></label>
        </div>
        <table class="adm-pl">
          <tr><td>Tạm tính</td><td>${v(e.subtotal)}</td></tr>
          <tr class="adm-pl-total"><td>Khách cần thanh toán</td><td data-total>${v(e.total)}</td></tr>
          ${n?`<tr><td class="adm-muted">Giá vốn ước tính · lãi gộp</td><td class="adm-muted">${v(e.cogs)} · ${v(e.net-e.cogs)}</td></tr>`:""}
        </table>
        ${e.priceNote&&e.priceNote!=="OK"?`<p class="adm-fineprint adm-warn-text">Kiểm tra giá: ${r(e.priceNote)}</p>`:""}
      </section>

      <section class="adm-d-section">
        <h3>Xử lý đơn</h3>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Trạng thái đơn</span><select name="status">${t.statuses.map(l=>`<option ${l===e.status?"selected":""}>${r(l)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Thanh toán · ${e.pay==="bank"?"Thanh toán ngay (CK)":"COD"}</span><select name="payStatus">${t.payStatuses.map(l=>`<option ${l===e.payStatus?"selected":""}>${r(l)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Loại khách</span><select name="customerType">${Object.entries(t.customerTypes).map(([l,y])=>`<option value="${l}" ${l===e.typeKey?"selected":""}>${r(y)}</option>`).join("")}</select></label>
          <label class="adm-field adm-fail-field" ${s?"":"hidden"}><span>Lý do hủy / hoàn *</span><select name="failReason"><option value="">— Chọn lý do —</option>${h.map(l=>`<option ${l===e.failReason?"selected":""}>${r(l)}</option>`).join("")}</select></label>
        </div>
        <label class="adm-field"><span>Ghi chú nội bộ</span><textarea name="internalNote" rows="3" placeholder="Đã gọi xác nhận, mã vận đơn, hẹn giao, phí ship hoàn…">${r(e.internalNote)}</textarea></label>
        <p class="adm-error" data-order-error hidden></p>
      </section>

      <div class="adm-d-actions">
        ${e.status==="Mới"?'<button type="button" class="adm-btn adm-btn-ghost" data-act="quick-status" data-status="Đã xác nhận">Xác nhận đơn</button>':""}
        ${e.status==="Đã xác nhận"?'<button type="button" class="adm-btn adm-btn-ghost" data-act="quick-status" data-status="Đang giao">Chuyển sang đang giao</button>':""}
        ${e.status!=="Hoàn tất"&&!s?'<button type="button" class="adm-btn adm-btn-success" data-act="quick-complete-drawer" style="font-weight:700">✓ Đã thu tiền & Hoàn tất</button>':""}
        ${e.status==="Mới"||e.status==="Đã xác nhận"?'<button type="button" class="adm-btn adm-btn-danger" data-act="mark-failed" data-status="Đã hủy">Hủy đơn</button>':""}
        ${e.status==="Đang giao"?'<button type="button" class="adm-btn adm-btn-danger" data-act="mark-failed" data-status="Hoàn hàng" data-reason="Khách không nhận hàng khi giao">Khách không nhận (hoàn hàng)</button>':""}
        <button type="submit" class="adm-btn adm-btn-primary">Lưu thay đổi</button>
      </div>
      ${e.updatedAt?`<p class="adm-fineprint">Cập nhật lần cuối ${X(e.updatedAt)}</p>`:""}
    </form>`)}function ke(a,e,t){a.querySelector('[name="status"]').value=e;const n=a.querySelector(".adm-fail-field");n.hidden=!1;const i=a.querySelector('[name="failReason"]');t&&!i.value&&(i.value=t);const s=a.querySelector("[data-order-error]");s.textContent=i.value?'Kiểm tra lý do rồi bấm "Lưu thay đổi".':'Chọn lý do rồi bấm "Lưu thay đổi".',s.hidden=!1,i.focus()}async function It(a,e={}){const t=a.dataset.code,n=c.data.orders.find(h=>h.code===t),i=new FormData(a),s={status:i.get("status"),payStatus:i.get("payStatus"),customerType:i.get("customerType"),shipping:Math.max(0,Math.round(Number(i.get("shipping"))||0)),discount:Math.max(0,Math.round(Number(i.get("discount"))||0)),internalNote:String(i.get("internalNote")||""),failReason:String(i.get("failReason")||""),...e},o=a.querySelector("[data-order-error]");if(G.includes(s.status)&&!s.failReason){a.querySelector(".adm-fail-field").hidden=!1,o.textContent=`Chọn lý do trước khi chuyển đơn sang "${s.status}".`,o.hidden=!1,a.querySelector('[name="failReason"]').focus();return}G.includes(s.status)||(s.failReason=""),e.status==="Hoàn tất"&&n.pay==="cod"&&s.payStatus==="Chưa thanh toán"&&(s.payStatus="Đã thanh toán");const d=St(n.status),m=a.querySelectorAll("button");m.forEach(h=>{h.disabled=!0});try{n.sbId&&xt(n.sbId,{status:s.status,pay_status:s.payStatus}).catch(()=>{}),await E("admin.updateOrder",{code:t,fields:s}),Object.assign(n,{status:s.status,payStatus:s.payStatus,shipping:s.shipping,discount:s.discount,internalNote:s.internalNote,failReason:s.failReason,customerType:c.data.options.customerTypes[s.customerType]||n.customerType,updatedAt:new Date().toISOString()}),j(),T(),Yt(t);const h=St(s.status);w(h!==d?`Đã lưu · đơn ${t} chuyển sang mục ${at[h].label}`:`Đã lưu đơn ${t}`)}catch(h){m.forEach(l=>{l.disabled=!1}),h.auth||w(h.message,!0)}}async function Rt(a){const e=c.data.orders.find(i=>i.code===a);if(!e)return;const t=e.status,n=e.payStatus;e.status="Hoàn tất",e.payStatus="Đã thanh toán",e.failReason="",e.updatedAt=new Date().toISOString(),j(),T(),U(),w(`Đang cập nhật đơn ${a}…`);try{e.sbId&&await xt(e.sbId,{status:"Hoàn tất",pay_status:"Đã thanh toán"}),await E("admin.updateOrder",{code:a,fields:{status:"Hoàn tất",payStatus:"Đã thanh toán",customerType:e.typeKey,shipping:e.shipping||0,discount:e.discount||0,internalNote:e.internalNote||"",failReason:""}}).catch(()=>{}),j(),T(),w(`✓ Đã thu tiền & hoàn tất đơn ${a}! Doanh thu +${v(e.net)} đã được ghi nhận.`)}catch(i){e.status=t,e.payStatus=n,j(),T(),w(`Lỗi khi cập nhật đơn: ${i.message}`,!0)}}async function we(a,e){const t=c.data.orders.find(i=>i.code===a);if(!t)return;const n=t.status;t.status=e,t.updatedAt=new Date().toISOString(),j(),T();try{t.sbId&&await xt(t.sbId,{status:e}),await E("admin.updateOrder",{code:a,fields:{status:e,payStatus:t.payStatus,customerType:t.typeKey,shipping:t.shipping||0,discount:t.discount||0,internalNote:t.internalNote||"",failReason:""}}).catch(()=>{}),j(),T(),w(`Đơn ${a} đã chuyển sang "${e}".`)}catch(i){t.status=n,j(),T(),w(`Lỗi khi cập nhật: ${i.message}`,!0)}}function Se(a){const e=Tt(a),t=["Mã đơn","Thời gian","Trạng thái","Lý do hủy / hoàn","Họ tên","Điện thoại","Email","Loại khách","Cơ sở / Mã TVV","Tỉnh/TP","Địa chỉ","Hình thức TT","Trạng thái TT","Tạm tính","Giảm giá","Phí vận chuyển","Tổng thanh toán","Sản phẩm","Ghi chú nội bộ"],n=e.map(d=>[d.code,X(d._date),d.status,d.failReason,d.name,d.phone,d.email,d.customerType,d.org,d.city,[d.address,d.district].filter(Boolean).join(", "),d.pay==="bank"?"Thanh toán ngay":"COD",d.payStatus,d.subtotal,d.discount,d.shipping,d.total,d.products,d.internalNote]),i=[t,...n].map(d=>d.map(m=>{let h=String(m??"");return/^[=+\-@]/.test(h)&&(h=`'${h}`),`"${h.replace(/"/g,'""')}"`}).join(",")).join(`\r
`),s=new Blob([`\uFEFF${i}`],{type:"text/csv;charset=utf-8"}),o=document.createElement("a");o.href=URL.createObjectURL(s),o.download=`bevibe-${{processing:"don-dang-xu-ly",success:"don-thanh-cong",failed:"don-huy-hoan"}[a]}-${it(new Date)}.csv`,document.body.appendChild(o),o.click(),setTimeout(()=>{URL.revokeObjectURL(o.href),o.remove()},500)}const nt=2;function Te(){const a=c.filters.customers,e=a.mode||"directory",t=c.derived.customers.length,n=c.derived.customers.filter(b=>b.doneCount>=nt||b.orders.length>=nt).length,i=c.data.orders.filter(b=>b.status==="Hoàn tất").length,s=`<div class="adm-mode-switch" role="tablist">
      <button type="button" role="tab" class="${e==="directory"||e==="list"?"is-active":""}" aria-selected="${e==="directory"||e==="list"}" data-act="customer-mode" data-mode="directory">Danh bạ khách hàng (${t})</button>
      <button type="button" role="tab" class="${e==="success"?"is-active":""}" aria-selected="${e==="success"}" data-act="customer-mode" data-mode="success">Đơn mua thành công (${i})</button>
      <button type="button" role="tab" class="${e==="loyal"?"is-active":""}" aria-selected="${e==="loyal"}" data-act="customer-mode" data-mode="loyal">Khách thân thiết (${n})</button>
    </div>`;if(e==="success")return qt("success",{before:s,purchase:!0,note:`khách mua từ ${nt} lần trở lên được tổng hợp ở "Khách thân thiết"`,empty:'Chưa có đơn hàng nào hoàn tất trong kỳ. Khi bạn bấm "✓ Thu tiền & Hoàn tất" ở mục Đơn hàng đang xử lý, đơn sẽ xuất hiện tại đây và doanh thu được ghi nhận.'});if(e==="loyal"){const b=tt(),D=a.q.trim().toLowerCase(),A=c.derived.customers.filter(f=>(f.doneCount>=nt||f.orders.length>=nt)&&f.orders.some(S=>V(S._date,b))),lt={};$t.forEach(f=>{lt[f.key]={count:A.filter(S=>!f.key||Q(S.type)===f.key).length}});const N=A.filter(f=>!a.type||Q(f.type)===a.type),Y=N.filter(f=>!D||[f.name,f.phone,f.email,f.org,f.city,f.address].some(S=>String(S||"").toLowerCase().includes(D))).sort((f,S)=>S.doneCount-f.doneCount||S.orders.length-f.orders.length||S.revenue-f.revenue),p=Math.min(a.page,Math.max(1,Math.ceil(Y.length/I))),x=Y.slice((p-1)*I,p*I),_=c.derived.customers.filter(f=>f.doneCount>0&&f.orders.some(S=>V(S._date,b))&&(!a.type||Q(f.type)===a.type)).length,W=f=>{const S={};return f.orders.forEach(F=>{F.items&&F.items.length?F.items.forEach(Z=>{S[Z.name]=(S[Z.name]||0)+Z.qty}):F.products&&(S[F.products]=(S[F.products]||0)+1)}),Object.entries(S).sort((F,Z)=>Z[1]-F[1]).slice(0,3)};return`
      ${s}
      ${Kt("customers",a.type,lt)}
      <section class="adm-card adm-card-tabbed">
        <div class="adm-tab-summary">
          ${M("Khách thân thiết",N.length)}
          ${M("Trên tổng khách có đơn",J(N.length,_||N.length))}
          ${M("Tổng chi tiêu",v(N.reduce((f,S)=>f+S.revenue,0)))}
          ${M("Số lần đặt trung bình",N.length?(N.reduce((f,S)=>f+S.orders.length,0)/N.length).toFixed(1).replace(".",","):"0")}
        </div>
        <div class="adm-toolbar" data-scope="customers">
          <input type="search" data-filter="q" value="${r(a.q)}" placeholder="Tìm tên, SĐT, email, cơ sở…" aria-label="Tìm khách thân thiết">
        </div>
        <p class="adm-muted adm-result-meta">${Y.length} khách hàng có từ ${nt} đơn trở lên · xếp theo số đơn đặt</p>
        ${x.length?`
        <div class="adm-table-wrap"><table class="adm-table">
          <thead><tr><th>Khách hàng</th><th>Loại khách</th><th class="num">Số đơn</th><th class="num">Tổng chi tiêu</th><th>Sản phẩm hay đặt</th><th>Lần đầu · gần nhất</th></tr></thead>
          <tbody>${x.map(f=>{const S=f.firstOrder?R(f.firstOrder):"—",F=f.lastDate?R(f.lastDate):"—";return`
            <tr data-act="open-customer" data-key="${r(f.key)}" tabindex="0">
              <td><span class="adm-cell-main">${r(f.name||"(chưa có tên)")}</span><small>${r(f.phone)}${f.email?` · ${r(f.email)}`:""}</small></td>
              <td>${r(f.type)}${f.org?`<small>${r(f.org)}</small>`:""}</td>
              <td class="num"><b>${f.orders.length}</b><small>đơn (${f.doneCount} xong)</small></td>
              <td class="num"><b>${v(f.revenue||f.ordered)}</b></td>
              <td class="adm-products-cell">${W(f).map(([Z,Lt])=>`<span>${r(Z)} <b>×${Lt}</b></span>`).join("")}</td>
              <td>${S}<small>gần nhất ${F}</small></td>
            </tr>`}).join("")}</tbody>
        </table></div>${vt(Y.length,p,"customers")}`:`<p class="adm-empty">Chưa có khách nào đặt từ ${nt} đơn trở lên trong khoảng thời gian này.</p>`}
      </section>`}const o=a.q.trim().toLowerCase(),d=c.derived.customers,m={};$t.forEach(b=>{m[b.key]={count:d.filter(D=>!b.key||Q(D.type)===b.key).length}});const h=d.filter(b=>!a.type||Q(b.type)===a.type),l=h.filter(b=>!o||[b.name,b.phone,b.email,b.org,b.city,b.address].some(D=>String(D||"").toLowerCase().includes(o))).sort((b,D)=>(D.lastDate?D.lastDate.getTime():0)-(b.lastDate?b.lastDate.getTime():0)),y=Math.min(a.page,Math.max(1,Math.ceil(l.length/I))),u=l.slice((y-1)*I,y*I),C=h.reduce((b,D)=>b+D.ordered,0),K=h.reduce((b,D)=>b+D.revenue,0),P=h.filter(b=>b.doneCount>0).length,H=h.filter(b=>b.orders.some(D=>D.status!=="Hoàn tất"&&!G.includes(D.status))).length;return`
    ${s}
    ${Kt("customers",a.type,m)}
    <section class="adm-card adm-card-tabbed">
      <div class="adm-tab-summary">
        ${M("Tổng khách hàng",h.length)}
        ${M("Khách đã mua xong",P)}
        ${M("Đang có đơn xử lý",H,H?"adm-warn-text":"")}
        ${M("Tổng tiền đã đặt",v(C))}
        ${M("Doanh thu thực thu",v(K),"adm-good-text")}
      </div>
      <div class="adm-toolbar" data-scope="customers">
        <input type="search" data-filter="q" value="${r(a.q)}" placeholder="Tìm tên, SĐT, email, địa chỉ, cơ sở…" aria-label="Tìm khách hàng">
      </div>
      <p class="adm-muted adm-result-meta">${l.length} khách hàng trong danh bạ · hiển thị người mới tương tác gần nhất trước</p>
      ${u.length?`
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Khách hàng</th><th>Địa chỉ / Tỉnh thành</th><th>Phân loại</th><th class="num">Số đơn</th><th class="num">Tổng tiền đặt</th><th>Đơn gần nhất</th><th>Thao tác</th></tr></thead>
        <tbody>${u.map(b=>{const D=String(b.phone||"").replace(/[^\d+]/g,""),A=b.city||b.address||"—";return`
          <tr data-act="open-customer" data-key="${r(b.key)}" tabindex="0">
            <td>
              <span class="adm-cell-main">${r(b.name||"(chưa có tên)")}</span>
              <small>${b.phone?`<a href="tel:${r(D)}" onclick="event.stopPropagation()">${r(b.phone)}</a> · <a href="https://zalo.me/${r(D)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Zalo</a>`:"Chưa có SĐT"}${b.email?` · ${r(b.email)}`:""}</small>
            </td>
            <td><span class="adm-cell-main">${r(A)}</span>${b.address&&b.city&&b.address!==b.city?`<small>${r(b.address)}</small>`:""}</td>
            <td>${r(b.type)}${b.org?`<small>${r(b.org)}</small>`:""}</td>
            <td class="num"><b>${b.orders.length}</b><small>đơn (${b.doneCount} xong)</small></td>
            <td class="num"><b>${v(b.ordered)}</b>${b.revenue>0?`<small>Đã thu: ${v(b.revenue)}</small>`:""}</td>
            <td>${b.lastDate?R(b.lastDate):"—"}<br>${O(b.latestStatus,rt[b.latestStatus])}</td>
            <td onclick="event.stopPropagation()"><button type="button" class="adm-btn adm-btn-ghost adm-btn-xs" data-act="open-customer" data-key="${r(b.key)}">Chi tiết →</button></td>
          </tr>`}).join("")}</tbody>
      </table></div>${vt(l.length,y,"customers")}`:'<p class="adm-empty">Chưa có khách hàng nào trong hệ thống.</p>'}
    </section>`}function xe(a){const e=c.derived.customerByKey[a];if(!e)return;const t=String(e.phone||"").replace(/[^\d+]/g,"");ct(`
    <h2>${r(e.name||"(chưa có tên)")}</h2>
    <p>${r(e.type)}${e.org?` – ${r(e.org)}`:""}</p>
    <p>${e.phone?`<a href="tel:${r(t)}">${r(e.phone)}</a> · <a href="https://zalo.me/${r(t)}" target="_blank" rel="noopener noreferrer">Zalo</a>`:""}${e.email?` · <a href="mailto:${r(e.email)}">${r(e.email)}</a>`:""}</p>
    <div class="adm-kpis adm-kpis-3 adm-kpis-compact">
      ${q("Đơn hợp lệ",e.validCount)}
      ${q("Doanh thu",v(e.revenue))}
      ${q("Mua lần đầu",e.firstOrder?R(e.firstOrder):"—")}
    </div>
    <section class="adm-d-section">
      <h3>Đơn hàng (${e.orders.length})</h3>
      ${e.orders.length?`<table class="adm-mini-table">${e.orders.map(n=>`<tr class="adm-click" data-act="open-order" data-code="${r(n.code)}"><td><b>${r(n.code)}</b><small>${X(n._date)}</small></td><td>${O(n.status,rt[n.status])}</td><td class="num">${v(n.total)}</td></tr>`).join("")}</table>`:'<p class="adm-muted">Chưa có đơn hàng.</p>'}
    </section>
    <section class="adm-d-section">
      <h3>Liên hệ / yêu cầu (${e.leads.length})</h3>
      ${e.leads.length?e.leads.map(n=>`<div class="adm-lead-mini adm-click" data-act="open-lead" data-id="${r(n.id)}"><b>${r(n.type)}</b> ${O(n.status,Vt[n.status])}<small>${X(n._date)}${n.interest?` · ${r(n.interest)}`:""}</small></div>`).join(""):'<p class="adm-muted">Không có.</p>'}
    </section>`)}const Wt=["Gọi điện","Zalo","Facebook / Instagram","TikTok","Khách giới thiệu","Hội chợ / sự kiện","Khách đến trực tiếp","Tư vấn viên giới thiệu","Khác"];function Ce(a){return String(a.type||"").indexOf("Nhập tay")===0}function De(){const a=c.data.options.leadSources||Wt,e=c.data.options.leadStatuses;ct(`
    <form class="adm-lead-add-form" autocomplete="off">
      <h2>Thêm khách tiềm năng</h2>
      <p class="adm-muted">Khách liên hệ qua điện thoại, Zalo, Facebook, được giới thiệu, gặp ở sự kiện…</p>
      <section class="adm-d-section">
        <div class="adm-d-grid">
          <label class="adm-field"><span>Họ tên *</span><input name="name" maxlength="80" required></label>
          <label class="adm-field"><span>Số điện thoại</span><input name="phone" inputmode="tel" maxlength="20" placeholder="VD: 0912 345 678"></label>
          <label class="adm-field"><span>Email</span><input name="email" type="email" maxlength="120"></label>
          <label class="adm-field"><span>Spa / Clinic / Công ty</span><input name="org" maxlength="160"></label>
          <label class="adm-field"><span>Nguồn khách</span><select name="source">${a.map(t=>`<option>${r(t)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Trạng thái</span><select name="status">${e.map((t,n)=>`<option ${n===0?"selected":""}>${r(t)}</option>`).join("")}</select></label>
        </div>
        <label class="adm-field"><span>Quan tâm</span><input name="interest" maxlength="300" placeholder="VD: Báo giá sỉ Dr.BARGO, nhập hàng cho spa, gia công OEM…"></label>
        <label class="adm-field"><span>Nội dung khách hỏi</span><textarea name="note" rows="3" maxlength="2000"></textarea></label>
        <label class="adm-field"><span>Ghi chú nội bộ</span><textarea name="internalNote" rows="2" maxlength="1000" placeholder="Hẹn gọi lại, đã gửi báo giá…"></textarea></label>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Người tư vấn</span><input name="consultant" maxlength="80" placeholder="Tên tư vấn viên phụ trách" value="${r(Nt(localStorage,"bevibe_admin_consultant",""))}"></label>
          <label class="adm-field adm-check"><input type="checkbox" name="converted"><span>Đã chốt, chờ khách đặt đơn trên web</span></label>
        </div>
        <p class="adm-note adm-note-warn" data-dup hidden></p>
        <p class="adm-error" data-lead-error hidden></p>
      </section>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">Lưu khách tiềm năng</button></div>
    </form>`),setTimeout(()=>{const t=$('.adm-lead-add-form [name="name"]');t&&t.focus()},50)}function Le(a,e){const t=Ot(a,e);return t?c.derived.customerByKey[t]:null}async function Me(a){const e=new FormData(a),t=Object.fromEntries(["name","phone","email","org","source","status","interest","note","internalNote","consultant"].map(l=>[l,String(e.get(l)||"").trim()]));e.get("converted")==="on"&&(t.status=z),dt(localStorage,"bevibe_admin_consultant",t.consultant||null);const n=a.querySelector("[data-lead-error]"),i=l=>{n.textContent=l,n.hidden=!1};n.hidden=!0;const s=t.phone.replace(/[\s.\-()]/g,""),o=/^\+?84\d{9,10}$/.test(s)?`0${s.replace(/^\+?84/,"")}`:s;if(!t.name)return i("Vui lòng nhập họ tên khách.");if(!o&&!t.email)return i("Vui lòng nhập số điện thoại hoặc email.");if(o&&!/^(\+?84|0)\d{9,10}$/.test(o))return i("Số điện thoại chưa đúng định dạng.");if(t.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email))return i("Email chưa đúng định dạng.");const d=a.querySelector("[data-dup]"),m=Le(o,t.email);if(m&&d.hidden){const l=m.orders.filter(y=>y.status==="Hoàn tất").length;d.innerHTML=`Số / email này đã có trong hệ thống: <b>${r(m.name||m.phone||m.email)}</b>
      (${m.orders.length} đơn${l?`, ${l} đơn hoàn tất`:""}, ${m.leads.length} lần liên hệ).
      <button type="button" class="adm-linkish" data-act="open-customer" data-key="${r(m.key)}">Xem hồ sơ</button> · bấm <b>Lưu</b> lần nữa để vẫn thêm lần liên hệ mới.`,d.hidden=!1;return}const h=a.querySelector('button[type="submit"]');h.disabled=!0;try{const l=await E("admin.addLead",{lead:{...t,phone:o}});c.data.leads.push({time:l.time||new Date().toISOString(),id:l.id,status:t.status,type:l.type||`Nhập tay – ${t.source}`,name:t.name,phone:l.phone||o,email:t.email,org:t.org,interest:t.interest,note:t.note,internalNote:t.internalNote,consultant:t.consultant,closedAt:t.status===z?new Date().toISOString():""}),j(),c.filters.leads.page=1;const y=c.data.leads.find(C=>C.id===l.id),u=y&&y.converted;!u&&!V(new Date,tt())&&(c.period.key="30d",$("#admPeriod").value="30d"),U(),T(),w(u?`${t.name} đã từng đặt đơn: yêu cầu được đưa vào mục Đơn hàng`:`Đã thêm khách tiềm năng ${t.name}`)}catch(l){h.disabled=!1,l.auth||i(l.message)}}function _e(){const a=c.filters.leads,e=tt(),t=a.q.trim().toLowerCase(),n=c.data.leads.filter(d=>V(d._date,e)&&!d.converted&&(!a.status||d.status===a.status)&&(!a.source||a.source==="manual"===Ce(d))&&(!t||[d.name,d.phone,d.email,d.org,d.type,d.interest,d.note].some(m=>String(m||"").toLowerCase().includes(t)))),i=Math.min(a.page,Math.max(1,Math.ceil(n.length/I))),s=n.slice((i-1)*I,i*I),o=c.data.options.leadStatuses;return`
    <p class="adm-muted adm-mode-hint adm-mode-hint-top">Người chưa đặt đơn. Tư vấn chốt được (Zalo, điện thoại…) thì tích <b>Chuyển đổi</b> và hướng dẫn khách đặt trên website. Khi khách đặt đơn với cùng số điện thoại / email, khách tự rời khỏi đây và đơn vào mục Đơn hàng.</p>
    ${(()=>{const d=c.data.leads.filter(m=>!m.converted&&m.status===z);return d.length?`<div class="adm-alerts"><button type="button" class="adm-alert" data-act="filter-leads-waiting"><b>${d.length}</b> khách đã chốt, đang chờ đặt đơn trên web</button></div>`:""})()}
    <section class="adm-card">
      <div class="adm-toolbar" data-scope="leads">
        <input type="search" data-filter="q" value="${r(a.q)}" placeholder="Tìm tên, SĐT, công ty, nội dung…" aria-label="Tìm khách tiềm năng">
        ${st("status",a.status,o.map(d=>[d,d]),"Mọi trạng thái")}
        ${st("source",a.source,[["web","Từ website"],["manual","Nhập tay"]],"Mọi nguồn")}
        <button type="button" class="adm-btn adm-btn-primary adm-btn-sm" data-act="add-lead">+ Thêm khách tiềm năng</button>
      </div>
      <p class="adm-muted adm-result-meta">${n.length} yêu cầu ·${o.map(d=>`${d}: ${n.filter(m=>m.status===d).length}`).join(" · ")}</p>
      ${s.length?`
      <div class="adm-table-wrap"><table class="adm-table">
        <thead><tr><th>Thời gian</th><th>Loại yêu cầu</th><th>Khách</th><th>Cơ sở / quan tâm</th><th>Người tư vấn</th><th>Chuyển đổi</th><th>Trạng thái</th></tr></thead>
        <tbody>${s.map(d=>`
          <tr data-act="open-lead" data-id="${r(d.id)}" tabindex="0">
            <td>${X(d._date)}</td>
            <td>${r(d.type)}${d.fromBuyer?"<small>Khách cũ gửi yêu cầu mới</small>":""}</td>
            <td><span class="adm-cell-main">${r(d.name)}</span><small>${r(d.phone)}${d.email?` · ${r(d.email)}`:""}</small></td>
            <td>${r(d.org)}<small>${r(d.interest)}</small></td>
            <td>${r(d.consultant||"—")}</td>
            <td><label class="adm-convert" title="Đã chốt trên Zalo / điện thoại, chờ khách đặt đơn trên web"><input type="checkbox" data-act="lead-convert" data-id="${r(d.id)}" ${d.status===z?"checked":""}><span>${d.status===z?`Chờ đặt đơn${d.closedAt?`<small>chốt ${R(d.closedAt)}</small>`:""}`:"Chuyển đổi"}</span></label></td>
            <td><select class="adm-inline-select adm-chip-${Vt[d.status]||"muted"}" data-act="lead-status" data-id="${r(d.id)}" aria-label="Trạng thái">${o.map(m=>`<option ${m===d.status?"selected":""}>${r(m)}</option>`).join("")}</select></td>
          </tr>`).join("")}</tbody>
      </table></div>${vt(n.length,i,"leads")}`:'<p class="adm-empty">Chưa có khách tiềm năng trong khoảng thời gian này.</p>'}
    </section>`}function Zt(a){const e=c.data.leads.find(n=>n.id===a);if(!e)return;const t=String(e.phone||"").replace(/[^\d+]/g,"");ct(`
    <form class="adm-lead-form" data-id="${r(e.id)}">
      <p class="adm-muted">${X(e._date)} · ${r(e.id)}</p>
      <h2>${r(e.name||"(chưa có tên)")}</h2>
      <p>${r(e.type)}</p>
      <section class="adm-d-section">
        <p>${e.phone?`<a href="tel:${r(t)}">${r(e.phone)}</a> · <a href="https://zalo.me/${r(t)}" target="_blank" rel="noopener noreferrer">Zalo</a>`:""}${e.email?` · <a href="mailto:${r(e.email)}">${r(e.email)}</a>`:""}</p>
        ${e.org?`<p><b>Cơ sở / công ty:</b> ${r(e.org)}</p>`:""}
        ${e.interest?`<p><b>Quan tâm:</b> ${r(e.interest)}</p>`:""}
        ${e.note?`<p class="adm-pre">${r(e.note)}</p>`:""}
      </section>
      ${e.converted?`
      <section class="adm-d-section">
        <h3>${e.fromBuyer?"Khách cũ gửi yêu cầu mới":"Đã chuyển thành khách đặt đơn"}</h3>
        <p class="adm-muted">Cùng số điện thoại / email với ${e.orders.length} đơn trên website. Đơn được xử lý ở mục Đơn hàng.</p>
        <table class="adm-mini-table">${e.orders.slice(0,5).map(n=>`<tr class="adm-click" data-act="open-order" data-code="${r(n.code)}"><td><b>${r(n.code)}</b><small>${X(n._date)}</small></td><td>${O(n.status,rt[n.status])}</td><td class="num">${v(n.total)}</td></tr>`).join("")}</table>
        <button type="button" class="adm-linkish" data-act="open-customer" data-key="${r(e.key)}">Xem hồ sơ khách →</button>
      </section>`:""}
      <section class="adm-d-section">
        <div class="adm-d-grid">
          <label class="adm-field"><span>Trạng thái</span><select name="status">${c.data.options.leadStatuses.map(n=>`<option ${n===e.status?"selected":""}>${r(n)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Người tư vấn</span><input name="consultant" maxlength="80" value="${r(e.consultant||"")}"></label>
        </div>
        ${e.status===z?`<p class="adm-note adm-note-warn">Đã chốt${e.closedAt?` ngày ${R(e.closedAt)}`:""}, đang chờ khách đặt đơn trên website. Nhắc khách dùng đúng số ${r(e.phone||e.email)} khi đặt để hệ thống nhận ra.</p>`:""}
        <label class="adm-field"><span>Ghi chú nội bộ</span><textarea name="internalNote" rows="4" placeholder="Nội dung đã tư vấn, hẹn gọi lại…">${r(e.internalNote)}</textarea></label>
      </section>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">Lưu</button></div>
    </form>`)}async function Et(a,e,t){const n=c.data.leads.find(s=>s.id===a),i={status:n.status,internalNote:n.internalNote,consultant:n.consultant,closedAt:n.closedAt};Object.assign(n,e),e.status===z&&i.status!==z?n.closedAt=new Date().toISOString():e.status&&e.status!==z&&e.status!=="Đã mua"&&(n.closedAt=""),j();try{n.sbId&&xt(n.sbId,{status:e.status}).catch(()=>{}),await E("admin.updateLead",{id:a,fields:e}),w("Đã lưu khách tiềm năng"),T(),t&&Zt(a)}catch(s){Object.assign(n,i),j(),T(),s.auth||w(s.message,!0)}}function Bt(){const a=c.data.customBrands||[];return[...ot.map(e=>({id:e.id,name:e.name,builtin:!0,visible:!0,lines:e.lines||[],image:e.coverImage})),...a.filter(e=>!ot.some(t=>t.id===e.id)).map(e=>({...e,builtin:!1,lines:[]}))]}function Qt(a){const e=Bt().find(t=>t.id===a);return e?e.name:a}function Ee(a,e=1400){return new Promise((t,n)=>{if(!/^image\/(jpeg|png|webp)$/.test(a.type)){n(new Error("Chỉ nhận ảnh JPG, PNG hoặc WEBP."));return}const i=new FileReader;i.onerror=()=>n(new Error("Không đọc được ảnh.")),i.onload=()=>{const s=new Image;s.onerror=()=>n(new Error("Ảnh bị lỗi, hãy thử ảnh khác.")),s.onload=()=>{const o=Math.min(1,e/Math.max(s.width,s.height)),d=document.createElement("canvas");d.width=Math.round(s.width*o),d.height=Math.round(s.height*o);const m=d.getContext("2d");m.fillStyle="#ffffff",m.fillRect(0,0,d.width,d.height),m.drawImage(s,0,0,d.width,d.height),t(d.toDataURL("image/jpeg",.86))},s.src=i.result},i.readAsDataURL(a)})}function Jt(a){return a.length?a.map((e,t)=>`<figure class="adm-img-item ${t===0?"is-main":""}">
        <img src="${r(e)}" alt="">
        ${t===0?'<span class="adm-img-main">Ảnh chính</span>':`<button type="button" class="adm-img-btn" data-act="img-main" data-i="${t}" title="Đặt làm ảnh chính">★</button>`}
        <button type="button" class="adm-img-btn adm-img-del" data-act="img-del" data-i="${t}" aria-label="Xóa ảnh" title="Xóa ảnh">×</button>
      </figure>`).join(""):'<p class="adm-muted">Chưa có ảnh. Ảnh đầu tiên là ảnh chính hiện trên thẻ sản phẩm.</p>'}let B=[];function wt(){const a=$("#admDrawerBody [data-images]");a&&(a.innerHTML=Jt(B))}async function Oe(a,e){for(const t of a){e.textContent=`Đang tải ảnh ${t.name}…`,e.hidden=!1;try{const n=await Ee(t),i=await E("admin.uploadImage",{name:t.name.replace(/\.[^.]+$/,""),dataUrl:n});B.push(i.url),wt()}catch(n){n.auth||w(n.message,!0)}}e.hidden=!0}function te(a){return`
    <div class="adm-field">
      <span>${a}</span>
      <div class="adm-img-grid" data-images>${Jt(B)}</div>
      <div class="adm-img-add">
        <label class="adm-btn adm-btn-ghost adm-btn-sm adm-file-btn">Tải ảnh lên<input type="file" accept="image/jpeg,image/png,image/webp" multiple data-upload hidden></label>
        <input type="url" data-img-url placeholder="hoặc dán link ảnh (https://…)">
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="img-add-url">Thêm link</button>
      </div>
      <small data-upload-status hidden></small>
    </div>`}function At(a,e){const t=a?(c.data.customProducts||[]).find(d=>d.id===a):null,n=a?(c.pricing||[]).find(d=>d.id===a)||{}:{};B=t?[t.image,...t.gallery||[]].filter(Boolean):[];const i=Bt(),s=t&&t.brandId||e||i[0].id,o=(ot.find(d=>d.id===s)||{}).lines||[];ct(`
    <form class="adm-product-form" data-id="${r(a||"")}" autocomplete="off">
      <h2>${t?"Sửa sản phẩm":"Thêm sản phẩm mới"}</h2>
      <p class="adm-muted">${t?r(t.id):"Sản phẩm sẽ hiện trên website (danh mục, tìm kiếm, trang chi tiết) sau khi lưu."}</p>
      <section class="adm-d-section">
        <h3>Thông tin chính</h3>
        <label class="adm-field"><span>Tên sản phẩm *</span><input name="name" maxlength="160" required value="${r(t?t.name:"")}" placeholder="VD: Dr.BARGO Cleansing Oil"></label>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Thương hiệu *</span><select name="brandId" data-brand-select>${i.map(d=>`<option value="${r(d.id)}" ${d.id===s?"selected":""}>${r(d.name)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Dòng sản phẩm</span><select name="line" data-line-select><option value="">— Không thuộc dòng nào —</option>${o.map(d=>`<option value="${r(d.id)}" ${t&&t.line===d.id?"selected":""}>${r(d.nameVi)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Danh mục</span><select name="category">${oe.map(d=>`<option value="${d.id}" ${(t?t.category:"moisturizer")===d.id?"selected":""}>${r(d.vi)}</option>`).join("")}</select></label>
          <label class="adm-field"><span>Quy cách</span><input name="spec" maxlength="80" value="${r(t?t.spec:"")}" placeholder="VD: Chai 150ml"></label>
        </div>
        <label class="adm-field"><span>Mô tả ngắn (hiện trên thẻ sản phẩm)</span><input name="tag" maxlength="200" value="${r(t?t.tag:"")}" placeholder="VD: Dầu tẩy trang dịu nhẹ cho da nhạy cảm"></label>
        <label class="adm-field"><span>Tên tiếng Hàn (không bắt buộc)</span><input name="nameKo" maxlength="160" value="${r(t?t.nameKo:"")}"></label>
      </section>
      <section class="adm-d-section">
        <h3>Ảnh sản phẩm *</h3>
        ${te("Ảnh (tối đa 9)")}
      </section>
      <section class="adm-d-section">
        <h3>Giá &amp; tình trạng</h3>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Giá bán (đ)</span><input type="number" name="price" min="0" step="1000" value="${n.price||""}" placeholder="Để trống = Liên hệ"></label>
          <label class="adm-field"><span>Giá vốn (đ)</span><input type="number" name="cost" min="0" step="1000" value="${n.cost||""}"></label>
          <label class="adm-field"><span>Trạng thái</span><select name="status">${jt.map(d=>`<option ${d===(n.status||"Đang bán")?"selected":""}>${d}</option>`).join("")}</select></label>
          <label class="adm-field adm-check"><input type="checkbox" name="visible" ${!t||t.visible?"checked":""}><span>Hiện trên website</span></label>
        </div>
        <p class="adm-fineprint">Giá khuyến mãi đặt ở mục Chi phí &amp; giá vốn.</p>
      </section>
      <section class="adm-d-section">
        <h3>Nội dung trang chi tiết</h3>
        <label class="adm-field"><span>Mô tả chi tiết</span><textarea name="desc" rows="4" maxlength="4000">${r(t?t.desc:"")}</textarea></label>
        <label class="adm-field"><span>Công dụng (mỗi dòng một ý)</span><textarea name="benefits" rows="3">${r(t?(t.benefits||[]).join(`
`):"")}</textarea></label>
        <label class="adm-field"><span>Thành phần (mỗi dòng: Tên thành phần: tác dụng)</span><textarea name="ingredients" rows="3" placeholder="Ceramide NP: phục hồi hàng rào da">${r(t?(t.ingredients||[]).map(d=>d.desc?`${d.name}: ${d.desc}`:d.name).join(`
`):"")}</textarea></label>
        <label class="adm-field"><span>Cách dùng</span><textarea name="usage" rows="2" maxlength="2000">${r(t?t.usage:"")}</textarea></label>
      </section>
      <p class="adm-error" data-product-error hidden></p>
      <div class="adm-d-actions">
        ${t?`<button type="button" class="adm-btn adm-btn-danger" data-act="delete-product" data-id="${r(t.id)}">Xóa sản phẩm</button>`:""}
        <button type="submit" class="adm-btn adm-btn-primary">${t?"Lưu thay đổi":"Thêm sản phẩm"}</button>
      </div>
    </form>`)}function Ft(a){const e=a?(c.data.customBrands||[]).find(t=>t.id===a):null;B=e&&e.image?[e.image]:[],ct(`
    <form class="adm-brand-form" data-id="${r(a||"")}" autocomplete="off">
      <h2>${e?"Sửa thương hiệu":"Thêm thương hiệu"}</h2>
      <p class="adm-muted">Thương hiệu sẽ hiện trong menu Thương hiệu và trang thương hiệu trên website.</p>
      <section class="adm-d-section">
        <label class="adm-field"><span>Tên thương hiệu *</span><input name="name" maxlength="80" required value="${r(e?e.name:"")}"></label>
        <div class="adm-d-grid">
          <label class="adm-field"><span>Nhãn ngắn</span><input name="badge" maxlength="60" value="${r(e?e.badge:"")}" placeholder="VD: Clinical Formula"></label>
          <label class="adm-field"><span>Xuất xứ</span><input name="origin" maxlength="80" value="${r(e?e.origin:"")}" placeholder="VD: Seoul, Korea"></label>
        </div>
        <label class="adm-field"><span>Khẩu hiệu</span><input name="tagline" maxlength="200" value="${r(e?e.tagline:"")}"></label>
        <label class="adm-field"><span>Giới thiệu ngắn</span><textarea name="desc" rows="3" maxlength="3000">${r(e?e.desc:"")}</textarea></label>
        <label class="adm-field"><span>Câu chuyện thương hiệu</span><textarea name="story" rows="4" maxlength="4000">${r(e?e.story:"")}</textarea></label>
        ${te("Ảnh đại diện (ảnh đầu tiên được dùng)")}
        <label class="adm-field adm-check"><input type="checkbox" name="visible" ${!e||e.visible?"checked":""}><span>Hiện trên website</span></label>
      </section>
      <p class="adm-error" data-brand-error hidden></p>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">${e?"Lưu thay đổi":"Thêm thương hiệu"}</button></div>
    </form>`)}async function Ke(a){const e=new FormData(a),t=a.querySelector("[data-product-error]"),n=h=>{t.textContent=h,t.hidden=!1},i=String(e.get("name")||"").trim();if(!i)return n("Vui lòng nhập tên sản phẩm.");if(!B.length)return n("Vui lòng thêm ít nhất 1 ảnh sản phẩm.");const s=a.dataset.id||"",o={id:s,name:i,nameKo:String(e.get("nameKo")||"").trim(),brandId:e.get("brandId"),line:e.get("line")||"",category:e.get("category"),spec:String(e.get("spec")||"").trim(),tag:String(e.get("tag")||"").trim(),desc:String(e.get("desc")||"").trim(),usage:String(e.get("usage")||"").trim(),visible:e.get("visible")==="on",image:B[0],gallery:B.slice(1,9),benefits:String(e.get("benefits")||"").split(`
`).map(h=>h.trim()).filter(Boolean),ingredients:String(e.get("ingredients")||"").split(`
`).map(h=>h.trim()).filter(Boolean).map(h=>{const l=h.indexOf(":");return l>0?{name:h.slice(0,l).trim(),desc:h.slice(l+1).trim()}:{name:h,desc:""}})},d=(c.pricing||[]).find(h=>h.id===s)||{};o.pricing={price:Math.max(0,Math.round(Number(e.get("price"))||0)),cost:Math.max(0,Math.round(Number(e.get("cost"))||0)),status:e.get("status"),salePrice:d.salePrice||0,saleFrom:d.saleFrom||"",saleTo:d.saleTo||""},o.pricing.salePrice&&o.pricing.salePrice>=o.pricing.price&&(o.pricing.salePrice=0,o.pricing.saleFrom="",o.pricing.saleTo="");const m=a.querySelectorAll("button");m.forEach(h=>{h.disabled=!0});try{const h=await E("admin.saveProduct",{product:o}),l={...o,id:h.id,updatedAt:new Date().toISOString()};delete l.pricing;const y=c.data.customProducts||(c.data.customProducts=[]),u=y.findIndex(C=>C.id===h.id);if(u>=0?y[u]={...y[u],...l}:y.push(l),c.data.pricing={...c.data.pricing||{},[h.id]:{name:i,unit:o.spec,...o.pricing}},c.data.costs={...c.data.costs,[h.id]:o.pricing.cost},!c.pricingDirty||!c.pricingDirty.size)c.pricing=null;else{const C={id:h.id,brand:Qt(o.brandId),brandId:o.brandId,image:o.image,custom:!0,visible:o.visible,name:i,unit:o.spec,...o.pricing},K=c.pricing.findIndex(P=>P.id===h.id);K>=0?c.pricing[K]=C:c.pricing.push(C)}j(),U(),T(),w(s?`Đã lưu ${i}`:`Đã thêm ${i} · khách thấy sản phẩm khi tải lại trang`)}catch(h){m.forEach(l=>{l.disabled=!1}),h.auth||n(h.message)}}async function Pe(a){const e=new FormData(a),t=a.querySelector("[data-brand-error]"),n=String(e.get("name")||"").trim();if(!n){t.textContent="Vui lòng nhập tên thương hiệu.",t.hidden=!1;return}const i=a.dataset.id||"",s={id:i,name:n,badge:String(e.get("badge")||"").trim(),origin:String(e.get("origin")||"").trim(),tagline:String(e.get("tagline")||"").trim(),desc:String(e.get("desc")||"").trim(),story:String(e.get("story")||"").trim(),image:B[0]||"",visible:e.get("visible")==="on"},o=a.querySelector('button[type="submit"]');o.disabled=!0;try{const d=await E("admin.saveBrand",{brand:s}),m=c.data.customBrands||(c.data.customBrands=[]),h=m.findIndex(y=>y.id===d.id),l={...s,id:d.id};h>=0?m[h]={...m[h],...l}:m.push(l),c.filters.pricing.brand=d.id,U(),T(),w(i?`Đã lưu thương hiệu ${n}`:`Đã thêm thương hiệu ${n} · bấm "+ Thêm sản phẩm" để thêm sản phẩm`)}catch(d){o.disabled=!1,d.auth||(t.textContent=d.message,t.hidden=!1)}}async function Ne(a){const e=(c.data.customProducts||[]).find(n=>n.id===a);if(!e)return;const t=(c.pricing||[]).find(n=>n.id===a)||{};try{await E("admin.saveProduct",{product:{...e,visible:!e.visible,pricing:{price:t.price||0,cost:t.cost||0,status:t.status||"Đang bán",salePrice:t.salePrice||0,saleFrom:t.saleFrom||"",saleTo:t.saleTo||""}}}),e.visible=!e.visible;const n=(c.pricing||[]).find(i=>i.id===a);n&&(n.visible=e.visible),T(),w(e.visible?`Đã hiện ${e.name} trên website`:`Đã ẩn ${e.name} khỏi website`)}catch(n){n.auth||w(n.message,!0)}}async function qe(a){const e=(c.data.customProducts||[]).find(t=>t.id===a);if(!(!e||!window.confirm(`Xóa sản phẩm "${e.name}"? Sản phẩm sẽ biến mất khỏi website. Đơn hàng cũ vẫn giữ nguyên.`)))try{await E("admin.deleteProduct",{id:a}),c.data.customProducts=c.data.customProducts.filter(t=>t.id!==a),c.data.pricing&&delete c.data.pricing[a],!c.pricingDirty||!c.pricingDirty.size?c.pricing=null:(c.pricing=c.pricing.filter(t=>t.id!==a),c.pricingDirty.delete(a)),U(),T(),w(`Đã xóa ${e.name}`)}catch(t){t.auth||w(t.message,!0)}}async function Be(a){const e=(c.data.customBrands||[]).find(t=>t.id===a);if(e){if((c.data.customProducts||[]).some(t=>t.brandId===a)){w("Thương hiệu này còn sản phẩm. Hãy xóa hoặc chuyển sản phẩm sang thương hiệu khác trước.",!0);return}if(window.confirm(`Xóa thương hiệu "${e.name}" khỏi website?`))try{await E("admin.deleteBrand",{id:a}),c.data.customBrands=c.data.customBrands.filter(t=>t.id!==a),c.filters.pricing.brand="",T(),w(`Đã xóa thương hiệu ${e.name}`)}catch(t){t.auth||w(t.message,!0)}}}const jt=["Đang bán","Hết hàng","Ngừng bán"],je=ot.flatMap(a=>a.productsVi.map(e=>({id:e.id,name:e.name,spec:e.spec||"",brand:a.name,brandId:a.id})));function ee(){const a=c.data.pricing||{},e=c.data.products||{},t=(c.data.customProducts||[]).map(o=>({id:o.id,name:o.name,spec:o.spec||"",brand:Qt(o.brandId),brandId:o.brandId,image:o.image,custom:!0,visible:o.visible!==!1})),i=[...je.map(o=>{const d=ot.find(m=>m.id===o.brandId).productsVi.find(m=>m.id===o.id)||{};return{...o,image:d.image||"",custom:!1,visible:!0}}),...t],s=[...new Set([...i.map(o=>o.id),...Object.keys(a),...Object.keys(e)])];c.pricing=s.map(o=>{const d=i.find(y=>y.id===o)||{name:o,brand:"",spec:""},m=a[o]||{},h=e[o]||{},l=kt[o]||{};return{id:o,brand:d.brand,brandId:d.brandId||"",image:d.image||"",custom:!!d.custom,visible:d.visible!==!1,name:m.name||h.name||d.name,unit:m.unit||h.unit||l.unit||d.spec||"",price:Number(m.price??h.price??0)||0,cost:Number(m.cost??c.data.costs[o]??0)||0,salePrice:Number(m.salePrice)||0,saleFrom:m.saleFrom||"",saleTo:m.saleTo||"",status:jt.includes(m.status)?m.status:"Đang bán"}}),c.pricingDirty=new Set}function pt(a){const e=it(new Date),t=a.salePrice>0&&a.price>0&&a.salePrice<a.price&&(!a.saleFrom||a.saleFrom<=e)&&(!a.saleTo||e<=a.saleTo),n=a.salePrice>0&&a.salePrice<a.price&&a.saleFrom&&a.saleFrom>e,i=a.salePrice>0&&a.saleTo&&a.saleTo<e;return{price:t?a.salePrice:a.price,onSale:t,upcoming:n,ended:i}}function ae(a){if(!(a.price>0))return'<span class="adm-muted">Liên hệ (chưa có giá)</span>';const e=pt(a),t=a.status!=="Đang bán"?` ${O(a.status,a.status==="Hết hàng"?"returned":"cancelled")}`:"";return e.onSale?`<b class="adm-sale-price">${v(e.price)}</b> <del class="adm-muted">${v(a.price)}</del> ${O(`-${Math.round((1-e.price/a.price)*100)}%`,"cancelled")}${t}`:`<b>${v(a.price)}</b>${e.upcoming?` <small>KM bắt đầu ${R(`${a.saleFrom}T00:00:00`)}</small>`:""}${e.ended?" <small>KM đã kết thúc</small>":""}${t}`}function He(a,e){const t=(e.q||"").trim().toLowerCase();if(t&&![a.name,a.id,a.brand,a.unit].some(i=>String(i||"").toLowerCase().includes(t))||e.brand&&a.brandId!==e.brand)return!1;const n=pt(a);switch(e.show){case"sale":return n.onSale||n.upcoming;case"out":return a.status==="Hết hàng";case"stop":return a.status==="Ngừng bán";case"noprice":return!(a.price>0);case"nocost":return a.price>0&&!(a.cost>0);default:return!0}}function Ie(){c.pricing||ee();const a=c.filters.pricing,e=c.pricing.filter(u=>He(u,a)),t=c.pricing,n=u=>t.filter(u).length,i=Bt();a.brand&&!i.some(u=>u.id===a.brand)&&(a.brand="");const s=i.find(u=>u.id===a.brand),o=c.pricingDirty.size,d=`<div class="adm-tabs adm-brand-tabs" role="tablist">
      ${[{id:"",name:"Tất cả"},...i].map(u=>{const C=t.filter(K=>!u.id||K.brandId===u.id).length;return`<button type="button" role="tab" aria-selected="${a.brand===u.id}" class="adm-tab ${a.brand===u.id?"is-active":""}" data-act="brand-tab" data-brand="${r(u.id)}">
          <span>${r(u.name)}</span><b>${C}</b>${u.id&&!u.builtin?`<em class="adm-tab-new" title="${u.visible?"Thương hiệu thêm từ admin":"Đang ẩn trên website"}">${u.visible?"mới":"ẩn"}</em>`:""}</button>`}).join("")}
      <button type="button" class="adm-tab adm-tab-add" data-act="add-brand">+ Thêm thương hiệu</button>
    </div>`,m=s&&!s.builtin?`
    <div class="adm-brand-head">
      ${s.image?`<img src="${r(s.image)}" alt="" loading="lazy">`:""}
      <div>
        <h2>${r(s.name)} ${O(s.visible?"Thêm từ admin":"Đang ẩn trên web",s.visible?"done":"muted")}</h2>
        <p class="adm-muted">${r(s.tagline||s.desc||"Hiện trong menu Thương hiệu của website.")}</p>
      </div>
      <div class="adm-brand-actions">
        <button type="button" class="adm-btn adm-btn-ghost adm-btn-sm" data-act="edit-brand" data-id="${r(s.id)}">Sửa thương hiệu</button>
        <button type="button" class="adm-btn adm-btn-danger adm-btn-sm" data-act="delete-brand" data-id="${r(s.id)}">Xóa</button>
      </div>
    </div>`:"",h=tt(),l=c.data.expenses.filter(u=>V(u._date,h)),y=l.reduce((u,C)=>u+C.amount,0);return`
    <section class="adm-kpis">
      ${q("Sản phẩm đang bán",n(u=>u.price>0&&u.status==="Đang bán"),`${n(u=>!(u.price>0))} sản phẩm để "Liên hệ"`,"primary")}
      ${q("Đang khuyến mãi",n(u=>pt(u).onSale),`${n(u=>pt(u).upcoming)} chương trình sắp bắt đầu`)}
      ${q("Hết hàng / ngừng bán",n(u=>u.status!=="Đang bán"),"Khách không thêm vào giỏ được")}
      ${q("Thiếu giá vốn",n(u=>u.price>0&&!(u.cost>0)),"Cần nhập để báo cáo tính đúng lợi nhuận",n(u=>u.price>0&&!(u.cost>0))?"bad":"good")}
    </section>

    ${d}
    <section class="adm-card adm-card-tabbed">
      ${m}
      <div class="adm-card-head">
        <div><h2>Sản phẩm &amp; bảng giá${s?` · ${r(s.name)}`:""}</h2>
        <p class="adm-muted">Sửa giá bán, giá vốn, khuyến mãi, trạng thái ngay trong bảng rồi bấm "Lưu bảng giá". Giá vốn chỉ hiện trong admin.</p></div>
      </div>
      <div class="adm-toolbar" data-scope="pricing">
        <input type="search" data-filter="q" value="${r(a.q)}" placeholder="Tìm tên, mã sản phẩm…" aria-label="Tìm sản phẩm">
        ${st("show",a.show,[["sale","Đang / sắp khuyến mãi"],["out","Hết hàng"],["stop","Ngừng bán"],["noprice","Chưa có giá (Liên hệ)"],["nocost","Thiếu giá vốn"]],"Tất cả sản phẩm")}
        <button type="button" class="adm-btn adm-btn-primary adm-btn-sm" data-act="add-product">+ Thêm sản phẩm${s?` cho ${r(s.name)}`:""}</button>
      </div>
      <p class="adm-muted adm-result-meta">${e.length} sản phẩm${s?` của ${r(s.name)}`:""} · để trống giá bán = website hiện "Liên hệ" · giá khuyến mãi chỉ áp dụng trong khoảng ngày đã chọn (để trống = không giới hạn)</p>
      <form id="admPricingForm" novalidate>
        <div class="adm-table-wrap"><table class="adm-table adm-pricing-table">
          <thead><tr>
            <th></th><th>Sản phẩm</th><th>Quy cách</th><th class="num">Giá bán (đ)</th><th class="num">Giá vốn (đ)</th><th class="num">Lãi gộp</th>
            <th>Khuyến mãi</th><th>Trạng thái</th><th>Website đang hiện</th><th></th>
          </tr></thead>
          <tbody>${e.map(u=>{const C=pt(u),K=u.price>0&&u.cost>0?J(C.price-u.cost,C.price):"—";return`
            <tr data-price-row="${r(u.id)}" class="${c.pricingDirty.has(u.id)?"is-dirty":""}">
              <td class="adm-thumb-cell">${u.image?`<img src="${r(u.image)}" alt="" loading="lazy">`:'<span class="adm-thumb-empty"></span>'}</td>
              <td><span class="adm-cell-main">${r(u.name)}</span><small>${r(u.brand)} · ${r(u.id)}</small>${u.custom?`<small>${O(u.visible?"Thêm từ admin":"Đang ẩn trên web",u.visible?"done":"muted")}</small>`:""}</td>
              <td><input class="adm-pin adm-pin-unit" data-field="unit" value="${r(u.unit)}" maxlength="80" aria-label="Quy cách ${r(u.name)}"></td>
              <td class="num"><input class="adm-pin" type="number" min="0" step="1000" data-field="price" value="${u.price||""}" placeholder="Liên hệ" aria-label="Giá bán ${r(u.name)}"></td>
              <td class="num"><input class="adm-pin" type="number" min="0" step="1000" data-field="cost" value="${u.cost||""}" placeholder="0" aria-label="Giá vốn ${r(u.name)}"></td>
              <td class="num" data-cell="margin">${K}</td>
              <td class="adm-sale-cell">
                <input class="adm-pin" type="number" min="0" step="1000" data-field="salePrice" value="${u.salePrice||""}" placeholder="Giá KM" aria-label="Giá khuyến mãi ${r(u.name)}">
                <span class="adm-sale-dates"><input type="date" class="adm-pin" data-field="saleFrom" value="${r(u.saleFrom)}" aria-label="Khuyến mãi từ ngày"><span>–</span><input type="date" class="adm-pin" data-field="saleTo" value="${r(u.saleTo)}" aria-label="Khuyến mãi đến ngày"></span>
              </td>
              <td><select class="adm-pin adm-pin-status adm-status-${u.status==="Đang bán"?"on":u.status==="Hết hàng"?"out":"stop"}" data-field="status" aria-label="Trạng thái ${r(u.name)}">${jt.map(P=>`<option ${P===u.status?"selected":""}>${P}</option>`).join("")}</select></td>
              <td data-cell="preview">${ae(u)}</td>
              <td class="adm-row-actions">${u.custom?`<button type="button" class="adm-linkish" data-act="edit-product" data-id="${r(u.id)}">Sửa</button><button type="button" class="adm-linkish" data-act="toggle-product" data-id="${r(u.id)}">${u.visible?"Ẩn":"Hiện"}</button>`:'<span class="adm-muted" title="Tên, ảnh, mô tả nằm trong code website">Có sẵn</span>'}</td>
            </tr>`}).join("")}</tbody>
        </table></div>
        <div class="adm-save-bar ${o?"is-dirty":""}">
          <span>${o?`<b>${o}</b> sản phẩm có thay đổi chưa lưu`:"Chưa có thay đổi"}</span>
          ${o?'<button type="button" class="adm-btn adm-btn-ghost" data-act="pricing-reset">Hoàn tác</button>':""}
          <button type="submit" class="adm-btn adm-btn-primary" ${o?"":"disabled"}>Lưu bảng giá</button>
        </div>
      </form>
    </section>

    <section class="adm-card">
      <div class="adm-card-head"><div><h2>Chi phí vận hành trong kỳ</h2><p class="adm-muted">${Ct()} · tổng ${v(y)} · nhập ở sheet "Chi phí" trong Google Sheet, dùng để tính lợi nhuận trong Báo cáo</p></div></div>
      ${l.length?`<div class="adm-table-wrap adm-table-short"><table class="adm-table adm-table-plain">
        <thead><tr><th>Ngày</th><th>Hạng mục</th><th class="num">Số tiền</th><th></th></tr></thead>
        <tbody>${l.map(u=>`<tr><td>${R(u._date)}</td><td>${r(u.category)}${u.note?`<small>${r(u.note)}</small>`:""}</td><td class="num">${v(u.amount)}</td>
          <td class="num"><button type="button" class="adm-icon-btn" data-act="delete-expense" data-id="${r(u.id)}" aria-label="Xóa khoản chi" title="Xóa">×</button></td></tr>`).join("")}</tbody>
      </table></div>`:'<p class="adm-empty">Chưa có khoản chi nào trong khoảng thời gian này.</p>'}
    </section>`}function Re(a){const e=a.closest("[data-price-row]"),t=c.pricing.find(o=>o.id===e.dataset.priceRow),n=a.dataset.field;t[n]=["price","cost","salePrice"].includes(n)?Math.max(0,Math.round(Number(a.value)||0)):a.value,c.pricingDirty.add(t.id),e.classList.add("is-dirty"),n==="status"&&(a.className=`adm-pin adm-pin-status adm-status-${t.status==="Đang bán"?"on":t.status==="Hết hàng"?"out":"stop"}`);const i=pt(t);e.querySelector('[data-cell="margin"]').textContent=t.price>0&&t.cost>0?J(i.price-t.cost,i.price):"—",e.querySelector('[data-cell="preview"]').innerHTML=ae(t);const s=et().querySelector(".adm-save-bar");s&&(s.classList.add("is-dirty"),s.querySelector("span").innerHTML=`<b>${c.pricingDirty.size}</b> sản phẩm có thay đổi chưa lưu`,s.querySelector('button[type="submit"]').disabled=!1,s.querySelector('[data-act="pricing-reset"]')||s.querySelector('button[type="submit"]').insertAdjacentHTML("beforebegin",'<button type="button" class="adm-btn adm-btn-ghost" data-act="pricing-reset">Hoàn tác</button>'))}async function Ae(a){for(const t of c.pricing)if(c.pricingDirty.has(t.id)){if(t.salePrice&&!(t.price>0))return w(`"${t.name}": cần nhập giá bán trước khi đặt giá khuyến mãi.`,!0);if(t.salePrice&&t.salePrice>=t.price)return w(`"${t.name}": giá khuyến mãi phải thấp hơn giá bán.`,!0);if(t.saleFrom&&t.saleTo&&t.saleFrom>t.saleTo)return w(`"${t.name}": ngày khuyến mãi chưa đúng (từ ngày sau đến ngày).`,!0)}const e=a.querySelector('button[type="submit"]');e.disabled=!0,e.textContent="Đang lưu…";try{const t=c.pricing.map(({brand:n,brandId:i,image:s,custom:o,visible:d,...m})=>m);await E("admin.savePricing",{rows:t}),c.data.pricing=Object.fromEntries(t.map(n=>[n.id,n])),c.data.costs=Object.fromEntries(t.map(n=>[n.id,n.cost])),c.pricingDirty=new Set,j(),T(),w("Đã lưu bảng giá · khách thấy giá mới khi tải lại trang")}catch(t){e.disabled=!1,e.textContent="Lưu bảng giá",t.auth||w(t.message,!0)}}function Fe(){window.addEventListener("hashchange",()=>{U(),T(),window.scrollTo(0,0)}),window.addEventListener("beforeunload",t=>{c.pricingDirty&&c.pricingDirty.size&&(t.preventDefault(),t.returnValue="")}),$("#admPeriod").value=c.period.key,$("#admPeriod").addEventListener("change",t=>{c.period.key=t.target.value,c.period.key==="custom"&&(c.period.from=$("#admFrom").value,c.period.to=$("#admTo").value),dt(localStorage,Gt,{...Xt,period:c.period.key==="custom"?"30d":c.period.key}),Object.values(c.filters).forEach(n=>{n.page=1}),T()}),["#admFrom","#admTo"].forEach(t=>$(t).addEventListener("change",()=>{let n=$("#admFrom").value,i=$("#admTo").value;n&&i&&n>i&&([n,i]=[i,n]),Object.assign(c.period,{key:"custom",from:n,to:i}),$("#admPeriod").value="custom",Object.values(c.filters).forEach(s=>{s.page=1}),T()})),$("#admRefresh").addEventListener("click",()=>ft(!0)),$("#admLogout").addEventListener("click",()=>ne(!1)),$("#admChangePw").addEventListener("click",Ge),$("#admDrawerClose").addEventListener("click",U),$("#admDrawerBackdrop").addEventListener("click",U),document.addEventListener("keydown",t=>{t.key==="Escape"&&U(),t.key==="Enter"&&t.target.matches("tr[data-act]")&&t.target.click()});let a;et().addEventListener("input",t=>{const n=t.target;if(n.matches(".adm-pin")){Re(n);return}if(!n.matches("[data-filter]"))return;const i=n.closest("[data-scope]").dataset.scope;clearTimeout(a);const s=()=>{if(c.filters[i][n.dataset.filter]=n.value,c.filters[i].page=1,T(),n.type==="search"){const o=et().querySelector(`[data-scope="${i}"] [data-filter="q"]`);o&&(o.focus(),o.setSelectionRange(o.value.length,o.value.length))}};n.type==="search"?a=setTimeout(s,250):s()}),et().addEventListener("change",t=>{const n=t.target;n.matches('[data-act="lead-status"]')&&Et(n.dataset.id,{status:n.value}),n.matches('[data-act="lead-convert"]')&&Et(n.dataset.id,{status:n.checked?z:"Tiềm năng"})});const e=t=>{const n=t.target.closest("[data-goto]");if(n){window.location.hash=`#/${n.dataset.goto}`;return}if(t.target.closest(".adm-convert"))return;const i=t.target.closest("[data-act]");if(!i||i.matches("select"))return;const s=i.dataset.act;if(s==="open-order")Yt(i.dataset.code);else if(s==="open-customer")xe(i.dataset.key);else if(s==="open-lead")Zt(i.dataset.id);else if(s==="type-tab")c.filters[i.dataset.scope].type=i.dataset.type,c.filters[i.dataset.scope].page=1,T();else if(s==="funnel-stage")c.funnelStage=Number(i.dataset.stage),T();else if(s==="page")c.filters[i.dataset.scope].page=Number(i.dataset.page),T(),window.scrollTo(0,0);else if(s==="export-orders")Se(i.dataset.group);else if(s==="filter-orders"){const o=St(i.dataset.status||"Mới"),d=at[o].statuses.length>1;Object.assign(c.filters[o],{q:"",status:d&&i.dataset.status||"",type:"",pay:i.dataset.pay||"",payStatus:i.dataset.payStatus||"",reason:"",page:1}),o==="success"&&(c.filters.customers.mode="list"),window.location.hash=`#/${at[o].view}`,T()}else if(s==="customer-mode")c.filters.customers.mode=i.dataset.mode,T();else if(s==="brand-tab")c.filters.pricing.brand=i.dataset.brand,T();else if(s==="add-brand")Ft();else if(s==="edit-brand")Ft(i.dataset.id);else if(s==="delete-brand")Be(i.dataset.id);else if(s==="add-product")At("",c.filters.pricing.brand);else if(s==="edit-product")At(i.dataset.id);else if(s==="toggle-product")Ne(i.dataset.id);else if(s==="delete-product")qe(i.dataset.id);else if(s==="img-del")B.splice(Number(i.dataset.i),1),wt();else if(s==="img-main"){const[o]=B.splice(Number(i.dataset.i),1);B.unshift(o),wt()}else if(s==="img-add-url"){const o=$("#admDrawerBody [data-img-url]"),d=o?o.value.trim():"";if(!/^https:\/\/[^\s"'<>]+$/.test(d)){w("Link ảnh cần bắt đầu bằng https://",!0);return}B.push(d),o.value="",wt()}else if(s==="pricing-reset")ee(),T();else if(s==="filter-leads-waiting")Object.assign(c.filters.leads,{status:z,q:"",source:"",page:1}),c.period.key="all",$("#admPeriod").value="all",T();else if(s==="add-lead")De();else if(s==="mark-failed")ke(i.closest("form"),i.dataset.status,i.dataset.reason||"");else if(s==="quick-status"){const o=i.closest("form");It(o,{status:i.dataset.status})}else if(s==="quick-status-inline")t.stopPropagation(),we(i.dataset.code,i.dataset.status);else if(s==="quick-complete-inline")t.stopPropagation(),Rt(i.dataset.code);else if(s==="quick-complete-drawer"){const o=i.closest("form");o&&Rt(o.dataset.code)}else s==="delete-expense"&&Ue(i.dataset.id)};et().addEventListener("click",e),$("#admDrawerBody").addEventListener("click",e),$("#admDrawerBody").addEventListener("submit",t=>{t.preventDefault();const n=t.target;if(n.matches(".adm-order-form"))It(n);else if(n.matches(".adm-pw-form"))Ve(n);else if(n.matches(".adm-lead-add-form"))Me(n);else if(n.matches(".adm-product-form"))Ke(n);else if(n.matches(".adm-brand-form"))Pe(n);else if(n.matches(".adm-lead-form")){const i=new FormData(n);Et(n.dataset.id,{status:i.get("status"),internalNote:String(i.get("internalNote")||""),consultant:String(i.get("consultant")||"").trim()},n)}}),$("#admDrawerBody").addEventListener("change",t=>{const n=t.target;if(n.matches("[data-upload]")&&n.files&&n.files.length){const i=Math.max(0,9-B.length);Oe(Array.from(n.files).slice(0,i),$("#admDrawerBody [data-upload-status]")),n.value=""}else if(n.matches("[data-brand-select]")){const i=(ot.find(o=>o.id===n.value)||{}).lines||[],s=$("#admDrawerBody [data-line-select]");s&&(s.innerHTML=`<option value="">— Không thuộc dòng nào —</option>${i.map(o=>`<option value="${r(o.id)}">${r(o.nameVi)}</option>`).join("")}`)}}),$("#admDrawerBody").addEventListener("change",t=>{if(t.target.name!=="status"||!t.target.closest(".adm-order-form"))return;const n=t.target.closest(".adm-order-form");n.querySelector(".adm-fail-field").hidden=!G.includes(t.target.value)}),$("#admDrawerBody").addEventListener("input",t=>{const n=t.target.closest(".adm-order-form");if(!n||!["discount","shipping"].includes(t.target.name))return;const i=c.data.orders.find(d=>d.code===n.dataset.code),s=new FormData(n),o=Math.max(0,i.subtotal-(Number(s.get("discount"))||0))+(Number(s.get("shipping"))||0);n.querySelector("[data-total]").textContent=v(o)}),et().addEventListener("submit",async t=>{t.preventDefault();const n=t.target;n.id==="admPricingForm"&&Ae(n)})}function Ge(){ct(`
    <form class="adm-pw-form" autocomplete="off">
      <h2>Đổi mật khẩu admin</h2>
      <p class="adm-muted">Sau khi đổi, các máy khác đang đăng nhập sẽ bị đăng xuất. Máy này vẫn giữ đăng nhập.</p>
      ${c.demo?'<p class="adm-note">Đang xem dữ liệu mẫu: thử đổi ở đây không ảnh hưởng mật khẩu thật.</p>':""}
      <section class="adm-d-section">
        <label class="adm-field"><span>Mật khẩu hiện tại</span><input type="password" name="current" autocomplete="current-password" required></label>
        <label class="adm-field"><span>Mật khẩu mới (ít nhất 8 ký tự)</span><input type="password" name="next" autocomplete="new-password" minlength="8" required></label>
        <label class="adm-field"><span>Nhập lại mật khẩu mới</span><input type="password" name="confirm" autocomplete="new-password" minlength="8" required></label>
        <p class="adm-error" data-pw-error hidden></p>
      </section>
      <div class="adm-d-actions"><button type="submit" class="adm-btn adm-btn-primary">Lưu mật khẩu mới</button></div>
      <p class="adm-fineprint">Quên mật khẩu: mở Google Sheet nhận đơn → menu <b>beVIBE Admin</b> → <b>Đặt / đổi mật khẩu admin</b>.</p>
    </form>`)}async function Ve(a){const e=new FormData(a),t=String(e.get("current")||""),n=String(e.get("next")||""),i=a.querySelector("[data-pw-error]"),s=d=>{i.textContent=d,i.hidden=!1};if(n.length<8)return s("Mật khẩu mới cần ít nhất 8 ký tự.");if(n!==String(e.get("confirm")||""))return s("Hai lần nhập mật khẩu mới không khớp.");if(n===t)return s("Mật khẩu mới phải khác mật khẩu hiện tại.");const o=a.querySelector('button[type="submit"]');o.disabled=!0;try{const d=await E("admin.changePassword",{currentPassword:t,newPassword:n});d.token&&(c.token=d.token,dt(sessionStorage,ut,d.token)),U(),w("Đã đổi mật khẩu admin")}catch(d){o.disabled=!1,d.auth||s(d.message)}}async function Ue(a){const e=c.data.expenses.find(t=>t.id===a);if(!(!e||!window.confirm(`Xóa khoản chi ${e.category} ${v(e.amount)} ngày ${R(e._date)}?`)))try{await E("admin.deleteExpense",{id:a}),c.data.expenses=c.data.expenses.filter(t=>t.id!==a),j(),T(),w("Đã xóa khoản chi")}catch(t){t.auth||w(t.message,!0)}}function Dt(a){$("#admShell").hidden=!0,$("#admLogin").hidden=!1;const e=$("#admLoginError");e.hidden=!a,e.textContent=a||"",$("#admEndpointNote").textContent="",setTimeout(()=>$("#admPassword").focus(),50)}function ne(a){c.token&&!c.demo&&!a&&E("admin.logout").catch(()=>{}),c.token="",c.data=null,c.demo=!1,dt(sessionStorage,ut,null),U(),Dt(a?"Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.":"")}function se(){const a={},e={},t=["Nhập hàng","Vận chuyển","Marketing / Quảng cáo","Nhân sự","Mặt bằng","Hoa hồng tư vấn viên","Khác"];return typeof kt=="object"&&kt&&Object.entries(kt).forEach(([n,i])=>{a[n]={name:n,unit:"Sản phẩm",price:i},e[n]=Math.round(i*.5)}),{ok:!0,generatedAt:new Date().toISOString(),orders:[],items:[],leads:[],expenses:[],costs:e,products:a,sheetUrl:"",customProducts:[],customBrands:[],pricing:{},options:{statuses:yt,failReasons:["Khách đổi ý / không mua nữa","Không liên lạc được khách","Đặt trùng / đặt nhầm","Sai địa chỉ / thông tin","Hết hàng","Khách không nhận hàng khi giao","Khách hẹn giao lại quá lâu","Hàng lỗi / giao sai","Khác"],payStatuses:["Chưa thanh toán","Đã thanh toán","Đã hoàn tiền"],leadStatuses:["Mới","Đã liên hệ","Tiềm năng","Chờ đặt đơn","Đã mua","Không phù hợp"],leadSources:Wt,customerTypes:{b2c:"Khách lẻ",wholesale:"Khách sỉ",consultant:"Tư vấn viên"},expenseCategories:t}}}function ze(a,e){!Array.isArray(e)||!a||e.forEach(t=>{if(t.order_type==="TEST"||t.customer_name&&t.customer_name.toLowerCase().trim()==="test")return;const n=String(t.order_type||"").toLowerCase(),i=n.includes("wholesale")||n.includes("sỉ")||n.includes("hợp tác")||n.includes("đối tác"),s=n.includes("tài khoản"),o=t.shipping_address||"",d=o.split(",").map(h=>h.trim()).filter(Boolean),m=d.length>1?d[d.length-1]:o;if(i||s){const h=`LD${t.id}`;a.leads.some(l=>l.id===h||l.sbId&&l.sbId===t.id)||a.leads.push({id:h,time:t.created_at,status:t.status||"Mới",type:s?"Đăng ký tài khoản":"Báo giá sỉ / Hợp tác",name:t.customer_name||"Khách đối tác",phone:t.phone||"",email:t.email||"",org:t.clinic_or_spa||"",address:o,city:m,interest:t.collaboration_need||"",note:t.note||"",internalNote:"",sbId:t.id})}else{const h=`DH${t.id}`;if(!a.orders.some(l=>l.code===h||l.sbId&&l.sbId===t.id)){const l=String(t.note||"").toLowerCase(),y=l.includes("chuyển khoản")||l.includes("chuyen khoan")||l.includes("bank"),u=Number(t.total_amount)||0;a.orders.push({code:h,time:t.created_at,customerType:i?"Khách sỉ":"Khách lẻ",name:t.customer_name||"Khách hàng",phone:t.phone||"",email:t.email||"",clinic:t.clinic_or_spa||"",org:t.clinic_or_spa||"",address:o,city:m,status:t.status||"Mới",pay:y?"bank":"cod",payStatus:t.pay_status||"Chưa thanh toán",subtotal:u,shipping:0,discount:0,total:u,products:t.collaboration_need||t.note||"Sản phẩm Bevibe",note:t.note||"",items:[],sbId:t.id})}}})}async function ft(a){const e=$("#admRefresh");e.disabled=!0,e.classList.add("is-loading"),c.data||(et().innerHTML='<div class="adm-loading">Đang tải dữ liệu…</div>');try{const t=se();t.orders=[],t.leads=[],t.expenses=[];try{if(Pt&&c.token&&c.token!=="bevibe_admin_token_default"){const i=await E("admin.data");i&&(i.costs&&(t.costs=i.costs),i.pricing&&(t.pricing=i.pricing),i.sheetUrl&&(t.sheetUrl=i.sheetUrl))}}catch{}try{const i=await de();i&&i.length&&ze(t,i)}catch(i){console.warn("Lỗi lấy dữ liệu Supabase:",i)}c.data=t,(!c.pricingDirty||!c.pricingDirty.size)&&(c.pricing=null),j(),$("#admLogin").hidden=!0,$("#admShell").hidden=!1,$("#admDemoTag").hidden=!0;const n=$("#admSheetLink");n.hidden=!t.sheetUrl,t.sheetUrl&&(n.href=t.sheetUrl),T(),a&&w("Đã cập nhật dữ liệu thực tế từ Supabase")}catch(t){t.auth||(c.data?w(t.message,!0):Dt(t.message))}finally{e.disabled=!1,e.classList.remove("is-loading")}}function Xe(){$("#admLoginForm").addEventListener("submit",async e=>{e.preventDefault();const t=$("#admPassword").value;if(!t)return;const n=$("#admLoginBtn");n.disabled=!0,n.textContent="Đang đăng nhập…",c.demo=!1;try{if(t===ie){try{const s=await E("admin.login",{password:t});c.token=s.token,dt(sessionStorage,ut,s.token)}catch{c.token="bevibe_admin_token_default",dt(sessionStorage,ut,c.token)}$("#admPassword").value="",await ft();return}const i=await E("admin.login",{password:t});c.token=i.token,dt(sessionStorage,ut,i.token),$("#admPassword").value="",await ft()}catch(i){Dt(i.message)}finally{n.disabled=!1,n.textContent="Đăng nhập"}});const a=$("#admDemoBtn");a&&a.addEventListener("click",()=>{c.demo=!1,c.token="bevibe_admin_token_default",ft()})}function Ye(){return se()}let L=null;async function We(a,e){if(await new Promise(t=>setTimeout(t,150)),L||(L=Ye()),a==="admin.data")return JSON.parse(JSON.stringify({...L,generatedAt:new Date().toISOString()}));if(a==="admin.updateOrder"){const t=L.orders.find(n=>n.code===e.code);if(t){const{customerType:n,...i}=e.fields;Object.assign(t,i,n?{customerType:L.options.customerTypes[n]}:{},{updatedAt:new Date().toISOString()})}}else if(a==="admin.addLead"){const t=e.lead,n=`LDDEMO${Date.now()}`,i={time:new Date().toISOString(),id:n,status:t.status,type:`Nhập tay – ${t.source}`,name:t.name,phone:t.phone,email:t.email,org:t.org,interest:t.interest,note:t.note,internalNote:t.internalNote};return L.leads.push(i),{ok:!0,id:n,time:i.time,type:i.type,phone:t.phone}}else if(a==="admin.updateLead"){const t=L.leads.find(n=>n.id===e.id);t&&Object.assign(t,e.fields)}else if(a==="admin.addExpense"){const t=`CPDEMO${Date.now()}`,n=e.expense;return L.expenses.push({id:t,date:`${n.date}T12:00:00+07:00`,category:n.category,amount:n.amount,note:n.note}),{ok:!0,id:t}}else if(a==="admin.deleteExpense")L.expenses=L.expenses.filter(t=>t.id!==e.id);else{if(a==="admin.uploadImage")return{ok:!0,url:e.dataUrl};if(a==="admin.saveProduct"){const t=e.product,n=t.id||`sp-demo-${Date.now().toString(36)}`,i={...t,id:n};delete i.pricing;const s=L.customProducts.findIndex(o=>o.id===n);return s>=0?L.customProducts[s]=i:L.customProducts.push(i),t.pricing&&(L.pricing[n]={name:t.name,unit:t.spec,...t.pricing}),{ok:!0,id:n}}else if(a==="admin.deleteProduct")L.customProducts=L.customProducts.filter(t=>t.id!==e.id),delete L.pricing[e.id];else if(a==="admin.saveBrand"){const t=e.brand,n=t.id||t.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||`brand-${Date.now()}`;if(!t.id&&(ot.some(s=>s.id===n)||L.customBrands.some(s=>s.id===n)))throw new Error(`Đã có thương hiệu tên "${t.name}".`);const i=L.customBrands.findIndex(s=>s.id===n);return i>=0?L.customBrands[i]={...t,id:n}:L.customBrands.push({...t,id:n}),{ok:!0,id:n}}else a==="admin.deleteBrand"?L.customBrands=L.customBrands.filter(t=>t.id!==e.id):a==="admin.savePricing"?(L.pricing=Object.fromEntries(e.rows.map(t=>[t.id,{...t}])),L.costs=Object.fromEntries(e.rows.map(t=>[t.id,t.cost]))):a==="admin.saveCosts"&&(L.costs={...e.costs})}return{ok:!0}}Xe();Fe();c.token&&Pt?ft():Dt("");
