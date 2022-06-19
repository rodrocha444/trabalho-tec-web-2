let aberturaGlobal = 200
let temaGlobal = 'diurno'
console.log(document.querySelector('input[name="cenario-radio"]:checked').value)
function alterarAberturaDosCanos(){
  let abertura = document.querySelector('input[name="abertura-canos-radio"]:checked').value
  console.log(abertura)
  abertura == 'facil' && (aberturaGlobal = 250)
  abertura == 'media' && (aberturaGlobal = 200)
  abertura == 'dificil' && (aberturaGlobal = 175)
}
function restart(){
  let flappy=document.querySelector('.wm-flappy')
  let game = document.querySelector('.game')
  let restart=document.querySelector('.restart-dialog')
  let newFlappy = document.createElement('div')
  newFlappy.classList.add('wm-flappy')
  
  flappy.remove()
  
  restart.remove()
  game.appendChild(newFlappy)
  
  let newGame = new FlappyBird().start()
  alterarCenario()
  
  
  
}
function abrirRestartDialog(){
  let restartDialog = document.createElement('div');
  let restartButton = document.createElement('button');
  let game = document.querySelector(".wm-flappy")
  let positions = game.getBoundingClientRect()
  

  restartDialog.classList.add('restart-dialog')
  restartDialog.appendChild(restartButton);
  restartDialog.style.position = 'absolute';
  restartDialog.style.top= positions.top+'px';
  restartDialog.style.height = positions.height+'px';
  restartDialog.style.left = positions.left+'px';
  restartDialog.style.backgroundColor = '#0008';
  restartDialog.style.width = positions.width+'px';
  restartDialog.style.display = 'flex';
  restartDialog.style.justifyContent = 'center';
  restartDialog.style.alignItems = 'center';
  
  restartButton.innerHTML="Restart"
  restartButton.style.padding = "15px 25px"
  restartButton.onclick = restart;
  document.body.appendChild(restartDialog);
}

function alterarCenario() {
  let tema = document.querySelector('input[name="cenario-radio"]:checked').value;
  temaGlobal = tema;
  let game = document.querySelector('.wm-flappy')
  let canoParteSuperior = document.querySelectorAll('.barreira .borda')
  let canoParteInferior = document.querySelectorAll('.barreira .corpo')
  if(tema==="diurno"){
    let gradienteCanos = "linear-gradient(90deg, var(--green-500), var(--green-300))"
    game.style.background = "var(--background)";
    game.style.borderColor = "var(--border)";
    canoParteSuperior.forEach(e=>e.style.background = gradienteCanos)
    canoParteInferior.forEach(e=>e.style.background = gradienteCanos)
  }
  else if(tema==="noturno"){
    let gradienteCanos = "linear-gradient(90deg, var(--blue-2), var(--blue-1))"
    game.style.background = "var(--background-dark)";
    game.style.borderColor = "var(--border-dark)";
    canoParteSuperior.forEach(e=>e.style.background = gradienteCanos)
    canoParteInferior.forEach(e=>e.style.background = gradienteCanos)
  }
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

/* const b= new Barreira(false)
b.setAltura(500)
document.querySelector('.wm-flappy').appendChild(b.elemento) */



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

/* const b= new ParDeBarreiras(500,300,1000)
document.querySelector('.wm-flappy').appendChild(b.elemento)  */

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  this.pares = [
    new ParDeBarreiras(altura, abertura, largura),
    new ParDeBarreiras(altura, abertura, largura + espaco),
    new ParDeBarreiras(altura, abertura, largura + espaco * 2),
    new ParDeBarreiras(altura, abertura, largura + espaco * 3)
  ]

  const deslocamento = 3
  this.animar = () => {
    this.pares.forEach(par => {
      par.setX(par.getX() - deslocamento)

      if (par.getX() < -par.getLargura()) {
        par.setX(par.getX() + espaco * this.pares.length)
        par.sortearAbertura()
      }
      const meio = largura / 2
      const cruzouMeio = par.getX() + deslocamento >= meio
        && par.getX() < meio
      if (cruzouMeio) {
        notificarPonto()
      }
    })
  }
}

/* const barreiras = new Barreiras(700, 400, 200, 400)
const areaDoJogo = document.querySelector('.wm-flappy')

barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
    barreiras.animar()
},20)  */


function Passaro(alturaJogo) {
  let voando = false

  this.elemento = novoElemento('img', 'passaro')
  this.elemento.src = 'img/passaro.png'

  this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
  this.setY = y => this.elemento.style.bottom = `${y}px`

  window.onkeydown = e => voando = true
  window.onkeyup = e => voando = false

  this.animar = () => {
    const novoY = this.getY() + (voando ? 8 : -5)
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

/* const barreiras = new Barreiras(700, 400, 200, 400)
const passaro = new Passaro(700)

const areaDoJogo = document.querySelector('.wm-flappy')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento)) 

setInterval(() => {
      barreiras.animar()
      passaro.animar() 
},20) */


function Progresso() {

  this.elemento = novoElemento('span', 'progresso')
  this.atualizarPontos = pontos => {
    this.elemento.innerHTML = pontos
  }
  this.atualizarPontos(0)
}

/*  const barreiras = new Barreiras(700, 400, 200, 400)
const passaro = new Passaro(700)

const areaDoJogo = document.querySelector('.wm-flappy')

areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach( par => areaDoJogo.appendChild(par.elemento))  */


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
  let pontos = 0
  const areaDoJogo = document.querySelector('.wm-flappy')
  const altura = areaDoJogo.clientHeight
  const largura = areaDoJogo.clientWidth

  const progresso = new Progresso()
  const barreiras = new Barreiras(altura, largura, aberturaGlobal, 400,
    () => progresso.atualizarPontos(++pontos))

  const passaro = new Passaro(altura)

  areaDoJogo.appendChild(progresso.elemento)
  areaDoJogo.appendChild(passaro.elemento)
  barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

  this.start = () => {
    const temporizador = setInterval(() => {
      barreiras.animar()
      passaro.animar()

      if (colidiu(passaro, barreiras)) {
        clearInterval(temporizador)
        abrirRestartDialog()
      }
    }, 20)
  }
}
new FlappyBird().start() 