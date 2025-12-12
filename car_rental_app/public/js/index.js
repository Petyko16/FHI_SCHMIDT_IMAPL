async function loadDashboard() {
    try {
        const res = await fetch("/dashboard-data");
        const data = await res.json();

        document.getElementById("carsCount").innerText = data.cars;
        document.getElementById("customersCount").innerText = data.customers;
        document.getElementById("rentalsCount").innerText = data.rentals;
        document.getElementById("availableCarsCount").innerText = data.availableCars;

    } catch (e) {
        alert("Nepodarilo sa načítať dashboard dáta");
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", loadDashboard);
