import { Router } from "express";
import { RentalService } from "../services/rental.service";
import { CarService } from "../services/car.service";
import { Rental } from "../classes/Rental";

export function rentalsRouter(rentalService: RentalService, carService: CarService) {
    const router = Router();

    router.get("/", (_req, res) => {
        res.json(rentalService.listRentals());
    });

    router.post("/", (req, res) => {
        const { id, carId, customerId, days } = req.body;

        const car = carService.listCars().find(c => c.id === carId);
        if (!car || !car.isAvailable) {
            return res.status(400).json({ message: "Car is not available" });
        }

        const rental = new Rental(id, carId, customerId, days);
        rentalService.addRental(rental);

        res.status(201).json(rental);
    });

    return router;
}
