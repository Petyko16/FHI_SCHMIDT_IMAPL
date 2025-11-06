import { Router, Request, Response } from "express";
import { RentalService } from "../services/rental.service";
import { CarService } from "../services/car.service";
import { Rental } from "../classes/Rental";
import { calculateTotalPrice } from "../utils/func.utils";

export function rentalsRouter(rentalService: RentalService, carService: CarService) {
    const router = Router();

    router.get("/", (_req, res) => res.json(rentalService.listRentals()));

    router.get("/:id", (req, res) => {
        const id = Number(req.params.id);
        const r = rentalService.findById(id);
        if (!r) return res.status(404).json({ message: "Rental not found" });
        res.json(r);
    });

    // Body: { id, carId, customerId, days }
    router.post("/", (req: Request, res: Response) => {
        const { id, carId, customerId, days } = req.body;
        if (id == null || carId == null || customerId == null || days == null) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const car = carService.findById(Number(carId));
        if (!car) return res.status(404).json({ message: "Car not found" });
        if (!car.isAvailable) return res.status(409).json({ message: "Car is not available" });

        const totalPrice = calculateTotalPrice(Number(days), car.pricePerDay);
        const rental = new Rental(Number(id), Number(carId), Number(customerId), Number(days), totalPrice);

        rentalService.addRental(rental); // autó elérhetetlenné válik
        res.status(201).json(rental);
    });

    // Foglalás törlése, autó felszabadítása
    router.delete("/:id", (req, res) => {
        const id = Number(req.params.id);
        const ok = rentalService.removeByIdAndReleaseCar(id);
        if (!ok) return res.status(404).json({ message: "Rental not found" });
        res.status(204).send();
    });

    // GET /rentals/by-customer/1
    router.get("/by-customer/:customerId", (req: Request, res: Response) => {
        const customerId = Number(req.params.customerId);
        const list = rentalService.listRentals().filter(r => r.customerId === customerId);
        res.json(list);
    });

// GET /rentals/by-car/1
    router.get("/by-car/:carId", (req: Request, res: Response) => {
        const carId = Number(req.params.carId);
        const list = rentalService.listRentals().filter(r => r.carId === carId);
        res.json(list);
    });

    return router;
}
