// ============================================================
//  CATÁLOGO DE PEÇAS
//  Para adicionar uma peça: copie um bloco { ... }, cole no fim
//  da lista e troque os dados. As fotos ficam em
//  public/pecas/<id>/ e o caminho começa com /pecas/...
// ============================================================

// Nome de cada uma das 3 fotos, na ordem em que aparecem em "fotos"
export const VISTAS = ['Frente', 'Costas', 'Detalhe'];

// Níveis de conservação (o número vira a barrinha de 1 a 4 na janela da peça)
export const CONDICOES = {
  'Nova com etiqueta': 4,
  'Ótimo estado': 3,
  'Bom estado': 2,
  'Com marcas de uso': 1,
};

export const pecas = [
  {
    id: 'jaqueta-jeans-90', // usado no link: seusite.com/#jaqueta-jeans-90
    nome: 'Jaqueta Jeans Anos 90',
    categoria: 'Jaquetas',
    preco: 89.9,
    tamanho: 'M',
    condicao: 'Ótimo estado', // tem que ser um dos nomes de CONDICOES
    observacao: 'Sem furos ou manchas. Desbotado natural do jeans.',
    descricao: 'Modelagem oversized, lavagem clara e botões de metal originais.',
    fotos: [
      '/pecas/jaqueta-jeans-90/frente.svg',
      '/pecas/jaqueta-jeans-90/costas.svg',
      '/pecas/jaqueta-jeans-90/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'vestido-floral-midi',
    nome: 'Vestido Floral Midi',
    categoria: 'Vestidos',
    preco: 74.9,
    tamanho: 'P',
    condicao: 'Nova com etiqueta',
    observacao: 'Nunca usado, ainda com a etiqueta da loja.',
    descricao: 'Viscose leve com estampa de flores miúdas e alças finas reguláveis.',
    fotos: [
      '/pecas/vestido-floral-midi/frente.svg',
      '/pecas/vestido-floral-midi/costas.svg',
      '/pecas/vestido-floral-midi/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'camisa-linho-areia',
    nome: 'Camisa de Linho Areia',
    categoria: 'Camisas',
    preco: 59.9,
    tamanho: 'G',
    condicao: 'Bom estado',
    observacao: 'Pequeno ponto de costura refeito na barra, quase imperceptível.',
    descricao: 'Linho puro, caimento solto e botões de madrepérola.',
    fotos: [
      '/pecas/camisa-linho-areia/frente.svg',
      '/pecas/camisa-linho-areia/costas.svg',
      '/pecas/camisa-linho-areia/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'calca-alfaiataria-preta',
    nome: 'Calça Alfaiataria Preta',
    categoria: 'Calças',
    preco: 69.9,
    tamanho: '40',
    condicao: 'Ótimo estado',
    observacao: 'Tecido sem bolinhas, vinco frontal bem marcado.',
    descricao: 'Cintura alta, perna reta e bolsos faca.',
    fotos: [
      '/pecas/calca-alfaiataria-preta/frente.svg',
      '/pecas/calca-alfaiataria-preta/costas.svg',
      '/pecas/calca-alfaiataria-preta/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'blazer-xadrez-vintage',
    nome: 'Blazer Xadrez Vintage',
    categoria: 'Jaquetas',
    preco: 119.9,
    tamanho: 'M',
    condicao: 'Bom estado',
    observacao: 'Forro com leve desgaste na manga, não aparece por fora.',
    descricao: 'Lã mista em xadrez marrom, ombreiras suaves e dois botões.',
    fotos: [
      '/pecas/blazer-xadrez-vintage/frente.svg',
      '/pecas/blazer-xadrez-vintage/costas.svg',
      '/pecas/blazer-xadrez-vintage/detalhe.svg',
    ],
    vendida: true, // aparece com o selo "vendida"
  },
  {
    id: 'saia-plissada-verde',
    nome: 'Saia Plissada Verde',
    categoria: 'Saias',
    preco: 54.9,
    tamanho: 'P',
    condicao: 'Ótimo estado',
    observacao: 'Pregas firmes, zíper funcionando perfeitamente.',
    descricao: 'Comprimento midi, cetim acetinado verde-musgo.',
    fotos: [
      '/pecas/saia-plissada-verde/frente.svg',
      '/pecas/saia-plissada-verde/costas.svg',
      '/pecas/saia-plissada-verde/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'tricot-oversized-creme',
    nome: 'Tricô Oversized Creme',
    categoria: 'Malhas',
    preco: 79.9,
    tamanho: 'G',
    condicao: 'Com marcas de uso',
    observacao: 'Algumas bolinhas nas laterais; preço já considera isso.',
    descricao: 'Ponto trançado, gola alta e mangas compridas bem quentinhas.',
    fotos: [
      '/pecas/tricot-oversized-creme/frente.svg',
      '/pecas/tricot-oversized-creme/costas.svg',
      '/pecas/tricot-oversized-creme/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'vestido-preto-slip',
    nome: 'Vestido Preto Slip',
    categoria: 'Vestidos',
    preco: 64.9,
    tamanho: 'M',
    condicao: 'Ótimo estado',
    observacao: 'Sem fios puxados, tecido com brilho original.',
    descricao: 'Cetim fluido, decote V e corte enviesado.',
    fotos: [
      '/pecas/vestido-preto-slip/frente.svg',
      '/pecas/vestido-preto-slip/costas.svg',
      '/pecas/vestido-preto-slip/detalhe.svg',
    ],
    vendida: false,
  },
  {
    id: 'camisa-estampada-retro',
    nome: 'Camisa Estampada Retrô',
    categoria: 'Camisas',
    preco: 49.9,
    tamanho: 'M',
    condicao: 'Bom estado',
    observacao: 'Cores levemente desbotadas pelo tempo, dá charme.',
    descricao: 'Manga curta, gola padre e estampa geométrica anos 70.',
    fotos: [
      '/pecas/camisa-estampada-retro/frente.svg',
      '/pecas/camisa-estampada-retro/costas.svg',
      '/pecas/camisa-estampada-retro/detalhe.svg',
    ],
    vendida: false,
  },
];
