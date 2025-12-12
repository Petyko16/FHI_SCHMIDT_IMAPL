const API_CARS = "/cars";

let editMode = false;
let currentId = null;
let carModal; // bootstrap modal inštancia

// Načítanie áut do tabuľky
async function loadCars() {
    const res = await fetch(API_CARS);
    const cars = await res.json();

    const tbody = document.getElementById("carsTableBody");
    tbody.innerHTML = "";

    cars.forEach(car => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="cars_detail.html?id=${car.id}">${car.id}</a></td>
            <td><a href="cars_detail.html?id=${car.id}">${car.brand}</a></td>
            <td><a href="cars_detail.html?id=${car.id}">${car.model}</a></td>
            <td>${car.year}</td>
            <td>${car.pricePerDay}</td>
            <td>${car.isAvailable ? "✔ Dostupné" : "❌ Prenajaté"}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="openEditCar(${car.id})">Upraviť</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCar(${car.id})">Vymazať</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Otvoriť modal na pridanie auta
function openAddCarModal() {
    editMode = false;
    currentId = null;

    document.getElementById("modalTitle").innerText = "Pridať auto";

    document.getElementById("carId").value = "";
    document.getElementById("brand").value = "";
    document.getElementById("model").value = "";
    document.getElementById("year").value = "";
    document.getElementById("price").value = "";

    carModal.show();
}

// Otvoriť modal na úpravu auta
async function openEditCar(id) {
    editMode = true;
    currentId = id;

    const res = await fetch(API_CARS);
    const cars = await res.json();
    const car = cars.find(c => c.id === id);

    if (!car) {
        alert("Auto sa nenašlo.");
        return;
    }

    document.getElementById("modalTitle").innerText = "Upraviť auto";

    document.getElementById("carId").value = car.id;
    document.getElementById("brand").value = car.brand;
    document.getElementById("model").value = car.model;
    document.getElementById("year").value = car.year;
    document.getElementById("price").value = car.pricePerDay;

    carModal.show();
}

// Uložiť (pridať alebo upraviť) auto
async function saveCar() {
    const brand = document.getElementById("brand").value.trim();
    const model = document.getElementById("model").value.trim();
    const year = Number(document.getElementById("year").value);
    const pricePerDay = Number(document.getElementById("price").value);

    if (!brand || !model || !year || !pricePerDay) {
        alert("Vyplňte všetky polia.");
        return;
    }

    const payload = { brand, model, year, pricePerDay };

    if (!editMode) {
        // PRIDAŤ (POST)
        await fetch(API_CARS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        // UPRAVIŤ (PUT)
        await fetch(`${API_CARS}/${currentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    }

    carModal.hide();
    loadCars();
}

// Vymazať auto
async function deleteCar(id) {
    if (!confirm("Naozaj chcete vymazať toto auto?")) return;

    await fetch(`${API_CARS}/${id}`, {
        method: "DELETE"
    });

    loadCars();
}

// Inicializácia po načítaní stránky
document.addEventListener("DOMContentLoaded", () => {
    const modalElement = document.getElementById("carModal");
    carModal = new bootstrap.Modal(modalElement);

    loadCars();
});
