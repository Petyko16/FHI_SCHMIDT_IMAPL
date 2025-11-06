import { Car } from "../classes/Car";
import { Storage } from "../Storage";

export class CarService {
    constructor(private storage: Storage) {}

    addCar(car: Car): void {
        this.storage.cars.push(car);
        this.storage.saveAll();
    }

    listCars(): Car[] {
        return this.storage.cars;
    }

    findById(id: number): Car | undefined {
        return this.storage.cars.find(car => car.id === id);
    }

    findAvailable(): Car[] {
        return this.storage.cars.filter(car => car.isAvailable);
    }

    setAvailability(id: number, isAvailable: boolean): void {
        const car = this.findById(id);
        if (car) {
            car.isAvailable = isAvailable;
            this.storage.saveAll();
        }
    }

    update(id: number, patch: Partial<Car>): Car | undefined {
        const c = this.findById(id);
        if (!c) return undefined;
        Object.assign(c, patch);
        this.storage.saveAll();
        return c;
    }

    removeById(id: number): number {
        const before = this.storage.cars.length;
        this.storage.cars = this.storage.cars.filter(c => c.id !== id);
        if (this.storage.cars.length !== before) this.storage.saveAll();
        return this.storage.cars.length;
    }
}
