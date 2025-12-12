export class Rental {
    constructor(
        public id: number,
        public carId: number,
        public customerId: number,
        public startDate: string,     // formátum: DD.MM.YYYY
        public endDate: string,       // formátum: DD.MM.YYYY
        public totalDays: number,
        public totalPrice: number,
        public status: string         // "Aktív", "Ukončený", "Plánovaný"
    ) {}
}
