const content = document.getElementById('content');

// Function to show different tabs
function showTab(tab) {
    if (tab === 'dashboard') {
        content.innerHTML = '<h2>Dashboard</h2><p>Welcome to Fusion CAD Web</p>';
    }

    if (tab === 'calls') {
        fetch('/api/calls')
            .then(r => r.json())
            .then(d => {
                if (d.length === 0) {
                    content.innerHTML = '<h2>911 Calls</h2><p>No active calls.</p>';
                    return;
                }
                content.innerHTML = '<h2>911 Calls</h2>' +
                    d.map(c => `<div class="call-entry">📞 ${c.info}</div>`).join('');
            })
            .catch(() => {
                content.innerHTML = '<p>Cannot connect to server.</p>';
            });
    }

    if (tab === 'bolos') {
        content.innerHTML = '<h2>BOLOs</h2><p>Coming soon...</p>';
    }

    if (tab === 'units') {
        content.innerHTML = '<h2>Units</h2><p>Live units will appear here.</p>';
    }

    if (tab === 'reports') {
        content.innerHTML = '<h2>Reports</h2><p>Report system coming soon.</p>';
    }
}

// Default tab on load
showTab('dashboard');
