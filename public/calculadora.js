import { calcularFGTS, calcularMultaFGTS } from './calculations/fgts.js';
import { calcularINSS } from './calculations/inss.js';
import { calcularIRRF } from './calculations/irrf.js';
function arredondar(valor) {
    return Math.round(valor * 100) / 100;
}
function calcularMesesProporcionais(inicio, fim) {
    let meses = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
    const diaFim = fim.getDate();
    const diaInicio = inicio.getDate();
    if (diaFim >= diaInicio) {
        meses++;
    }
    return Math.max(0, Math.min(meses, 12));
}
function calcularAvisoPrevio(salarioBase, dataAdmissao, dataDemissao) {
    const anosTrabalhados = Math.floor((dataDemissao.getTime() - dataAdmissao.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const diasAviso = 30 + Math.min(anosTrabalhados * 3, 60);
    const valorDiario = salarioBase / 30;
    return arredondar(valorDiario * diasAviso);
}
function validarDados(dados) {
    const erros = [];
    if (!dados.salarioBase || dados.salarioBase <= 0) {
        erros.push({ campo: 'salario', mensagem: 'O salário deve ser maior que zero.' });
    }
    if (isNaN(dados.dataAdmissao.getTime())) {
        erros.push({ campo: 'dataAdmissao', mensagem: 'Data de admissão inválida.' });
    }
    if (isNaN(dados.dataDemissao.getTime())) {
        erros.push({ campo: 'dataDemissao', mensagem: 'Data de demissão inválida.' });
    }
    if (dados.dataDemissao <= dados.dataAdmissao) {
        erros.push({ campo: 'dataDemissao', mensagem: 'A data de demissão deve ser posterior à data de admissão.' });
    }
    if (dados.dataDemissao > new Date()) {
        erros.push({ campo: 'dataDemissao', mensagem: 'A data de demissão não pode ser futura.' });
    }
    return erros;
}
export function calcularRescisao(dados) {
    const erros = validarDados(dados);
    if (erros.length > 0) {
        return { resultado: null, erros };
    }
    const { salarioBase, dataAdmissao, dataDemissao, motivoRescisao } = dados;
    const valorDiario = salarioBase / 30;
    const diasTrabalhadosUltimoMes = dataDemissao.getDate();
    const saldoSalario = arredondar(valorDiario * diasTrabalhadosUltimoMes);
    const mesesTrabalhados = calcularMesesProporcionais(dataAdmissao, dataDemissao);
    const decimoTerceiroProporcional = arredondar((salarioBase / 12) * mesesTrabalhados);
    const feriasProporcionais = arredondar((salarioBase / 12) * mesesTrabalhados);
    const tercoConstitucional = arredondar(feriasProporcionais / 3);
    const avisoPrevio = calcularAvisoPrevio(salarioBase, dataAdmissao, dataDemissao);
    const baseFGTS = saldoSalario + decimoTerceiroProporcional + avisoPrevio;
    const fgts = calcularFGTS(baseFGTS / (mesesTrabalhados || 1), mesesTrabalhados);
    const multaFGTS = calcularMultaFGTS(baseFGTS / (mesesTrabalhados || 1), mesesTrabalhados, motivoRescisao);
    const totalBruto = saldoSalario + decimoTerceiroProporcional + feriasProporcionais + tercoConstitucional + avisoPrevio;
    const inss = calcularINSS(saldoSalario);
    const irrf = calcularIRRF(totalBruto - inss, inss, 0);
    const totalLiquido = totalBruto + multaFGTS - inss - irrf;
    const resultado = {
        saldoSalario: arredondar(saldoSalario),
        avisoPrevio: arredondar(avisoPrevio),
        decimoTerceiroProporcional: arredondar(decimoTerceiroProporcional),
        feriasProporcionais: arredondar(feriasProporcionais),
        tercoConstitucional: arredondar(tercoConstitucional),
        fgts: arredondar(fgts),
        multaFGTS: arredondar(multaFGTS),
        inss: arredondar(inss),
        irrf: arredondar(irrf),
        totalBruto: arredondar(totalBruto),
        totalLiquido: arredondar(totalLiquido),
    };
    return { resultado, erros: [] };
}
