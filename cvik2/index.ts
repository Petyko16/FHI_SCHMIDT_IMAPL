class Vehicle {
    constructor(public name: string) {}

    move(): void {
        console.log(`${this.name} sa pohybuje.`);
    }
}

class WheeledVehicle extends Vehicle {
    constructor(name: string, public wheels: number) {
        super(name);
    }

    override move(): void {
        console.log(`${this.name} (vozidlo s ${this.wheels} kolesami) ide po ceste.`);
    }
}

class Car extends WheeledVehicle {
    // Zapúzdrená (private) vlastnosť – prístup len cez getter
    private fuelType: string;

    constructor(name: string, fuelType: string) {
        super(name, 4);
        this.fuelType = fuelType;
    }

    getFuelType(): string {
        return this.fuelType;
    }

    override move(): void {
        console.log(`${this.name} (auto) ide po ceste na ${this.fuelType}.`);
    }
}

class Sedan extends Car {
    override move(): void {
        console.log(`${this.name} (sedan) ide po diaľnici – palivo: ${this.getFuelType()}.`);
    }
}

class Kombi extends Car {
    override move(): void {
        console.log(`${this.name} (kombi) vezie batožinu – palivo: ${this.getFuelType()}.`);
    }
}

class Bicycle extends WheeledVehicle {
    constructor(name: string) {
        super(name, 2);
    }

    override move(): void {
        console.log(`${this.name} (bicykel) sa pohybuje po cyklotrase.`);
    }
}

class Boat extends Vehicle {
    private enginePower: number;

    constructor(name: string, enginePower: number) {
        super(name);
        this.enginePower = enginePower;
    }

    get power(): number {
        return this.enginePower;
    }

    override move(): void {
        console.log(`${this.name} (loď) pláva po vode s výkonom ${this.enginePower} kW.`);
    }
}

const v1 = new Sedan("Škoda Octavia", "benzín");
const v2 = new Kombi("Volkswagen Passat", "diesel");
const v3 = new Bicycle("Kellys Spider");
const v4 = new Boat("Katamarán", 40);

const vozidla: Vehicle[] = [v1, v2, v3, v4];

vozidla.forEach((v) => v.move());

console.log(`\nTyp paliva Octavie: ${(v1 as Car).getFuelType()}`);
