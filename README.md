<p align="center">
  <img src="https://img.shields.io/badge/status-estável-22C55E?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/typescript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/license-MIT-F59E0B?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/privacidade-100%25_local-34D399?style=flat-square" alt="Privacidade">
</p>

<br>

<p align="center">
  <a href="#funcionalidades">Funcionalidades</a> •
  <a href="#stack">Stack</a> •
  <a href="#design-system">Design System</a> •
  <a href="#como-usar">Como Usar</a> •
  <a href="#desenvolvimento">Desenvolvimento</a> •
  <a href="#licença">Licença</a>
</p>

<br>

<div align="center">
  <img src="https://img.icons8.com/fluency/96/000000/balance-scale.png" alt="JurisCalc" width="64">
  <h1 align="center">⚖️ JurisCalc</h1>
  <p align="center">
    <strong>Calculadora de Verbas Rescisórias CLT</strong><br>
    Processamento 100% local · Zero servidores · Privacidade absoluta
  </p>
</div>

<br>

<p align="center">
  <i>Seus dados não saem do seu computador. Nada é salvo, nada é enviado.</i>
</p>

<br>

---

## ✦ Funcionalidades

<table>
  <thead>
    <tr>
      <th align="left">Verba</th>
      <th align="left">Descrição</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>Saldo de Salário</code></td>
      <td>Dias trabalhados no mês da rescisão</td>
    </tr>
    <tr>
      <td><code>Aviso Prévio</code></td>
      <td>30 dias + 3 dias por ano trabalhado (até 90 dias)</td>
    </tr>
    <tr>
      <td><code>13º Salário Proporcional</code></td>
      <td>Proporção sobre meses trabalhados no ano</td>
    </tr>
    <tr>
      <td><code>Férias Proporcionais + 1/3</code></td>
      <td>Férias proporcionais acrescidas do terço constitucional</td>
    </tr>
    <tr>
      <td><code>FGTS (8%)</code></td>
      <td>Fundo de Garantia sobre verbas salariais</td>
    </tr>
    <tr>
      <td><code>Multa FGTS (40%)</code></td>
      <td>Aplicada apenas em demissão sem justa causa</td>
    </tr>
    <tr>
      <td><code>INSS</code></td>
      <td>Desconto previdenciário — tabela progressiva 2025</td>
    </tr>
    <tr>
      <td><code>IRRF</code></td>
      <td>Imposto de Renda retido na fonte — tabela progressiva</td>
    </tr>
  </tbody>
</table>

<br>

### ✨ Diferenciais

- **🌗 Tema claro/escuro** com persistência em `localStorage`
- **📄 Impressão / exportar PDF** com layout otimizado
- **📱 Responsivo** — funciona em qualquer dispositivo
- **♿ Acessível** — `aria-live`, `focus-visible`, `prefers-reduced-motion`
- **⚡ Sem dependências de runtime** — apenas HTML + CSS + JS
- **🔒 100% local** — zero dados trafegam pela rede

<br>

---

## ✦ Stack

<div align="center">

| Camada | Tecnologia | Propósito |
|--------|-----------|-----------|
| **Runtime** | <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"> | Tipagem segura e código robusto |
| **UI** | <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"> | Estrutura e design system |
| **Ícones** | <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide"> | Ícones SVG leves e consistentes |
| **Build** | <img src="https://img.shields.io/badge/tsc-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="tsc"> | Compilador TypeScript oficial |
| **CI/CD** | <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions"> | Typecheck + build + deploy automático |

</div>

<br>

---

## ✦ Design System

<p align="center">
  <i>Baseado no UI/UX Pro Max Skill — adaptado para o segmento jurídico</i>
</p>

<br>

### Paleta

<table>
  <tr>
    <td><img src="https://placehold.co/24/1E3A8A/1E3A8A" alt="Navy"> <code>#1E3A8A</code></td>
    <td><b>Primary</b> — azul navy, transmite autoridade e confiança</td>
  </tr>
  <tr>
    <td><img src="https://placehold.co/24/B45309/B45309" alt="Gold"> <code>#B45309</code></td>
    <td><b>Accent</b> — dourado sóbrio, remete à excelência jurídica</td>
  </tr>
  <tr>
    <td><img src="https://placehold.co/24/0F172A/0F172A" alt="Dark"> <code>#0F172A</code></td>
    <td><b>Background Dark</b> — slate 900, fundo profissional</td>
  </tr>
  <tr>
    <td><img src="https://placehold.co/24/F8FAFC/F8FAFC" alt="Light"> <code>#F8FAFC</code></td>
    <td><b>Background Light</b> — slate 50, base limpa</td>
  </tr>
</table>

### Tipografia

| Papel | Fonte | Estilo |
|-------|-------|--------|
| **Headings** | `EB Garamond` | Serifada clássica — formalidade e tradição |
| **Body / UI** | `Inter` | Sans-serif moderna — legibilidade e precisão |

### Estilo Visual

| Propriedade | Valor |
|-------------|-------|
| Cantos | `10px` (md) · `16px` (lg) |
| Sombras | Suaves e elegantes (`0 10px 15px -3px`) |
| Transições | `250ms ease` — suaves e naturais |
| Tema | Dark / Light com toggle em forma de **cápsula deslizante** |

<br>

---

## ✦ Como Usar

### Online (recomendado)

Acesse via **GitHub Pages** (link disponível após o deploy).

### Local

```bash
# Clone
git clone https://github.com/seu-usuario/juriscalc.git
cd juriscalc

# Instale as dependências
npm install

# Compile o TypeScript
npm run build

# Abra o arquivo no navegador
start index.html
```

> 💡 **Dica:** Você pode abrir o `index.html` diretamente no navegador — não precisa de servidor.

<br>

---

## ✦ Desenvolvimento

### Comandos disponíveis

```bash
npm run build       # Compila TypeScript para dist/
npm run watch       # Watch mode — recompila automaticamente
npm run typecheck   # Verifica tipos sem compilar
```

### Estrutura do projeto

```
juriscalc/
├── .github/workflows/deploy.yml   ← CI/CD
├── index.html                      ← Entrada
├── src/                            ← Código fonte (TypeScript + CSS)
│   ├── main.ts                     ← Orquestrador (DOM, eventos, animações)
│   ├── calculadora.ts              ← Motor de cálculos rescisórios
│   ├── types.ts                    ← Interfaces e tipos
│   ├── style.css                   ← Design system completo
│   └── calculations/
│       ├── fgts.ts                 ← FGTS 8% + Multa 40%
│       ├── inss.ts                 ← INSS progressivo
│       └── irrf.ts                 ← IRRF com dedução
└── dist/                           ← Compilado (runtime)
```

### CI/CD

O workflow do GitHub Actions executa automaticamente em `push` para `main`:

1. **typecheck** — verifica tipos do TypeScript
2. **build** — compila para `dist/`
3. **deploy** — publica no GitHub Pages

<br>

---

## ✦ Licença

Distribuído sob licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

<br>

---

<p align="center">
  Feito com dedicação para profissionais do Direito Trabalhista<br>
  <sub>Os cálculos são estimativas e não substituem a consulta a um advogado especializado.</sub>
</p>
