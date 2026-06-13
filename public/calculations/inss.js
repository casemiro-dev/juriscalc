const FAIXAS_INSS = [
    { limite: 1412.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 7786.02, aliquota: 0.14 },
];
const TETO_INSS = 7786.02;
export function calcularINSS(salarioBruto) {
    if (salarioBruto <= 0)
        return 0;
    let inss = 0;
    let salarioRestante = Math.min(salarioBruto, TETO_INSS);
    let faixaAnterior = 0;
    for (const faixa of FAIXAS_INSS) {
        if (salarioRestante <= 0)
            break;
        const baseFaixa = Math.min(salarioRestante, faixa.limite - faixaAnterior);
        inss += baseFaixa * faixa.aliquota;
        salarioRestante -= baseFaixa;
        faixaAnterior = faixa.limite;
    }
    if (salarioRestante > 0) {
        inss += salarioRestante * 0.14;
    }
    return Math.round(inss * 100) / 100;
}
