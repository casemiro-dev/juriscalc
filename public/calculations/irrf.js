const FAIXAS_IRRF = [
    { limite: 2259.20, aliquota: 0, deducao: 0 },
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896.00 },
];
const VALOR_DEPENDENTE = 189.59;
export function calcularIRRF(salarioBruto, descontoINSS, numeroDependentes = 0) {
    if (salarioBruto <= 0)
        return 0;
    const baseCalculo = salarioBruto - descontoINSS - (numeroDependentes * VALOR_DEPENDENTE);
    if (baseCalculo <= FAIXAS_IRRF[0].limite)
        return 0;
    for (const faixa of FAIXAS_IRRF) {
        if (baseCalculo <= faixa.limite) {
            const irrf = (baseCalculo * faixa.aliquota) - faixa.deducao;
            return Math.max(0, Math.round(irrf * 100) / 100);
        }
    }
    const irrf = (baseCalculo * FAIXAS_IRRF[4].aliquota) - FAIXAS_IRRF[4].deducao;
    return Math.max(0, Math.round(irrf * 100) / 100);
}
