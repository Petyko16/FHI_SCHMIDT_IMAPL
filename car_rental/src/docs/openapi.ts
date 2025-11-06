export const openapiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Car Rental API",
        version: "1.0.0",
        description: "Egyszerű autókölcsönző REST API (cars, customers, rentals)."
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
        schemas: {
            Car: {
                type: "object",
                required: ["id", "brand", "model", "year", "pricePerDay"],
                properties: {
                    id: { type: "integer", example: 1 },
                    brand: { type: "string", example: "Toyota" },
                    model: { type: "string", example: "Corolla" },
                    year: { type: "integer", example: 2022 },
                    pricePerDay: { type: "number", example: 45 },
                    isAvailable: { type: "boolean", example: true }
                }
            },
            Customer: {
                type: "object",
                required: ["id", "name", "email", "phone"],
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Peter Schmidt" },
                    email: { type: "string", example: "peter@mail.com" },
                    phone: { type: "string", example: "0900123456" }
                }
            },
            Rental: {
                type: "object",
                required: ["id", "carId", "customerId", "days"],
                properties: {
                    id: { type: "integer", example: 1 },
                    carId: { type: "integer", example: 1 },
                    customerId: { type: "integer", example: 1 },
                    days: { type: "integer", example: 5 },
                    totalPrice: { type: "number", example: 225 },
                    date: { type: "string", format: "date-time" }
                }
            },
            Error: {
                type: "object",
                properties: { message: { type: "string" } }
            }
        }
    },
    paths: {
        "/": {
            get: {
                summary: "Health check",
                responses: { "200": { description: "OK" } }
            }
        },
        "/cars": {
            get: {
                summary: "Autók listázása",
                responses: {
                    "200": {
                        description: "OK",
                        content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Car" } } } }
                    }
                }
            },
            post: {
                summary: "Új autó létrehozása",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Car" },
                            example: { id: 1, brand: "Toyota", model: "Corolla", year: 2022, pricePerDay: 45 }
                        }
                    }
                },
                responses: { "201": { description: "Létrehozva" }, "400": { description: "Hiányzó mező", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } } }
            }
        },
        "/cars/{id}": {
            get: {
                summary: "Autó lekérése id alapján",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                responses: {
                    "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Car" } } } },
                    "404": { description: "Nem található", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } }
                }
            },
            put: {
                summary: "Autó frissítése (patch-szerű)",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                requestBody: { required: true, content: { "application/json": { schema: { type: "object" } } } },
                responses: { "200": { description: "OK" }, "404": { description: "Nem található" } }
            },
            delete: {
                summary: "Autó törlése",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                responses: { "204": { description: "Törölve" }, "404": { description: "Nem található" } }
            }
        },
        "/cars/{id}/availability": {
            put: {
                summary: "Autó elérhetőségének állítása",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { isAvailable: { type: "boolean" } }, required: ["isAvailable"] }, example: { isAvailable: true } } } },
                responses: { "200": { description: "OK" }, "404": { description: "Nem található" } }
            }
        },
        "/cars/search": {
            get: {
                summary: "Autók keresése/szűrése",
                parameters: [
                    { in: "query", name: "brand", schema: { type: "string" } },
                    { in: "query", name: "model", schema: { type: "string" } },
                    { in: "query", name: "yearFrom", schema: { type: "integer" } },
                    { in: "query", name: "yearTo", schema: { type: "integer" } },
                    { in: "query", name: "priceMax", schema: { type: "number" } },
                    { in: "query", name: "available", schema: { type: "boolean" } },
                    { in: "query", name: "q", schema: { type: "string" } }
                ],
                responses: { "200": { description: "OK" } }
            }
        },
        "/customers": {
            post: {
                summary: "Új ügyfél létrehozása",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/Customer" },
                            example: { id: 1, name: "Peter Schmidt", email: "peter@mail.com", phone: "0900123456" }
                        }
                    }
                },
                responses: { "201": { description: "Létrehozva" }, "400": { description: "Hibás adatok" } }
            },
            get: {
                summary: "Ügyfelek listázása",
                responses: { "200": { description: "OK" } }
            }
        },
        "/customers/{id}": {
            get: {
                summary: "Ügyfél lekérése",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                responses: { "200": { description: "OK" }, "404": { description: "Nem található" } }
            },
            delete: {
                summary: "Ügyfél törlése",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                responses: { "204": { description: "Törölve" }, "404": { description: "Nem található" } }
            }
        },
        "/rentals": {
            get: { summary: "Foglalások listázása", responses: { "200": { description: "OK" } } },
            post: {
                summary: "Foglalás létrehozása",
                requestBody: {
                    required: true,
                    content: { "application/json": { schema: { $ref: "#/components/schemas/Rental" }, example: { id: 1, carId: 1, customerId: 1, days: 5 } } }
                },
                responses: { "201": { description: "Létrehozva" }, "404": { description: "Autó/ügyfél hiányzik" }, "409": { description: "Autó nem elérhető" } }
            }
        },
        "/rentals/{id}": {
            get: {
                summary: "Foglalás lekérése",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                responses: { "200": { description: "OK" }, "404": { description: "Nem található" } }
            },
            delete: {
                summary: "Foglalás törlése (autó felszabadul)",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
                responses: { "204": { description: "Törölve" }, "404": { description: "Nem található" } }
            }
        },
        "/rentals/by-customer/{customerId}": {
            get: {
                summary: "Foglalások ügyfél szerint",
                parameters: [{ in: "path", name: "customerId", required: true, schema: { type: "integer" } }],
                responses: { "200": { description: "OK" } }
            }
        },
        "/rentals/by-car/{carId}": {
            get: {
                summary: "Foglalások autó szerint",
                parameters: [{ in: "path", name: "carId", required: true, schema: { type: "integer" } }],
                responses: { "200": { description: "OK" } }
            }
        }
    }
};
