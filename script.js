document.addEventListener('DOMContentLoaded', () => {
    // Set date
    const dateEl = document.getElementById('currentDate');
    const now = new Date();
    dateEl.textContent = now.toLocaleDateString('en-IN', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const inputs = document.querySelectorAll('input, select, textarea');
    const denomInputs = document.querySelectorAll('.denom-input');

    // Load saved data
    loadFormData();

    // Event Listeners
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            calculateTotals();
            saveFormData();
        });
    });

    document.getElementById('copyBtn').addEventListener('click', () => shareSlip('copy'));
    document.getElementById('whatsappBtn').addEventListener('click', () => shareSlip('whatsapp'));
    document.getElementById('resetBtn').addEventListener('click', resetForm);

    function calculateTotals() {
        let cashTotal = 0;

        // Calculate Denominations
        denomInputs.forEach(input => {
            const val = parseInt(input.getAttribute('data-val'));
            const qty = parseInt(input.value) || 0;
            const rowTotal = val * qty;
            cashTotal += rowTotal;
            document.getElementById(`t${val}`).textContent = `₹${rowTotal.toLocaleString('en-IN')}`;
        });

        const digital = parseInt(document.getElementById('digital').value) || 0;
        const float = parseInt(document.getElementById('startingFloat').value) || 0;
        
        const grandTotal = cashTotal + digital;
        const netHandover = grandTotal - float;

        // Update UI
        document.getElementById('cashTotal').textContent = `₹${cashTotal.toLocaleString('en-IN')}`;
        document.getElementById('digitalTotalDisplay').textContent = `₹${digital.toLocaleString('en-IN')}`;
        document.getElementById('grandTotal').textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
        document.getElementById('netHandover').textContent = `₹${netHandover.toLocaleString('en-IN')}`;
    }

    function shareSlip(type) {
        const staff = document.getElementById('staffName').value || "N/A";
        const shift = document.getElementById('shift').value;
        const float = document.getElementById('startingFloat').value;
        const cash = document.getElementById('cashTotal').textContent;
        const digital = document.getElementById('digitalTotalDisplay').textContent;
        const grand = document.getElementById('grandTotal').textContent;
        const net = document.getElementById('netHandover').textContent;
        const notes = document.getElementById('notes').value || "None";

        const message = `*TABOCHE RESTAURANT HANDOVER*
📅 Date: ${new Date().toLocaleDateString()}
👤 Staff: ${staff}
🕒 Shift: ${shift}
------------------------------
💰 Opening Float: ₹${float}
💵 Total Cash: ${cash}
💳 Digital: ${digital}
------------------------------
🌟 *GRAND TOTAL: ${grand}*
✅ *NET SALE: ${net}*
------------------------------
📝 Notes: ${notes}
_Generated via Taboche Handover Pro_`;

        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            navigator.clipboard.writeText(message).then(() => {
                alert('Slip copied to clipboard! ✅');
            });
        }
    }

    function saveFormData() {
        const data = {};
        inputs.forEach(input => {
            data[input.id] = input.value;
        });
        localStorage.setItem('taboche_handover_data', JSON.stringify(data));
    }

    function loadFormData() {
        const saved = localStorage.getItem('taboche_handover_data');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(key => {
                const el = document.getElementById(key);
                if (el) el.value = data[key];
            });
            calculateTotals();
        }
    }

    function resetForm() {
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('taboche_handover_data');
            location.reload();
        }
    }
});