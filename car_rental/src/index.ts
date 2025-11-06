import express from "express";
import { Storage } from "./Storage";
import { CarService } from "./services/car.service";
import { CustomerService } from "./services/customer.service";
import { RentalService } from "./services/rental.service";
import { carsRouter } from "./api/cars.router";
import { customersRouter } from "./api/customers.router";
import { rentalsRouter } from "./api/rentals.router";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi";


const storage = new Storage();
const carService = new CarService(storage);
const customerService = new CustomerService(storage);
const rentalService = new RentalService(storage, carService);

const app = express();
app.use(express.json());

app.use("/cars", carsRouter(carService));
app.use("/customers", customersRouter(customerService));
app.use("/rentals", rentalsRouter(rentalService, carService));

app.get("/", (_req, res) => res.json({ ok: true, service: "car_rental" }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// 404 – ismeretlen útvonalakra
app.use((_req, res) => {
    res.status(404).json({ message: "Not found" });
});

// (Opcionális) Egységes hiba-kezelő – ha dobunk next(err)-et valahol
// app.use((err: any, _req: any, res: any, _next: any) => {
//   console.error(err);
//   res.status(500).json({ message: "Internal server error" });
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
});
