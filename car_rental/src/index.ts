import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import { Storage } from "./Storage";
import { CarService } from "./services/car.service";
import { CustomerService } from "./services/customer.service";
import { RentalService } from "./services/rental.service";

import { carsRouter } from "./api/cars.router";
import { customersRouter } from "./api/customers.router";
import { rentalsRouter } from "./api/rentals.router";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    })
);

// STATIC FRONTEND
app.use(express.static(path.join(__dirname, "../public")));

const storage = new Storage();
const carService = new CarService(storage);
const customerService = new CustomerService(storage);
const rentalService = new RentalService(storage, carService);

// API routes
app.use("/cars", carsRouter(carService));
app.use("/customers", customersRouter(customerService));
app.use("/rentals", rentalsRouter(rentalService, carService));

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = 3000;
app.listen(PORT, () =>
    console.log(`API running on http://localhost:${PORT}`)
);
