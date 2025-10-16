function formatMena(suma: number): string {
    return suma.toFixed(2).replace('.', ',') + ' €';
}

function cenaTaxi(km: number, cakanieMin: number, znecistene: boolean): string {
    const zaklad = 1.50;
    const nad5 = Math.max(0, km - 5) * 0.75;
    const cakanie = (cakanieMin * 10) / 60;
    const znecistenie = znecistene ? 20 : 0;
    const celkom = zaklad + nad5 + cakanie + znecistenie;
    return formatMena(celkom);
}

console.log('[07]', cenaTaxi(15, 5, false), '(očakávané: 9,83 €)');
