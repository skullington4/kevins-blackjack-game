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



/*------------ Event listeners --------------*/



/*------------ Functions --------------*/

init();


function init() {
    turn = 1;
    
    winner = null;
    pHand = [null, null, null, null, null];
    cHand = [null, null, null, null, null];
    render();
}

function render() {

}












