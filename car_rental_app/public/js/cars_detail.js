const urlParams = new URLSearchParams(window.location.search);
const carId = Number(urlParams.get("id"));

async function loadCarDetail() {
    const cars = await (await fetch("/cars")).json();
    const customers = await (await fetch("/customers")).json();
    const rentals = await (await fetch("/rentals")).json();

    const car = cars.find(c => c.id === carId);
    if (!car) {
        alert("Auto sa nenašlo!");
        window.location.href = "cars.html";
        return;
    }

    // Fill car info
    document.getElementById("carTitle").innerText = `${car.brand} ${car.model}`;
    document.getElementById("carModel").innerText = `${car.brand} ${car.model}`;
    document.getElementById("carYear").innerText = car.year;
    document.getElementById("carPrice").innerText = car.pricePerDay;

    // Car status
    const statusEl = document.getElementById("carStatus");
    if (car.isAvailable) {
        statusEl.className = "badge bg-success";
        statusEl.innerText = "Dostupné";
    } else {
        statusEl.className = "badge bg-danger";
        statusEl.innerText = "Prenajaté";
    }

    // Placeholder car image (free service)
    document.getElementById("carPhoto").src =
        `https://source.unsplash.com/featured/?car,${car.brand}`;

    // Rentals of this car
    const tbody = document.getElementById("rentalsTableBody");
    tbody.innerHTML = "";

    const carRentals = rentals.filter(r => r.carId === carId);

    carRentals.forEach(r => {
        const cust = customers.find(c => c.id === r.customerId);

        let badge = "";
        if (r.status === "Aktív") badge = `<span class="badge bg-success">Aktív</span>`;
        else if (r.status === "Plánovaný") badge = `<span class="badge bg-primary">Plánovaný</span>`;
        else badge = `<span class="badge bg-secondary">Ukončený</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${cust ? cust.name : "?"}</td>
                <td>${r.startDate}</td>
                <td>${r.endDate}</td>
                <td>${r.totalDays}</td>
                <td>${r.totalPrice} €</td>
                <td>${badge}</td>
            </tr>
        `;
    });

    generateRevenueChart(carRentals);
}

// Create revenue graph
function generateRevenueChart(rentals) {
    const months = Array(12).fill(0);

    rentals.forEach(r => {
        const month = Number(r.startDate.split(".")[1]) - 1;
        months[month] += r.totalPrice;
    });

    new Chart(document.getElementById("revenueChart"), {
        type: "bar",
        data: {
            labels: [
                "Jan", "Feb", "Mar", "Apr", "Máj", "Jún",
                "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"
            ],
            datasets: [{
                label: "Tržby (€)",
                data: months,
                backgroundColor: "rgba(0,123,255,0.6)"
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", loadCarDetail);
s