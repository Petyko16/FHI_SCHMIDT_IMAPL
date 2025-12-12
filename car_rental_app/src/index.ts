import express from "express";
import cors from "cors";
import path from "path";
import { Storage } from "./storage";

import { carsRouter } from "./api/car.router";
import { customersRouter } from "./api/customers.router";
import { rentalsRouter } from "./api/rentals.router";

const app = express();
const storage = new Storage();

app.use(express.json());
app.use(cors());

// statické súbory
app.use(express.static(path.join(__dirname, "../public")));

// API
app.use("/cars", carsRouter(storage));
app.use("/customers", customersRouter(storage));
app.use("/rentals", rentalsRouter(storage));

// DASHBOARD DATA (pre index.js)
app.get("/dashboard-data", (req, res) => {
    res.json({
        cars: storage.cars.length,
        customers: storage.customers.length,
        rentals: storage.rentals.length,
        availableCars: storage.cars.filter(c => c.isAvailable).length
    });
});

// ROOT = dashboard
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});
