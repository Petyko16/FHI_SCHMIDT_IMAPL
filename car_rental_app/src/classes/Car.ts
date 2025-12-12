// 🚗 Trieda reprezentuje jedno auto
export class Car {
    constructor(
        public id: number,
        public brand: string,
        public model: string,
        public year: number,
        public pricePerDay: number,
        public isAvailable: boolean = true
    ) {}
}
