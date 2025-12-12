import { Router } from "express";
import { Customer } from "../classes/Customer";
import { CustomerService } from "../services/customer.service";

export function customersRouter(customerService: CustomerService) {
    const router = Router();

    router.get("/", (_req, res) => {
        res.json(customerService.listCustomers());
    });

    router.post("/", (req, res) => {
        const { id, name, email, phone } = req.body;
        if (!id || !name || !email || !phone) {
            return res.status(400).json({ message: "Missing customer fields" });
        }
        const c = new Customer(id, name, email, phone);
        customerService.addCustomer(c);
        res.status(201).json(c);
    });

    return router;
}
