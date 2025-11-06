import { Customer } from "../classes/Customer";
import { Storage } from "../Storage";

export class CustomerService {
    constructor(private storage: Storage) {}

    addCustomer(customer: Customer): void {
        this.storage.customers.push(customer);
    }

    listCustomers(): Customer[] {
        return this.storage.customers;
    }

    findById(id: number): Customer | undefined {
        return this.storage.customers.find(c => c.id === id);
    }
    removeById(id: number): boolean {
        const before = this.storage.customers.length;
        this.storage.customers = this.storage.customers.filter(u => u.id !== id);
        return this.storage.customers.length < before;
    }

}
