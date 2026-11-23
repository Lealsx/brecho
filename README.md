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

1. Coloque as 3 fotos do celular numa pasta qualquer (ex.: `~/Imagens/vestido-azul/`).
   Ou nomeie como `frente`, `costas` e `detalhe`, ou deixe na ordem em que tirou (1ª = frente).
2. Rode o compressor, passando a pasta e o id da peça (só minúsculas e hífen):

   ```bash
   npm run fotos -- ~/Imagens/vestido-azul vestido-azul-midi
   ```

   Ele gira, corta em 4:5, reduz para 1200×1500, converte para `.webp` abaixo de ~300 KB,
   **apaga o GPS e os dados do celular** e salva em `public/pecas/vestido-azul-midi/`.
3. Em `src/pecas.js`, copie um bloco `{ ... }`, cole no fim da lista, troque os dados
   e cole o trecho `fotos: [...]` que o comando mostrou no final.
3. Quando vender, mude `vendida: false` para `vendida: true`.

Cada peça tem um link próprio: `seusite.com/#id-da-peca`, que abre a peça direto.

## Publicar na Vercel

1. Suba o projeto para o GitHub.
2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
   A Vercel reconhece o Vite sozinha (build `npm run build`, pasta `dist`).
3. Depois disso, cada `git push` publica a nova versão automaticamente.
