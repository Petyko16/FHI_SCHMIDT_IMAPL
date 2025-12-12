import { Car } from "../classes/Car";
import { Storage } from "../Storage";

export class CarService {
    constructor(private storage: Storage) {}

    listCars(): Car[] {
        return this.storage.cars;
    }

    addCar(car: Car) {
        this.storage.cars.push(car);
        this.storage.saveAll();
    }
}
