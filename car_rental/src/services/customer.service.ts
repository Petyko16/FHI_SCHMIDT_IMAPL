import { Customer } from "../classes/Customer";
import { Storage } from "../Storage";

export class CustomerService {
    constructor(private storage: Storage) {}

    listCustomers(): Customer[] {
        return this.storage.customers;
    }

    addCustomer(c: Customer) {
        this.storage.customers.push(c);
        this.storage.saveAll();
    }
}
