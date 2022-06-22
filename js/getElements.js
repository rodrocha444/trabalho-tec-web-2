function getBarreiras() {
  let barreiras = document.querySelectorAll('.par-de-barreiras');

  return barreiras
}
function getGame() {
  let background = document.querySelector('.wm-flappy')

  return background
}
function getPassaro() {
  let passaro = document.querySelector('.passaro');

  return passaro
}
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}