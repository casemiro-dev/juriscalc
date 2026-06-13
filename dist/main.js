import { calcularRescisao } from './calculadora.js';
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function obterElemento(id) {
    const el = document.getElementById(id);
    if (!el)
        throw new Error(`Elemento #${id} não encontrado`);
    return el;
}
const DOM = {
    themeToggle: obterElemento('theme-toggle'),
    body: document.body,
    form: obterElemento('form-calculadora'),
    salario: obterElemento('salario'),
    dataAdmissao: obterElemento('data-admissao'),
    dataDemissao: obterElemento('data-demissao'),
    motivo: obterElemento('motivo'),
    btnCalcular: obterElemento('btn-calcular'),
    resultado: obterElemento('resultado'),
    btnImprimir: obterElemento('btn-imprimir'),
    erroGlobal: obterElemento('erro-global'),
    erroSalario: obterElemento('erro-salario'),
    erroAdmissao: obterElemento('erro-admissao'),
    erroDemissao: obterElemento('erro-demissao'),
    rowMultaFGTS: obterElemento('row-multa-fgts'),
};
const CAMPOS_RESULTADO = {
    'res-saldo': 'saldoSalario',
    'res-aviso': 'avisoPrevio',
    'res-13': 'decimoTerceiroProporcional',
    'res-ferias': 'feriasProporcionais',
    'res-terco': 'tercoConstitucional',
    'res-fgts': 'fgts',
    'res-multa-fgts': 'multaFGTS',
    'res-inss': 'inss',
    'res-irrf': 'irrf',
    'res-total-liquido': 'totalLiquido',
};
let valoresFinais = {};
Object.keys(CAMPOS_RESULTADO).forEach((id) => {
    valoresFinais[CAMPOS_RESULTADO[id]] = 0;
});
function limparErros() {
    DOM.erroSalario.textContent = '';
    DOM.erroAdmissao.textContent = '';
    DOM.erroDemissao.textContent = '';
    DOM.erroGlobal.classList.remove('visible');
    DOM.salario.classList.remove('input-error');
    DOM.dataAdmissao.classList.remove('input-error');
    DOM.dataDemissao.classList.remove('input-error');
}
function exibirErroCampo(campo, mensagem) {
    const map = {
        salario: { input: DOM.salario, error: DOM.erroSalario },
        dataAdmissao: { input: DOM.dataAdmissao, error: DOM.erroAdmissao },
        dataDemissao: { input: DOM.dataDemissao, error: DOM.erroDemissao },
    };
    const { input, error } = map[campo];
    input.classList.add('input-error');
    error.textContent = mensagem;
}
function exibirErroGlobal(mensagem) {
    DOM.erroGlobal.querySelector('span').textContent = mensagem;
    DOM.erroGlobal.classList.add('visible');
}
function animarContagem(elemento, valorFinal, duracao = 600) {
    const valorInicial = 0;
    const inicio = performance.now();
    function atualizar(tempo) {
        const progresso = Math.min((tempo - inicio) / duracao, 1);
        const suavizacao = 1 - Math.pow(1 - progresso, 3);
        const valorAtual = valorInicial + (valorFinal - valorInicial) * suavizacao;
        elemento.textContent = formatarMoeda(valorAtual);
        if (progresso < 1) {
            requestAnimationFrame(atualizar);
        }
        else {
            elemento.textContent = formatarMoeda(valorFinal);
        }
    }
    requestAnimationFrame(atualizar);
}
function exibirResultado() {
    DOM.resultado.classList.remove('hidden');
    DOM.rowMultaFGTS.style.display = DOM.motivo.value === 'pedidoDemissao' ? 'none' : '';
    for (const [id, campo] of Object.entries(CAMPOS_RESULTADO)) {
        const el = document.getElementById(id);
        if (el) {
            animarContagem(el, valoresFinais[campo] ?? 0);
        }
    }
}
function iniciarLoading() {
    DOM.btnCalcular.classList.add('loading');
    DOM.btnCalcular.disabled = true;
}
function pararLoading() {
    DOM.btnCalcular.classList.remove('loading');
    DOM.btnCalcular.disabled = false;
}
function aoEnviarFormulario(event) {
    event.preventDefault();
    limparErros();
    iniciarLoading();
    requestAnimationFrame(() => {
        const dados = {
            salarioBase: parseFloat(DOM.salario.value) || 0,
            dataAdmissao: new Date(DOM.dataAdmissao.value + 'T12:00:00'),
            dataDemissao: new Date(DOM.dataDemissao.value + 'T12:00:00'),
            motivoRescisao: DOM.motivo.value,
        };
        const { resultado, erros } = calcularRescisao(dados);
        if (erros.length > 0) {
            erros.forEach((err) => {
                if (err.campo === 'salario') {
                    exibirErroCampo('salario', err.mensagem);
                }
                else if (err.campo === 'dataAdmissao') {
                    exibirErroCampo('dataAdmissao', err.mensagem);
                }
                else if (err.campo === 'dataDemissao') {
                    exibirErroCampo('dataDemissao', err.mensagem);
                }
                else {
                    exibirErroGlobal(err.mensagem);
                }
            });
            DOM.resultado.classList.add('hidden');
            pararLoading();
            return;
        }
        if (resultado) {
            valoresFinais = resultado;
            DOM.resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
            exibirResultado();
        }
        pararLoading();
    });
}
function aoImprimir() {
    window.print();
}
function alternarTema() {
    const ehDark = DOM.body.classList.contains('dark-theme');
    DOM.body.classList.remove('dark-theme', 'light-theme');
    DOM.body.classList.add(ehDark ? 'light-theme' : 'dark-theme');
    localStorage.setItem('juriscalc-theme', ehDark ? 'light' : 'dark');
}
function carregarTema() {
    const temaSalvo = localStorage.getItem('juriscalc-theme');
    if (temaSalvo === 'light') {
        DOM.body.classList.remove('dark-theme');
        DOM.body.classList.add('light-theme');
    }
}
function configurarAnoMinimo() {
    const hoje = new Date();
    const maxDate = hoje.toISOString().split('T')[0];
    DOM.dataAdmissao.setAttribute('max', maxDate);
    DOM.dataDemissao.setAttribute('max', maxDate);
}
function inicializar() {
    carregarTema();
    configurarAnoMinimo();
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    DOM.themeToggle.addEventListener('click', alternarTema);
    DOM.form.addEventListener('submit', aoEnviarFormulario);
    DOM.btnImprimir.addEventListener('click', aoImprimir);
    DOM.salario.addEventListener('input', () => {
        DOM.salario.classList.remove('input-error');
        DOM.erroSalario.textContent = '';
    });
    DOM.dataAdmissao.addEventListener('change', () => {
        DOM.dataAdmissao.classList.remove('input-error');
        DOM.erroAdmissao.textContent = '';
    });
    DOM.dataDemissao.addEventListener('change', () => {
        DOM.dataDemissao.classList.remove('input-error');
        DOM.erroDemissao.textContent = '';
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
}
else {
    inicializar();
}
