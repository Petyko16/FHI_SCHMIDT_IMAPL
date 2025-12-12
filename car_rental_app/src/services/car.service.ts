import { Storage } from "../storage";
import { Car } from "../classes/Car";

export class CarService {
    constructor(private storage: Storage) {}

    getAll(): Car[] {
        return this.storage.cars;
    }

    getById(id: number): Car | undefined {
        return this.storage.cars.find(c => c.id === id);
    }

    addCar(data: any): Car {
        const newCar = new Car(
            Date.now(),
            data.brand,
            data.model,
            Number(data.year),
            Number(data.pricePerDay),
            true
        );

        this.storage.cars.push(newCar);
        this.storage.saveAll();
        return newCar;
    }

    updateCar(id: number, data: Partial<Car>): Car | null {
        const car = this.getById(id);
        if (!car) return null;

        car.brand = data.brand ?? car.brand;
        car.model = data.model ?? car.model;
        car.year = data.year ?? car.year;
        car.pricePerDay = data.pricePerDay ?? car.pricePerDay;
        car.isAvailable = data.isAvailable ?? car.isAvailable;

        this.storage.saveAll();
        return car;
    }

    deleteCar(id: number): boolean {
        const index = this.storage.cars.findIndex(c => c.id === id);
        if (index === -1) return false;

        this.storage.cars.splice(index, 1);
        this.storage.saveAll();
        return true;
    }
}
