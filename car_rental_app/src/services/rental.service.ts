import { Storage } from "../storage";
import { Rental } from "../classes/Rental";
import { Car } from "../classes/Car";

// 🔄 Služba pre prácu s prenájmami
export class RentalService {

    constructor(private storage: Storage) {}

    // ➤ Vráti všetky prenájmy
    getAll(): Rental[] {
        return this.storage.rentals;
    }

    // ➤ Vytvorenie nového prenájmu
    addRental(rental: Rental): string | Rental {

        const car = this.storage.cars.find(c => c.id === rental.carId);
        const customer = this.storage.customers.find(c => c.id === rental.customerId);

        // 🛑 Kontroly
        if (!car) return "Auto neexistuje.";
        if (!customer) return "Zákazník neexistuje.";
        if (!car.isAvailable) return "Auto nie je dostupné.";

        // ➤ označíme auto ako nedostupné
        car.isAvailable = false;

        // ➤ uložíme prenájom
        this.storage.rentals.push(rental);

        this.storage.saveAll();

        return rental;
    }

    // ➤ Vymazanie prenájmu + uvoľnenie auta
    deleteRental(id: number): boolean {
        const rental = this.storage.rentals.find(r => r.id === id);
        if (!rental) return false;

        // ➤ nájdeme auto a označíme ako dostupné
        const car = this.storage.cars.find(c => c.id === rental.carId);
        if (car) car.isAvailable = true;

        // ➤ odstránime prenájom
        this.storage.rentals = this.storage.rentals.filter(r => r.id !== id);

        this.storage.saveAll();
        return true;
    }
}
