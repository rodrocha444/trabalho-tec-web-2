function updateCenario() {
  TEMA = selectElements('input[name="cenario-radio"]:checked').value;

  let barreiras = selectElements('.par-de-barreiras')
  let game = selectElements('.wm-flappy')

  if (TEMA == 'diurno') {
    game.style.background = "var(--background)"
  }
  else if (TEMA == 'noturno') {
    barreiras.forEach(e => e.style.filter = "drop-shadow(16px 16px 20px black) hue-rotate(90deg) brightness(0.6)")
    game.style.background = "var(--background--dark)"
  }
}

function updateAberturaCanos() {
  let nivelAbertura = selectElements('input[name="abertura-canos-radio"]:checked').value;

  const novaAbertura = {
    facil: 350,
    media: 300,
    dificil: 200,
  }

  ABERTURA_DOS_CANOS = novaAbertura[nivelAbertura]
}

function updateDistanciaEntreCanos() {
  let nivelDistancia = selectElements('input[name="distancia-entre-canos-radio"]:checked').value;

  const novaDistancia = {
    facil: 500,
    media: 400,
    dificil: 300,
  }

  DISTANCIA_ENTRE_CANOS = novaDistancia[nivelDistancia]
}

function updateVelocidadeDoJogo() {
  let velocidade = selectElements('input[name="velocidade-do-jogo"]').value;

  VELOCIDADE_DO_JOGO = velocidade
}

function updatePersonagem() {
  let personagem = selectElements('select[name="personagem-select"]').value;

  PERSONAGEM_SRC = personagem
}

function udpateModoDeJogo() {
  let modo = selectElements('input[name="tipo-de-jogo"]:checked').value;

  TIPO_DE_JOGO = modo
}

function updateVelocidadeDoPersonagem() {
  let velocidade = selectElements('input[name="velocidade-do-personagem-radio"]:checked').value;

  const novaVelocidade = {
    baixa: [3,-3],
    media: [8,-5],
    alta: [10,-7]
  }
  
  VELOCIDADE_DO_PERSONAGEM = novaVelocidade[velocidade]
}

function updateIncrementoPontuacao() {
  let pontuacao = selectElements('input[name="pontuacao-radio"]:checked').value;

  INCREMENTO_PONTUACAO = pontuacao
}