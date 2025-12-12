import fs from "fs";

export function loadDB(path: string) {
    if (!fs.existsSync(path)) return [];
    return JSON.parse(fs.readFileSync(path, "utf8"));
}

export function saveDB(path: string, data: any) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
