// Word Wise - Vocabulary Learning App with Crossword
class WordWiseApp {
    constructor() {
        this.words = [];
        this.currentCard = 0;
        this.currentQuiz = null;
        this.quizHistory = [];
        this.activeTab = 'manage';
        this.editingWord = null;
        this.flashcardDeck = [];
        this.selectedFile = null;
        this.crossword = null;
        this.selectedCell = null;
        this.selectedWord = null;
        this.currentDirection = 'across';
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.switchTab('manage'); // Initialize with manage tab
    }

    // Data Management
    loadData() {
        const savedWords = localStorage.getItem('wordwise-words');
        const savedQuizHistory = localStorage.getItem('wordwise-quiz-history');
        
        if (savedWords) {
            this.words = JSON.parse(savedWords);
        } else {
            // Load sample data with crossword usage tracking
            this.words = [
                {
                    id: 1,
                    word: "PERSPICACIOUS",
                    definition: "Having keen insight or discernment",
                    example: "She made a perspicacious observation about the market trends",
                    tags: ["GRE"],
                    difficulty: "advanced",
                    mastery_level: "learning",
                    created_at: "2025-08-01",
                    last_reviewed: null,
                    quiz_attempts: 0,
                    correct_answers: 0,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 2,
                    word: "UBIQUITOUS", 
                    definition: "Present everywhere at the same time",
                    example: "Smartphones have become ubiquitous in modern society",
                    tags: ["GRE"],
                    difficulty: "advanced",
                    mastery_level: "learning",
                    created_at: "2025-08-01",
                    last_reviewed: null,
                    quiz_attempts: 0,
                    correct_answers: 0,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 3,
                    word: "SERENDIPITY",
                    definition: "Pleasant surprise or fortunate accident",
                    example: "Finding that book was pure serendipity",
                    tags: ["General"],
                    difficulty: "intermediate",
                    mastery_level: "mastered",
                    created_at: "2025-08-01",
                    last_reviewed: "2025-08-01",
                    quiz_attempts: 3,
                    correct_answers: 3,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 4,
                    word: "EPHEMERAL",
                    definition: "Lasting for a very short time",
                    example: "The beauty of cherry blossoms is ephemeral",
                    tags: ["GRE"],
                    difficulty: "advanced",
                    mastery_level: "difficult",
                    created_at: "2025-08-01",
                    last_reviewed: "2025-08-01",
                    quiz_attempts: 2,
                    correct_answers: 0,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 5,
                    word: "PRAGMATIC",
                    definition: "Dealing with things sensibly and realistically",
                    example: "She took a pragmatic approach to solving the problem",
                    tags: ["business"],
                    difficulty: "intermediate",
                    mastery_level: "mastered",
                    created_at: "2025-08-01",
                    last_reviewed: "2025-08-01",
                    quiz_attempts: 4,
                    correct_answers: 4,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 6,
                    word: "COGNIZANT",
                    definition: "Having knowledge or being aware of",
                    example: "We must be cognizant of the environmental impact",
                    tags: ["GRE"],
                    difficulty: "advanced",
                    mastery_level: "learning",
                    created_at: "2025-08-01",
                    last_reviewed: null,
                    quiz_attempts: 0,
                    correct_answers: 0,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 7,
                    word: "VERBOSE",
                    definition: "Using or expressed in more words than are needed",
                    example: "His verbose explanation confused rather than clarified",
                    tags: ["GRE"],
                    difficulty: "advanced",
                    mastery_level: "difficult",
                    created_at: "2025-08-01",
                    last_reviewed: "2025-08-01",
                    quiz_attempts: 2,
                    correct_answers: 1,
                    crossword_used: 0,
                    crossword_solved: 0
                },
                {
                    id: 8,
                    word: "TENACIOUS",
                    definition: "Tending to keep a firm hold; persistent",
                    example: "Her tenacious spirit helped her overcome all obstacles",
                    tags: ["General"],
                    difficulty: "intermediate",
                    mastery_level: "mastered",
                    created_at: "2025-08-01",
                    last_reviewed: "2025-08-01",
                    quiz_attempts: 3,
                    correct_answers: 3,
                    crossword_used: 0,
                    crossword_solved: 0
                }
            ];
            this.saveData();
        }
        
        if (savedQuizHistory) {
            this.quizHistory = JSON.parse(savedQuizHistory);
        }
    }

    saveData() {
        localStorage.setItem('wordwise-words', JSON.stringify(this.words));
        localStorage.setItem('wordwise-quiz-history', JSON.stringify(this.quizHistory));
    }

    // Event Listeners
    setupEventListeners() {
        // Bottom navigation - Fixed event handling
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tab = e.currentTarget.dataset.tab;
                console.log('Tab clicked:', tab); // Debug log
                this.switchTab(tab);
            });
        });

        // Add word modal
        document.getElementById('add-word-fab').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openWordModal();
        });

        document.getElementById('word-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWord();
        });

        document.getElementById('cancel-word').addEventListener('click', () => {
            this.closeWordModal();
        });

        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeWordModal();
        });

        document.getElementById('modal-backdrop').addEventListener('click', () => {
            this.closeWordModal();
        });

        // Search and filters
        document.getElementById('search-input').addEventListener('input', () => {
            this.renderWords();
        });

        document.getElementById('mastery-filter').addEventListener('change', () => {
            this.renderWords();
        });

        document.getElementById('difficulty-filter').addEventListener('change', () => {
            this.renderWords();
        });

        // CSV Import/Export
        document.getElementById('import-csv-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openImportModal();
        });

        document.getElementById('export-csv-btn').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.exportCSV();
        });

        // Import modal
        document.getElementById('import-modal-close').addEventListener('click', () => {
            this.closeImportModal();
        });

        document.getElementById('cancel-import').addEventListener('click', () => {
            this.closeImportModal();
        });

        document.getElementById('csv-file-input').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        document.getElementById('process-import').addEventListener('click', () => {
            this.processImport();
        });

        // Crossword controls
        document.getElementById('generate-crossword').addEventListener('click', () => {
            this.generateCrossword();
        });

        document.getElementById('reveal-word').addEventListener('click', () => {
            this.revealRandomWord();
        });

        document.getElementById('check-puzzle').addEventListener('click', () => {
            this.checkAllWords();
        });

        // Flashcards
        document.getElementById('flip-card').addEventListener('click', () => {
            this.flipCard();
        });

        document.getElementById('prev-card').addEventListener('click', () => {
            this.previousCard();
        });

        document.getElementById('next-card').addEventListener('click', () => {
            this.nextCard();
        });

        document.getElementById('shuffle-cards').addEventListener('click', () => {
            this.shuffleCards();
        });

        document.getElementById('flashcard-filter').addEventListener('change', () => {
            this.setupFlashcards();
        });

        // Flashcard click to flip
        document.getElementById('flashcard').addEventListener('click', () => {
            this.flipCard();
        });

        // Flashcard mastery buttons
        document.getElementById('mark-difficult').addEventListener('click', () => {
            this.updateMastery('difficult');
        });

        document.getElementById('mark-learning').addEventListener('click', () => {
            this.updateMastery('learning');
        });

        document.getElementById('mark-mastered').addEventListener('click', () => {
            this.updateMastery('mastered');
        });

        // Quiz
        document.getElementById('start-quiz').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('next-question').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('new-quiz').addEventListener('click', () => {
            this.resetQuiz();
        });

        document.getElementById('review-answers').addEventListener('click', () => {
            this.showAnswerReview();
        });

        // Drag and drop for CSV
        const uploadArea = document.getElementById('file-upload-area');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].type === 'text/csv') {
                    this.handleFileSelect(files[0]);
                }
            });

            uploadArea.addEventListener('click', () => {
                document.getElementById('csv-file-input').click();
            });
        }
    }

    // Tab Management - Fixed implementation
    switchTab(tabName) {
        console.log('Switching to tab:', tabName); // Debug log
        this.activeTab = tabName;
        
        // Update navigation visual state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const activeNavItem = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        const tabContent = document.getElementById(`${tabName}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
            console.log('Tab content activated:', `${tabName}-tab`); // Debug log
        } else {
            console.error('Tab content not found:', `${tabName}-tab`); // Debug log
        }
        
        // Initialize specific tab content
        if (tabName === 'manage') {
            this.renderWords();
            this.updateStats();
        } else if (tabName === 'crossword') {
            // Crossword initialization happens when user clicks generate
            console.log('Crossword tab activated');
        } else if (tabName === 'flashcards') {
            this.setupFlashcards();
        } else if (tabName === 'quiz') {
            this.resetQuiz();
        } else if (tabName === 'progress') {
            this.renderProgress();
        }
    }

    // Crossword Generation and Management
    generateCrossword() {
        console.log('Generating crossword...');
        
        // Select suitable words for crossword (4-12 letters work best)
        const suitableWords = this.words.filter(word => 
            word.word.length >= 4 && word.word.length <= 12
        );
        
        if (suitableWords.length < 5) {
            this.showToast('Need at least 5 words (4-12 letters) to generate crossword', 'error');
            return;
        }

        // Simple crossword generation - create intersecting words
        this.crossword = this.createSimpleCrossword(suitableWords.slice(0, 8));
        this.renderCrossword();
        this.updateCrosswordProgress();
        this.showToast('New crossword generated!', 'success');
    }

    createSimpleCrossword(words) {
        // Create a simple 15x15 grid
        const size = 15;
        const grid = Array(size).fill(null).map(() => Array(size).fill(null));
        const placedWords = [];
        
        // Start with the longest word in the center
        const sortedWords = words.sort((a, b) => b.word.length - a.word.length);
        
        // Place first word horizontally in center
        if (sortedWords.length > 0) {
            const firstWord = sortedWords[0];
            const startRow = Math.floor(size / 2);
            const startCol = Math.floor((size - firstWord.word.length) / 2);
            
            for (let i = 0; i < firstWord.word.length; i++) {
                grid[startRow][startCol + i] = {
                    letter: firstWord.word[i],
                    wordId: firstWord.id,
                    isStart: i === 0,
                    number: i === 0 ? 1 : null
                };
            }
            
            placedWords.push({
                id: firstWord.id,
                word: firstWord.word,
                definition: firstWord.definition,
                direction: 'across',
                startRow: startRow,
                startCol: startCol,
                number: 1,
                length: firstWord.word.length,
                completed: false
            });
        }

        // Try to place remaining words
        let wordNumber = 2;
        for (let i = 1; i < Math.min(sortedWords.length, 6); i++) {
            const word = sortedWords[i];
            const placement = this.findWordPlacement(grid, word, placedWords, size);
            
            if (placement) {
                // Place the word
                for (let j = 0; j < word.word.length; j++) {
                    const row = placement.direction === 'across' ? placement.row : placement.row + j;
                    const col = placement.direction === 'across' ? placement.col + j : placement.col;
                    
                    if (!grid[row][col]) {
                        grid[row][col] = {
                            letter: word.word[j],
                            wordId: word.id,
                            isStart: j === 0,
                            number: j === 0 ? wordNumber : null
                        };
                    } else {
                        // Intersection - add word ID to existing cell
                        grid[row][col].wordId = [grid[row][col].wordId, word.id].flat();
                        if (j === 0) grid[row][col].number = wordNumber;
                    }
                }
                
                placedWords.push({
                    id: word.id,
                    word: word.word,
                    definition: word.definition,
                    direction: placement.direction,
                    startRow: placement.row,
                    startCol: placement.col,
                    number: wordNumber,
                    length: word.word.length,
                    completed: false
                });
                
                wordNumber++;
            }
        }

        return {
            grid: grid,
            words: placedWords,
            size: size
        };
    }

    findWordPlacement(grid, word, placedWords, size) {
        // Try to find intersection points with already placed words
        for (const placedWord of placedWords) {
            for (let i = 0; i < word.word.length; i++) {
                for (let j = 0; j < placedWord.word.length; j++) {
                    if (word.word[i] === placedWord.word[j]) {
                        // Found potential intersection
                        let newRow, newCol, newDirection;
                        
                        if (placedWord.direction === 'across') {
                            // Place new word vertically
                            newDirection = 'down';
                            newRow = placedWord.startRow - i;
                            newCol = placedWord.startCol + j;
                        } else {
                            // Place new word horizontally
                            newDirection = 'across';
                            newRow = placedWord.startRow + j;
                            newCol = placedWord.startCol - i;
                        }
                        
                        // Check if placement is valid
                        if (this.isValidPlacement(grid, word.word, newRow, newCol, newDirection, size)) {
                            return {
                                row: newRow,
                                col: newCol,
                                direction: newDirection
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    isValidPlacement(grid, word, row, col, direction, size) {
        // Check boundaries
        if (direction === 'across') {
            if (col < 0 || col + word.length > size || row < 0 || row >= size) return false;
        } else {
            if (row < 0 || row + word.length > size || col < 0 || col >= size) return false;
        }
        
        // Check for conflicts
        for (let i = 0; i < word.length; i++) {
            const checkRow = direction === 'across' ? row : row + i;
            const checkCol = direction === 'across' ? col + i : col;
            
            if (grid[checkRow][checkCol] && grid[checkRow][checkCol].letter !== word[i]) {
                return false;
            }
        }
        
        return true;
    }

    renderCrossword() {
        if (!this.crossword) return;
        
        console.log('Rendering crossword...');
        
        const gridContainer = document.getElementById('crossword-grid');
        gridContainer.innerHTML = '';
        gridContainer.style.gridTemplateColumns = `repeat(${this.crossword.size}, 1fr)`;
        
        // Create grid cells
        for (let row = 0; row < this.crossword.size; row++) {
            for (let col = 0; col < this.crossword.size; col++) {
                const cell = document.createElement('div');
                const cellData = this.crossword.grid[row][col];
                
                if (cellData) {
                    cell.className = 'crossword-cell';
                    cell.dataset.row = row;
                    cell.dataset.col = col;
                    
                    // Add number if it's a word start
                    if (cellData.number) {
                        const number = document.createElement('span');
                        number.className = 'cell-number';
                        number.textContent = cellData.number;
                        cell.appendChild(number);
                    }
                    
                    // Add input for user typing
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.answer = cellData.letter;
                    
                    // Mobile-optimized event listeners
                    input.addEventListener('input', (e) => this.handleCellInput(e, row, col));
                    input.addEventListener('focus', (e) => this.handleCellFocus(e, row, col));
                    input.addEventListener('keydown', (e) => this.handleCellKeydown(e, row, col));
                    
                    // Touch events for mobile
                    cell.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        this.handleCellTouch(row, col);
                    });
                    
                    cell.addEventListener('click', () => this.handleCellClick(row, col));
                    cell.appendChild(input);
                } else {
                    cell.className = 'crossword-cell black';
                }
                
                gridContainer.appendChild(cell);
            }
        }
        
        this.renderClues();
    }

    handleCellInput(e, row, col) {
        const input = e.target;
        const value = input.value.toUpperCase();
        input.value = value;
        
        // Auto-advance to next cell in current direction
        if (value && this.selectedWord) {
            this.moveToNextCell(row, col);
        }
        
        // Check if word is completed
        this.checkWordCompletion();
    }

    handleCellFocus(e, row, col) {
        this.selectCell(row, col);
    }

    handleCellKeydown(e, row, col) {
        if (e.key === 'Backspace' && !e.target.value) {
            this.moveToPreviousCell(row, col);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || 
                   e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.handleArrowKey(e.key, row, col);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.switchDirection();
        }
    }

    handleCellTouch(row, col) {
        this.selectCell(row, col);
    }

    handleCellClick(row, col) {
        this.selectCell(row, col);
    }

    selectCell(row, col) {
        // Clear previous selection
        document.querySelectorAll('.crossword-cell').forEach(cell => {
            cell.classList.remove('selected', 'highlight');
        });
        
        const cellData = this.crossword.grid[row][col];
        if (!cellData) return;
        
        this.selectedCell = { row, col };
        
        // Find words that contain this cell
        const wordsAtCell = this.crossword.words.filter(word => {
            if (word.direction === 'across') {
                return word.startRow === row && 
                       col >= word.startCol && 
                       col < word.startCol + word.length;
            } else {
                return word.startCol === col && 
                       row >= word.startRow && 
                       row < word.startRow + word.length;
            }
        });
        
        // Select word based on current direction or toggle if same cell clicked
        let selectedWord = wordsAtCell.find(w => w.direction === this.currentDirection);
        if (!selectedWord && wordsAtCell.length > 0) {
            selectedWord = wordsAtCell[0];
            this.currentDirection = selectedWord.direction;
        }
        
        if (selectedWord) {
            this.selectedWord = selectedWord;
            this.highlightWord(selectedWord);
            this.highlightClue(selectedWord);
        }
        
        // Focus the input
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const input = cell.querySelector('input');
        if (input) {
            input.focus();
        }
    }

    highlightWord(word) {
        for (let i = 0; i < word.length; i++) {
            const row = word.direction === 'across' ? word.startRow : word.startRow + i;
            const col = word.direction === 'across' ? word.startCol + i : word.startCol;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                if (row === this.selectedCell.row && col === this.selectedCell.col) {
                    cell.classList.add('selected');
                } else {
                    cell.classList.add('highlight');
                }
            }
        }
    }

    highlightClue(word) {
        // Clear previous clue highlights
        document.querySelectorAll('.clue-item').forEach(clue => {
            clue.classList.remove('selected');
        });
        
        // Highlight current clue
        const clueElement = document.querySelector(`[data-word-id="${word.id}"]`);
        if (clueElement) {
            clueElement.classList.add('selected');
            clueElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    moveToNextCell(row, col) {
        if (!this.selectedWord) return;
        
        let nextRow, nextCol;
        if (this.selectedWord.direction === 'across') {
            nextRow = row;
            nextCol = col + 1;
        } else {
            nextRow = row + 1;
            nextCol = col;
        }
        
        // Check if next cell is within the word
        if (this.selectedWord.direction === 'across') {
            if (nextCol < this.selectedWord.startCol + this.selectedWord.length) {
                this.selectCell(nextRow, nextCol);
            }
        } else {
            if (nextRow < this.selectedWord.startRow + this.selectedWord.length) {
                this.selectCell(nextRow, nextCol);
            }
        }
    }

    moveToPreviousCell(row, col) {
        if (!this.selectedWord) return;
        
        let prevRow, prevCol;
        if (this.selectedWord.direction === 'across') {
            prevRow = row;
            prevCol = col - 1;
        } else {
            prevRow = row - 1;
            prevCol = col;
        }
        
        // Check if previous cell is within the word
        if (this.selectedWord.direction === 'across') {
            if (prevCol >= this.selectedWord.startCol) {
                this.selectCell(prevRow, prevCol);
            }
        } else {
            if (prevRow >= this.selectedWord.startRow) {
                this.selectCell(prevRow, prevCol);
            }
        }
    }

    handleArrowKey(key, row, col) {
        let newRow = row, newCol = col;
        
        switch (key) {
            case 'ArrowLeft':
                newCol = Math.max(0, col - 1);
                this.currentDirection = 'across';
                break;
            case 'ArrowRight':
                newCol = Math.min(this.crossword.size - 1, col + 1);
                this.currentDirection = 'across';
                break;
            case 'ArrowUp':
                newRow = Math.max(0, row - 1);
                this.currentDirection = 'down';
                break;
            case 'ArrowDown':
                newRow = Math.min(this.crossword.size - 1, row + 1);
                this.currentDirection = 'down';
                break;
        }
        
        if (this.crossword.grid[newRow][newCol]) {
            this.selectCell(newRow, newCol);
        }
    }

    switchDirection() {
        if (!this.selectedCell) return;
        
        this.currentDirection = this.currentDirection === 'across' ? 'down' : 'across';
        this.selectCell(this.selectedCell.row, this.selectedCell.col);
    }

    checkWordCompletion() {
        if (!this.crossword) return;
        
        let completedCount = 0;
        
        this.crossword.words.forEach(word => {
            let wordComplete = true;
            let userWord = '';
            
            for (let i = 0; i < word.length; i++) {
                const row = word.direction === 'across' ? word.startRow : word.startRow + i;
                const col = word.direction === 'across' ? word.startCol + i : word.startCol;
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const input = cell?.querySelector('input');
                
                if (!input || !input.value) {
                    wordComplete = false;
                    break;
                }
                userWord += input.value;
            }
            
            // Check if word is correct
            if (wordComplete && userWord === word.word) {
                if (!word.completed) {
                    word.completed = true;
                    this.highlightCorrectWord(word);
                    
                    // Update word stats
                    const wordData = this.words.find(w => w.id === word.id);
                    if (wordData) {
                        wordData.crossword_solved++;
                        this.saveData();
                    }
                    
                    this.showToast(`Correct: ${word.word}!`, 'success');
                }
                completedCount++;
            } else if (word.completed && (!wordComplete || userWord !== word.word)) {
                // Word was completed but now incorrect
                word.completed = false;
                this.removeCorrectHighlight(word);
            }
        });
        
        this.updateCrosswordProgress();
        
        // Check if puzzle is complete
        if (completedCount === this.crossword.words.length) {
            this.showToast('Crossword completed! 🎉', 'success');
        }
    }

    highlightCorrectWord(word) {
        for (let i = 0; i < word.length; i++) {
            const row = word.direction === 'across' ? word.startRow : word.startRow + i;
            const col = word.direction === 'across' ? word.startCol + i : word.startCol;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('correct-word');
            }
        }
        
        // Mark clue as completed
        const clueElement = document.querySelector(`[data-word-id="${word.id}"]`);
        if (clueElement) {
            clueElement.classList.add('completed');
        }
    }

    removeCorrectHighlight(word) {
        for (let i = 0; i < word.length; i++) {
            const row = word.direction === 'across' ? word.startRow : word.startRow + i;
            const col = word.direction === 'across' ? word.startCol + i : word.startCol;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.remove('correct-word');
            }
        }
        
        // Remove completed status from clue
        const clueElement = document.querySelector(`[data-word-id="${word.id}"]`);
        if (clueElement) {
            clueElement.classList.remove('completed');
        }
    }

    renderClues() {
        if (!this.crossword) return;
        
        const acrossClues = this.crossword.words.filter(w => w.direction === 'across');
        const downClues = this.crossword.words.filter(w => w.direction === 'down');
        
        // Render across clues
        const acrossContainer = document.getElementById('across-clues');
        if (acrossContainer) {
            acrossContainer.innerHTML = acrossClues.length ? 
                acrossClues.map(word => `
                    <div class="clue-item" data-word-id="${word.id}" onclick="app.selectWordFromClue(${word.id})">
                        <span class="clue-number">${word.number}</span>
                        <span class="clue-text">${word.definition}</span>
                    </div>
                `).join('') : '<p class="no-clues">No across clues</p>';
        }
        
        // Render down clues
        const downContainer = document.getElementById('down-clues');
        if (downContainer) {
            downContainer.innerHTML = downClues.length ?
                downClues.map(word => `
                    <div class="clue-item" data-word-id="${word.id}" onclick="app.selectWordFromClue(${word.id})">
                        <span class="clue-number">${word.number}</span>
                        <span class="clue-text">${word.definition}</span>
                    </div>
                `).join('') : '<p class="no-clues">No down clues</p>';
        }
    }

    selectWordFromClue(wordId) {
        const word = this.crossword.words.find(w => w.id === wordId);
        if (word) {
            this.currentDirection = word.direction;
            this.selectCell(word.startRow, word.startCol);
        }
    }

    updateCrosswordProgress() {
        if (!this.crossword) return;
        
        const completed = this.crossword.words.filter(w => w.completed).length;
        const total = this.crossword.words.length;
        const percentage = total > 0 ? (completed / total) * 100 : 0;
        
        const wordsCompletedEl = document.getElementById('words-completed');
        const totalWordsEl = document.getElementById('total-words');
        const progressEl = document.getElementById('crossword-progress');
        
        if (wordsCompletedEl) wordsCompletedEl.textContent = completed;
        if (totalWordsEl) totalWordsEl.textContent = total;
        if (progressEl) progressEl.style.width = `${percentage}%`;
    }

    revealRandomWord() {
        if (!this.crossword) {
            this.showToast('Generate a crossword first!', 'error');
            return;
        }
        
        // Find incomplete words
        const incompleteWords = this.crossword.words.filter(w => !w.completed);
        if (incompleteWords.length === 0) {
            this.showToast('All words are already completed!', 'success');
            return;
        }
        
        // Select random incomplete word
        const randomWord = incompleteWords[Math.floor(Math.random() * incompleteWords.length)];
        
        // Fill in the word
        for (let i = 0; i < randomWord.length; i++) {
            const row = randomWord.direction === 'across' ? randomWord.startRow : randomWord.startRow + i;
            const col = randomWord.direction === 'across' ? randomWord.startCol + i : randomWord.startCol;
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            const input = cell?.querySelector('input');
            
            if (input) {
                input.value = randomWord.word[i];
            }
        }
        
        // Update word usage stats
        const wordData = this.words.find(w => w.id === randomWord.id);
        if (wordData) {
            wordData.crossword_used++;
        }
        
        this.checkWordCompletion();
        this.showToast(`Revealed: ${randomWord.word}`, 'success');
    }

    checkAllWords() {
        if (!this.crossword) {
            this.showToast('Generate a crossword first!', 'error');
            return;
        }
        
        this.checkWordCompletion();
        
        const completed = this.crossword.words.filter(w => w.completed).length;
        const total = this.crossword.words.length;
        
        this.showToast(`${completed} of ${total} words correct`, 'info');
    }

    // Words Management (rest of existing code...)
    renderWords() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const masteryFilter = document.getElementById('mastery-filter').value;
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        
        let filteredWords = this.words.filter(word => {
            const matchesSearch = word.word.toLowerCase().includes(searchTerm) ||
                                word.definition.toLowerCase().includes(searchTerm) ||
                                word.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesMastery = !masteryFilter || word.mastery_level === masteryFilter;
            const matchesDifficulty = !difficultyFilter || word.difficulty === difficultyFilter;
            
            return matchesSearch && matchesMastery && matchesDifficulty;
        });
        
        const grid = document.getElementById('words-grid');
        
        if (filteredWords.length === 0) {
            grid.innerHTML = '<div class="text-center text-secondary"><p>No words found. Add some words to get started!</p></div>';
            return;
        }
        
        grid.innerHTML = filteredWords.map(word => `
            <div class="word-card">
                <div class="word-card-header">
                    <h3 class="word-title">${word.word}</h3>
                    <div class="word-actions">
                        <button class="action-btn" onclick="app.editWord(${word.id})" title="Edit" aria-label="Edit word">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="action-btn" onclick="app.deleteWord(${word.id})" title="Delete" aria-label="Delete word">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="word-definition">${word.definition}</div>
                ${word.example ? `<div class="word-example">"${word.example}"</div>` : ''}
                <div class="word-meta">
                    <div class="word-tags">
                        ${word.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="mastery-badge mastery-badge--${word.mastery_level}">${word.mastery_level}</span>
                </div>
            </div>
        `).join('');
        
        this.updateWordCount();
    }

    updateWordCount() {
        document.querySelector('.word-count').textContent = `${this.words.length} words`;
    }

    openWordModal(word = null) {
        this.editingWord = word;
        const modal = document.getElementById('word-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('word-form');
        
        if (word) {
            title.textContent = 'Edit Word';
            document.getElementById('word-input').value = word.word;
            document.getElementById('definition-input').value = word.definition;
            document.getElementById('example-input').value = word.example || '';
            document.getElementById('tags-input').value = word.tags.join(', ');
            document.getElementById('difficulty-input').value = word.difficulty;
            document.getElementById('mastery-input').value = word.mastery_level;
        } else {
            title.textContent = 'Add New Word';
            form.reset();
        }
        
        modal.classList.remove('hidden');
    }

    closeWordModal() {
        document.getElementById('word-modal').classList.add('hidden');
        this.editingWord = null;
    }

    saveWord() {
        const wordInput = document.getElementById('word-input').value.trim().toUpperCase();
        const definitionInput = document.getElementById('definition-input').value.trim();
        const exampleInput = document.getElementById('example-input').value.trim();
        const tagsInput = document.getElementById('tags-input').value.trim();
        const difficultyInput = document.getElementById('difficulty-input').value;
        const masteryInput = document.getElementById('mastery-input').value;
        
        if (!wordInput || !definitionInput) {
            this.showToast('Word and definition are required', 'error');
            return;
        }
        
        // Check for duplicates (excluding current word if editing)
        const existingWord = this.words.find(w => 
            w.word.toLowerCase() === wordInput.toLowerCase() && 
            (!this.editingWord || w.id !== this.editingWord.id)
        );
        
        if (existingWord) {
            this.showToast('This word already exists', 'error');
            return;
        }
        
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
        
        if (this.editingWord) {
            // Update existing word
            const wordIndex = this.words.findIndex(w => w.id === this.editingWord.id);
            this.words[wordIndex] = {
                ...this.words[wordIndex],
                word: wordInput,
                definition: definitionInput,
                example: exampleInput,
                tags: tags,
                difficulty: difficultyInput,
                mastery_level: masteryInput
            };
            this.showToast('Word updated successfully', 'success');
        } else {
            // Add new word
            const newWord = {
                id: Date.now(),
                word: wordInput,
                definition: definitionInput,
                example: exampleInput,
                tags: tags,
                difficulty: difficultyInput,
                mastery_level: masteryInput,
                created_at: new Date().toISOString().split('T')[0],
                last_reviewed: null,
                quiz_attempts: 0,
                correct_answers: 0,
                crossword_used: 0,
                crossword_solved: 0
            };
            this.words.push(newWord);
            this.showToast('Word added successfully', 'success');
        }
        
        this.saveData();
        this.renderWords();
        this.updateStats();
        this.closeWordModal();
    }

    editWord(id) {
        const word = this.words.find(w => w.id === id);
        if (word) {
            this.openWordModal(word);
        }
    }

    deleteWord(id) {
        if (confirm('Are you sure you want to delete this word?')) {
            this.words = this.words.filter(w => w.id !== id);
            this.saveData();
            this.renderWords();
            this.updateStats();
            this.showToast('Word deleted successfully', 'success');
        }
    }

    // CSV Import/Export
    openImportModal() {
        document.getElementById('import-modal').classList.remove('hidden');
    }

    closeImportModal() {
        document.getElementById('import-modal').classList.add('hidden');
        document.getElementById('csv-file-input').value = '';
        document.getElementById('process-import').disabled = true;
        document.getElementById('import-progress').classList.add('hidden');
    }

    handleFileSelect(file) {
        if (!file || file.type !== 'text/csv') {
            this.showToast('Please select a valid CSV file', 'error');
            return;
        }
        
        document.getElementById('process-import').disabled = false;
        this.selectedFile = file;
        this.showToast('CSV file selected. Click "Import Words" to proceed.', 'success');
    }

    processImport() {
        if (!this.selectedFile) return;
        
        const progressDiv = document.getElementById('import-progress');
        const progressFill = document.getElementById('import-progress-fill');
        const statusText = document.getElementById('import-status');
        
        progressDiv.classList.remove('hidden');
        progressFill.style.width = '0%';
        statusText.textContent = 'Processing CSV file...';
        
        Papa.parse(this.selectedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                this.importCSVData(results.data, progressFill, statusText);
            },
            error: (error) => {
                this.showToast('Error parsing CSV file', 'error');
                console.error('CSV parse error:', error);
            }
        });
    }

    importCSVData(data, progressFill, statusText) {
        let imported = 0;
        let skipped = 0;
        let errors = 0;
        const total = data.length;
        
        progressFill.style.width = '20%';
        statusText.textContent = 'Validating data...';
        
        setTimeout(() => {
            data.forEach((row, index) => {
                const word = row.Word?.trim().toUpperCase();
                const definition = row.Definition?.trim();
                const example = row.Example?.trim() || '';
                const tags = row.Tags ? row.Tags.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag) : [];
                
                if (!word || !definition) {
                    errors++;
                    return;
                }
                
                // Check for duplicates
                const existingWord = this.words.find(w => w.word.toLowerCase() === word.toLowerCase());
                if (existingWord) {
                    skipped++;
                    return;
                }
                
                // Check word limit
                if (this.words.length >= 500) {
                    skipped++;
                    return;
                }
                
                const newWord = {
                    id: Date.now() + index,
                    word: word,
                    definition: definition,
                    example: example,
                    tags: tags,
                    difficulty: 'intermediate',
                    mastery_level: 'learning',
                    created_at: new Date().toISOString().split('T')[0],
                    last_reviewed: null,
                    quiz_attempts: 0,
                    correct_answers: 0,
                    crossword_used: 0,
                    crossword_solved: 0
                };
                
                this.words.push(newWord);
                imported++;
                
                const progress = ((index + 1) / total) * 80 + 20;
                progressFill.style.width = `${progress}%`;
            });
            
            progressFill.style.width = '100%';
            statusText.textContent = 'Import complete!';
            
            setTimeout(() => {
                this.saveData();
                this.renderWords();
                this.updateStats();
                this.closeImportModal();
                
                this.showToast(`Import complete: ${imported} words imported, ${skipped} skipped, ${errors} errors`, 'success');
            }, 1000);
        }, 500);
    }

    exportCSV() {
        const csvContent = [
            ['Word', 'Definition', 'Example', 'Tags', 'Difficulty', 'Mastery Level'],
            ...this.words.map(word => [
                word.word,
                word.definition,
                word.example || '',
                word.tags.join(', '),
                word.difficulty,
                word.mastery_level
            ])
        ];
        
        const csvString = csvContent.map(row => 
            row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `wordwise-vocabulary-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Vocabulary exported successfully', 'success');
    }

    // Flashcards
    setupFlashcards() {
        const filter = document.getElementById('flashcard-filter').value;
        let cards = this.words;
        
        if (filter) {
            cards = this.words.filter(word => word.mastery_level === filter);
        }
        
        this.flashcardDeck = [...cards];
        this.currentCard = 0;
        this.renderFlashcard();
    }

    renderFlashcard() {
        if (this.flashcardDeck.length === 0) {
            document.getElementById('flashcard').innerHTML = `
                <div class="flashcard-front">
                    <div class="flashcard-word">No cards available</div>
                </div>
                <div class="flashcard-back">
                    <div class="flashcard-definition">Add some words to start studying!</div>
                </div>
            `;
            document.getElementById('card-position').textContent = '0 / 0';
            return;
        }
        
        const word = this.flashcardDeck[this.currentCard];
        const flashcard = document.getElementById('flashcard');
        
        flashcard.classList.remove('flipped');
        flashcard.innerHTML = `
            <div class="flashcard-front">
                <div class="flashcard-word">${word.word}</div>
            </div>
            <div class="flashcard-back">
                <div class="flashcard-definition">${word.definition}</div>
                <div class="flashcard-example">${word.example || ''}</div>
            </div>
        `;
        
        document.getElementById('card-position').textContent = 
            `${this.currentCard + 1} / ${this.flashcardDeck.length}`;
    }

    flipCard() {
        document.getElementById('flashcard').classList.toggle('flipped');
    }

    previousCard() {
        if (this.flashcardDeck.length === 0) return;
        this.currentCard = (this.currentCard - 1 + this.flashcardDeck.length) % this.flashcardDeck.length;
        this.renderFlashcard();
    }

    nextCard() {
        if (this.flashcardDeck.length === 0) return;
        this.currentCard = (this.currentCard + 1) % this.flashcardDeck.length;
        this.renderFlashcard();
    }

    shuffleCards() {
        for (let i = this.flashcardDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.flashcardDeck[i], this.flashcardDeck[j]] = [this.flashcardDeck[j], this.flashcardDeck[i]];
        }
        this.currentCard = 0;
        this.renderFlashcard();
        this.showToast('Cards shuffled', 'success');
    }

    updateMastery(level) {
        if (this.flashcardDeck.length === 0) return;
        
        const word = this.flashcardDeck[this.currentCard];
        const wordIndex = this.words.findIndex(w => w.id === word.id);
        
        this.words[wordIndex].mastery_level = level;
        this.words[wordIndex].last_reviewed = new Date().toISOString().split('T')[0];
        
        this.saveData();
        this.updateStats();
        this.showToast(`Marked as ${level}`, 'success');
        
        // Update flashcard deck
        this.flashcardDeck[this.currentCard].mastery_level = level;
    }

    // Quiz System
    startQuiz() {
        const length = parseInt(document.getElementById('quiz-length').value);
        const questionType = document.getElementById('question-type').value;
        
        if (this.words.length < 4) {
            this.showToast('You need at least 4 words to start a quiz', 'error');
            return;
        }
        
        this.currentQuiz = {
            questions: this.generateQuizQuestions(length, questionType),
            currentQuestion: 0,
            answers: [],
            startTime: Date.now()
        };
        
        document.getElementById('quiz-setup').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
        
        this.renderQuestion();
    }

    generateQuizQuestions(length, questionType) {
        const shuffledWords = [...this.words].sort(() => Math.random() - 0.5);
        const questions = [];
        
        for (let i = 0; i < Math.min(length, shuffledWords.length); i++) {
            const correctWord = shuffledWords[i];
            let type = questionType;
            
            if (questionType === 'both') {
                type = Math.random() < 0.5 ? 'word-to-definition' : 'definition-to-word';
            }
            
            // Generate distractors
            const otherWords = shuffledWords.filter(w => w.id !== correctWord.id);
            const distractors = otherWords.sort(() => Math.random() - 0.5).slice(0, 3);
            
            const options = [correctWord, ...distractors].sort(() => Math.random() - 0.5);
            
            questions.push({
                word: correctWord,
                type: type,
                options: options,
                correctIndex: options.findIndex(opt => opt.id === correctWord.id)
            });
        }
        
        return questions;
    }

    renderQuestion() {
        const question = this.currentQuiz.questions[this.currentQuiz.currentQuestion];
        const progress = ((this.currentQuiz.currentQuestion + 1) / this.currentQuiz.questions.length) * 100;
        
        document.getElementById('quiz-progress').style.width = `${progress}%`;
        document.getElementById('question-counter').textContent = 
            `${this.currentQuiz.currentQuestion + 1} / ${this.currentQuiz.questions.length}`;
        
        const questionText = question.type === 'word-to-definition' 
            ? `What is the definition of "${question.word.word}"?`
            : `Which word means "${question.word.definition}"?`;
        
        document.getElementById('question-text').textContent = questionText;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = question.options.map((option, index) => {
            const optionText = question.type === 'word-to-definition' 
                ? option.definition 
                : option.word;
            
            return `
                <button class="quiz-option" onclick="app.selectAnswer(${index})">
                    ${optionText}
                </button>
            `;
        }).join('');
        
        document.getElementById('quiz-feedback').classList.add('hidden');
    }

    selectAnswer(selectedIndex) {
        const question = this.currentQuiz.questions[this.currentQuiz.currentQuestion];
        const isCorrect = selectedIndex === question.correctIndex;
        
        // Update word stats
        const wordIndex = this.words.findIndex(w => w.id === question.word.id);
        this.words[wordIndex].quiz_attempts++;
        if (isCorrect) {
            this.words[wordIndex].correct_answers++;
        }
        
        // Store answer
        this.currentQuiz.answers.push({
            question: question,
            selectedIndex: selectedIndex,
            correct: isCorrect
        });
        
        // Show feedback
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            option.disabled = true;
            if (index === question.correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        const feedbackDiv = document.getElementById('quiz-feedback');
        const feedbackMessage = document.getElementById('feedback-message');
        
        if (isCorrect) {
            feedbackMessage.innerHTML = `<span style="color: var(--color-success)">✓ Correct!</span>`;
        } else {
            const correctAnswer = question.type === 'word-to-definition' 
                ? question.word.definition 
                : question.word.word;
            feedbackMessage.innerHTML = `<span style="color: var(--color-error)">✗ Incorrect</span><br>Correct answer: ${correctAnswer}`;
        }
        
        feedbackDiv.classList.remove('hidden');
    }

    nextQuestion() {
        this.currentQuiz.currentQuestion++;
        
        if (this.currentQuiz.currentQuestion >= this.currentQuiz.questions.length) {
            this.finishQuiz();
        } else {
            this.renderQuestion();
        }
    }

    finishQuiz() {
        const correct = this.currentQuiz.answers.filter(a => a.correct).length;
        const total = this.currentQuiz.answers.length;
        const score = Math.round((correct / total) * 100);
        
        // Save quiz to history
        const quizResult = {
            date: new Date().toISOString().split('T')[0],
            score: score,
            correct: correct,
            total: total,
            duration: Date.now() - this.currentQuiz.startTime
        };
        
        this.quizHistory.unshift(quizResult);
        this.quizHistory = this.quizHistory.slice(0, 10); // Keep last 10 results
        
        this.saveData();
        
        // Show results
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('quiz-results').classList.remove('hidden');
        
        document.getElementById('final-score').textContent = `${score}%`;
        
        const resultsDetails = document.getElementById('results-details');
        resultsDetails.innerHTML = `
            <p><strong>Score:</strong> ${correct} / ${total} (${score}%)</p>
            <p><strong>Time:</strong> ${Math.round((Date.now() - this.currentQuiz.startTime) / 1000)}s</p>
            <h4>Review:</h4>
            ${this.currentQuiz.answers.map((answer, index) => {
                const icon = answer.correct ? '✓' : '✗';
                const color = answer.correct ? 'var(--color-success)' : 'var(--color-error)';
                return `<p><span style="color: ${color}">${icon}</span> ${answer.question.word.word}</p>`;
            }).join('')}
        `;
    }

    resetQuiz() {
        this.currentQuiz = null;
        document.getElementById('quiz-results').classList.add('hidden');
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('quiz-setup').classList.remove('hidden');
    }

    showAnswerReview() {
        this.showToast('Review functionality coming soon!', 'info');
    }

    // Progress and Statistics
    updateStats() {
        const total = this.words.length;
        const mastered = this.words.filter(w => w.mastery_level === 'mastered').length;
        const learning = this.words.filter(w => w.mastery_level === 'learning').length;
        const difficult = this.words.filter(w => w.mastery_level === 'difficult').length;
        
        document.getElementById('total-words-stat').textContent = total;
        document.getElementById('mastered-words-stat').textContent = mastered;
        document.getElementById('learning-words-stat').textContent = learning;
        document.getElementById('difficult-words-stat').textContent = difficult;
    }

    renderProgress() {
        this.updateStats();
        this.renderMasteryChart();
        this.renderQuizHistory();
    }

    renderMasteryChart() {
        const ctx = document.getElementById('mastery-chart').getContext('2d');
        
        const mastered = this.words.filter(w => w.mastery_level === 'mastered').length;
        const learning = this.words.filter(w => w.mastery_level === 'learning').length;
        const difficult = this.words.filter(w => w.mastery_level === 'difficult').length;
        
        // Clear any existing chart
        Chart.getChart(ctx)?.destroy();
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Mastered', 'Learning', 'Difficult'],
                datasets: [{
                    data: [mastered, learning, difficult],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderQuizHistory() {
        const historyContainer = document.getElementById('quiz-history-list');
        
        if (this.quizHistory.length === 0) {
            historyContainer.innerHTML = '<p class="text-secondary">No quiz attempts yet. Take your first quiz!</p>';
            return;
        }
        
        historyContainer.innerHTML = this.quizHistory.map(quiz => `
            <div class="quiz-history-item">
                <div>
                    <strong>${quiz.score}%</strong> (${quiz.correct}/${quiz.total})
                    <br>
                    <small class="text-secondary">${quiz.date}</small>
                </div>
                <div class="text-secondary">
                    ${Math.round(quiz.duration / 1000)}s
                </div>
            </div>
        `).join('');
    }

    // Utility Functions
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    window.app = new WordWiseApp();
});