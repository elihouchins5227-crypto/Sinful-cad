// --- Global state ---
let calls = [];     // 911 calls
let units = [];     // Units list
let bolos = [];     // BOLOs
let reports = [];   // Reports

// --- Tab switching ---
function showTab(tab) {
  const content = document.getElementById('content');

  switch(tab) {
    case 'dashboard':
      content.innerHTML = `
        <h2>Dashboard</h2>
        <p>Welcome to Sinful CAD.</p>
        <ul>
          <li>Total 911 calls: ${calls.length}</li>
          <li>Total Units: ${units.length}</li>
          <li>Total BOLOs: ${bolos.length}</li>
          <li>Total Reports: ${reports.length}</li>
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
          ${calls.map((c,i) => `<p>${i+1}. [${c.type.toUpperCase()}] ${c.caller}: ${c.info}</p>`).join('')}
        </div>
      `;

      document.getElementById('callForm').addEventListener('submit', function(e){
        e.preventDefault();
        const caller = document.getElementById('caller').value.trim();
        const type = document.getElementById('type').value;
        const info = document.getElementById('info').value.trim();
        if(!caller || !info) return alert('Fill all fields.');
        calls.push({caller, type, info});
        this.reset();
        showTab('calls');
      });
      break;

    case 'units':
      content.innerHTML = `
        <h2>Units</h2>
        <form id="unitForm">
          <input type="text" id="unitName" placeholder="Unit Name" required />
          <select id="unitStatus">
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="offduty">Off Duty</option>
          </select>
          <button type="submit">Add Unit</button>
        </form>
        <div id="unitList">
          ${units.map((u,i) => `<p>${i+1}. ${u.name} - ${u.status}</p>`).join('')}
        </div>
      `;

      document.getElementById('unitForm').addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('unitName').value.trim();
        const status = document.getElementById('unitStatus').value;
        if(!name) return alert('Enter unit name.');
        units.push({name,status});
        this.reset();
        showTab('units');
      });
      break;

    case 'bolos':
      content.innerHTML = `
        <h2>BOLOs</h2>
        <form id="boloForm">
          <input type="text" id="boloName" placeholder="BOLO Subject" required />
          <textarea id="boloInfo" placeholder="BOLO Information" required></textarea>
          <button type="submit">Add BOLO</button>
        </form>
        <div id="boloList">
          ${bolos.map((b,i) => `<p>${i+1}. ${b.name}: ${b.info}</p>`).join('')}
        </div>
      `;

      document.getElementById('boloForm').addEventListener('submit', function(e){
        e.preventDefault();
        const name = document.getElementById('boloName').value.trim();
        const info = document.getElementById('boloInfo').value.trim();
        if(!name || !info) return alert('Fill all fields.');
        bolos.push({name, info});
        this.reset();
        showTab('bolos');
      });
      break;

    case 'reports':
      content.innerHTML = `
        <h2>Reports</h2>
        <form id="reportForm">
          <input type="text" id="reporter" placeholder="Your Name" required />
          <textarea id="reportInfo" placeholder="Report Details" required></textarea>
          <button type="submit">Submit Report</button>
        </form>
        <div id="reportList">
          ${reports.map((r,i) => `<p>${i+1}. ${r.reporter}: ${r.info}</p>`).join('')}
        </div>
      `;

      document.getElementById('reportForm').addEventListener('submit', function(e){
        e.preventDefault();
        const reporter = document.getElementById('reporter').value.trim();
        const info = document.getElementById('reportInfo').value.trim();
        if(!reporter || !info) return alert('Fill all fields.');
        reports.push({reporter, info});
        this.reset();
        showTab('reports');
      });
      break;

    default:
      content.innerHTML = '<p>Tab not found</p>';
  }
}

// --- Initialize default tab ---
document.addEventListener('DOMContentLoaded', () => showTab('dashboard'));
