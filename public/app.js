// --- Global state ---
let calls = []; // Array of 911 calls

// --- Tab switching ---
function showTab(tab) {
  const content = document.getElementById('content');

  switch(tab) {
    case 'dashboard':
      content.innerHTML = `
        <h2>Dashboard</h2>
        <p>Welcome to Sinful CAD. Total 911 calls: ${calls.length}</p>
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
          ${calls.map((c, i) => `<p>${i+1}. [${c.type.toUpperCase()}] ${c.caller}: ${c.info}</p>`).join('')}
        </div>
      `;

      // Add event listener for form submission
      const form = document.getElementById('callForm');
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const caller = document.getElementById('caller').value.trim();
        const type = document.getElementById('type').value;
        const info = document.getElementById('info').value.trim();

        if (!caller || !info) return alert('Please fill out all fields.');

        calls.push({ caller, type, info });
        form.reset();
        showTab('calls'); // refresh tab
      });
      break;

    case 'units':
      content.innerHTML = `
        <h2>Units</h2>
        <p>Unit list coming soon...</p>
      `;
      break;

    case 'bolos':
      content.innerHTML = `
        <h2>BOLOs</h2>
        <p>BOLO list coming soon...</p>
      `;
      break;

    case 'reports':
      content.innerHTML = `
        <h2>Reports</h2>
        <p>Reports section coming soon...</p>
      `;
      break;

    default:
      content.innerHTML = '<p>Tab not found</p>';
  }
}

// --- Initialize default tab ---
document.addEventListener('DOMContentLoaded', () => showTab('dashboard'));
