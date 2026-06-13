import { calcularRescisao } from './calculadora.js';
import type { DadosRescisao, MotivoRescisao } from './types.js';

declare const lucide: {
  createIcons: () => void;
};

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function obterElemento<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado`);
  return el as T;
}

type CampoFormulario = 'salario' | 'dataAdmissao' | 'dataDemissao';

const DOM = {
  themeToggle: obterElemento<HTMLButtonElement>('theme-toggle'),
  body: document.body,
  form: obterElemento<HTMLFormElement>('form-calculadora'),
  salario: obterElemento<HTMLInputElement>('salario'),
  dataAdmissao: obterElemento<HTMLInputElement>('data-admissao'),
  dataDemissao: obterElemento<HTMLInputElement>('data-demissao'),
  motivo: obterElemento<HTMLSelectElement>('motivo'),
  btnCalcular: obterElemento<HTMLButtonElement>('btn-calcular'),
  resultado: obterElemento<HTMLElement>('resultado'),
  btnImprimir: obterElemento<HTMLButtonElement>('btn-imprimir'),
  erroGlobal: obterElemento<HTMLDivElement>('erro-global'),
  erroSalario: obterElemento<HTMLSpanElement>('erro-salario'),
  erroAdmissao: obterElemento<HTMLSpanElement>('erro-admissao'),
  erroDemissao: obterElemento<HTMLSpanElement>('erro-demissao'),
  rowMultaFGTS: obterElemento<HTMLTableRowElement>('row-multa-fgts'),
};

const CAMPOS_RESULTADO: Record<string, keyof typeof valoresFinais> = {
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

let valoresFinais: Record<string, number> = {};

Object.keys(CAMPOS_RESULTADO).forEach((id) => {
  valoresFinais[CAMPOS_RESULTADO[id]] = 0;
});

function limparErros(): void {
  DOM.erroSalario.textContent = '';
  DOM.erroAdmissao.textContent = '';
  DOM.erroDemissao.textContent = '';
  DOM.erroGlobal.classList.remove('visible');
  DOM.salario.classList.remove('input-error');
  DOM.dataAdmissao.classList.remove('input-error');
  DOM.dataDemissao.classList.remove('input-error');
}

function exibirErroCampo(campo: CampoFormulario, mensagem: string): void {
  const map: Record<CampoFormulario, { input: HTMLInputElement; error: HTMLSpanElement }> = {
    salario: { input: DOM.salario, error: DOM.erroSalario },
    dataAdmissao: { input: DOM.dataAdmissao, error: DOM.erroAdmissao },
    dataDemissao: { input: DOM.dataDemissao, error: DOM.erroDemissao },
  };
  const { input, error } = map[campo];
  input.classList.add('input-error');
  error.textContent = mensagem;
}

function exibirErroGlobal(mensagem: string): void {
  DOM.erroGlobal.querySelector('span')!.textContent = mensagem;
  DOM.erroGlobal.classList.add('visible');
}

function animarContagem(
  elemento: HTMLElement,
  valorFinal: number,
  duracao: number = 600
): void {
  const valorInicial = 0;
  const inicio = performance.now();

  function atualizar(tempo: number): void {
    const progresso = Math.min((tempo - inicio) / duracao, 1);
    const suavizacao = 1 - Math.pow(1 - progresso, 3);
    const valorAtual = valorInicial + (valorFinal - valorInicial) * suavizacao;
    elemento.textContent = formatarMoeda(valorAtual);

    if (progresso < 1) {
      requestAnimationFrame(atualizar);
    } else {
      elemento.textContent = formatarMoeda(valorFinal);
    }
  }

  requestAnimationFrame(atualizar);
}

function exibirResultado(): void {
  DOM.resultado.classList.remove('hidden');

  DOM.rowMultaFGTS.style.display = DOM.motivo.value === 'pedidoDemissao' ? 'none' : '';

  for (const [id, campo] of Object.entries(CAMPOS_RESULTADO)) {
    const el = document.getElementById(id);
    if (el) {
      animarContagem(el, valoresFinais[campo] ?? 0);
    }
  }
}

function iniciarLoading(): void {
  DOM.btnCalcular.classList.add('loading');
  DOM.btnCalcular.disabled = true;
}

function pararLoading(): void {
  DOM.btnCalcular.classList.remove('loading');
  DOM.btnCalcular.disabled = false;
}

function aoEnviarFormulario(event: SubmitEvent): void {
  event.preventDefault();
  limparErros();
  iniciarLoading();

  requestAnimationFrame(() => {
    const dados: DadosRescisao = {
      salarioBase: parseFloat(DOM.salario.value) || 0,
      dataAdmissao: new Date(DOM.dataAdmissao.value + 'T12:00:00'),
      dataDemissao: new Date(DOM.dataDemissao.value + 'T12:00:00'),
      motivoRescisao: DOM.motivo.value as MotivoRescisao,
    };

    const { resultado, erros } = calcularRescisao(dados);

    if (erros.length > 0) {
      erros.forEach((err) => {
        if (err.campo === 'salario') {
          exibirErroCampo('salario', err.mensagem);
        } else if (err.campo === 'dataAdmissao') {
          exibirErroCampo('dataAdmissao', err.mensagem);
        } else if (err.campo === 'dataDemissao') {
          exibirErroCampo('dataDemissao', err.mensagem);
        } else {
          exibirErroGlobal(err.mensagem);
        }
      });
      DOM.resultado.classList.add('hidden');
      pararLoading();
      return;
    }

    if (resultado) {
      valoresFinais = resultado as unknown as Record<string, number>;
      DOM.resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
      exibirResultado();
    }

    pararLoading();
  });
}

function aoImprimir(): void {
  window.print();
}

function alternarTema(): void {
  const ehDark = DOM.body.classList.contains('dark-theme');

  DOM.body.classList.remove('dark-theme', 'light-theme');
  DOM.body.classList.add(ehDark ? 'light-theme' : 'dark-theme');

  localStorage.setItem('juriscalc-theme', ehDark ? 'light' : 'dark');
}

function carregarTema(): void {
  const temaSalvo = localStorage.getItem('juriscalc-theme');
  if (temaSalvo === 'light') {
    DOM.body.classList.remove('dark-theme');
    DOM.body.classList.add('light-theme');
  }
}

function configurarAnoMinimo(): void {
  const hoje = new Date();
  const maxDate = hoje.toISOString().split('T')[0];
  DOM.dataAdmissao.setAttribute('max', maxDate);
  DOM.dataDemissao.setAttribute('max', maxDate);
}

function inicializar(): void {
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
} else {
  inicializar();
}
