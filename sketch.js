let mode = "menu";

let rtState = "nothing";
let rtStartTime = 0;
let reactionTime = 0;
let waitDuration = 0;
let waitStart = 0;

let cards = [];
let firstCard = null;
let secondCard = null;
let noFlip = false;

let colorList = [];
let columns = 4;
let rows = 4;
let rectWidth = 75;
let rectHeight = 115;
let flipTime = 1000;
let currentTime = 0;
let totalTime = 60;
let gameStartTime = 0;
let gameState = "start";
let streak = 0;
let seconds;


function setup() {
  createCanvas(800, 600);
  colorList = [
    color(255,0,0),
    color(0,255,0),
    color(0,0,255),
    color(255,255,0),
    color(255,0,255),
    color(0,255,255),
    color(255,128,0),
    color(128,0,255),
    color(200,100,100),
    color(100,200,100)
  ];
}

function draw() {
  if (mode == "menu") {
    drawMenu();
  }
  else if (mode == "reaction") {
    drawReaction();
  }
  else if (mode == "memory") {
    drawMemory();
  }

  if (currentTime > 0 && millis() > currentTime) {
    reflipCards();
  }
}

function drawMenu() {
  background(30);
  fill(255); 
  textAlign(CENTER, CENTER); textSize(40);
  text("Human Benchmark Lite", width/2, 120);
  textSize(24);
  text("Click a game", width/2, 200);

  fill(100,200,255); 
  rect(250,260,300,60);
  fill(255); 
  text("Reaction Time", 400, 290);

  fill(200,255,100); 
  rect(250,340,300,60);
  fill(0); 
  text("Memory Game", 400, 370);
}

function drawBackButton() {
  fill(255); 
  rect(20, 20, 100, 40);
  fill(0); 
  textAlign(CENTER, CENTER); 
  textSize(16);
  text("Back", 70, 40);
}

function mouseOnBack() {
  return mouseX > 20 && mouseX < 120 && mouseY > 20 && mouseY < 60;
}

function mousePressed() {
  if (mouseOnBack() && mode != "menu") {
    mode = "menu";
    rtState = "nothing";
    gameState = "start";
    return;
  }

  if (mode == "menu") {
    if (mouseX > 250 && mouseX < 550 && mouseY > 260 && mouseY < 320) {
      mode = "reaction"; rtState = "nothing";
    }
    if (mouseX > 250 && mouseX < 550 && mouseY > 340 && mouseY < 400) {
      mode = "memory"; gameState = "start";
    }
  } else if (mode == "reaction") {
    reactionClick();
  } else if (mode == "memory") {
    memoryMousePressed();
  }
}

function drawReaction() {
  textAlign(CENTER, CENTER); 
  textSize(28);

  if (rtState == "nothing") {
    background(30); fill(255);
    text("Click to start", width/2, height/2);
  }
  else if (rtState == "waiting") {
    background(200,0,0); fill(255);
    text("WAIT...", width/2, height/2);
    if (millis() - waitStart > waitDuration) {
      rtState = "go";
      rtStartTime = millis();
    }
  }
  else if (rtState == "go") {
    background(0,200,0); 
    fill(255);
    text("CLICK!", width/2, height/2);
  }
  else if (rtState == "result") {
    background(20); 
    fill(255);
    if (reactionTime < 0) {
       text("Too early!", width/2, height/2);
    }
    else {
      text("Reaction: " + reactionTime + " ms", width/2, height/2);
    } 
    textSize(18);
    text("Click to retry", width/2, height/2 + 40);
  }
  drawBackButton();
}

function reactionClick() {
  if (mouseOnBack()) {
    return;
  }
  if (rtState == "nothing") {
    rtState = "waiting";
    waitDuration = random(500, 6000);
    waitStart = millis();
  }
  else if (rtState == "go") {
    reactionTime = round(millis() - rtStartTime);
    rtState = "result";
  }
  else if (rtState == "waiting") {
    reactionTime = -1;
    rtState = "result";
  }
  else if (rtState == "result") {
    rtState = "nothing";
  }
}

function drawMemory() {
  if (gameState == "start") {
    memoryStartScreen();
  }
  else if (gameState == "instructions") {
    memoryInstructionsScreen();
  }
  else if (gameState == "game") {
    memoryGameScreen();
  }
  else if (gameState == "win") {
    memoryWinScreen();
  }
  else if (gameState == "lose") {
    memoryLoseScreen();
  }
  drawBackButton();
}

function memoryStartScreen() {
  background(204,229,255);
  textAlign(CENTER, CENTER); 
  fill(0); 
  textSize(60);
  text("Memory Match", width/2, 90);
  textSize(28);
  text("Click a difficulty to start", width/2, 160);

  fill(150,200,255);
  rect(250,195,300,55);
  fill(120,200,120); 
  rect(250,265,300,55);
  fill(120,120,220); 
  rect(250,335,300,55);
  fill(220,120,120); 
  rect(250,405,300,55);

  fill(0); 
  textSize(26);
  text("How to Play", 400, 222);
  text("Easy",        400, 292);
  text("Medium",      400, 362);
  text("Hard",        400, 432);
}

function memoryInstructionsScreen() {
  background(204,229,255);
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(48);
  text("How to Play", width/2, 60);

  textSize(18);
  textAlign(LEFT, TOP);

  let steps = [
    ["1  Flip two cards",  "Click any face-down card to reveal its colour."],
    ["2  Find the match",  "Same colour? They stay face-up — you matched them!"],
    ["3  Beat the clock",  "Match every pair before the timer hits zero to win."],
    ["Tip",                "Miss a pair and your streak resets. Go for a clean run!"]
  ];

  let stepY = 115;
  for (let i = 0; i < steps.length; i++) {
    fill(0);
    textStyle(BOLD);
    text(steps[i][0], 80, stepY);
    textStyle(NORMAL);
    fill(50);
    text(steps[i][1], 100, stepY + 26);
    stepY += 80;
  }

  fill(100,200,255);
  rect(250,470,300,55);
  fill(0);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("Back to menu", 400, 497);
  textStyle(NORMAL);
}

function memoryGameScreen() {
  background(0);
  fill(255); 
  textSize(30); 
  textAlign(LEFT, TOP);

  let elapsed = floor((millis() - gameStartTime) / 1000);
  seconds = totalTime - elapsed;
  if (seconds < 0) { 
    seconds = 0; gameState = "lose"; 
  }

  text("Timer:",650,40);  
  text(seconds,650,75);
  text("Streak:",650,220); 
  text(streak,650,255);

  for (let i = 0; i < cards.length; i++) {
    let c = cards[i];
    if (c.flipped || c.matched) {
      fill(c.color);
    }
    else {
       fill(200);
    }
    rect(c.x, c.y, rectWidth, rectHeight);
  }
}

function memoryWinScreen() {
  background(0,200,0);
  textAlign(CENTER, CENTER); 
  textSize(40); 
  fill(0);
  text("YOU WIN!", width/2, height/2 - 30);
  textSize(20); 
  text("Click to play again", width/2, height/2 + 60);
}

function memoryLoseScreen() {
  background(200,0,0);
  textAlign(CENTER, CENTER); 
  textSize(40); 
  fill(0);
  text("YOU LOSE!", width/2, height/2 - 30);
  textSize(20); text("Click to play again", width/2, height/2 + 60);
}

function memoryMousePressed() {
  if (mouseOnBack()) {
    return;
  }
  
  if (gameState == "start") {
    if (mouseX > 250 && mouseX < 550 && mouseY > 195 && mouseY < 250) {
      gameState = "instructions";
    }
    if (mouseX > 250 && mouseX < 550 && mouseY > 265 && mouseY < 320) { 
      setDifficulty("easy");   startMemoryGame(); 
    }
    if (mouseX > 250 && mouseX < 550 && mouseY > 335 && mouseY < 390) { 
      setDifficulty("medium"); startMemoryGame(); 
    }
    if (mouseX > 250 && mouseX < 550 && mouseY > 405 && mouseY < 460) { 
      setDifficulty("hard");   startMemoryGame(); 
    }
  }
  else if (gameState == "instructions") {
    if (mouseX > 250 && mouseX < 550 && mouseY > 460 && mouseY < 515) {
      gameState = "start";
    }
  }
  else if (gameState == "win" || gameState == "lose") {
    gameState = "start";
  }
  else if (gameState == "game" && !noFlip) {
    for (let i = 0; i < cards.length; i++) {
      let c = cards[i];
      if (mouseX > c.x && mouseX < c.x + rectWidth &&
          mouseY > c.y && mouseY < c.y + rectHeight) {
        flipCard(i,cards);
      }
    }
  }
}

function setDifficulty(level) {
  if (level == "easy")   { 
    columns = 3; 
    rows = 4; 
    totalTime = 45; 
    flipTime = 1400; 
  }
  if (level == "medium") { 
    columns = 4; 
    rows = 4; 
    totalTime = 30; 
    flipTime = 1000; 
  }
  if (level == "hard")   { 
    columns = 5; 
    rows = 4; 
    totalTime = 30; 
    flipTime = 700;  
  }
}

function startMemoryGame() {
  assignCards();
  gameStartTime = millis();
  gameState = "game";
  streak = 0;
  firstCard = null;
  secondCard = null;
  noFlip = false;
  currentTime = 0;
}

function assignCards() {
  let cardColors = [];
  let pairs = (columns * rows) / 2;
  for (let i = 0; i < pairs; i++) {
    cardColors.push(colorList[i]);
    cardColors.push(colorList[i]);
  }
  cardColors = shuffle(cardColors);
  cards = [];
  
  let startX   = 150;
  let startY   = 40;
  let spacingX = 20;
  let spacingY = 20;

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let index = i * rows + j;
      cards.push({
        color: cardColors[index],
        flipped: false,
        matched: false,
        x: startX + i * (rectWidth  + spacingX),
        y: startY + j * (rectHeight + spacingY)
      });
    }
  }
}

function flipCard(index, cardsArray) {
  let card = cardsArray[index];

  if (!card.flipped && !card.matched) {
    card.flipped = true;

    if (firstCard == null) {
      firstCard = card;
    } 
    else {
      secondCard = card;
      noFlip = true;

      if (firstCard.color === secondCard.color) {
        firstCard.matched = true;
        secondCard.matched = true;
        streak++;
        firstCard = null;
        secondCard = null;
        noFlip = false;
        

        let allMatched = true;
        
        for (let i = 0; i < cardsArray.length; i++) {
          allMatched = allMatched && cardsArray[i].matched;
        }
        if (allMatched) {
          gameState = "win";
        }
      } 
      else {
        streak = 0;
        currentTime = millis() + flipTime;
      }
    }
  }
}

function reflipCards() {
  if (firstCard && secondCard) {
    firstCard.flipped = false;
    secondCard.flipped = false;
  }
  
  firstCard = null;
  secondCard = null;
  noFlip = false;
  currentTime = 0;
}
