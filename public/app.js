// --- LOGIN SYSTEM ---
const ADMIN_KEY = "sinfuladmin24";
let session = JSON.parse(localStorage.getItem("session")) || null;

function login() {
  const username = document.getElementById("username").value.trim();
  const role = document.getElementById("role").value;
  const key = document.getElementById("adminkey").value;

  if (!username) return alert("Enter username");
  if (role === "admin" && key !== ADMIN_KEY) return alert("Invalid admin key");

  session = { username, role };
  localStorage.setItem("session", JSON.stringify(session));
  boot();
}

function logout() {
  localStorage.removeItem("session");
  location.reload();
}

function boot() {
  if (!session) return;
  document.getElementById("login").style.display = "none";
  document.getElementById("cad").style.display = "block";
  showTab("dashboard");
}

// --- DATA STORAGE ---
let calls = JSON.parse(localStorage.getItem('calls')) || [];
let units = JSON.parse(localStorage.getItem('units')) || [];
let bolos = JSON.parse(localStorage.getItem('bolos')) || [];
let reports = JSON.parse(localStorage.getItem('reports')) || [];
let civilians = JSON.parse(localStorage.getItem('civilians')) || [];
let businesses = JSON.parse(localStorage.getItem('businesses')) || [];
let economy = JSON.parse(localStorage.getItem('economy')) || [];

function saveData() {
  localStorage.setItem('calls', JSON.stringify(calls));
  localStorage.setItem('units', JSON.stringify(units));
  localStorage.setItem('bolos', JSON.stringify(bolos));
  localStorage.setItem('reports', JSON.stringify(reports));
  localStorage.setItem('civilians', JSON.stringify(civilians));
  localStorage.setItem('businesses', JSON.stringify(businesses));
  localStorage.setItem('economy', JSON.stringify(economy));
}

// --- TAB SYSTEM ---
function showTab(tab) {
  const content = document.getElementById('content');
  const role = session.role;

  switch(tab) {
    case 'dashboard':
      content.innerHTML = `
        <h2>Dashboard</h2>
        <ul>
          <li>Total 911 Calls: ${calls.length}</li>
          <li>Total Units: ${units.length}</li>
          <li>Total BOLOs: ${bolos.length}</li>
          <li>Total Reports: ${reports.length}</li>
          <li>Total Civilians: ${civilians.length}</li>
          <li>Total Businesses: ${businesses.length}</li>
        </ul>
      `;
      break;

    case 'calls':
      content.innerHTML = `
        <h2>911 Calls</h2>
        <form id="callForm">
          <input type="text" id="caller" placeholder="Your Name" required />
          <select id="type">
            <option value="civ">Civilian</option>
            <option value="leo">LEO/Dispatch</option>
          </select>
          <textarea id="info" placeholder="Enter call information" required></textarea>
          <button type="submit">Submit Call</button>
        </form>
        <div id="callList">
          ${calls.map((c,i)=>`<p>${i+1}. [${c.type.toUpperCase()}] ${c.caller}: ${c.info}</p>`).join('')}
        </div>
      `;
      document.getElementById('callForm').addEventListener('submit', function(e){
        e.preventDefault();
        const caller = document.getElementById('caller').value.trim();
        const type = document.getElementById('type').value;
        const info = document.getElementById('info').value.trim();
        if(!caller || !info) return alert("Fill all fields");
        calls.push({caller,type,info});
        saveData();
        this.reset();
        showTab('calls');
      });
      break;

    case 'civilian':
      if(!["civ","leo","doj","admin"].includes(role)) return alert("Access denied");
      content.innerHTML = `
        <h2>Civilian Profiles</h2>
        <form id="civForm">
          <input type="text" id="civName" placeholder="Full Name" required />
          <input type="date" id="civDOB" required />
          <input type="text" id="civPhone" placeholder="Phone #" required />
          <input type="text" id="civAddress" placeholder="Address" required />
          <textarea id="civJobs" placeholder="Jobs (comma separated)"></textarea>
          <textarea id="civLicenses" placeholder="Licenses (comma separated)"></textarea>
          <input type="number" id="civCash" placeholder="Cash" />
          <input type="number" id="civBank" placeholder="Bank" />
          <button type="submit">Add Civilian</button>
        </form>
        <div id="civList">
          ${civilians.map((c,i)=>`<p>${i+1}. ${c.name} | DOB: ${c.dob} | Phone: ${c.phone} | Address: ${c.address} | Jobs: ${c.jobs.join(", ")} | Licenses: ${c.licenses.join(", ")} | Cash: $${c.cash} | Bank: $${c.bank}</p>`).join('')}
        </div>
      `;
      document.getElementById('civForm').addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('civName').value.trim();
        const dob = document.getElementById('civDOB').value;
        const phone = document.getElementById('civPhone').value.trim();
        const address = document.getElementById('civAddress').value.trim();
        const jobs = document.getElementById('civJobs').value.split(",").map(j=>j.trim()).filter(Boolean);
        const licenses = document.getElementById('civLicenses').value.split(",").map(l=>l.trim()).filter(Boolean);
        const cash = parseInt(document.getElementById('civCash').value) || 0;
        const bank = parseInt(document.getElementById('civBank').value) || 0;
        civilians.push({name,dob,phone,address,jobs,licenses,cash,bank,criminalHistory:[],courtHistory:[],assets:{vehicles:[],businesses:[]}});
        saveData();
        this.reset();
        showTab('civilian');
      });
      break;

    case 'economy':
      if(!["leo","doj","admin"].includes(role)) return alert("Access denied");
      content.innerHTML = `
        <h2>Economy</h2>
        <p>Total Cash: $${civilians.reduce((a,c)=>a+c.cash,0)}</p>
        <p>Total Bank: $${civilians.reduce((a,c)=>a+c.bank,0)}</p>
        <p>Business Revenue: $${businesses.reduce((a,b)=>a+b.revenue,0)}</p>
      `;
      break;

    case 'businesses':
      if(!["leo","doj","admin"].includes(role)) return alert("Access denied");
      content.innerHTML = `
        <h2>Businesses</h2>
        <form id="bizForm">
          <input type="text" id="bizName" placeholder="Business Name" required />
          <input type="text" id="bizOwner" placeholder="Owner Name" required />
          <button type="submit">Add Business</button>
        </form>
        <div id="bizList">
          ${businesses.map((b,i)=>`<p>${i+1}. ${b.name} | Owner: ${b.owner} | Revenue: $${b.revenue || 0}</p>`).join('')}
        </div>
      `;
      document.getElementById('bizForm').addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('bizName').value.trim();
        const owner = document.getElementById('bizOwner').value.trim();
        businesses.push({name,owner,revenue:0,employees:[]});
        saveData();
        this.reset();
        showTab('businesses');
      });
      break;

    case 'doj':
      if(!["doj","admin"].includes(role)) return alert("Access denied");
      content.innerHTML = `
        <h2>DOJ</h2>
        <p>View and manage court cases, warrants, asset forfeitures (placeholder)</p>
      `;
      break;

    default:
      content.innerHTML = "<p>Tab not found</p>";
  }
}

document.addEventListener('DOMContentLoaded', boot);
