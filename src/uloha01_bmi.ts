type KategoriaBMI = 'podváha' | 'normálna hmotnosť' | 'nadváha' | 'obezita';

function vypocitajBMI(hmotnostKg: number, vyskaCm: number) {
    const vyskaM = vyskaCm / 100;
    const bmi = hmotnostKg / (vyskaM * vyskaM);

    let kategoria: KategoriaBMI;
    if (bmi <= 19) kategoria = 'podváha';
    else if (bmi <= 25) kategoria = 'normálna hmotnosť';
    else if (bmi <= 30) kategoria = 'nadváha';
    else kategoria = 'obezita';

    const minNormal = 19 * vyskaM * vyskaM;
    const maxNormal = 25 * vyskaM * vyskaM;

    let odporucanie = 'OK';
    if (hmotnostKg < minNormal)
        odporucanie = `priber ${ (minNormal - hmotnostKg).toFixed(2) } kg`;
    else if (hmotnostKg > maxNormal)
        odporucanie = `schudni ${ (hmotnostKg - maxNormal).toFixed(2) } kg`;

    console.log(`[01] BMI=${bmi.toFixed(2)} → ${kategoria}, ${odporucanie}`);
}

vypocitajBMI(140, 185);
