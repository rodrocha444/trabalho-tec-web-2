function updateCenario() {
  tema = document.querySelector('input[name="cenario-radio"]:checked').value;

  let barreiras = getBarreiras()
  let game = getGame()

  if (tema == 'diurno') {
    barreiras.forEach(e => e.style.filter = "drop-shadow(16px 16px 20px black)")
    game.style.background = "var(--background)"
  }
  else if (tema == 'noturno') {
    barreiras.forEach(e => e.style.filter = "drop-shadow(16px 16px 20px black) hue-rotate(90deg) brightness(0.6)")
    game.style.background = "var(--background--dark)"
  }
}

function updateAberturaCanos() {
  let nivelAbertura = document.querySelector('input[name="abertura-canos-radio"]:checked').value;

  nivelAbertura == 'facil' && (aberturaDosCanos = 300)
  nivelAbertura == 'media' && (aberturaDosCanos = 200)
  nivelAbertura == 'dificil' && (aberturaDosCanos = 175)

}

function updateDistanciaEntreCanos() {
  let nivelDistancia = document.querySelector('input[name="distancia-entre-canos-radio"]:checked').value;

  nivelDistancia == 'facil' && (distanciaEntreCanos = 500)
  nivelDistancia == 'media' && (distanciaEntreCanos = 400)
  nivelDistancia == 'dificil' && (distanciaEntreCanos = 300)
}

function updateVelocidadeDoJogo() {
  let velocidade = document.querySelector('input[name="velocidade-do-jogo"]').value;

  velocidadeDoJogo = velocidade
}

function updatePersonagem() {
  let personagem = document.querySelector('select[name="personagem-select"]').value;

  personagemSrc = personagem
}

function udpateModoDeJogo() {
  let modo = document.querySelector('input[name="tipo-de-jogo"]:checked').value;

  tipoDeJogo = modo
}

function updateVelocidadeDoPersonagem(){
  let velocidade = document.querySelector('input[name="velocidade-do-personagem-radio"]:checked').value;

  velocidade == 'baixa' && (velocidadeDoPersonagem = [3,-3])
  velocidade == 'media' && (velocidadeDoPersonagem = [8,-5])
  velocidade == 'alta' && (velocidadeDoPersonagem = [10,-7])
}

function updateIncrementoPontuacao() {
  let pontuacao = document.querySelector('input[name="pontuacao-radio"]:checked').value;

  incrementoPontuacao = pontuacao
}