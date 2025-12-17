/*********************************
 AUTH + SECURITY
*********************************/
const ADMIN_KEY = "sinfuladmin24";

let session = JSON.parse(localStorage.getItem("session"));
let users = JSON.parse(localStorage.getItem("users")) || [];

async function hashPassword(pw) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}

document.getElementById("loginBtn").onclick = async () => {
  const u = username.value.trim();
  const r = role.value;
  const p = prompt("Password:");
  const key = adminkey.value;

  if (!u || !p) return alert("Missing credentials");
  if (r === "admin" && key !== ADMIN_KEY) return alert("Invalid admin key");

  const hash = await hashPassword(p);
  let user = users.find(x => x.username === u);

  if (!user) {
    user = { username:u, role:r, pass:hash };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  } else if (user.pass !== hash) {
    return alert("Incorrect password");
  }

  session = user;
  localStorage.setItem("session", JSON.stringify(session));
  boot();
};

function logout() {
  localStorage.removeItem("session");
  location.reload();
}

function boot() {
  if (!session) return;
  login.style.display = "none";
  cad.style.display = "block";
  showTab("dashboard");
}

document.addEventListener("DOMContentLoaded", boot);

/*********************************
 DATABASE (SQL‑STYLE SCHEMA)
*********************************/
const db = JSON.parse(localStorage.getItem("db")) || {
  civilians: [],
  businesses: [],
  transactions: [],
  crimes: [],
  court: [],
  taxes: { income:0.15, business:0.20 },
  government: { balance:0 }
};

function save(){ localStorage.setItem("db", JSON.stringify(db)); }
function now(){ return new Date().toLocaleString(); }

/*********************************
 UI NAVIGATION
*********************************/
function showTab(tab){
  const c = content;
  const r = session.role;

  if(tab==="dashboard"){
    c.innerHTML=`
      <h2>Dashboard</h2>
      <p>Civilians: ${db.civilians.length}</p>
      <p>Businesses: ${db.businesses.length}</p>
      <p>Crimes: ${db.crimes.length}</p>
      <p>Gov Budget: $${db.government.balance}</p>
    `;
  }

  if(tab==="civilian"){
    c.innerHTML=`
      <h2>Civilians</h2>
      <form onsubmit="addCiv(event)">
        <input id="cn" placeholder="Name" required>
        <input id="cdob" type="date" required>
        <input id="cphone" placeholder="Phone">
        <input id="caddr" placeholder="Address">
        <input id="ccash" type="number" value="0">
        <input id="cbank" type="number" value="0">
        <button>Add</button>
      </form>
      ${db.civilians.map(x=>`
        <p><b>${x.name}</b> | Bank:$${x.bank} | Dirty:$${x.dirty} | Heat:${x.heat}</p>
      `).join("")}
    `;
  }

  if(tab==="jobs"){
    c.innerHTML=db.civilians.map(x=>`
      <p>${x.name}
      <button onclick="clockIn('${x.name}')">In</button>
      <button onclick="clockOut('${x.name}')">Out</button></p>
    `).join("");
  }

  if(tab==="economy"){
    c.innerHTML=db.transactions.map(t=>`
      <p>${t.time} | ${t.desc} | $${t.amount}</p>
    `).join("");
  }

  if(tab==="businesses"){
    c.innerHTML=`
      <form onsubmit="addBiz(event)">
        <input placeholder="Name">
        <input placeholder="Owner">
        <button>Add</button>
      </form>
      ${db.businesses.map(b=>`
        <p>${b.name} | $${b.balance}</p>
      `).join("")}
    `;
  }

  if(tab==="crime"){
    c.innerHTML=db.civilians.map(x=>`
      <p>${x.name}
      <button onclick="crime('${x.name}','drug')">Drugs</button>
      <button onclick="crime('${x.name}','robbery')">Rob</button>
      <button onclick="launder('${x.name}')">Launder</button>
      </p>
    `).join("");
  }

  if(tab==="doj"){
    if(!["doj","admin"].includes(r)) return alert("Denied");
    c.innerHTML=`
      ${db.court.map(c=>`
        <p>${c.name} | Fine:$${c.fine} | Seized:$${c.seized}
        <button onclick="exportCase('${c.name}')">PDF</button>
        </p>
      `).join("")}
    `;
  }

  if(tab==="admin" && r==="admin"){
    c.innerHTML=`
      <h2>ADMIN PANEL</h2>
      <button onclick="wipeEconomy()">WIPE ECONOMY</button>
      <button onclick="db.taxes.income+=0.01;save()">+ Income Tax</button>
      <button onclick="db.taxes.business+=0.01;save()">+ Biz Tax</button>
    `;
  }

  save();
}

/*********************************
 CORE LOGIC
*********************************/
function addCiv(e){
  e.preventDefault();
  db.civilians.push({
    name:cn.value,dob:cdob.value,phone:cphone.value,address:caddr.value,
    cash:+ccash.value,bank:+cbank.value,dirty:0,heat:0,clocked:false
  });
  save(); showTab("civilian");
}

function clockIn(n){ db.civilians.find(x=>x.name===n).clocked=true; save(); }
function clockOut(n){
  const c=db.civilians.find(x=>x.name===n);
  if(!c.clocked) return;
  c.clocked=false;
  const pay=150, tax=pay*db.taxes.income;
  c.bank+=pay-tax; db.government.balance+=tax;
  db.transactions.push({time:now(),desc:`${n} paid`,amount:pay});
  save();
}

function addBiz(e){
  e.preventDefault();
  db.businesses.push({name:e.target[0].value,owner:e.target[1].value,balance:0});
  save();
}

setInterval(()=>{
  db.businesses.forEach(b=>{
    const inc=200, tax=inc*db.taxes.business;
    b.balance+=inc-tax; db.government.balance+=tax;
  });
  save();
},60000);

function crime(n,t){
  const c=db.civilians.find(x=>x.name===n);
  const amt=t==="robbery"?1200:600;
  c.dirty+=amt; c.heat+=t==="robbery"?3:1;
  if(c.heat>=5) warrant(c);
  save();
}

function launder(n){
  const c=db.civilians.find(x=>x.name===n);
  const clean=c.dirty*0.7;
  c.bank+=clean; c.dirty=0;
  save();
}

function warrant(c){
  const fine=c.heat*500;
  const seized=Math.min(c.bank,fine);
  c.bank-=seized; c.heat=0;
  db.government.balance+=seized;
  db.court.push({name:c.name,fine,seized});
}

function exportCase(name){
  const w=window.open("");
  const c=db.court.find(x=>x.name===name);
  w.document.write(`<h1>Court Record</h1><p>${JSON.stringify(c)}</p>`);
  w.print();
}

function wipeEconomy(){
  if(!confirm("CONFIRM WIPE")) return;
  localStorage.clear();
  location.reload();
}
