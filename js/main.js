//require ("./cardsMain");

/*------------ Constants --------------*/
const PLAYER = {
    p: '1',
    c: '-1'
}






/*------------ State variables --------------*/
let money = 0;
let score = {
    p: 0,
    c: 0
};
let wager = 0;
let turn = 1;
let pHand = [];
let cHand = [];
let pBlackjack = null;
let cBlackjack = null;

/*------------ cached elements --------------*/
const winnerEl = document.getElementById('winnerDisplay');
const playerScoreEl = document.getElementById('pScore');
const computerScoreEl = document.getElementById('cScore');
const wagerEl = document.getElementById('wager');
const playerMoneyEl = document.getElementById('pMoney');
const computerCardsEl = document.getElementById('cCardHolder');
const playerCardsEl = document.getElementById('pCardHolder');
const hitButton = document.getElementById('hit');
const stayButton = document.getElementById('stay');
const startButton = document.getElementById('placeWager');


/*------------ Event listeners --------------*/
startButton.addEventListener('click', playHand);
hitButton.addEventListener('click', handleHit);
stayButton.addEventListener('click', handleStay);

/*------------ Functions --------------*/
init();

function init() {
    turn = 1;
    money = 5000;
    winner = null;
    winnerEl.style.visibility = "hidden";
    shuffledDeck = new getNewShuffledDeck();
    render();
}

function render() {
    renderHand();
    renderScore();
}


function renderHand() {
    // This function should interate through each players hand,
    // update their respective score values, and updates the score divs
    playerCardsEl.innerHTML = '';
    let cardsHtml = '';
    pHand.forEach(function(card) {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    });
    playerCardsEl.innerHTML = cardsHtml;

    // Display computers hand
    computerCardsEl.innerHTML = '';
    cardsHtml = '';
    cHand.forEach(function(card) {
      cardsHtml += `<div class="card ${card.face}"></div>`;
    });
    computerCardsEl.innerHTML = cardsHtml;


}


function renderScore () {
    //This logic will include shuffledDeck[0-i].value to propogate the value
    // Thinking this will be a while loop
    playerScoreEl.innerHTML = '';
    score.p = 0;
    pHand.forEach(function(card) {
        score.p += card.value;
    });
    playerScoreEl.innerText = score.p;
    
    score.c = 0;
    cHand.forEach(function(card) {
        score.c += card.value;
    });
    computerScoreEl.innerText = score.c;

}


function playHand() {
    // This function is going to hold the logic for the whole individual hand
    if (bet > money) {
        console.log("Nice try but your pockets aren't that deep");
        return;
    }
    money = money - bet;
    winnerEl.style.visibility = 'hidden';
    // Dealing the firsh 4 cards

    pHand.push(shuffledDeck.shift());
    cHand.push(shuffledDeck.shift());
    pHand.push(shuffledDeck.shift());
    cHand.push(shuffledDeck.shift());
    render();

    // Need to check for blackjack here

    // Next will be the player hand
    // I'm going to need to use a counter for the pHand array spot



}

function handleHit() {
    pHand.push(shuffledDeck.shift());
}

function handleStay() {

}


