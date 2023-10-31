/*------------ Constants --------------*/
// This is used for the computers first card placed face down
const BACKCARD = {
    face: "back",
    value: 0
};
const SIZE = {
    small: "",
    large: " large"
};

/*------------ State variables --------------*/
let money = 0; //Player money
let score = {
    p: 0,
    c: 0
};
let wager = 0;
let pHand = []; // Holds player cards object
let cHand = []; // Holds comp cards object
let pBlackjack = null; // player blackjack boolean
let cBlackjack = null; // Comp blackjack boolean
let stayed; // Boolean to mark when player hits stay button and moves to comp turn.
let tempCard = []; // Holds the value of the face down card
let newDeck; // Deck in use
let win;
let windowHeight, windowWidth; // Used to track screen size
let cardSize; // Used to set the card size for bigger or smaller screen


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
const bet10Button = document.getElementById('bet10');
const bet50Button = document.getElementById('bet50');
const bet100Button = document.getElementById('bet100');
const bet1000Button = document.getElementById('bet1000');
const resetButton = document.getElementById('reset');


/*------------ Event listeners --------------*/
startButton.addEventListener('click', playHand);
hitButton.addEventListener('click', handleHit);
stayButton.addEventListener('click', handleStay);
bet10Button.addEventListener('click', function() {
    wagerEl.value = 10;
    playHand();
});
bet50Button.addEventListener('click', function() {
    wagerEl.value = 50;
    playHand();
});
bet100Button.addEventListener('click', function() {
    wagerEl.value = 100;
    playHand();
});
bet1000Button.addEventListener('click', function() {
    wagerEl.value = 1000;
    playHand();
});
resetButton.addEventListener('click', init);

/*------------ Functions --------------*/
init();

function init() {
    money = 5000;
    wager = 0;
    pHand = [];
    cHand = [];
    newDeck = new getNewShuffledDeck();
    startNoHitNoStay();
    stayed = false;
    render();
}


function render() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    if (windowWidth < 900) {
        cardSize = SIZE.small;
    } else {
        cardSize = SIZE.large;
    }
    renderHand();
    playerMoneyEl.innerText = `$${money}`;
    
}


function renderHand() {
    // This function should iterate through each players hand and display their cards
    // And updates score
    playerCardsEl.innerHTML = '';
    let cardsHtml = '';
    // --------Player section------------
    pHand.forEach(function(card) {
      cardsHtml += `<div class="card ${card.face}${cardSize}"></div>`;
    });
    playerCardsEl.innerHTML = cardsHtml;

    let i = numAces(pHand);

    // Player score section
    playerScoreEl.innerHTML = '';
    score.p = 0;
    pHand.forEach(function(card) {
        score.p += card.value;
    });
    //Checking if there is an ace AND bust to make ace 11 -> 1
    if (score.p > 21) {
        while (i > 0) {
            score.p -= 10;
            if (score.p <= 21) {
                break;
            }
            i--;
        }
    }
    playerScoreEl.innerText = score.p;

    // Checks for player bust
    if (score.p > 21) {
        playerScoreEl.innerText += ": Bust!"
        winnerEl.innerText = "Computer wins!";
        win = true;
        startNoHitNoStay()
    }

    // Checks for any winning hands or if player stayed. 
    // If any are true, we want to display both cards, otherwise keep first card down
    if (stayed || pBlackjack || cBlackjack || win) {
        cHand[0] = tempCard;
    }
    else if (!stayed && cHand.length > 0) {
        cHand[0] = BACKCARD;
    }

    //  --------Computer section------------
    computerCardsEl.innerHTML = '';
    cardsHtml = '';
    cHand.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}${cardSize}"></div>`;
    });
    computerCardsEl.innerHTML = cardsHtml;

    //Computer score section
    i = numAces(cHand);

    score.c = 0;
    cHand.forEach(function(card) {
        score.c += card.value;
    });
    
    if (score.c > 21) {
        while (i > 0) {
            score.c -= 10;
            if (score.c <= 21) {
                break;
            }
            i--;
        }
    }
    // Checks for bust
    if (score.c > 21) {
        computerScoreEl.innerText = `${score.c}: Bust!`;

    } else {

        computerScoreEl.innerText = score.c;
    }
}


function btnHitStayNoStart() {
    //This function is for disabling start and enabling hit and stay
    hitButton.removeAttribute('disabled', 'disabled');
    stayButton.removeAttribute('disabled', 'disabled');
    startButton.setAttribute('disabled', 'disabled');
    bet10Button.setAttribute('disabled', 'disabled');
    bet50Button.setAttribute('disabled', 'disabled');
    bet100Button.setAttribute('disabled', 'disabled');
    bet1000Button.setAttribute('disabled', 'disabled');

}

function startNoHitNoStay() {
    // function enables start and disabled hit/stay
    hitButton.setAttribute('disabled', 'disabled');
    stayButton.setAttribute('disabled', 'disabled');
    startButton.removeAttribute('disabled', 'disabled');
    bet10Button.removeAttribute('disabled', 'disabled');
    bet50Button.removeAttribute('disabled', 'disabled');
    bet100Button.removeAttribute('disabled', 'disabled');
    bet1000Button.removeAttribute('disabled', 'disabled');
}

function playHand() {
    // function when place wager start hand button is pressed
    // Checks to make sure wage is valid, deals first 4 cards, checks for blackjack,
    // then waits for player's next move
    wager = Number(wagerEl.value);
    if (typeof wager !== "number" || isNaN(wager)) {
        winnerEl.innerText = "You must use numbers only!";
    } else if (wager > money) {
        winnerEl.innerText = "You do not have enough money to place this bet!";
    } else if (wager <= 0) {
        winnerEl.innerText = "You must enter a bet!";
    }
    else {
        stayed = false;
        win = false;
        money -= wager;
        winnerEl.innerText = "";
        btnHitStayNoStart();
        // Dealing the firsh 4 cards
        pHand = [];
        cHand = [];

        checkDeck()
        pHand.push(newDeck.shift());
        checkDeck()
        cHand.push(newDeck.shift());
        checkDeck()
        pHand.push(newDeck.shift());
        checkDeck()
        cHand.push(newDeck.shift());
        tempCard = cHand[0];    
        checkBlackjack();
        render();
    }


}

function handleHit() {
    checkDeck()
    pHand.push(newDeck.shift());
    render();
}

function handleStay() {
    stayed = true;
    render();
    hitButton.setAttribute('disabled', 'disabled');
    stayButton.setAttribute('disabled', 'disabled');
    while (score.c < 16) {
        checkDeck()
        cHand.push(newDeck.shift());
        render();
    }
    if (score.c > 21) {
        money += wager*2;
        winnerEl.innerText = "Player wins!";
    } else if (score.p > score.c) {
        winnerEl.innerText = "Player wins!";
        money += wager*2;
    } else if (score.p < score.c) {
        winnerEl.innerText = "Computer wins!"
    } else {
        winnerEl.innerText = "It's a draw!"
        money = Number(money) + Number(wager);
    }
    render();
    startNoHitNoStay();
}   

function checkDeck() {
    // Checks the deck to make sure there are cards left. If length = 0, get new shuffled deck
    if (newDeck.length === 0) {
        newDeck = new getNewShuffledDeck();
    }
}

function checkBlackjack() {
    cBlackjack = false;
    pBlackjack = false;
    cHand[0] = tempCard;
    //Check for player blackjack
    let ace = false;
    let jack = false;
    // Player check
    // This will check for any aces
    if (numAces(pHand)>= 1) {
            ace = true;
        }
    // This checks for any jacks
    if (isJacks(pHand)) {
        jack = true;
    }
    if (ace && jack) {
        pBlackjack = true;
    }

    ace = false;
    jack = false;

    //Computer check
    if (numAces(cHand)>=1) {
            ace = true;
        }
    if (isJacks(cHand)) {
        jack = true;
    }
    if (ace && jack) {
        cBlackjack = true;
    }
    // These check for combos of player/comp blackjack
    if (pBlackjack && cBlackjack) {
        winnerEl.innerText = "Both players got blackjack!!!";
        win = true;
        money += wager;
        startNoHitNoStay();
    } else if (pBlackjack) {
        winnerEl.innerText = "Player wins with blackjack!!!";
        money += wager*2.5;
        win = true;
        startNoHitNoStay();
    } else if(cBlackjack) {
        winnerEl.innerText = "Computer wins with blackjack!!!";
        win = true;
        startNoHitNoStay();
        render();
    } else if (!pBlackjack && !cBlackjack) {
        cHand[0] = BACKCARD;
    }
    

}

// Checks a hand for how many aces there are.
// Used for score tracking and blackJack
function numAces(hand) {
    let total = 0;
    hand.forEach(function(card) {
        if(card.face === "dA" || card.face === "cA" || 
        card.face === "hA" || card.face === "sA") {
            total++;
        }
    })
    return total;
}

// Checks hand to see if there are any jacks in a hand.
// Used to check for blackJack
function isJacks(hand) {
    let foundJack = false;
    hand.forEach(function(card) {
        if(card.face === "dJ" || card.face === "cJ" || 
        card.face === "hJ" || card.face === "sJ") {
            foundJack = true;
        }
    })
    return foundJack;
}