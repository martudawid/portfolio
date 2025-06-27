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

    let slideIndex = 0;
    showSlides(); // Inicia el slideshow automáticamente

    function showSlides() {
      let i;
      let slides = document.getElementsByClassName("mySlides");
      let dots = document.getElementsByClassName("dot");
      
      // Si no hay slides, no hacer nada (medida de seguridad)
      if (slides.length === 0) return;

      // Ocultar todos los slides
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      slideIndex++; // Avanzar al siguiente slide

      // Si llegamos al final, volver al primero
      if (slideIndex > slides.length) {slideIndex = 1}

      // Quitar la clase "active" de todos los puntos
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }

      // Mostrar el slide actual y marcar su punto como activo
      slides[slideIndex-1].style.display = "block";
      dots[slideIndex-1].className += " active";
      
      // Llamar a esta misma función después de 3 segundos
      setTimeout(showSlides, 3000); // Cambia de imagen cada 3 segundos
    }
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
