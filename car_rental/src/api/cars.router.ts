import { Router, Request, Response } from "express";
import { CarService } from "../services/car.service";
import { Car } from "../classes/Car";

export function carsRouter(carService: CarService) {
    const router = Router();

    router.get("/", (_req: Request, res: Response) => {
        res.json(carService.listCars());
    });

    router.get("/:id", (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const car = carService.findById(id);
        if (!car) return res.status(404).json({ message: "Car not found" });
        res.json(car);
    });

    router.post("/", (req: Request, res: Response) => {
        const { id, brand, model, year, pricePerDay, isAvailable } = req.body;
        if (id == null || !brand || !model || year == null || pricePerDay == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const car = new Car(
            Number(id),
            String(brand),
            String(model),
            Number(year),
            Number(pricePerDay),
            Boolean(isAvailable ?? true)
        );
        carService.addCar(car);
        res.status(201).json(car);
    });

    router.put("/:id/availability", (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { isAvailable } = req.body;
        const car = carService.findById(id);
        if (!car) return res.status(404).json({ message: "Car not found" });
        carService.setAvailability(id, Boolean(isAvailable));
        res.json(carService.findById(id));
    });

    router.delete("/:id", (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const before = carService.listCars().length;
        const left = carService.removeById(id);
        if (left === before) return res.status(404).json({ message: "Car not found" });
        res.status(204).send();
    });

    // SEARCH /cars/search?brand=Toyota&model=Corolla&yearFrom=2020&yearTo=2024&priceMax=60&available=true&q=Cor
    router.get("/search", (req: Request, res: Response) => {
        const all = carService.listCars();
        const {
            brand,
            model,
            yearFrom,
            yearTo,
            priceMax,
            available,
            q
        } = req.query as Record<string, string | undefined>;

        let result = all;

        if (brand) {
            const b = brand.toLowerCase();
            result = result.filter(c => c.brand.toLowerCase() === b);
        }
        if (model) {
            const m = model.toLowerCase();
            result = result.filter(c => c.model.toLowerCase() === m);
        }
        if (yearFrom) {
            const yf = Number(yearFrom);
            result = result.filter(c => c.year >= yf);
        }
        if (yearTo) {
            const yt = Number(yearTo);
            result = result.filter(c => c.year <= yt);
        }
        if (priceMax) {
            const p = Number(priceMax);
            result = result.filter(c => c.pricePerDay <= p);
        }
        if (available !== undefined) {
            const av = String(available).toLowerCase();
            if (av === "true" || av === "false") {
                const bool = av === "true";
                result = result.filter(c => c.isAvailable === bool);
            }
        }
        if (q) {
            const qq = q.toLowerCase();
            result = result.filter(c =>
                `${c.brand} ${c.model}`.toLowerCase().includes(qq)
            );
        }

        res.json(result);
    });

    return router;
}
