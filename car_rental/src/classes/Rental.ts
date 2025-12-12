export class Rental {
    constructor(
        public id: number,
        public carId: number,
        public customerId: number,
        public days: number
    ) {}
}
