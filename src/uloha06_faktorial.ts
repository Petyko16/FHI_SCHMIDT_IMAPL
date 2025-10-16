function faktorial(n: number): string {
    if (n <= 0 || !Number.isInteger(n))
        return 'Zadaj celé číslo > 0';

    let sucin = 1;
    const casti: number[] = [];
    for (let i = n; i >= 1; i--) {
        sucin *= i;
        casti.push(i);
    }

    return `${n}! = ${casti.join('.')} = ${sucin}`;
}

console.log('[06]', faktorial(5));
console.log('[06]', faktorial(0));
