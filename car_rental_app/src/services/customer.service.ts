import { Storage } from "../storage";
import { Customer } from "../classes/Customer";

// 👤 Služba pre prácu so zákazníkmi (CRUD logika)
export class CustomerService {

    constructor(private storage: Storage) {}

    // ➤ Vráti všetkých zákazníkov
    getAll(): Customer[] {
        return this.storage.customers;
    }

    // ➤ Pridá nového zákazníka
    add(customer: Customer): void {
        this.storage.customers.push(customer);
        this.storage.saveAll();
    }

    // ➤ Aktualizuje existujúceho zákazníka
    update(id: number, data: Partial<Customer>): Customer | null {
        const customer = this.storage.customers.find(c => c.id === id);

        if (!customer) return null;

        Object.assign(customer, data);
        this.storage.saveAll();
        return customer;
    }

    // ➤ Odstráni zákazníka podľa ID
    delete(id: number): boolean {
        const before = this.storage.customers.length;

        this.storage.customers = this.storage.customers.filter(c => c.id !== id);

        const changed = this.storage.customers.length !== before;

        if (changed) this.storage.saveAll();

        return changed;
    }
}
