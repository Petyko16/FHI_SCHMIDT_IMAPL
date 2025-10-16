const MAPA: Record<string, string> = {
    B: '1', A: '2', L: '3', T: '4', I: '5', M: '6',
    O: '7', R: '8', E: '9', S: '10', K: '11', Y: '12'
};

function odstranDiakritiku2(s: string) {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function baltimoresky(veta: string): string {
    const cista = odstranDiakritiku2(veta).toUpperCase();
    let vysledok = '';
    for (const znak of cista) {
        if (MAPA[znak]) vysledok += MAPA[znak];
        else vysledok += znak;
    }
    return vysledok;
}

const vstup = 'To nemyslite vážne!';
console.log('[08]', baltimoresky(vstup), '(očakávané: 47 N9612103549 V2ZN9!)');
