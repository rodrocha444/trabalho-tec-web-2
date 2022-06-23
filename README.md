# Trabalho Prático Tec. Web. 2

## Questão 01
---
Formulário criado ao lado do *game* assim não precisando de requisições, apenas de atualização de configurações com base nos dados dos *inputs*

## Questão 02
---
Armazenei o tema da aplicação em uma variável global no arquivo `variaveisDoGame.js`. Uma abordagem aqui começada que se propagou por toda a aplicação.

```javascript
let tema = 'diurno';
let aberturaDosCanos = 300;
...
```

Assim ficou fácil de fazer o update desse dado:
```javascript
function updateCenario() {
  tema = document.querySelector('input[name="cenario-radio"]:checked').value;

  let barreiras = getBarreiras()
  let game = getGame()

  if (tema == 'diurno') {
    game.style.background = "var(--background)"
  }
  else if (tema == 'noturno') {
    barreiras.forEach(e => e.style.filter = "drop-shadow(16px 16px 20px black) hue-rotate(90deg) brightness(0.6)")
    game.style.background = "var(--background--dark)"
  }
}
```
> Todos os *updates* estão no script `configs.js`
## Questão 03 e 04
---
Utilizei variáveis globais, `let aberturaDosCanos = 300` e `let distanciaEntreCanos = 400`, e fiz com que o código do professor utilizasse essas variáveis
```javascript	
function FlappyBird() {
  ...
  const barreiras = new Barreiras(altura, largura, aberturaDosCanos, distanciaEntreCanos,
  ...
}
```
Assim, restou apenas fazer as funções que fizessem o update dessas variáveis
```javascript
function updateAberturaCanos() {
  let nivelAbertura = document.querySelector('input[name="abertura-canos-radio"]:checked').value;
  
  nivelAbertura == 'facil' && (aberturaDosCanos = 400)
  nivelAbertura == 'media' && (aberturaDosCanos = 300)
  nivelAbertura == 'dificil' && (aberturaDosCanos = 200)
}
function updateDistanciaEntreCanos() {
  let nivelDistancia = document.querySelector('input[name="distancia-entre-canos-radio"]:checked').value;

  nivelDistancia == 'facil' && (distanciaEntreCanos = 500)
  nivelDistancia == 'media' && (distanciaEntreCanos = 400)
  nivelDistancia == 'dificil' && (distanciaEntreCanos = 300)
}
```
