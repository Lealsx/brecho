# Brechó

Vitrine online de brechó com rolagem suave e animações fluidas.
Clique numa peça para abrir a janela com 3 fotos (frente, costas e detalhe), nome, preço e condição.
O botão "Quero essa peça" abre o WhatsApp com a mensagem pronta.

Feito com [Vite](https://vite.dev), [GSAP](https://gsap.com) e [Lenis](https://lenis.darkroom.engineering).

## Rodar no computador

```bash
npm install      # só na primeira vez: baixa as dependências
npm run dev      # abre em http://localhost:5173 e atualiza sozinho ao salvar
```

## Onde mexer

| O que | Arquivo |
|---|---|
| Nome, slogan, WhatsApp, Instagram | `src/config.js` |
| Peças (nome, preço, tamanho, condição, fotos, vendida) | `src/pecas.js` |
| Fotos | `public/pecas/<id-da-peca>/` |
| Cores e fontes | topo do `src/style.css` (bloco `:root`) |
| Título da aba do navegador | `index.html` (`<title>`) |

### Adicionar uma peça

1. Crie a pasta `public/pecas/minha-peca/` com 3 fotos: `frente.jpg`, `costas.jpg`, `detalhe.jpg`
   (formato vertical 4:5, por exemplo 1200×1500, de preferência abaixo de 300 KB cada).
2. Em `src/pecas.js`, copie um bloco `{ ... }`, cole no fim da lista e troque os dados e os caminhos das fotos.
3. Quando vender, mude `vendida: false` para `vendida: true`.

Cada peça tem um link próprio: `seusite.com/#id-da-peca`, que abre a peça direto.

## Publicar na Vercel

1. Suba o projeto para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
   A Vercel reconhece o Vite sozinha (build `npm run build`, pasta `dist`).
3. Depois disso, cada `git push` publica a nova versão automaticamente.
