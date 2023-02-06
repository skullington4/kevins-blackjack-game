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
const wagerEl = document.getElementById('wagerAmount');
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
    render();
}

function render() {
    renderHand();
    renderScore();
    playerMoneyEl.innerText = `Player money: ${money}`;
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
    wager = wagerEl.value;
    money -= wager;
    hitButton.removeAttribute('disabled', 'disabled');
    stayButton.removeAttribute('disabled', 'disabled');
    startButton.setAttribute('disabled', 'disabled');
    // Dealing the firsh 4 cards
    pHand = [];
    cHand = [];
    shuffledDeck = new getNewShuffledDeck();

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
    render();
    scoreCheck();
}

function handleStay() {
    hitButton.setAttribute('disabled', 'disabled');
    stayButton.setAttribute('disabled', 'disabled');
    while (score.c < 16) {
        cHand.push(shuffledDeck.shift());
        render();
    }
    if (score.c > 21) {
        computerScoreEl.innerText += ": Bust!";
        money += wager*2;
        winnerEl.innerText = "Player wins!";
    } else if (score.p > score.c) {
        winnerEl.innerText = "Player wins!";
        money += wager*2;
    } else if (score.p < score.c) {
        winnerEl.innerText = "Computer wins!"
    } else {
        winnerEl.innerText = "It's a draw!"
        money += wager;
    }
    render();
    startButton.removeAttribute('disabled', 'disabled');
}   


function scoreCheck() {
    if (score.p > 21) {
        playerScoreEl.innerText += ": Bust!"
        winner = -1;
        winnerEl.innerText = "Computer wins!";
    }

}

function checkBlackjack() {

}