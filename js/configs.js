function updateCenario() {
  tema = document.querySelector('input[name="cenario-radio"]:checked').value;

  let barreiras = getBarreiras()
  let game = getGame()

  console.log(barreiras)
  if (tema == 'diurno') {
    barreiras.forEach(e => e.style.filter = "")
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
  nivelAbertura == 'dificil' && (aberturaDosCanos = 150) 

}