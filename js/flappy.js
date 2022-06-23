function BackToNormalGame(isNecessarioMudarModo) {
  atualizarEstiloPassaro('filter', '');
  isNecessarioMudarModo && (TIPO_DE_JOGO = 'normal')
  removerElementos(selectElements('.tempo-invencibilidade-div'))
}

function addDivDoTempoRestante(time) {
  const SECOND_IN_MILLISECONDS = 1000
  let tempoDeInvencibilidadeRestante = novoElemento('h1', 'tempo-de-invencibilidade-restante')
  let tempoContainer = novoElemento('h1', 'tempo-invencibilidade-div');

  tempoDeInvencibilidadeRestante.innerHTML = time
  tempoContainer.innerHTML = 'Tempo de Invencibilidade Restante:'

  setInterval(() => { tempoDeInvencibilidadeRestante.innerHTML -= 1 }, SECOND_IN_MILLISECONDS)

  addFilhosToPai(tempoContainer, tempoDeInvencibilidadeRestante)
  addFilhosToPai(selectElements('.wm-flappy'), tempoContainer)
}

function ficarInvencivel(time) {
  let timeInMiliseconds = time * 1000
  let isNecessarioMudarModo = true

  addDivDoTempoRestante(time)

  TIPO_DE_JOGO == 'normal' ? TIPO_DE_JOGO = 'treino' : isNecessarioMudarModo = false;

  atualizarEstiloPassaro('filter', 'invert(1)');

  setTimeout(() => {
    BackToNormalGame(isNecessarioMudarModo)
  }, timeInMiliseconds)
}

function Item(img, acao) {
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
  this.setX = x => this.elemento.style.left = `${x}px`
  this.setY = y => this.elemento.style.top = `${y}px`

  this.elemento = novoElemento('div', 'itemEspecial')
  this.elemento.style.backgroundImage = img;
  this.acao = acao
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

  const toAdd = [this.superior, this.inferior].map(value => value.elemento)
  addFilhosToPai(this.elemento, ...toAdd)

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

  this.pares = criarParDeBarreiras(4, { altura, largura, abertura, espaco })

  this.moeda = new Item(
    "url('img/moeda.png')",
    () => notificarPonto(10 * INCREMENTO_PONTUACAO)
  )

  this.up = new Item(
    "url('img/up.png')",
    () => ficarInvencivel(TEMPO_INVENCIBILIDADE_PERSONAGEM)
  )

  const deslocamento = VELOCIDADE_DO_JOGO
  const alturaDoGame = selectElements('.wm-flappy').clientHeight
  const tamanhoDosItens = 50
  let indexAtual = 0;

  let posicaoInicialMoedaX = this.pares[getRandomIntInclusive(0, 3)].getX() - espaco / 2 + 50;
  let posicaoInicialMoedaY = getRandomIntInclusive(0, alturaDoGame - tamanhoDosItens)

  let posicaoInicialUpX = this.pares[getRandomIntInclusive(0, 3)].getX() - espaco / 2 + 50;
  let posicaoInicialUpY = getRandomIntInclusive(0, alturaDoGame - tamanhoDosItens)

  this.moeda.setY(posicaoInicialMoedaY)
  this.moeda.setX(posicaoInicialMoedaX)

  this.up.setY(posicaoInicialUpY)
  this.up.setX(posicaoInicialUpX)

  this.animar = () => {
    [this.moeda, this.up, ...this.pares]
      .forEach(elemento => deslocar(elemento, deslocamento));

    [this.moeda, this.up]
      .forEach(value => {
        estaoSobrepostos(selectElements('.passaro'), value.elemento) && handleItens(value, {
          activeAction: true,
          espaco,
        })
        value.getX() < -tamanhoDosItens && handleItens(value, {
          activeAction: true,
          espaco,
        })
      })


    this.pares.forEach((par, index, array) => {
      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }
      const posPassaro = Math.floor(getComputedStyle(selectElements('.passaro')).left.split('px')[0])
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
  this.elemento.src = PERSONAGEM_SRC

  this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
  this.setY = y => this.elemento.style.bottom = `${y}px`
  this.isInvencible = false;

  window.onkeydown = () => voando = true
  window.onkeyup = () => voando = false

  this.animar = () => {
    const novoY = this.getY() + (voando ? VELOCIDADE_DO_PERSONAGEM[0] : VELOCIDADE_DO_PERSONAGEM[1])
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
    this.elemento.innerHTML = PONTOS_DO_GAME
  }
  this.atualizarPontos(0)
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

  let game = selectElements('.wm-flappy')
  let GameOverDiv = novoElemento('div', 'gameover')
  let botaoRestart = novoElemento('button', 'restart')
  let pontuacao = novoElemento('h1', 'pontuacao-final')
  let nomeJogador = selectElements('input[name="nome-do-jogador"]').value

  botaoRestart.innerHTML = "Restart"
  pontuacao.innerHTML = `${nomeJogador} - ${PONTOS_DO_GAME} pontos`;

  addFilhosToPai(GameOverDiv, pontuacao, botaoRestart)
  addFilhosToPai(game, GameOverDiv)

  botaoRestart.onclick = () => {
    const elementosParaEliminar = [
      barreiras.moeda,
      barreiras.up,
      passaro,
      progresso,
      ...barreiras.pares
    ].map(value => value.elemento)

    removerElementos(...elementosParaEliminar, GameOverDiv)
    PONTOS_DO_GAME = 0

    new FlappyBird().start()
  }
}
function FlappyBird() {
  const areaDoJogo = selectElements('.wm-flappy')
  const altura = areaDoJogo.clientHeight
  const largura = areaDoJogo.clientWidth

  const progresso = new Progresso()
  const barreiras = new Barreiras(altura, largura, ABERTURA_DOS_CANOS, DISTANCIA_ENTRE_CANOS,
    (quantDePontos = INCREMENTO_PONTUACAO) => {
      PONTOS_DO_GAME += parseInt(quantDePontos);
      progresso.atualizarPontos()
    })

  const passaro = new Passaro(altura)

  const toAdd = [
    ...barreiras.pares,
    progresso,
    barreiras.moeda,
    barreiras.up,
    passaro,
  ].map(value => value.elemento)

  addFilhosToPai(areaDoJogo, ...toAdd)
  updateCenario()

  this.start = () => {
    const temporizador = setInterval(() => {

      [barreiras, passaro].forEach(cadaUm => cadaUm.animar())

      if (colidiu(passaro, barreiras) && TIPO_DE_JOGO == 'normal') {

        clearInterval(temporizador)
        removerElementos(progresso.elemento)
        GameOverDialog(barreiras, passaro, progresso)

      }
    }, 20)
  }
}

new FlappyBird().start() 