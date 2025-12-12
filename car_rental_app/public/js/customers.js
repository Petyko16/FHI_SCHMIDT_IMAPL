const API = "/customers";

let customers = [];
let customerModal = null;

window.addEventListener("DOMContentLoaded", async () => {
    // Bootstrap modal init
    const modalEl = document.getElementById("customerModal");
    customerModal = new bootstrap.Modal(modalEl);

    await loadCustomers();
});

async function loadCustomers() {
    const tbody = document.getElementById("customersTableBody");
    if (!tbody) return;

    const res = await fetch(API);
    customers = await res.json();

    tbody.innerHTML = customers.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.email)}</td>
      <td>${escapeHtml(c.phone)}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="openEditCustomerModal(${c.id})">Upraviť</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Vymazať</button>
      </td>
    </tr>
  `).join("");
}

function openAddCustomerModal() {
    document.getElementById("modalTitle").innerText = "Pridať zákazníka";
    document.getElementById("customerId").value = "";
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

    customerModal.show();
}

function openEditCustomerModal(id) {
    const c = customers.find(x => x.id === id);
    if (!c) return;

    document.getElementById("modalTitle").innerText = "Upraviť zákazníka";
    document.getElementById("customerId").value = String(c.id);
    document.getElementById("name").value = c.name ?? "";
    document.getElementById("email").value = c.email ?? "";
    document.getElementById("phone").value = c.phone ?? "";

    customerModal.show();
}

async function saveCustomer() {
    const idRaw = document.getElementById("customerId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (!name || !email || !phone) {
        alert("Vyplň všetky polia.");
        return;
    }

    if (!idRaw) {
        // ADD
        await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone })
        });
    } else {
        // EDIT (PUT)
        const id = Number(idRaw);
        await fetch(`${API}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, phone })
        });
    }

    customerModal.hide();
    await loadCustomers();
}

async function deleteCustomer(id) {
    if (!confirm("Naozaj chcete vymazať zákazníka?")) return;

    await fetch(`${API}/${id}`, { method: "DELETE" });
    await loadCustomers();
}

// Biztonságos kiírás
function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Globálissá tesszük az onclick miatt
window.openAddCustomerModal = openAddCustomerModal;
window.openEditCustomerModal = openEditCustomerModal;
window.saveCustomer = saveCustomer;
window.deleteCustomer = deleteCustomer;
