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

  const deslocamento = velocidadeDoJogo
  let indexAtual = 0;
  this.animar = () => {
    this.pares.forEach((par, index, array) => {
      par.setX(par.getX() - deslocamento)

      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }
      const posPassaro = Math.floor(getComputedStyle(getPassaro()).getPropertyValue('left').split('px')[0])

      if ((posPassaro >= par.getX()) && index == indexAtual) {
        if (indexAtual < array.length - 1)
          indexAtual += 1;
        else
          indexAtual = 0;
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

  window.onkeydown = e => voando = true
  window.onkeyup = e => voando = false

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

function FlappyBird() {
  const areaDoJogo = document.querySelector('.wm-flappy')
  const altura = areaDoJogo.clientHeight
  const largura = areaDoJogo.clientWidth

  const progresso = new Progresso()
  const barreiras = new Barreiras(altura, largura, aberturaDosCanos, distanciaEntreCanos,
    () => {
      pontosDoGame += parseInt(incrementoPontuacao);
      progresso.atualizarPontos()
    })

  const passaro = new Passaro(altura)

  areaDoJogo.appendChild(progresso.elemento)
  areaDoJogo.appendChild(passaro.elemento)
  barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

  updateCenario()

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar()
      passaro.animar()
      if (colidiu(passaro, barreiras) && tipoDeJogo=='normal') {
        clearInterval(temporizador)
        let botaoRestart = document.createElement('button')
        botaoRestart.innerHTML = "Restart"
        document.body.appendChild(botaoRestart)
        botaoRestart.onclick = () => {
          barreiras.pares.forEach(e => e.elemento.remove())
          passaro.elemento.remove()
          progresso.elemento.remove()
          botaoRestart.remove()
          pontosDoGame = 0
          new FlappyBird().start()
        }
      }
    }, 20)
  }
}

new FlappyBird().start() 