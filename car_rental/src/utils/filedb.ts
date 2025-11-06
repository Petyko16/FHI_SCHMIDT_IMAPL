import * as fs from "fs";
import * as path from "path";

const DB_DIR = path.resolve(__dirname, "../db");

function ensureDir() {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

function filePath(name: "cars" | "customers" | "rentals") {
    ensureDir();
    return path.join(DB_DIR, `${name}.json`);
}

export function readList<T>(name: "cars" | "customers" | "rentals"): T[] {
    const p = filePath(name);
    if (!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p, "utf-8") || "[]";
    try { return JSON.parse(raw) as T[]; } catch { return []; }
}

export function writeList<T>(name: "cars" | "customers" | "rentals", data: T[]): void {
    const p = filePath(name);
    fs.writeFileSync(p, JSON.stringify(data, null, 2), "utf-8");
}
