let scores = { p1: 0, p2: 0 };
let p1Choice = null, p2Choice = null;
let round1Winner = "";
let flippedCards = [];

// This array stays consistent until a full reset
let masterSymbols = ['🍎', '🍎', '💎', '💎', '⭐', '⭐', '🍀', '🍀', '🔥', '🔥', '🌈', '🌈', '👻', '👻', '🤖', '🤖'];
let matchedIndices = []; // Track which cards are already removed from play

// Initial Shuffle
shuffleSymbols();

function shuffleSymbols() {
    masterSymbols.sort(() => Math.random() - 0.5);
    matchedIndices = [];
}

function fullReset() {
    if (confirm("Reset everything? This will reshuffle the cards and clear points.")) {
        scores = { p1: 0, p2: 0 };
        document.getElementById('p1-match-score').innerText = "0";
        document.getElementById('p2-match-score').innerText = "0";
        shuffleSymbols();
        p1Choice = p2Choice = null;
        document.getElementById('rps-status').innerText = "Player 1, make your move!";
    }
}

// --- ROUND 1 ---
function handleRPS(choice) {
    const status = document.getElementById('rps-status');
    if (!p1Choice) {
        p1Choice = choice;
        status.innerText = "Player 2, choose!";
    } else {
        p2Choice = choice;
        const rules = { '🪨': '✂️', '📄': '🪨', '✂️': '📄' };
        if (p1Choice === p2Choice) {
            status.innerText = "Tie! Try again Player 1.";
            p1Choice = p2Choice = null;
        } else {
            round1Winner = (rules[p1Choice] === p2Choice) ? "p1" : "p2";
            alert(`${round1Winner === 'p1' ? 'Player 1' : 'Player 2'} wins!`);
            startRound2();
        }
    }
}

// --- ROUND 2 ---
function startRound2() {
    document.getElementById('round1').classList.add('hidden');
    document.getElementById('round2').classList.remove('hidden');
    document.getElementById('memory-status').innerText = `${round1Winner === 'p1' ? 'Player 1' : 'Player 2'}'s turn`;

    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    flippedCards = [];

    // Rebuild the grid using the SAME masterSymbols array
    masterSymbols.forEach((s, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.symbol = s;
        card.dataset.index = index;
        card.innerText = s;

        // If this card was matched in a previous round, keep it visible/green
        if (matchedIndices.includes(index)) {
            card.classList.add('matched');
        } else {
            card.onclick = () => flipCard(card);
        }

        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        if (flippedCards.length === 2) setTimeout(evaluateMemory, 800);
    }
}

function evaluateMemory() {
    const [c1, c2] = flippedCards;
    if (c1.dataset.symbol === c2.dataset.symbol) {
        c1.classList.add('matched');
        c2.classList.add('matched');
        matchedIndices.push(parseInt(c1.dataset.index), parseInt(c2.dataset.index));
        scores[round1Winner]++;
        document.getElementById(`${round1Winner}-match-score`).innerText = scores[round1Winner];
        alert("CORRECT! +1 Point.");
    } else {
        c1.classList.add('failed');
        c2.classList.add('failed');
        alert("WRONG! No point.");
    }

    // If all cards matched, reshuffle for the next set of points
    if (matchedIndices.length === masterSymbols.length) {
        alert("All cards found! Reshuffling board...");
        shuffleSymbols();
    }

    nextRound();
}

function nextRound() {
    if (scores.p1 >= 5 || scores.p2 >= 5) {
        alert(`GAME OVER! ${scores.p1 >= 5 ? 'Player 1' : 'Player 2'} wins the whole match!`);
        location.reload();
    } else {
        p1Choice = p2Choice = null;
        document.getElementById('round2').classList.add('hidden');
        document.getElementById('round1').classList.remove('hidden');
        document.getElementById('rps-status').innerText = "Player 1, make your move!";
    }
}