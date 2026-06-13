export type MotivoRescisao = 'semJustaCausa' | 'pedidoDemissao';

export interface DadosRescisao {
  salarioBase: number;
  dataAdmissao: Date;
  dataDemissao: Date;
  motivoRescisao: MotivoRescisao;
}

export interface ResultadoRescisao {
  saldoSalario: number;
  avisoPrevio: number;
  decimoTerceiroProporcional: number;
  feriasProporcionais: number;
  tercoConstitucional: number;
  fgts: number;
  multaFGTS: number;
  inss: number;
  irrf: number;
  totalBruto: number;
  totalLiquido: number;
}

export interface ErroValidacao {
  campo: string;
  mensagem: string;
}
