import { Rental } from "../classes/Rental";
import { Storage } from "../Storage";
import { CarService } from "./car.service";

export class RentalService {
    constructor(private storage: Storage, private carService: CarService) {}

    addRental(rental: Rental): void {
        this.carService.setAvailability(rental.carId, false);
        this.storage.rentals.push(rental);
        this.storage.saveAll();
    }

    listRentals(): Rental[] {
        return this.storage.rentals;
    }

    findById(id: number): Rental | undefined {
        return this.storage.rentals.find(r => r.id === id);
    }

    removeByIdAndReleaseCar(id: number): boolean {
        const r = this.storage.rentals.find(x => x.id === id);
        if (!r) return false;
        this.carService.setAvailability(r.carId, true);
        this.storage.rentals = this.storage.rentals.filter(x => x.id !== id);
        this.storage.saveAll();
        return true;
    }
}
