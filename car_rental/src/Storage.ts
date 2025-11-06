import { Car } from "./classes/Car";
import { Customer } from "./classes/Customer";
import { Rental } from "./classes/Rental";
import { readList, writeList } from "./utils/filedb";

export class Storage {
    public cars: Car[] = [];
    public customers: Customer[] = [];
    public rentals: Rental[] = [];

    constructor() {
        // induláskor betöltjük a JSON fájlokból
        this.cars = readList<Car>("cars");
        this.customers = readList<Customer>("customers");
        this.rentals = readList<Rental>("rentals");
    }

    saveAll() {
        writeList("cars", this.cars);
        writeList("customers", this.customers);
        writeList("rentals", this.rentals);
        console.log("[DB] Saved cars:", this.cars.length, "customers:", this.customers.length, "rentals:", this.rentals.length);
    }
}
