function vycistiRetazec(s: string) {
    return s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
}

function jePalindrom(veta: string): boolean {
    const cisty = vycistiRetazec(veta);
    return cisty === [...cisty].reverse().join('');
}

const testy = [
    'abba',
    'madam',
    'kobyla ma maly bok',
    'jelenovi pivo nelej',
    'typescript'
];

for (const t of testy)
    console.log(`[03] "${t}" → ${jePalindrom(t) ? 'palindróm' : 'nie'}`);
