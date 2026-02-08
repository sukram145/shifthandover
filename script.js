document.addEventListener('DOMContentLoaded', () => {

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

    const inputs = document.querySelectorAll('input[id], select[id], textarea[id]');
    const denomInputs = document.querySelectorAll('.denom-input');

    loadData();
    calculateTotals();

    inputs.forEach(el => {
        el.addEventListener('input', () => {
            sanitize();
            calculateTotals();
            saveData();
        });
    });

    document.getElementById('copyBtn').onclick = () => share('copy');
    document.getElementById('whatsappBtn').onclick = () => share('whatsapp');
    document.getElementById('resetBtn').onclick = resetForm;

    function sanitize() {
        document.querySelectorAll('input[type="number"]').forEach(i => {
            if (i.value < 0) i.value = 0;
        });
    }

    function calculateTotals() {
        let cash = 0;

        denomInputs.forEach(i => {
            const val = Number(i.dataset.val);
            const qty = Number(i.value) || 0;
            const total = val * qty;
            cash += total;
            document.getElementById(`t${val}`).textContent = `₹${total.toLocaleString('en-IN')}`;
        });

        const digital = Number(digitalInput().value) || 0;
        const float = Number(floatInput().value) || 0;

        const grand = cash + digital;
        const net = grand - float;

        setText('cashTotal', cash);
        setText('digitalTotalDisplay', digital);
        setText('grandTotal', grand);
        setText('netHandover', net);
    }

    function setText(id, val) {
        document.getElementById(id).textContent = `₹${val.toLocaleString('en-IN')}`;
    }

    function share(type) {
        const msg =
`*TABOCHE HANDOVER*
📅 ${formattedDate}
👤 ${staff().value || 'N/A'}
🕒 ${shift().value}

💰 Float: ₹${floatInput().value}
💵 Cash: ${cashTotal().textContent}
💳 Digital: ${digitalTotal().textContent}

🌟 *Grand:* ${grandTotal().textContent}
✅ *Net Sale:* ${netTotal().textContent}

📝 ${notes().value || 'None'}
`;

        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
        } else {
            navigator.clipboard.writeText(msg).then(() => alert('Copied ✅'));
        }
    }

    function saveData() {
        const data = {};
        inputs.forEach(i => data[i.id] = i.value);
        localStorage.setItem('taboche_data', JSON.stringify(data));
    }

    function loadData() {
        const data = JSON.parse(localStorage.getItem('taboche_data') || '{}');
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id];
        });
    }

    function resetForm() {
        if (!confirm('Clear all data?')) return;
        localStorage.removeItem('taboche_data');
        inputs.forEach(i => i.value = '');
        calculateTotals();
    }

    /* Shortcuts */
    const staff = () => document.getElementById('staffName');
    const shift = () => document.getElementById('shift');
    const notes = () => document.getElementById('notes');
    const floatInput = () => document.getElementById('startingFloat');
    const digitalInput = () => document.getElementById('digital');
    const cashTotal = () => document.getElementById('cashTotal');
    const digitalTotal = () => document.getElementById('digitalTotalDisplay');
    const grandTotal = () => document.getElementById('grandTotal');
    const netTotal = () => document.getElementById('netHandover');

});
