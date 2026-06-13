export function calcularFGTS(salarioBruto: number, mesesTrabalhados: number): number {
  const aliquota = 0.08;
  const fgtsMensal = salarioBruto * aliquota;
  return arredondar(fgtsMensal * Math.max(1, mesesTrabalhados));
}

export function calcularMultaFGTS(
  salarioBruto: number,
  mesesTrabalhados: number,
  motivoRescisao: string
): number {
  if (motivoRescisao !== 'semJustaCausa') return 0;
  const aliquotaMulta = 0.40;
  const fgtsTotal = calcularFGTS(salarioBruto, mesesTrabalhados);
  return arredondar(fgtsTotal * aliquotaMulta);
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}
