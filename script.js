let scores = { p1: 0, p2: 0 };
        let currentPlayer = 'p1';
        let matrixPattern = [], userPattern = [], round1Winner = "";
        let isShowingPattern = false, matchedIndices = [], flippedCards = [];
        
        const symbols = ['🍎','🍎','💎','💎','⭐','⭐','🍀','🍀','🔥','🔥','🌈','🌈','👻','👻','🤖','🤖'];

        function initMatrix() {
            const board = document.getElementById('matrix-board');
            board.innerHTML = '';
            document.getElementById('matrix-status').innerText = `Player ${currentPlayer === 'p1' ? '1' : '2'}: Memorize!`;
            
            for (let i = 0; i < 25; i++) {
                const cell = document.createElement('div');
                cell.className = 'matrix-cell';
                cell.onclick = () => handleMatrixClick(i, cell);
                board.appendChild(cell);
            }
            setTimeout(showFullPattern, 1000);
        }

        function showFullPattern() {
            isShowingPattern = true;
            matrixPattern = [];
            userPattern = [];
            
            // Pick 7 unique tiles
            while(matrixPattern.length < 7) {
                let r = Math.floor(Math.random() * 25);
                if(!matrixPattern.includes(r)) matrixPattern.push(r);
            }

            const cells = document.querySelectorAll('.matrix-cell');
            
            // Show all at once
            matrixPattern.forEach(idx => {
                cells[idx].classList.add('highlight');
            });

            // Hide after 2 seconds
            setTimeout(() => {
                matrixPattern.forEach(idx => {
                    cells[idx].classList.remove('highlight');
                });
                isShowingPattern = false;
                document.getElementById('matrix-status').innerText = "Repeat the pattern!";
            }, 2000);
        }

        function handleMatrixClick(index, cell) {
            if (isShowingPattern || cell.classList.contains('correct')) return;
            
            if (matrixPattern.includes(index)) {
                cell.classList.add('correct');
                userPattern.push(index);
                if (userPattern.length === matrixPattern.length) {
                    round1Winner = currentPlayer;
                    setTimeout(startRound2, 500);
                }
            } else {
                cell.classList.add('wrong');
                isShowingPattern = true;
                setTimeout(() => {
                    currentPlayer = (currentPlayer === 'p1') ? 'p2' : 'p1';
                    updateUI(); 
                    initMatrix();
                }, 800);
            }
        }

        function startRound2() {
            document.getElementById('round1').classList.add('hidden');
            document.getElementById('round2').classList.remove('hidden');
            document.getElementById('memory-status').innerText = `P${round1Winner === 'p1'?1:2} wins Round 1! Pick 2 cards.`;
            
            const grid = document.getElementById('memory-grid');
            grid.innerHTML = '';
            symbols.forEach((s, i) => {
                const card = document.createElement('div');
                card.className = 'memory-card';
                card.innerText = s;
                if (matchedIndices.includes(i)) card.classList.add('matched');
                else card.onclick = () => flipCard(card, s, i);
                grid.appendChild(card);
            });
        }

        function flipCard(card, symbol, index) {
            if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
                card.classList.add('flipped');
                flippedCards.push({card, symbol, index});
                if (flippedCards.length === 2) setTimeout(checkMatch, 1000);
            }
        }

        function checkMatch() {
            const [c1, c2] = flippedCards;
            if (c1.symbol === c2.symbol) {
                c1.card.classList.add('matched'); c2.card.classList.add('matched');
                matchedIndices.push(c1.index, c2.index);
                scores[round1Winner]++;
                document.getElementById(`${round1Winner}-match-score`).innerText = scores[round1Winner];
            } else {
                c1.card.classList.remove('flipped'); c2.card.classList.remove('flipped');
            }
            flippedCards = [];
            
            if (matchedIndices.length === symbols.length) {
                symbols.sort(() => Math.random() - 0.5);
                matchedIndices = [];
            }
            
            if (scores.p1 >= 5 || scores.p2 >= 5) {
                alert(`Game Over! Player ${scores.p1>=5?1:2} Wins!`);
                location.reload();
            } else {
                document.getElementById('round2').classList.add('hidden');
                document.getElementById('round1').classList.remove('hidden');
                initMatrix();
            }
        }

        function updateUI() {
            document.getElementById('score-p1').classList.toggle('active', currentPlayer === 'p1');
            document.getElementById('score-p2').classList.toggle('active', currentPlayer === 'p2');
        }

        symbols.sort(() => Math.random() - 0.5);
        initMatrix();