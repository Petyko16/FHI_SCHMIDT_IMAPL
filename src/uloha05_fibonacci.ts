function fibonacci(pocet: number): number[] {
    if (!Number.isInteger(pocet) || pocet < 1) {
        throw new Error('pocet musí byť celé číslo ≥ 1');
    }

    const vysledok: number[] = [];
    let a = 0; // F0
    let b = 1; // F1

    for (let i = 0; i < pocet; i++) {
        vysledok.push(a);
        const dalsi = a + b;
        a = b;
        b = dalsi;
    }
    return vysledok;
}

// DEMO (vstup 11)
console.log('[05]', fibonacci(11).join(', '));
