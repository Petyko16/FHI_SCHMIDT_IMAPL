import { Router } from "express";
import { Storage } from "../storage";
import { Car } from "../classes/Car";

export function carsRouter(storage: Storage) {
    const router = Router();

    // GET – všetky autá
    router.get("/", (req, res) => {
        res.json(storage.cars);
    });

    // POST – pridať nové auto
    router.post("/", (req, res) => {
        const { brand, model, year, pricePerDay } = req.body;

        if (!brand || !model || !year || !pricePerDay) {
            return res.status(400).json({ error: "Chýbajú údaje o aute." });
        }

        const id = storage.getNextCarId();
        const car = new Car(
            id,
            brand,
            model,
            Number(year),
            Number(pricePerDay),
            true // nové auto je dostupné
        );

        storage.cars.push(car);
        storage.saveAll();

        res.json(car);
    });

    // PUT – upraviť existujúce auto
    router.put("/:id", (req, res) => {
        const id = Number(req.params.id);
        const { brand, model, year, pricePerDay } = req.body;

        const car = storage.cars.find(c => c.id === id);
        if (!car) {
            return res.status(404).json({ error: "Auto sa nenašlo." });
        }

        if (!brand || !model || !year || !pricePerDay) {
            return res.status(400).json({ error: "Chýbajú údaje o aute." });
        }

        car.brand = brand;
        car.model = model;
        car.year = Number(year);
        car.pricePerDay = Number(pricePerDay);

        storage.saveAll();
        res.json(car);
    });

    // DELETE – vymazať auto
    router.delete("/:id", (req, res) => {
        const id = Number(req.params.id);
        const before = storage.cars.length;

        storage.cars = storage.cars.filter(c => c.id !== id);

        if (storage.cars.length === before) {
            return res.status(404).json({ error: "Auto sa nenašlo." });
        }

        storage.saveAll();
        res.json({ success: true });
    });

    return router;
}
