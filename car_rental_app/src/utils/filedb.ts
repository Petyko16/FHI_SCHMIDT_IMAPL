import fs from "fs";

// 📥 Funkcia na načítanie JSON databázy
export function loadDB<T>(path: string): T[] {
    try {
        // Ak súbor neexistuje → vrátime prázdne pole
        if (!fs.existsSync(path)) return [];

        const obsah = fs.readFileSync(path, "utf8");

        // Ak je súbor prázdny → tiež prázdne pole
        if (!obsah.trim()) return [];

        // JSON → objekt
        return JSON.parse(obsah) as T[];
    } catch (err) {
        console.error("[DB] Chyba pri načítaní súboru:", path, err);
        return [];
    }
}

// 💾 Uloženie dát do JSON súboru
export function saveDB(path: string, data: any[]): void {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
}
