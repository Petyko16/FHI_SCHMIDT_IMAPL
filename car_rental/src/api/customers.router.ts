import { Router, Request, Response } from "express";
import { CustomerService } from "../services/customer.service";
import { Customer } from "../classes/Customer";

// Beépített validátorok, hogy ne kelljen import
function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
}
function validatePhone(phone: string): boolean {
    return /^[0-9 +()-]{7,20}$/.test(String(phone));
}

// NÉV SZERINTI EXPORT — EZ KELL AZ index.ts-nek
export function customersRouter(customerService: CustomerService) {
    const router = Router();

    router.get("/", (_req: Request, res: Response) => {
        res.json(customerService.listCustomers());
    });

    router.get("/:id", (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const customer = customerService.findById(id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    });

    router.post("/", (req: Request, res: Response) => {
        const { id, name, email, phone } = req.body;
        if (id == null || !name || !email || !phone) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid email" });
        if (!validatePhone(phone)) return res.status(400).json({ message: "Invalid phone" });

        const c = new Customer(Number(id), String(name), String(email), String(phone));
        customerService.addCustomer(c);
        res.status(201).json(c);
    });

    router.delete("/:id", (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const removed = customerService.removeById(id);
        if (!removed) return res.status(404).json({ message: "Customer not found" });
        res.status(204).send();
    });

    return router;
}

// (opcionális) default export is mehet, de NEM szükséges:
// export default customersRouter;
