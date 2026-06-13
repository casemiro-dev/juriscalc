export function calcularFGTS(salarioBruto, mesesTrabalhados) {
    const aliquota = 0.08;
    const fgtsMensal = salarioBruto * aliquota;
    return arredondar(fgtsMensal * Math.max(1, mesesTrabalhados));
}
export function calcularMultaFGTS(salarioBruto, mesesTrabalhados, motivoRescisao) {
    if (motivoRescisao !== 'semJustaCausa')
        return 0;
    const aliquotaMulta = 0.40;
    const fgtsTotal = calcularFGTS(salarioBruto, mesesTrabalhados);
    return arredondar(fgtsTotal * aliquotaMulta);
}
function arredondar(valor) {
    return Math.round(valor * 100) / 100;
}
