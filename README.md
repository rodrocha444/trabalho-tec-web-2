# Trabalho Prático Tec. Web. 2
![Last Commit](https://img.shields.io/github/last-commit/rodrocha444/trabalho-tec-web-2)
![Top Language](https://img.shields.io/github/languages/top/rodrocha444/trabalho-tec-web-2)
![Language Count](https://img.shields.io/github/languages/count/rodrocha444/trabalho-tec-web-2)

[Roteiro do Trabalho](TrabalhoPratico2_%20tecWeb.pdf)

Resultado disponível em: https://trabalho-tec-web-2.vercel.app/

---
## Questão 01

Formulário criado ao lado do *game* assim não precisando de requisições, apenas de atualização de configurações com base nos dados dos *inputs*,

> as funções de atualização de dados estão quase integralmente presentes no arquivo `configs.js`
---
## Questão 02

Armazenei o tema da aplicação em uma variável global no arquivo `variaveisDoGame.js`. Uma abordagem aqui começada que se propagou por toda a aplicação.

```javascript
let TEMA = 'diurno';
...
```

Assim ficou fácil de fazer o update desse dado:
```javascript
function updateCenario() {
  TEMA = selectElements('input[name="cenario-radio"]:checked').value;

  let barreiras = selectElements('.par-de-barreiras')
  let game = selectElements('.wm-flappy')

  if (TEMA == 'diurno') {
    game.style.background = "var(--background)"
    barreiras.forEach(e => e.style.filter = "drop-shadow(16px 16px 20px black)")
  }
  else if (TEMA == 'noturno') {
    barreiras.forEach(e => e.style.filter = "drop-shadow(16px 16px 20px black) hue-rotate(90deg) brightness(0.6)")
    game.style.background = "var(--background--dark)"
  }
}
```
---
## Questão 03 e 04

Utilizei variáveis globais, ` ABERTURA_DOS_CANOS` e `DISTANCIA_ENTRE_CANOS`, e fiz com que o código do professor utilizasse essas variáveis
```javascript	
function FlappyBird() {
  ...
  const barreiras = new Barreiras(altura, largura, ABERTURA_DOS_CANOS, DISTANCIA_ENTRE_CANOS,
  ...
```
Assim, restou apenas fazer as funções que fizessem o update dessas variáveis
```javascript
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
```
---
## Questão 05

Utilizei a variável global `VELOCIDADE_DO_JOGO`, assim só me preocupei em colocá-lo no seguinte trecho de código do professor:
```javascript
...
const deslocamento = VELOCIDADE_DO_JOGO
...
```
E criar uma função para atualização dessa variável:
```javascript	
function updateVelocidadeDoJogo() {
  let velocidade = selectElements('input[name="velocidade-do-jogo"]').value;

  VELOCIDADE_DO_JOGO = velocidade
}
```
---
## Questão 06

Utilizei a variável global `PERSONAGEM_SRC` para armazenar o caminho para a imagem do personagem, assim, bastou colocar o valor inicial:
```javascript	
function Passaro(alturaJogo) {
  ...
  this.elemento.src = PERSONAGEM_SRC
  ...
```
E criar uma função para atualização dessa variável:
```javascript	
function updatePersonagem() {
  let personagem = selectElements('select[name="personagem-select"]').value;

  PERSONAGEM_SRC = personagem
}
```
---
## Questão 07
Utilizei a variável global `TIPO_DE_JOGO` e coloquei na condicional que verifica se o personagem `colidiu()`
```javascript	
if (colidiu(passaro, barreiras) && TIPO_DE_JOGO == 'normal') {
```
E criar uma função para atualização dessa variável:
```javascript	
function udpateModoDeJogo() {
  let modo = selectElements('input[name="tipo-de-jogo"]:checked').value;

  TIPO_DE_JOGO = modo
}
```
---
## Questão 08
Utilizei a variável global `VELOCIDADE_DO_PERSONAGEM` , onde o índice 0 representa a velocidade com que o personagem sobe e o índice 1 a velocidade com que o personagem desce:
```javascript	
const novoY = this.getY() + (voando ? VELOCIDADE_DO_PERSONAGEM[0] : VELOCIDADE_DO_PERSONAGEM[1])
```
Restou apenas ter que criar uma função para atualização dessa variável:
```javascript	
function updateVelocidadeDoPersonagem() {
  let velocidade = selectElements('input[name="velocidade-do-personagem-radio"]:checked').value;

  const novaVelocidade = {
    baixa: [3,-3],
    media: [8,-5],
    alta: [10,-7]
  }
  
  VELOCIDADE_DO_PERSONAGEM = novaVelocidade[velocidade]
}
```
---
## Questão 09
A abordagem adotada foi criar uma tela de *Game Over* que ficasse sobreposta ao *game*, onde nela fosse exposto o nome do jogador e sua pontuação.

Segue a função responsável pela criação da tela de *Game Over*:
```javascript	
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
```
E ela foi chamada logo após a colisão do personagem com as barreiras:
```javascript	
if (colidiu(passaro, barreiras) && TIPO_DE_JOGO == 'normal') {
  ...
  GameOverDialog(barreiras, passaro, progresso)
}
```
---
## Questão 10
Utilizei a variável global `INCREMENTO_PONTUACAO`, onde era indicado quanto cada barreira ultrapassada valia, assim, restou colocá-la na função responsável por notificar a pontuação:
```javascript	
(quantDePontos = INCREMENTO_PONTUACAO) => {
      PONTOS_DO_GAME += parseInt(quantDePontos);
      progresso.atualizarPontos()
    })
```
Restou apenas ter que criar uma função para atualização dessa variável:
```javascript	
function updateIncrementoPontuacao() {
  let pontuacao = selectElements('input[name="pontuacao-radio"]:checked').value;

  INCREMENTO_PONTUACAO = pontuacao
}
```
---
## Questão 11 e 12
Criei uma entidade chamada `Item` que foi a peça principal para as duas questões:
```javascript
function Item(img, acao) {
  this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
  this.setX = x => this.elemento.style.left = `${x}px`
  this.setY = y => this.elemento.style.top = `${y}px`

  this.elemento = novoElemento('div', 'itemEspecial')
  this.elemento.style.backgroundImage = img;
  this.acao = acao
}
```
Para fazer a moeda foi simples, bastou colocar a acao do item como:
```javascript	
this.moeda = new Item(
    "url('img/moeda.png')",
    () => notificarPonto(10 * INCREMENTO_PONTUACAO)
  )
```
> Diferente do proposto pelo trabalho, a pontuação da moeda é 10 vezes o valor de `INCREMENTO_PONTUACAO`, assim a proposta da moeda é mais válida

Para fazer o item especial, que eu nomeei de `up`, foi necessário a criação de outras duas funções, `ficarInvencivel` e `addDivDoTempoRestante`

A primeira é responsável por trocar a cor do personagem e remover as colisões(alterando momentaneamente o `TIPO_DE_JOGO`):
```javascript	
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
```
E a segunda é responsável por colocar uma `div` no *game* para mostrar o tempo restante da invencibilidade:
```javascript	
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
```