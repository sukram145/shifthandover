function calculateTotals() {
  const denominations = {
    d1000: 1000,
    d500: 500,
    d100: 100,
    d50: 50,
    d20: 20,
    d10: 10,
    d5: 5
  };

  let cashTotal = 0;
  for (let id in denominations) {
    const qty = parseInt(document.getElementById(id).value) || 0;
    cashTotal += qty * denominations[id];
  }

  const digital = parseInt(document.getElementById("digital").value) || 0;
  const startingFloat = parseInt(document.getElementById("startingFloat").value);
  const grandTotal = cashTotal + digital;
  const netHandover = grandTotal - startingFloat;

  document.getElementById("cashTotal").textContent = `Cash: ₹${cashTotal}`;
  document.getElementById("grandTotal").textContent = `Grand: ₹${grandTotal}`;
  document.getElementById("netHandover").textContent = `Net: ₹${netHandover}`;
}

function shareSlip() {
  const staffName = document.getElementById("staffName").value || "-";
  const shift = document.getElementById("shift").value;
  const notes = document.getElementById("notes").value || "-";
  const startingFloat = document.getElementById("startingFloat").value;

  const slip = `
TABOCHE RESTAURANT
CASH HANDOVER REPORT
==============================

Staff: ${staffName}
Shift: ${shift}
Float: ₹${startingFloat}

Cash: ${document.getElementById("cashTotal").textContent.split(": ")[1]}
Grand: ${document.getElementById("grandTotal").textContent.split(": ")[1]}
Net: ${document.getElementById("netHandover").textContent.split(": ")[1]}

Notes:
${notes}

==============================
Generated via Web Handover App
`;

  navigator.clipboard.writeText(slip).then(() => {
    alert("Slip copied to clipboard!");
  });
}

// Attach listeners
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", calculateTotals);
  el.addEventListener("change", calculateTotals);
});
document.getElementById("shareBtn").addEventListener("click", shareSlip);