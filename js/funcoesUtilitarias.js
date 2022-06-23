function removerElementos(...listaDeElementos) {
  listaDeElementos.forEach(elemento => elemento.remove())
}

function addFilhosToPai(Pai, ...filhos) {
  filhos.forEach(elemento => Pai.appendChild(elemento))
}

function novoElemento(tagName, className) {
  const elemento = document.createElement(tagName)
  elemento.className = className
  return elemento
}

function estaoSobrepostos(elementoA, elementoB) {

  const a = elementoA.getBoundingClientRect()
  const b = elementoB.getBoundingClientRect()
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

  return horizontal && vertical
}

function selectElements(query) {
  let result = document.querySelectorAll(query)

  return result.length > 1 ? result : result[0];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function atualizarEstiloPassaro(atributo, valor) {
  selectElements('.passaro').style[atributo] = valor;
}

function criarParDeBarreiras(quant, { altura, largura, abertura, espaco }) {
  let result = []
  for (let i = 0; i < quant; i++) {
    result.push(new ParDeBarreiras(altura, abertura, largura + espaco * i))
  }
  return result
}

function deslocar(elemento, deslocamento) {
  elemento.setX(elemento.getX() - deslocamento)
}

function handleItens(elemento, { activeAction, espaco }) {
  const alturaDoGame = selectElements('.wm-flappy').clientHeight
  const tamanhoDosItens = 50

  activeAction && elemento.acao();
  elemento.setX(elemento.getX() + espaco * getRandomIntInclusive(4, 7));
  elemento.setY(getRandomIntInclusive(0, alturaDoGame - tamanhoDosItens))
}