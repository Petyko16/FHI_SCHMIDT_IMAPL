const params = new URLSearchParams(window.location.search);
const customerId = Number(params.get("id"));

async function loadCustomerDetail() {
    const customers = await (await fetch("/customers")).json();
    const cars = await (await fetch("/cars")).json();
    const rentals = await (await fetch("/rentals")).json();

    const customer = customers.find(c => c.id === customerId);
    if (!customer) {
        alert("Zákazník sa nenašiel.");
        window.location.href = "customers.html";
        return;
    }

    // Header + profile
    document.getElementById("customerName").innerText = customer.name;
    document.getElementById("custName").innerText = customer.name;
    document.getElementById("custEmail").innerText = customer.email;
    document.getElementById("custPhone").innerText = customer.phone;

    // Avatar (placeholder)
    document.getElementById("avatar").src =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=0D8ABC&color=fff&size=256`;

    // Customer rentals
    const custRentals = rentals.filter(r => r.customerId === customerId);

    const tbody = document.getElementById("rentalsTableBody");
    tbody.innerHTML = "";

    let totalSpent = 0;

    custRentals.forEach(r => {
        const car = cars.find(c => c.id === r.carId);
        totalSpent += r.totalPrice;

        let badge = "";
        if (r.status === "Aktív") badge = `<span class="badge bg-success">Aktív</span>`;
        else if (r.status === "Plánovaný") badge = `<span class="badge bg-primary">Plánovaný</span>`;
        else badge = `<span class="badge bg-secondary">Ukončený</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${r.id}</td>
                <td>${car ? car.brand + " " + car.model : "?"}</td>
                <td>${r.startDate}</td>
                <td>${r.endDate}</td>
                <td>${r.totalDays}</td>
                <td>${r.totalPrice} €</td>
                <td>${badge}</td>
            </tr>
        `;
    });

    document.getElementById("totalSpent").innerText = totalSpent;

    generateChart(custRentals);
}

// Chart: number of rentals per month
function generateChart(rentals) {
    const months = Array(12).fill(0);

    rentals.forEach(r => {
        const m = Number(r.startDate.split(".")[1]) - 1;
        months[m]++;
    });

    new Chart(document.getElementById("rentalsChart"), {
        type: "line",
        data: {
            labels: ["Jan","Feb","Mar","Apr","Máj","Jún","Júl","Aug","Sep","Okt","Nov","Dec"],
            datasets: [{
                label: "Počet prenájmov",
                data: months,
                borderColor: "rgba(40,167,69,1)",
                backgroundColor: "rgba(40,167,69,0.2)",
                fill: true,
                tension: 0.3
            }]
        }
    });
}

document.addEventListener("DOMContentLoaded", loadCustomerDetail);
