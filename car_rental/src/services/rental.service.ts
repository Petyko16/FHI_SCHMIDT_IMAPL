import { Rental } from "../classes/Rental";
import { Storage } from "../Storage";
import { CarService } from "./car.service";

export class RentalService {
    constructor(private storage: Storage, private carService: CarService) {}

    listRentals(): Rental[] {
        return this.storage.rentals;
    }

    addRental(r: Rental) {
        this.storage.rentals.push(r);
        this.carService.listCars().find(c => c.id === r.carId)!.isAvailable = false;
        this.storage.saveAll();
    }
}
