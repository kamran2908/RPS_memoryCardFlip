let scores = { p1: 0, p2: 0 };
let tttBoard = Array(9).fill(null);
let currentPlayer = 'X'; // X is P1, O is P2
let round1Winner = "";
let flippedCards = [];
let matchedIndices = [];

const masterSymbols = ['🍎', '🍎', '💎', '💎', '⭐', '⭐', '🍀', '🍀', '🔥', '🔥', '🌈', '🌈', '👻', '👻', '🤖', '🤖'];

// --- INITIALIZATION ---
function shuffleSymbols() {
    masterSymbols.sort(() => Math.random() - 0.5);
    matchedIndices = [];
}

function fullReset() {
    if (confirm("Restart game and scores?")) {
        location.reload();
    }
}

// --- ROUND 1: TIC TAC TOE ---
function initTTT() {
    const board = document.getElementById('ttt-board');
    board.innerHTML = '';
    tttBoard.forEach((cell, i) => {
        const div = document.createElement('div');
        div.className = 'ttt-cell';
        div.innerText = cell || '';
        if (cell === 'X') div.style.color = 'var(--p1)';
        if (cell === 'O') div.style.color = 'var(--p2)';
        div.onclick = () => handleTTTMove(i);
        board.appendChild(div);
    });
    updateTurnUI();
}

function updateTurnUI() {
    document.getElementById('score-p1').classList.toggle('active', currentPlayer === 'X');
    document.getElementById('score-p2').classList.toggle('active', currentPlayer === 'O');
    document.getElementById('ttt-status').innerText = `Player ${currentPlayer === 'X' ? '1' : '2'}'s Turn (${currentPlayer})`;
}

function handleTTTMove(i) {
    if (tttBoard[i]) return;
    tttBoard[i] = currentPlayer;
    initTTT();

    if (checkTTTWin()) {
        round1Winner = (currentPlayer === 'X') ? 'p1' : 'p2';
        setTimeout(() => {
            alert(`Player ${currentPlayer === 'X' ? '1' : '2'} wins Tic-Tac-Toe!`);
            startRound2();
        }, 100);
    } else if (!tttBoard.includes(null)) {
        alert("It's a draw! Resetting Tic-Tac-Toe board...");
        tttBoard.fill(null);
        initTTT();
    } else {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        updateTurnUI();
    }
}

function checkTTTWin() {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8], // Rows
        [0,3,6], [1,4,7], [2,5,8], // Cols
        [0,4,8], [2,4,6]             // Diags
    ];
    return wins.some(pattern => {
        return pattern.every(idx => tttBoard[idx] === currentPlayer);
    });
}

// --- ROUND 2: MEMORY ---
function startRound2() {
    document.getElementById('round1').classList.add('hidden');
    document.getElementById('round2').classList.remove('hidden');
    document.getElementById('memory-status').innerText = `Player ${round1Winner === 'p1' ? '1' : '2'}, find a match!`;

    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    flippedCards = [];

    masterSymbols.forEach((s, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.symbol = s;
        card.dataset.index = index;
        card.innerText = s;

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
        alert("MATCH! Point awarded.");
    } else {
        c1.classList.add('failed');
        c2.classList.add('failed');
        alert("NO MATCH!");
    }

    if (matchedIndices.length === masterSymbols.length) {
        alert("Board cleared! Reshuffling for next round.");
        shuffleSymbols();
    }
    
    checkMatchEnd();
}

function checkMatchEnd() {
    if (scores.p1 >= 5 || scores.p2 >= 5) {
        alert(`GAME OVER! Player ${scores.p1 >= 5 ? '1' : '2'} wins the match!`);
        location.reload();
    } else {
        // Reset Round 1
        tttBoard.fill(null);
        currentPlayer = 'X';
        document.getElementById('round2').classList.add('hidden');
        document.getElementById('round1').classList.remove('hidden');
        initTTT();
    }
}

// Start
shuffleSymbols();
initTTT();
