/***************
 AUTH
****************/
const ADMIN_KEY = "sinfuladmin24";
let session = JSON.parse(localStorage.getItem("session")) || null;

function login(){
  const u = username.value.trim();
  const r = role.value;
  const k = adminkey.value;
  if(!u) return alert("Username required");
  if(r==="admin" && k!==ADMIN_KEY) return alert("Invalid admin key");
  session={u,r};
  localStorage.setItem("session",JSON.stringify(session));
  boot();
}

function logout(){
  localStorage.clear();
  location.reload();
}

function boot(){
  if(!session) return;
  login.style.display="none";
  cad.style.display="block";
  showTab("dashboard");
}

document.addEventListener("DOMContentLoaded",boot);

/***************
 DATA STORE
****************/
const db = JSON.parse(localStorage.getItem("db")) || {
  civilians:[],
  businesses:[],
  transactions:[],
  court:[],
  crimes:[],
  taxes:{
    income:0.15,
    business:0.20
  },
  government:{balance:0}
};

function save(){ localStorage.setItem("db",JSON.stringify(db)); }
function now(){ return new Date().toLocaleString(); }

/***************
 TABS
****************/
function showTab(tab){
  const c = document.getElementById("content");
  const r = session.r;

  /* DASHBOARD */
  if(tab==="dashboard"){
    c.innerHTML=`
      <h2>Dashboard</h2>
      <p>Civilians: ${db.civilians.length}</p>
      <p>Businesses: ${db.businesses.length}</p>
      <p>Crimes: ${db.crimes.length}</p>
      <p>Government Balance: $${db.government.balance}</p>
    `;
  }

  /* CIVILIANS */
  if(tab==="civilian"){
    c.innerHTML=`
      <h2>Civilian Profiles</h2>
      <form onsubmit="addCiv(event)">
        <input placeholder="Name" id="cn">
        <input placeholder="DOB">
        <input placeholder="Phone">
        <input placeholder="Address">
        <input placeholder="Cash">
        <input placeholder="Bank">
        <button>Add</button>
      </form>
      ${db.civilians.map(c=>`
        <p>${c.name} | Cash:$${c.cash} Bank:$${c.bank}</p>
      `).join("")}
    `;
  }

  /* JOBS */
  if(tab==="jobs"){
    c.innerHTML=`
      <h2>Jobs</h2>
      <p>Legal & whitelisted jobs tracked per civilian</p>
      ${db.civilians.map(c=>`
        <p>${c.name} | Jobs: ${c.jobs.join(", ")}</p>
      `).join("")}
    `;
  }

  /* ECONOMY */
  if(tab==="economy"){
    c.innerHTML=`
      <h2>Economy</h2>
      ${db.transactions.map(t=>`
        <p>${t.time} | ${t.desc} | $${t.amount}</p>
      `).join("")}
    `;
  }

  /* BUSINESSES */
  if(tab==="businesses"){
    c.innerHTML=`
      <h2>Businesses</h2>
      <form onsubmit="addBiz(event)">
        <input placeholder="Name">
        <input placeholder="Owner">
        <button>Add</button>
      </form>
      ${db.businesses.map(b=>`
        <p>${b.name} | Owner:${b.owner} | $${b.balance}</p>
      `).join("")}
    `;
  }

  /* CRIME */
  if(tab==="crime"){
    c.innerHTML=`
      <h2>Crime</h2>
      ${db.crimes.map(c=>`
        <p>${c.name} | Heat:${c.heat} | Dirty:$${c.dirty}</p>
      `).join("")}
    `;
  }

  /* DOJ */
  if(tab==="doj"){
    if(!["doj","admin"].includes(r)) return alert("Access denied");
    c.innerHTML=`
      <h2>DOJ</h2>
      ${db.court.map(c=>`
        <p>${c.name} | Fine:$${c.fine} | Seized:$${c.seized}</p>
      `).join("")}
    `;
  }

  save();
}

/***************
 FUNCTIONS
****************/
function addCiv(e){
  e.preventDefault();
  const f=e.target;
  db.civilians.push({
    name:f[0].value,
    cash:+f[4].value||0,
    bank:+f[5].value||0,
    jobs:[],
    licenses:[],
    criminal:[],
    assets:[]
  });
  save(); showTab("civilian");
}

function addBiz(e){
  e.preventDefault();
  const f=e.target;
  db.businesses.push({
    name:f[0].value,
    owner:f[1].value,
    balance:0,
    employees:[]
  });
  save(); showTab("businesses");
}
