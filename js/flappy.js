function BackToNormalGame(idTimeout,modo) {
  clearTimeout(idTimeout);
  getPassaro().style.filter = ""
  modo =='treino' || (tipoDeJogo = 'normal')
  let elemento = document.querySelector('.tempoInvencibilidade')
  elemento && elemento.remove()
}
function ficarInvencivel(time,modo) {
  let timeInMiliseconds = time * 1000
  let timeElemento = document.createElement('h1');
  let elemento = document.createElement('h1')

  timeElemento.innerHTML = time
  elemento.innerHTML = 'Tempo de Invencibilidade Restante:'
  elemento.classList.add('tempoInvencibilidade')

  elemento.appendChild(timeElemento)
  getGame().appendChild(elemento)

  setInterval(() => { timeElemento.innerHTML -= 1 }, 1000)
  tipoDeJogo = 'treino'
  getPassaro().style.filter = "invert(1)"

  return setTimeout(() => {
    BackToNormalGame(modo)
  }, timeInMiliseconds)
}

function Item(img, acao) {
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
  this.setX = x => this.elemento.style.left = `${x}px`
  this.setY = y => this.elemento.style.top = `${y}px`

  this.elemento = document.createElement('div');
  this.elemento.classList.add('itemEspecial');
  this.elemento.style.backgroundImage = img;
  this.acao = acao
}

function novoElemento(tagName, className) {
  const elemento = document.createElement(tagName)
  elemento.className = className
  return elemento
}

function Barreira(reversa = false) {
  this.elemento = novoElemento('div', 'barreira')
  const borda = novoElemento('div', 'borda')
  const corpo = novoElemento('div', 'corpo')
  this.elemento.appendChild(reversa ? corpo : borda)
  this.elemento.appendChild(reversa ? borda : corpo)

  this.setAltura = altura => corpo.style.height = `${altura}px`

}

function ParDeBarreiras(altura, abertura, popsicaoNaTela) {
  this.elemento = novoElemento('div', 'par-de-barreiras')
  this.superior = new Barreira(true)
  this.inferior = new Barreira(false)

  this.elemento.appendChild(this.superior.elemento)
  this.elemento.appendChild(this.inferior.elemento)


  this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura)
    const alturaInferior = altura - abertura - alturaSuperior
    this.superior.setAltura(alturaSuperior)
    this.inferior.setAltura(alturaInferior)
  }
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
  this.setX = popsicaoNaTela => this.elemento.style.left = `${popsicaoNaTela}px`
  this.getLargura = () => this.elemento.clientWidth

  this.sortearAbertura()
  this.setX(popsicaoNaTela)
}

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3)
  ]
  this.moeda = new Item("url('img/moeda.png')", () => notificarPonto(10 * incrementoPontuacao));
  this.up = new Item("url('img/up.png')", () => ficarInvencivel(tempoDeInvencibilidadeDoPassaro,tipoDeJogo));

  const deslocamento = velocidadeDoJogo
  let indexAtual = 0;
  let idTimeout = 0;
  let posicaoInicialMoedaX = this.pares[getRandomIntInclusive(0, 3)].getX() - espaco / 2 + 50;
  let posicaoInicialMoedaY = getRandomIntInclusive(0, getGame().clientHeight - 50)

  let posicaoInicialUpX = this.pares[getRandomIntInclusive(0, 3)].getX() - espaco / 2 + 50;
  let posicaoInicialUpY = getRandomIntInclusive(0, getGame().clientHeight - 50)

  this.moeda.setY(posicaoInicialMoedaY)
  this.moeda.setX(posicaoInicialMoedaX)

  this.up.setY(posicaoInicialUpY)
  this.up.setX(posicaoInicialUpX)

  this.animar = () => {

    this.moeda.setX(this.moeda.getX() - deslocamento)
    if (estaoSobrepostos(getPassaro(), this.moeda.elemento)) {

      this.moeda.acao();
      this.moeda.setX(this.moeda.getX() + espaco * getRandomIntInclusive(4, 7));
    }
    if (this.moeda.getX() < -50) {
      this.moeda.setX(this.moeda.getX() + espaco * getRandomIntInclusive(4, 7))
      this.moeda.setY(getRandomIntInclusive(0, getGame().clientHeight - 50))
    }

    this.up.setX(this.up.getX() - deslocamento)
    if (estaoSobrepostos(getPassaro(), this.up.elemento)) {
      BackToNormalGame(idTimeout);
      idTimeout = this.up.acao()
      this.up.setX(this.up.getX() + espaco * getRandomIntInclusive(4, 7));
    }
    if (this.up.getX() < -50) {
      this.up.setX(this.up.getX() + espaco * getRandomIntInclusive(4, 7))
      this.up.setY(getRandomIntInclusive(0, getGame().clientHeight - 50))
    }

    this.pares.forEach((par, index, array) => {
      par.setX(par.getX() - deslocamento)
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }

      const posPassaro = Math.floor(getComputedStyle(getPassaro()).left.split('px')[0])

      if ((posPassaro >= par.getX()) && index == indexAtual) {
        indexAtual < (array.length - 1) ? indexAtual += 1 : indexAtual = 0;
        notificarPonto()
      }
    })
  }
}

function Passaro(alturaJogo) {
  let voando = false

  this.elemento = novoElemento('img', 'passaro')
  this.elemento.src = personagemSrc

  this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
  this.setY = y => this.elemento.style.bottom = `${y}px`
  this.isInvencible = false;

  window.onkeydown = () => voando = true
  window.onkeyup = () => voando = false

  this.animar = () => {
    const novoY = this.getY() + (voando ? velocidadeDoPersonagem[0] : velocidadeDoPersonagem[1])
    const alturaMaxima = alturaJogo - this.elemento.clientWidth

    if (novoY <= 0) {
      this.setY(0)
    } else if (novoY >= alturaMaxima) {
      this.setY(alturaMaxima)
    } else {
      this.setY(novoY)
    }
  }
  this.setY(alturaJogo / 2)
}

function Progresso() {

  this.elemento = novoElemento('span', 'progresso')
  this.atualizarPontos = () => {
    this.elemento.innerHTML = pontosDoGame
  }
  this.atualizarPontos(0)
}

function estaoSobrepostos(elementoA, elementoB) {

  const a = elementoA.getBoundingClientRect()
  const b = elementoB.getBoundingClientRect()
  const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
  const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

  return horizontal && vertical
}

function colidiu(passaro, barreiras) {
  let colidiu = false

  barreiras.pares.forEach(parDeBarreiras => {
    if (!colidiu) {
      const superior = parDeBarreiras.superior.elemento
      const inferior = parDeBarreiras.inferior.elemento
      colidiu = estaoSobrepostos(passaro.elemento, superior)
        || estaoSobrepostos(passaro.elemento, inferior)
    }
  })
  return colidiu

}
function GameOverDialog(barreiras, passaro, progresso) {
  let GameOverDiv = document.createElement('div')
  let botaoRestart = document.createElement('button')
  let pontuacao = document.createElement('h1')
  let nomeJogador = document.querySelector('input[name="nome-do-jogador"]').value

  GameOverDiv.classList.add('gameover')
  botaoRestart.classList.add('restart')

  botaoRestart.innerHTML = "Restart"
  pontuacao.innerHTML = `${nomeJogador} - ${pontosDoGame} pontos`;

  GameOverDiv.appendChild(pontuacao)
  GameOverDiv.appendChild(botaoRestart)

  document.querySelector('.wm-flappy').appendChild(GameOverDiv)

  botaoRestart.onclick = () => {
    barreiras.pares.forEach(e => e.elemento.remove())
    barreiras.moeda.elemento.remove()
    barreiras.up.elemento.remove()
    passaro.elemento.remove()
    progresso.elemento.remove()
    GameOverDiv.remove()
    pontosDoGame = 0
    new FlappyBird().start()
  }
}
function FlappyBird() {
  const areaDoJogo = document.querySelector('.wm-flappy')
  const altura = areaDoJogo.clientHeight
  const largura = areaDoJogo.clientWidth

  const progresso = new Progresso()
  const barreiras = new Barreiras(altura, largura, aberturaDosCanos, distanciaEntreCanos,
    (quantDePontos = incrementoPontuacao) => {
      pontosDoGame += parseInt(quantDePontos);
      progresso.atualizarPontos()
    })

  const passaro = new Passaro(altura)

  areaDoJogo.appendChild(progresso.elemento)
  barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
  areaDoJogo.appendChild(barreiras.moeda.elemento)
  areaDoJogo.appendChild(barreiras.up.elemento)
  areaDoJogo.appendChild(passaro.elemento)

  updateCenario()

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar()
      passaro.animar()
      if (colidiu(passaro, barreiras) && tipoDeJogo == 'normal') {
        clearInterval(temporizador)
        progresso.elemento.remove()
        GameOverDialog(barreiras, passaro, progresso)
      }
    }, 20)
  }
}

new FlappyBird().start() 