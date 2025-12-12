import { Router } from "express";
import { CarService } from "../services/car.service";
import { Car } from "../classes/Car";

export function carsRouter(carService: CarService) {
    const router = Router();

    router.get("/", (_req, res) => {
        res.json(carService.listCars());
    });

    router.post("/", (req, res) => {
        const { id, brand, model, year, pricePerDay } = req.body;
        if (!id || !brand || !model || !year || !pricePerDay) {
            return res.status(400).json({ message: "Missing fields" });
        }
        const car = new Car(id, brand, model, year, pricePerDay, true);
        carService.addCar(car);
        res.status(201).json(car);
    });

    return router;
}
