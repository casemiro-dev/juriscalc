# MEMÓRIA DE ALTERAÇÕES — JurisCalc

## Sobre

Este documento registra todas as alterações, decisões de design e melhorias
realizadas no projeto **JurisCalc — Calculadora de Verbas Rescisórias (CLT)**.

---

## 1. Conversão JavaScript → TypeScript

### Alterações

| Arquivo | Ação |
|---------|------|
| `src/types.js` | **Removido** — arquivo vazio e morto |
| `src/calculadora.js` | **Convertido** → `calculadora.ts` |
| `src/main.js` | **Convertido** → `main.ts` |
| `tsconfig.json` | **Criado** — configuração strict, ES2020, DOM lib |

### Decisões

- `tsconfig.json` usa `strict: true` para máxima segurança de tipos
- `moduleResolution: "bundler"` compatível com ES modules nativos
- `noUnusedLocals` e `noUnusedParameters` ativos para código limpo
- Caminhos de import mantêm `.js` para compatibilidade com módulos ES nativos

---

## 2. Tipos e Interfaces

**Arquivo:** `src/types.ts`

| Tipo | Descrição |
|------|-----------|
| `DadosRescisao` | Input do formulário (salário, datas, motivo) |
| `ResultadoRescisao` | Output completo do cálculo (11 campos) |
| `ErroValidacao` | Erro com campo e mensagem |
| `MotivoRescisao` | Union type: `'semJustaCausa' \| 'pedidoDemissao'` |

### Campos de `ResultadoRescisao`

- `saldoSalario` — dias trabalhados no último mês
- `avisoPrevio` — 30 dias + 3 por ano trabalhado (máx. 90)
- `decimoTerceiroProporcional` — 13º proporcional aos meses trabalhados
- `feriasProporcionais` — férias proporcionais
- `tercoConstitucional` — 1/3 sobre férias
- `fgts` — 8% sobre verbas salariais
- `multaFGTS` — 40% do FGTS (apenas sem justa causa)
- `inss` — INSS progressivo por faixas
- `irrf` — IRRF com dedução por dependentes
- `totalBruto` — soma de verbas salariais
- `totalLiquido` — total bruto + multa FGTS - descontos

---

## 3. Lógica de Cálculo Refatorada

### `src/calculations/fgts.ts`
- `calcularFGTS()` — 8% sobre salário bruto por mês trabalhado
- `calcularMultaFGTS()` — 40% apenas para `semJustaCausa`

### `src/calculations/inss.ts`
- Tabela progressiva 2025 com 4 faixas:
  - 7,5% até R$ 1.412,00
  - 9% até R$ 2.666,68
  - 12% até R$ 4.000,03
  - 14% até R$ 7.786,02

### `src/calculations/irrf.ts`
- Tabela progressiva com 5 faixas e deduções
- Dedução de R$ 189,59 por dependente
- Isenção até R$ 2.259,20

### `src/calculadora.ts`
- `calcularMesesProporcionais()` corrigida para empregos > 1 ano
- `calcularAvisoPrevio()`: 30 dias + 3 dias por ano (máx. 60 adicionais)
- `validarDados()`: salário > 0, datas válidas, demissão > admissão, sem data futura
- Retorno com `{ resultado, erros }` — pattern de resultado seguro

### Bugs Corrigidos

| Bug | Arquivo | Correção |
|-----|---------|----------|
| `meses % 12` truncava tempo > 1 ano | `calculadora.ts` | `Math.min(meses, 12)` |
| Aviso Prévio não calculado | `calculadora.ts` | Função `calcularAvisoPrevio()` |
| FGTS + Multa ausentes | `calculadora.ts` | Import e integração |
| INSS/IRRF ausentes | `calculadora.ts` | Import e integração |
| Datas invertidas permitiam cálculo | `calculadora.ts` | `validarDados()` retorna erro |
| `parseFloat` sem fallback | `main.ts` | `parseFloat || 0` |
| Tema não persistia | `main.ts` | `localStorage` |
| `lucide.createIcons()` sem verificação | `main.ts` | Guard `typeof lucide` |
| `types.js` vazio | — | Removido |

---

## 4. Design System (UI/UX Pro Max)

### Referência Utilizada

Baseado no `ui-ux-pro-max-skill-main`:

| Referência | Aplicação |
|------------|-----------|
| **Row #40 — Legal Services** (colors.csv) | Paleta de cores |
| **Row #29 — Legal Professional** (typography.csv) | Par tipográfico |
| **Style #26 — Trust & Authority** (styles.csv) | Estilo visual |
| **Pattern #23 — Minimal & Direct** (landing.csv) | Layout da página |

### Paleta de Cores

```css
--primary:  #1E3A8A  (Navy jurídico)
--accent:   #B45309  (Ouro autoridade)
--bg-dark:  #0F172A  (Slate 900)
--bg-light: #F8FAFC  (Slate 50)
```

### Tipografia

- **Headings:** EB Garamond (serifada clássica — autoridade, formalidade)
- **Body/UI:** Inter (sans-serif limpa — legibilidade, modernidade)

### Design Tokens

| Token | Valor |
|-------|-------|
| `--radius-md` | 10px |
| `--radius-lg` | 16px |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.08)` |
| `--transition-base` | 250ms ease |

### Melhorias de UI

- ❌ **Removido** `backdrop-filter: blur()` (glassmorphism) — substituído por bordas sólidas + sombras elegantes
- ❌ **Removidos** emojis (⚖️, 🔒) — substituídos por ícones Lucide SVG (`scale`, `shield`, `calculator`, `printer`, `alert-circle`)
- 🔄 **Toggle tema**: redesign de círculo para cápsula com thumb deslizante (iOS-style toggle switch)
- 🔄 **Select dropdown**: adicionado `select option { background: var(--bg-card); color: var(--text-primary) }` para garantir contraste no dark mode
- ✅ Botão com estado `loading` (spinner + disabled)
- ✅ Validação inline com mensagens por campo
- ✅ Seção de resultado com scroll suave (`scrollIntoView`)
- ✅ Animações de contagem (`requestAnimationFrame` com easing cúbico)
- ✅ Botão de impressão (`window.print()`)
- ✅ `@media print` com estilo limpo para PDF
- ✅ `prefers-reduced-motion` respeitado (todas as animações desligadas)
- ✅ `aria-live="polite"` nos resultados para leitores de tela
- ✅ `focus-visible` com outline 3px dourado
- ✅ Scrollbar customizada

---

## 5. Estrutura de Arquivos Final

```
juriscalc/
├── .github/workflows/deploy.yml  ← CI/CD GitHub Actions
├── .gitignore
├── index.html                     ← Referencia ./dist/main.js
├── tsconfig.json                  ← outDir: ./dist
├── package.json
├── MEMORIA.md
├── src/                           ← Código fonte TypeScript + CSS
│   ├── main.ts
│   ├── calculadora.ts
│   ├── types.ts
│   ├── style.css
│   └── calculations/
│       ├── fgts.ts
│       ├── inss.ts
│       └── irrf.ts
└── dist/                          ← Compilado (runtime)
    ├── main.js
    ├── calculadora.js
    └── calculations/
        ├── fgts.js
        ├── inss.js
        └── irrf.js
```

---

## 6. Funcionalidades Adicionadas

- [x] Aviso Prévio (30 dias + 3/ano)
- [x] FGTS (8%)
- [x] Multa FGTS (40% — apenas sem justa causa)
- [x] INSS progressivo (4 faixas)
- [x] IRRF com dedução por dependente
- [x] Validação de formulário com mensagens inline
- [x] Tema claro/escuro persistente (localStorage)
- [x] Animação de contagem nos valores
- [x] Botão de impressão/PDF
- [x] Loading spinner ao calcular
- [x] Acessibilidade (ARIA, focus-visible, reduced-motion)
- [x] Estilo de impressão otimizado

---

## 7. Melhorias Futuras Possíveis

- [ ] Cálculo de **horas extras** e **adicional noturno**
- [ ] Cálculo de **comissões** e **gratificações**
- [ ] Suporte a **dependentes** para IRRF (input no formulário)
- [ ] **Pluralidade de vínculos** simultâneos
- [ ] **Histórico de cálculos** (localStorage)
- [ ] **Exportar CSV/JSON** dos resultados
- [ ] **Tema system preference** (prefers-color-scheme)
- [ ] Testes unitários (Vitest)
- [ ] Service Worker para PWA (instalável)
- [ ] i18n (inglês/espanhol)

---

## 8. Configuração Git e GitHub (13/06/2026)

### Realizado

- `git init` no diretório do projeto
- Repositório `casemiro-dev/juriscalc` criado no GitHub
- Git configurado com user `casemir-dev` / `franciscorpg9@gmail.com`
- `git add .` + commit `be65f7e`: `"feat: JurisCalc v2 — TypeScript + design system jurídico"` (20 arquivos, 2161 inserções)
- Branch renomeada de `master` para `main`
- Remote `origin` vinculado a `https://github.com/casemiro-dev/juriscalc.git`
- `git push -u origin main` realizado com sucesso

### Pendente

- Ativar GitHub Pages em **Settings > Pages > Source: "GitHub Actions"**
- Site publicado em `https://casemiro-dev.github.io/juriscalc`

---

## 9. Observações Técnicas

- O projeto usa **ES modules nativos** (não requer bundler)
- TypeScript é compilado via `tsc` ou consumido diretamente com `ts-node`
- O arquivo `index.html` referencia `./public/main.js` (compilado TypeScript)
- O diretório `src/` contém apenas `.ts` e `.css` — sem `.js` poluído
- O diretório `public/` contém o runtime compilado e é commitado (necessário para GitHub Pages / Vercel)
- `src/**/*.js` está no `.gitignore` para evitar poluição
- `.github/workflows/deploy.yml` faz typecheck + build + deploy para GitHub Pages
- Ícones Lucide carregados via CDN com `defer`
- Zero dependências de runtime (exceto Lucide CDN)

---

## 10. Migração para Vercel (13/06/2026)

### Problema

Ao tentar fazer deploy no Vercel, o build falhou com o erro:

> Nenhum diretório de saída chamado "public" foi encontrado após a conclusão da compilação.
> Configure o diretório de saída nas configurações do seu projeto. Como alternativa, configure vercel.json#outputDirectory.

O projeto compilava o TypeScript para `dist/`, mas o Vercel espera o diretório `public/` por padrão.

### Solução — Renomear `dist/` → `public/`

| Arquivo | Alteração |
|---------|-----------|
| `tsconfig.json` | `"outDir": "./dist"` → `"./public"` |
| `index.html` | `./dist/main.js` → `./public/main.js` |
| `.gitignore` | `dist/*.js.map` → `public/*.js.map` |

Commit: `fa8d4e7` — `"chore: rename dist -> public for Vercel deploy"`

### Erro 404 — Implantação Não Encontrada

Após reconfigurar para `public/`, o Vercel retornou **404 NOT_FOUND**:

> Esta implantação não foi encontrada.

**Causa:** O `index.html` está na **raiz do projeto**, mas `outputDirectory: public` faz o Vercel servir apenas arquivos dentro de `public/`. O HTML nunca era encontrado.

**Solução:** Criar `vercel.json` com `outputDirectory: "."`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "."
}
```

Isso mantém o build em `public/`, mas o Vercel serve os arquivos a partir da raiz do projeto.

Commit: `ab45bd8` — `"chore: add vercel.json with outputDirectory ."`

### Comandos Executados

```bash
# Remover diretório antigo e recompilar
Remove-Item -LiteralPath "dist" -Recurse -Force
npm run build                                          # Compila para public/

# Versionamento
git add -A
git commit -m "chore: rename dist -> public for Vercel deploy"
git push

# Após 404 — criar vercel.json
git add vercel.json
git commit -m "chore: add vercel.json with outputDirectory ."
git push
```
