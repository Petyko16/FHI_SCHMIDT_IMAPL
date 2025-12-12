import { Router } from "express";
import { Storage } from "../storage";
import { Rental } from "../classes/Rental";

// Convert DD.MM.YYYY → JS Date
function parseDate(d: string): Date {
    const [day, month, year] = d.split(".").map(Number);
    return new Date(year, month - 1, day);
}

export function rentalsRouter(storage: Storage) {
    const router = Router();

    // GET all rentals
    router.get("/", (req, res) => {
        res.json(storage.rentals);
    });

    // CREATE rental
    router.post("/", (req, res) => {
        const { carId, customerId, startDate, endDate } = req.body;

        if (!carId || !customerId || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing rental data" });
        }

        // Convert dates
        const start = parseDate(startDate);
        const end = parseDate(endDate);

        const msInDay = 1000 * 60 * 60 * 24;
        const totalDays = Math.ceil((end.getTime() - start.getTime()) / msInDay);

        if (totalDays < 1) {
            return res.status(400).json({ error: "End date must be later than start date." });
        }

        const car = storage.cars.find(c => c.id === carId);
        if (!car) return res.status(404).json({ error: "Car not found" });

        const totalPrice = totalDays * car.pricePerDay;

        // Determine status
        const today = new Date();
        let status = "Aktív";

        if (start > today) status = "Plánovaný";
        else if (end < today) status = "Ukončený";

        const id = storage.getNextRentalId();

        const rental = new Rental(
            id,
            carId,
            customerId,
            startDate,
            endDate,
            totalDays,
            totalPrice,
            status
        );

        // Mark car unavailable only if currently active or future rental
        if (status !== "Ukončený") {
            car.isAvailable = false;
        }

        storage.rentals.push(rental);
        storage.saveAll();

        res.json(rental);
    });

    // DELETE rental
    router.delete("/:id", (req, res) => {
        const id = Number(req.params.id);
        const rental = storage.rentals.find(r => r.id === id);

        if (!rental) return res.status(404).json({ error: "Rental not found" });

        // Make car available again
        const car = storage.cars.find(c => c.id === rental.carId);
        if (car) car.isAvailable = true;

        storage.rentals = storage.rentals.filter(r => r.id !== id);
        storage.saveAll();

        res.json({ success: true });
    });

    return router;
}
