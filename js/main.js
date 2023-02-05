import "./cardsMain";
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
let shuffledDeck = [];
let pBlackjack = null;
let cBlackjack = null;


/*------------ cached elements --------------*/
const winnerEl = document.getElementById('#winnerDisplay');
const playerScoreEl = document.getElementById('#pScore');
const computerScoreEl = document.getElementById('#cScore');
const wagerEl = document.getElementById('#wager');
const playerMoneyEl = document.getElementById('#pMoney');
const computerCardsEl = document.getElementById('#cCards');
const playerCardsEl = document.getElementById('#pCards');
const hitEl = document.getElementById('#hit');
const StayEl = document.getElementById('#stay');
const StartGameEl = document.getElementById('#placeWager');


/*------------ Event listeners --------------*/
StartGameEl.addEventListener('click', playHand)


/*------------ Functions --------------*/

init();


function init() {
    turn = 1;

    winner = null;
    pHand = [null, null, null, null, null, null, null, null, null, null];
    cHand = [null, null, null, null, null, null, null, null, null, null];
    winnerEl.style.visibility = "hidden";
    shuffledDeck = new getNewShuffledDeck();
    render();
}

function render() {
    renderHand();
    renderScore();
}


function renderHand(hand, player) {
    // This function should interate through each players hand,
    // update their respective score values, and updates the score divs
    let cardsInHand = "";
    hand.forEach(function(card) {
        cardsInHand += `<div class="card ${card.face}"></div>`;
      });


}


function renderScore (hand, player) {
    //This logic will include shuffledDeck[0-i].value to propogate the value
    // Thinking this will be a while loop
    

}


function playHand() {
    // This function is going to hold the logic for the whole individual hand

    // Dealing the firsh 4 cards
    pHand = shuffledDeck.shift();
    cHand = shuffledDeck.shift();
    pHand = shuffledDeck.shift();
    cHand = shuffledDeck.shift();
    render();




}





