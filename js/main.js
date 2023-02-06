/*------------ Constants --------------*/
const BACKCARD = {
    face: "back",
    value: 0
};

/*------------ State variables --------------*/
let money = 0;
let score = {
    p: 0,
    c: 0
};
let wager = 0;
let pHand = [];
let cHand = [];
let pBlackjack = null;
let cBlackjack = null;
let stayed;
let tempCard = [];

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
    money = 5000;
    shuffledDeck = new getNewShuffledDeck();
    startNoHitNoStay();
    stayed = false;
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

    // Display computers hand - players turn (first card down)
    if (!stayed && cHand.length > 0) {
        cHand[0] = BACKCARD;
    }
    else if (stayed) {
        cHand[0] = tempCard;
    }

    // Display full computer hand
        computerCardsEl.innerHTML = '';
        cardsHtml = '';
        cHand.forEach(function(card) {
        cardsHtml += `<div class="card ${card.face}"></div>`;
        });
        computerCardsEl.innerHTML = cardsHtml;


}


function renderScore () {
    let i = numAces(pHand);


    playerScoreEl.innerHTML = '';
    score.p = 0;
    pHand.forEach(function(card) {
        score.p += card.value;
    });
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
    computerScoreEl.innerText = score.c;
}

function btnHitStayNoStart() {
    //This function is for disabling start and enabling hit and stay
    hitButton.removeAttribute('disabled', 'disabled');
    stayButton.removeAttribute('disabled', 'disabled');
    startButton.setAttribute('disabled', 'disabled');
}

function startNoHitNoStay() {
    hitButton.setAttribute('disabled', 'disabled');
    stayButton.setAttribute('disabled', 'disabled');
    startButton.removeAttribute('disabled', 'disabled');
}

function playHand() {
    
    stayed = false;
    // This function is going to hold the logic for the whole individual hand
    wager = Number(wagerEl.value);
    money -= wager;
    winnerEl.innerText = "";
    wagerEl.innerText = "";
    btnHitStayNoStart();
    // Dealing the firsh 4 cards
    pHand = [];
    cHand = [];
    if (shuffledDeck.length === 0) {
        shuffledDeck = new getNewShuffledDeck();
    }

    pHand.push(shuffledDeck.shift());
    cHand.push(shuffledDeck.shift());
    pHand.push(shuffledDeck.shift());
    cHand.push(shuffledDeck.shift());
    tempCard = cHand[0];
    render();

    // Need to check for blackjack here
    checkBlackjack();

}

function handleHit() {
    if (shuffledDeck.length === 0) {
        shuffledDeck = new getNewShuffledDeck();
    }
    pHand.push(shuffledDeck.shift());
    render();
    scoreCheck();
}

function handleStay() {
    stayed = true;
    render();
    hitButton.setAttribute('disabled', 'disabled');
    stayButton.setAttribute('disabled', 'disabled');
    while (score.c < 16) {
        if (shuffledDeck.length === 0) {
            shuffledDeck = new getNewShuffledDeck();
        }
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
        money = Number(money) + Number(wager);
    }
    render();
    startButton.removeAttribute('disabled', 'disabled');
}   


function scoreCheck() {
    if (score.p > 21) {
        playerScoreEl.innerText += ": Bust!"
        winnerEl.innerText = "Computer wins!";
        startNoHitNoStay()
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
    if (numAces(cHand)) {
            ace = true;
        }
    if (isJacks(cHand)) {
        jack = true;
    }
    if (ace && jack) {
        cBlackjack = true;
    }

    if (pBlackjack && cBlackjack) {
        winnerEl.innerText = "Both players got blackjack!!!";
        money += wager;
        startNoHitNoStay();
    } else if (pBlackjack) {
        winnerEl.innerText = "Player wins with blackjack!!!";
        money += wager*3;
        startNoHitNoStay();
    } else if(cBlackjack) {
        winnerEl.innerText = "Computer wins with blackjack!!!";
        startNoHitNoStay();
    } else {
        cHand[0] = BACKCARD;
    }


}

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

function isJacks(hand) {
    hand.forEach(function(card) {
        if(card.face === "dJ" || card.face === "cJ" || 
        card.face === "hJ" || card.face === "sJ") {
            return true;
        }
    })
}

function testingBJ() {
    cHand[0].face = "sA";
    cHand[0].value = 11;
    cHand[1].face = "sJ";
    cHand[1].value = 10;

    pHand[0].face = "sA";
    pHand[0].value = 11;
    pHand[1].face = "sA";
    pHand[1].value = 11;
    checkBlackjack();
    render();
}

function testingTie() {
    cHand[0].face = "sJ";
    cHand[0].value = 10;
    cHand[1].face = "sK";
    cHand[1].value = 10;

    pHand[0].face = "sJ";
    pHand[0].value = 10;
    pHand[1].face = "sK";
    pHand[1].value = 10;
    render();
}