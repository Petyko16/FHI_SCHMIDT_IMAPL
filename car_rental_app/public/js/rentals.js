const API_RENTALS = "/rentals";
const API_CARS = "/cars";
const API_CUSTOMERS = "/customers";

let editMode = false;
let currentId = null;

const modal = new bootstrap.Modal(document.getElementById("rentalModal"));

// ---------------- LOAD RENTALS ----------------

async function loadRentals() {
    const rentals = await (await fetch(API_RENTALS)).json();
    const cars = await (await fetch(API_CARS)).json();
    const customers = await (await fetch(API_CUSTOMERS)).json();

    const tbody = document.getElementById("rentalsTableBody");
    tbody.innerHTML = "";

    rentals.forEach(r => {
        const car = cars.find(c => c.id === r.carId);
        const cust = customers.find(c => c.id === r.customerId);

        // Status color badge
        let badge = "";
        if (r.status === "Aktív") badge = `<span class="badge bg-success badge-status">Aktív</span>`;
        else if (r.status === "Plánovaný") badge = `<span class="badge bg-primary badge-status">Plánovaný</span>`;
        else badge = `<span class="badge bg-secondary badge-status">Ukončený</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${car ? car.brand + " " + car.model : "?"}</td>
                <td>${cust ? cust.name : "?"}</td>
                <td>${r.startDate}</td>
                <td>${r.endDate}</td>
                <td>${r.totalDays}</td>
                <td>${r.totalPrice} €</td>
                <td>${badge}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="openEditRental(${r.id})">Upraviť</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRental(${r.id})">Vymazať</button>
                </td>
            </tr>
        `;
    });
}

// ---------------- LOAD SELECT OPTIONS ----------------

async function loadSelects() {
    const cars = await (await fetch(API_CARS)).json();
    const customers = await (await fetch(API_CUSTOMERS)).json();

    const carSelect = document.getElementById("rentalCar");
    const custSelect = document.getElementById("rentalCustomer");

    carSelect.innerHTML = "";
    custSelect.innerHTML = "";

    cars.forEach(c => {
        carSelect.innerHTML += `<option value="${c.id}">${c.brand} ${c.model}</option>`;
    });

    customers.forEach(c => {
        custSelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
}

// ---------------- OPEN ADD MODAL ----------------

async function openAddRentalModal() {
    editMode = false;
    currentId = null;

    document.getElementById("modalTitle").innerText = "Nový prenájom";

    document.getElementById("rentalId").value = "";
    document.getElementById("rentalStart").value = "";
    document.getElementById("rentalEnd").value = "";

    await loadSelects();
    modal.show();
}

// ---------------- OPEN EDIT MODAL ----------------

async function openEditRental(id) {
    editMode = true;
    currentId = id;

    const rentals = await (await fetch(API_RENTALS)).json();
    const r = rentals.find(x => x.id === id);

    document.getElementById("modalTitle").innerText = "Upraviť prenájom";

    await loadSelects();

    document.getElementById("rentalCar").value = r.carId;
    document.getElementById("rentalCustomer").value = r.customerId;

    document.getElementById("rentalStart").value = r.startDate;
    document.getElementById("rentalEnd").value = r.endDate;

    modal.show();
}

// ---------------- SAVE RENTAL (ADD OR EDIT) ----------------

async function saveRental() {
    const carId = Number(document.getElementById("rentalCar").value);
    const customerId = Number(document.getElementById("rentalCustomer").value);
    const startDate = document.getElementById("rentalStart").value;
    const endDate = document.getElementById("rentalEnd").value;

    if (!carId || !customerId || !startDate || !endDate) {
        alert("Vyplňte všetky polia!");
        return;
    }

    const payload = { carId, customerId, startDate, endDate };

    if (!editMode) {
        // CREATE rental
        await fetch(API_RENTALS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        // UPDATE rental
        await fetch(`${API_RENTALS}/${currentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    }

    modal.hide();
    loadRentals();
}

// ---------------- DELETE RENTAL ----------------

async function deleteRental(id) {
    if (!confirm("Naozaj chcete vymazať prenájom?")) return;

    await fetch(`${API_RENTALS}/${id}`, { method: "DELETE" });
    loadRentals();
}

// ---------------- INIT ----------------

document.addEventListener("DOMContentLoaded", () => {
    loadRentals();
    loadSelects();
});
