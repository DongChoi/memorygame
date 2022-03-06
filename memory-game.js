"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */


const MISMATCHING_CARDS = 1000;
const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

let colors = shuffle(COLORS);
let counter = document.getElementById("counter")
let counterNum = 0
let highscore = 9999

//score functions
function countScore(){
  counter.innerHTML = `<b><p>Counter: ${counterNum}</p><p>HighScore: ${highscore}</p></b>`
  counterNum++
}

function storeHighScore(){
  if(counterNum < highscore){
    localStorage.setItem("highscore", counterNum);
  }
}

function loadHighScore(){
  if(localStorage.getItem("highscore") < highscore){
  highscore = localStorage.getItem("highscore");
  }
  if(localStorage.getItem("highscore") === null){
    highscore = 9999;
  }
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */
// put a class of color of shuffled
// make sure colors shuffles everytime game is reset, started
function startGame(){
  let startButton = document.getElementById("startButton")
    startButton.addEventListener("click", startHandler);
}

//starting the game and setting up the board
function startGame(){
  let startButton = document.getElementById("startButton")
    startButton.addEventListener("click", startHandler);
}


function startHandler(evt){
  console.log("start button has been pressed", evt);
  shuffle(COLORS);
  createCards();
  loadHighScore();
  counterNum = 0;
  countScore();
}

function handleCardClick(evt) {
  let card = evt.target
  console.log(`handleCardClick: the card will now be revealed`)
  flipCard(card)
}

startGame()

function createCards() {
  let counter = 0
  const gameBoard = document.getElementById("game");
  gameBoard.innerHTML = ""
  /*i dont know if i need to write code here yet */
  for (let color of colors) {
    let setColor = document.createElement("div");
    setColor.setAttribute("class", color);
    setColor.setAttribute("value", color);
    setColor.classList.add("hidden");
    gameBoard.prepend(setColor);
  }
  makeClickable();
}


/** Flip a card face-up. */

//clicking the cards and its conditions
function flipCard(card) {
  card.classList.remove("hidden");
  card.classList.add("revealed");
  console.log(`flipCard: the ${card.getAttribute("value")} card has been flipped`);
  //remove attribute of hidden
  checkTwoCards();
}

function unFlipCards() {
  let unflipThese = document.getElementsByClassName("revealed")
  for(let hidden of unflipThese){
    hidden.classList.add("hidden")
  }
  let removerevealclass = document.getElementsByClassName("hidden")
  for(let removeReveal of removerevealclass){
    removeReveal.classList.remove("revealed")
  }
  countScore();
  makeClickable();
  // ... you need to write this ...
  //addclasslist of hidden if two cards are not the same colored class
}


function checkTwoCards(){
  //you have to add a timer so there cannot be more than two cards pressed
  // you have to make 
  let revealedCards = document.getElementsByClassName("revealed");
  console.log(revealedCards);
  if(revealedCards.length === 2){
    makeUnclickable()
    console.log("2 cards have been flipped, checking for two matching cards");
    let arr = []
    for(let i = 0; i < revealedCards.length; i++){
      arr.push(revealedCards[i].getAttribute("value"));
      console.log(arr);
    }
    arr.reduce(function(acc, next){
      if(acc === next){
        console.log("this is the acc and next", acc, next);
        console.log("FOUND MATCHING CARDS");
        setTimeout(function(){
          untouchable();
        }, FOUND_MATCH_WAIT_MSECS);
      }
      else {
        console.log("NON MATCHING PAIR");

        setTimeout(function(){
        unFlipCards()
        }, MISMATCHING_CARDS);
      }
    });
  }
}




//make cards clickable and unclickable so players cannot cheat
//untouchable make it so you cannot click the matched cards anymore so score does not increase
function untouchable(){
  console.log("untouchable: removing revealed tag and event listener");
  let matchingCards = document.getElementsByClassName("revealed");
  for(let untouch of matchingCards){
    untouch.classList.add("matched!");
    untouch.removeEventListener("click", handleCardClick);
  }
  let removeClassRevealed = document.getElementsByClassName("matched!");
  for(let removereveal of removeClassRevealed){
    removereveal.classList.remove("revealed");
  }
  if(checkForWin()){
    winHandler();
  }
  countScore();
  makeClickable();
}


function makeClickable(){
  console.log("making cards Clickable")
  let cards = document.getElementsByClassName("hidden");
  for(let i = 0; i < cards.length; i++){
    cards[i].addEventListener("click", handleCardClick)
  }
}


function makeUnclickable(){
  console.log("making cards Unclickable")
  let cards = document.getElementsByClassName("hidden");
  for(let i = 0; i < cards.length; i++){
    cards[i].removeEventListener("click", handleCardClick)
  }
}

/** Handle clicking on a card: this could be first-card or second-card. */


//handle win condition
//you can reuse this!
function checkForWin(){
  console.log("checking for win condition");
  return document.querySelector(".hidden") == undefined;
}

function winHandler(){
  storeHighScore()
  console.log("win condition has been met");
  alert("YOU WIN!");
}



