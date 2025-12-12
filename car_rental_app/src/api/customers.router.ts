import { Router } from "express";
import { Storage } from "../storage";
import { Customer } from "../classes/Customer";

export function customersRouter(storage: Storage) {
    const router = Router();

    router.get("/", (req, res) => {
        res.json(storage.customers);
    });

    router.post("/", (req, res) => {
        const { name, email, phone } = req.body;

        const id = storage.getNextCustomerId();
        const customer = new Customer(id, name, email, phone);

        storage.customers.push(customer);
        storage.saveAll();

        res.json(customer);
    });

    router.delete("/:id", (req, res) => {
        const id = Number(req.params.id);
        storage.customers = storage.customers.filter(c => c.id !== id);
        storage.saveAll();
        res.json({ success: true });
    });

    // UPDATE customer
    router.put("/:id", (req, res) => {
        const id = Number(req.params.id);
        const { name, email, phone } = req.body;

        const customer = storage.customers.find(c => c.id === id);
        if (!customer) return res.status(404).json({ error: "Customer not found" });

        customer.name = name;
        customer.email = email;
        customer.phone = phone;

        storage.saveAll();
        res.json(customer);
    });


    return router;
}
