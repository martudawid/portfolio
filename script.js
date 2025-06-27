document.addEventListener('DOMContentLoaded', () => {

    const gameContainer = document.getElementById('game-container');
    const gameImage = document.getElementById('game-image');
    const optionsContainer = document.getElementById('game-options');
    const gameFeedback = document.getElementById('game-feedback');

    const destinations = [
        {
            image: 'imagenes/viaje1.JPG',
            options: ['Monte Fuji', 'Alpes Suizos', 'Himalaya', 'Patagonia'],
            answer: 'Patagonia' 
        },
        {
            image: 'grecia.jpg',
            options: ['Egipto', 'México', 'Perú', 'Grecia'],
            answer: 'Grecia'
        },
        {
            image: 'imagenes/newyork.jpg', 
            options: ['Chicago', 'Los Ángeles', 'Nueva York', 'Toronto'],
            answer: 'Nueva York'
        }
    ];

    let currentQuestionIndex = 0;

    function loadQuestion(index) {
        if (!gameImage) return; 
        const question = destinations[index];
        gameImage.src = question.image;
        optionsContainer.innerHTML = '';
        gameFeedback.textContent = '';

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => checkAnswer(option, question.answer);
            optionsContainer.appendChild(button);
        });
    }

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            gameFeedback.textContent = '¡Correcto! Siguiente destino...';
            gameFeedback.style.color = '#2ecc71';
            setTimeout(() => {
                currentQuestionIndex = (currentQuestionIndex + 1) % destinations.length;
                loadQuestion(currentQuestionIndex);
            }, 1500);
        } else {
            gameFeedback.textContent = '¡Incorrecto! Intenta de nuevo.';
            gameFeedback.style.color = '#e74c3c';
        }
    }
    
    if(gameContainer) { 
        loadQuestion(currentQuestionIndex);
    }

   
    const todoInput = document.getElementById('todo-input');
    const todoAddBtn = document.getElementById('todo-add');
    const todoList = document.getElementById('todo-list');

    if(todoInput) {
        const savedTodos = JSON.parse(localStorage.getItem('bucketList')) || [];

        const saveTodos = () => {
            const todosToSave = Array.from(todoList.querySelectorAll('li')).map(li => li.textContent);
            localStorage.setItem('bucketList', JSON.stringify(todosToSave));
        };

        const addTodo = (text) => {
            if (text.trim() === '') return;
            const li = document.createElement('li');
            li.textContent = text;
            li.onclick = () => {
                li.remove();
                saveTodos();
            };
            todoList.appendChild(li);
        };

        savedTodos.forEach(todo => addTodo(todo));

        todoAddBtn.addEventListener('click', () => {
            addTodo(todoInput.value);
            todoInput.value = '';
            saveTodos();
        });
        
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTodo(todoInput.value);
                todoInput.value = '';
                saveTodos();
            }
        });
    }

    const galleryImages = document.querySelectorAll('.gallery-img');
    const lightboxModal = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxModal.style.display = 'flex';
                lightboxImg.src = img.src;
            });
        });

        const closeModal = () => { lightboxModal.style.display = 'none'; };
        lightboxClose.addEventListener('click', closeModal);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) { closeModal(); }
        });
    }


    const gameBoard = document.querySelector('.memory-game-container');
    const movesCounter = document.getElementById('memory-moves');
    
    if (gameBoard) {
        const icons = [
            'fa-plane', 'fa-plane',
            'fa-coffee', 'fa-coffee',
            'fa-camera-retro', 'fa-camera-retro',
            'fa-map-signs', 'fa-map-signs',
            'fa-suitcase', 'fa-suitcase',
            'fa-passport', 'fa-passport'
        ];

        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        
        function shuffle(array) {
            array.sort(() => 0.5 - Math.random());
        }

        function createBoard() {
            shuffle(icons);
            gameBoard.innerHTML = ''; 
            icons.forEach(icon => {
                const card = document.createElement('div');
                card.classList.add('memory-card');
                card.dataset.icon = icon;

                card.innerHTML = `
                    <div class="front-face"><i class="fas ${icon}"></i></div>
                    <div class="back-face"><i class="fas fa-question"></i></div>
                `;
                gameBoard.appendChild(card);
                card.addEventListener('click', flipCard);
            });
        }

        function flipCard() {
            if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
                moves++;
                movesCounter.textContent = `Movimientos: ${moves}`;
                this.classList.add('flipped');
                flippedCards.push(this);

                if (flippedCards.length === 2) {
                    checkForMatch();
                }
            }
        }

        function checkForMatch() {
            const [card1, card2] = flippedCards;
            if (card1.dataset.icon === card2.dataset.icon) {
                // Es un match
                card1.removeEventListener('click', flipCard);
                card2.removeEventListener('click', flipCard);
                matchedPairs++;
                if (matchedPairs === icons.length / 2) {
                    setTimeout(() => alert(`¡Ganaste en ${moves} movimientos!`), 500);
                }
                resetTurn();
            } else {
              
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    resetTurn();
                }, 1200);
            }
        }

        function resetTurn() {
            flippedCards = [];
        }

        createBoard();
    }
});
