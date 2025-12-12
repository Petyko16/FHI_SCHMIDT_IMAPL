import fs from "fs";
import { Car } from "./classes/Car";
import { Customer } from "./classes/Customer";
import { Rental } from "./classes/Rental";
import { loadDB, saveDB } from "./utils/filedb";

export class Storage {
    cars: Car[] = [];
    customers: Customer[] = [];
    rentals: Rental[] = [];

    constructor() {
        // Create DB directory if missing
        if (!fs.existsSync("./src/db")) fs.mkdirSync("./src/db");

        // Load data
        this.cars = loadDB<Car>("./src/db/cars.json");
        this.customers = loadDB<Customer>("./src/db/customers.json");
        this.rentals = loadDB<Rental>("./src/db/rentals.json");

        // Seed cars
        if (this.cars.length === 0) {
            this.seedCars();
            this.saveAll();
        }

        // Seed customers
        if (this.customers.length === 0) {
            this.seedCustomers();
            this.saveAll();
        }
    }

    // 🚗 Seed 10 cars
    private seedCars() {
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

    // 👤 Seed 10 customers
    private seedCustomers() {
        this.customers = [
            new Customer(1, "Peter Schmidt", "peter@test.sk", "0900000000"),
            new Customer(2, "Ján Novák", "jan@test.sk", "0903123123"),
            new Customer(3, "Marek Hruška", "marek@test.sk", "0911222333"),
            new Customer(4, "Adam Krajčí", "adam@test.sk", "0905444333"),
            new Customer(5, "Martin Slaný", "martin@test.sk", "0902333444"),
            new Customer(6, "Tomáš Biely", "tomas@test.sk", "0910123456"),
            new Customer(7, "Lukáš Rudo", "lukas@test.sk", "0911555666"),
            new Customer(8, "Simona Fialová", "simona@test.sk", "0907999888"),
            new Customer(9, "Dominika Čierna", "domca@test.sk", "0907888999"),
            new Customer(10, "David Krátky", "david@test.sk", "0907444555")
        ];
    }

    // 🔢 AUTO ID
    getNextCarId(): number {
        if (this.cars.length === 0) return 1;
        return Math.max(...this.cars.map(c => c.id)) + 1;
    }

    // 🔢 CUSTOMER ID
    getNextCustomerId(): number {
        if (this.customers.length === 0) return 1;
        return Math.max(...this.customers.map(c => c.id)) + 1;
    }

    // 🔢 RENTAL ID
    getNextRentalId(): number {
        if (this.rentals.length === 0) return 1;
        return Math.max(...this.rentals.map(r => r.id)) + 1;
    }

    // 💾 Save all DB data
    saveAll() {
        saveDB("./src/db/cars.json", this.cars);
        saveDB("./src/db/customers.json", this.customers);
        saveDB("./src/db/rentals.json", this.rentals);

        console.log(`[DB] Saved: cars=${this.cars.length}, customers=${this.customers.length}, rentals=${this.rentals.length}`);
    }
}
