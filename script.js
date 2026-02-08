document.addEventListener('DOMContentLoaded', () => {

    // Set Date
    const now = new Date();
    const formattedDate = now.toLocaleString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('currentDate').textContent = formattedDate;

    // Selectors
    const inputs = document.querySelectorAll('input, select, textarea');
    const denomInputs = document.querySelectorAll('.denom-input');

    // Helper functions for values
    const getVal = (id) => document.getElementById(id);

    // Initial Load
    loadData();
    calculateTotals();

    // Event Listeners
    inputs.forEach(el => {
        el.addEventListener('input', () => {
            if (el.type === 'number' && el.value < 0) el.value = 0;
            calculateTotals();
            saveData();
        });
    });

    document.getElementById('copyBtn').onclick = () => share('copy');
    document.getElementById('whatsappBtn').onclick = () => share('whatsapp');
    document.getElementById('resetBtn').onclick = resetForm;

    function calculateTotals() {
        let cash = 0;

        denomInputs.forEach(i => {
            const val = Number(i.dataset.val);
            const qty = Number(i.value) || 0;
            const rowTotal = val * qty;
            cash += rowTotal;
            document.getElementById(`t${val}`).textContent = `₹${rowTotal.toLocaleString('en-IN')}`;
        });

        const digital = Number(getVal('digital').value) || 0;
        const float = Number(getVal('startingFloat').value) || 0;

        const grand = cash + digital;
        const net = grand - float;

        document.getElementById('cashTotal').textContent = `₹${cash.toLocaleString('en-IN')}`;
        document.getElementById('digitalTotalDisplay').textContent = `₹${digital.toLocaleString('en-IN')}`;
        document.getElementById('grandTotal').textContent = `₹${grand.toLocaleString('en-IN')}`;
        document.getElementById('netHandover').textContent = `₹${net.toLocaleString('en-IN')}`;
    }

    function share(type) {
        const staff = getVal('staffName').value || 'N/A';
        const shift = getVal('shift').value;
        const float = getVal('startingFloat').value;
        const cash = document.getElementById('cashTotal').textContent;
        const digital = document.getElementById('digitalTotalDisplay').textContent;
        const grand = document.getElementById('grandTotal').textContent;
        const net = document.getElementById('netHandover').textContent;
        const notes = getVal('notes').value || 'None';

        const msg = 
`*TABOCHE HANDOVER*
📅 ${formattedDate}
👤 Staff: ${staff}
🕒 Shift: ${shift}

💰 Float: ₹${float}
💵 Cash: ${cash}
💳 Digital: ${digital}

🌟 *Grand Total:* ${grand}
✅ *NET SALE:* ${net}

📝 Remarks: ${notes}`;

        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
        } else {
            navigator.clipboard.writeText(msg).then(() => alert('Copied to Clipboard! ✅'));
        }
    }

    function saveData() {
        const data = {};
        inputs.forEach(i => { if(i.id) data[i.id] = i.value; });
        localStorage.setItem('taboche_pro_data', JSON.stringify(data));
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('taboche_pro_data') || '{}');
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id];
        });
    }

    function resetForm() {
        if (!confirm('This will clear all current entry data. Continue?')) return;
        localStorage.removeItem('taboche_pro_data');
        inputs.forEach(i => {
            if(i.tagName === 'SELECT') return; // Keep float/shift defaults
            i.value = i.type === 'number' ? 0 : '';
        });
        calculateTotals();
    }
});