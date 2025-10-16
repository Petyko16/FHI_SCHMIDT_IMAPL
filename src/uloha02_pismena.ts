function odstranDiakritiku(s: string) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function spocitajPismena(veta: string) {
    const mapa = new Map<string, number>();
    const text = odstranDiakritiku(veta.toLowerCase());
    for (const znak of text) {
        if (/[a-z]/.test(znak))
            mapa.set(znak, (mapa.get(znak) ?? 0) + 1);
    }

    console.log('[02] Výsledok:');
    for (const [znak, pocet] of mapa.entries())
        console.log(`   ${znak} ${pocet}`);
}

spocitajPismena('Alabama');
