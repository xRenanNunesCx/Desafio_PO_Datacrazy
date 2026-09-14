# Desafio PO 2026 — Datacrazy: Gerenciamento de Produtos

Resolução do desafio técnico de Product Owner (Datacrazy, 2026): redesenho da tela de Produtos do CRM Datacrazy para suportar venda multicanal (TikTok Shop, Shopify, Mercado Livre).

## 📎 Entregáveis do desafio

1. **Protótipo** — este repositório (Next.js + Tailwind CSS + shadcn/ui, gerado via [v0.dev](https://v0.dev) e ajustado pra aproximar da identidade visual real da Datacrazy)
2. **Modelagem de dados e PRD** — [link do documento Notion aqui]
3. **Organização do trabalho** — backlog, sprints e priorização (MoSCoW/RICE) no PRD acima + board de execução em [Projects](../../projects) deste repositório

## 🖥️ Rodando localmente

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🧱 Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (base-ui) · lucide-react

## 🧩 O que o protótipo cobre

- **Tela "Produtos"** — grid com busca, filtros (categoria/canal/status), paginação e menu de ações (Importar/Exportar)
- **Modal de criar/editar produto**, em abas:
  - *Informações* — nome, SKU, categoria, descrição curta/completa, status
  - *Imagens & Variações*
  - *Precificação & Estoque*
  - *Canais de Venda* — ativação por canal (TikTok Shop, Shopify, Mercado Livre) com seleção de `sync_mode` (Datacrazy como catálogo mestre vs. espelho do canal externo), espelhando a modelagem de dados do Entregável 2

## 📌 Contexto

Desenvolvido como parte de um processo seletivo para vaga de Product Owner na Datacrazy. O PRD completo (problema, personas, MoSCoW, RICE, user stories em BDD, sprints) está no link do Notion acima — inclui o raciocínio de produto por trás de cada decisão de modelagem e escopo.
