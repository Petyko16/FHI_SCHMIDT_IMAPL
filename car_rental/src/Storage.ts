import { Car } from "./classes/Car";
import { Customer } from "./classes/Customer";
import { Rental } from "./classes/Rental";

import { loadDB, saveDB } from "./utils/filedb";
import fs from "fs";

export class Storage {
    cars: Car[] = [];
    customers: Customer[] = [];
    rentals: Rental[] = [];

    constructor() {
        // Ensure DB folder exists
        if (!fs.existsSync("./src/db")) {
            fs.mkdirSync("./src/db");
        }

        // LOAD DATABASE FILES OR EMPTY LIST
        this.cars = loadDB("./src/db/cars.json") || [];
        this.customers = loadDB("./src/db/customers.json") || [];
        this.rentals = loadDB("./src/db/rentals.json") || [];

        // AUTO-SEED CARS IF EMPTY
        if (this.cars.length === 0) {
            console.log("[DB] Seeding 10 cars...");
            this.seedCars();
            this.saveAll();
        }
    }

    seedCars() {
        this.cars = [
            new Car(1, "Toyota", "Corolla", 2020, 40, true),
            new Car(2, "Honda", "Civic", 2019, 38, true),
            new Car(3, "Ford", "Focus", 2021, 45, true),
            new Car(4, "BMW", "3 Series", 2018, 75, true),
            new Car(5, "Mercedes", "C-Class", 2019, 82, true),
            new Car(6, "Volkswagen", "Golf", 2020, 42, true),
            new Car(7, "Audi", "A4", 2017, 70, true),
            new Car(8, "Hyundai", "Elantra", 2022, 39, true),
            new Car(9, "Kia", "Ceed", 2021, 41, true),
            new Car(10, "Opel", "Astra", 2020, 37, true)
        ];
    }

    saveAll() {
        saveDB("./src/db/cars.json", this.cars);
        saveDB("./src/db/customers.json", this.customers);
        saveDB("./src/db/rentals.json", this.rentals);

        console.log(
            `[DB] Saved cars: ${this.cars.length} customers: ${this.customers.length} rentals: ${this.rentals.length}`
        );
    }
}
