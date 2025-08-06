// Enhanced VocabMaster App with CSV Import/Export - Fixed Version

class VocabularyApp {
    constructor() {
        this.words = [];
        this.currentFlashcardIndex = 0;
        this.flashcardWords = [];
        this.isFlashcardFlipped = false;
        this.quizData = null;
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.quizHistory = this.loadQuizHistory();
        this.maxWords = 500;
        this.selectedCSVFile = null;
        this.parsedCSVData = null;
        
        this.init();
    }

    async init() {
        await this.loadInitialData();
        this.setupEventListeners();
        this.renderWords();
        this.updateProgress();
        this.setupFlashcards();
        this.showTab('words');
    }

    async loadInitialData() {
        // Load from localStorage first
        const savedWords = localStorage.getItem('vocabularyWords');
        if (savedWords) {
            this.words = JSON.parse(savedWords);
        } else {
            // Load sample data
            this.words = [
                {
                    id: 1,
                    word: "Perspicacious",
                    definition: "Having keen insight or discernment",
                    example: "She made a perspicacious observation about the market trends",
                    tags: ["GRE", "advanced"],
                    difficulty: "advanced",
                    mastery_level: "learning",
                    created_at: "2025-07-31",
                    last_reviewed: null
                },
                {
                    id: 2,
                    word: "Ubiquitous", 
                    definition: "Present everywhere at the same time",
                    example: "Smartphones have become ubiquitous in modern society",
                    tags: ["GRE", "technology"],
                    difficulty: "advanced",
                    mastery_level: "learning",
                    created_at: "2025-07-31",
                    last_reviewed: null
                },
                {
                    id: 3,
                    word: "Serendipity",
                    definition: "Pleasant surprise or fortunate accident", 
                    example: "Finding that book was pure serendipity",
                    tags: ["General", "emotions"],
                    difficulty: "intermediate",
                    mastery_level: "mastered",
                    created_at: "2025-07-31",
                    last_reviewed: "2025-07-31"
                },
                {
                    id: 4,
                    word: "Aberrant",
                    definition: "Departing from an accepted standard; abnormal or deviant",
                    example: "The student's aberrant behavior in class concerned the teacher",
                    tags: ["GRE", "psychology"],
                    difficulty: "advanced", 
                    mastery_level: "difficult",
                    created_at: "2025-07-31",
                    last_reviewed: null
                },
                {
                    id: 5,
                    word: "Benevolent",
                    definition: "Well-meaning and kindly; charitable",
                    example: "The benevolent donor gave millions to local charities",
                    tags: ["General", "personality"],
                    difficulty: "intermediate",
                    mastery_level: "mastered",
                    created_at: "2025-07-31",
                    last_reviewed: "2025-07-31"
                }
            ];
            this.saveWords();
        }
    }

    saveWords() {
        localStorage.setItem('vocabularyWords', JSON.stringify(this.words));
    }

    saveQuizHistory() {
        localStorage.setItem('quizHistory', JSON.stringify(this.quizHistory));
    }

    loadQuizHistory() {
        const saved = localStorage.getItem('quizHistory');
        return saved ? JSON.parse(saved) : [];
    }

    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.currentTarget.dataset.tab;
                this.showTab(tab);
            });
        });

        // Add word button
        const addWordBtn = document.getElementById('add-word-btn');
        if (addWordBtn) {
            addWordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showWordModal();
            });
        }

        // Word Modal events
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideWordModal();
            });
        }
        
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideWordModal();
            });
        }

        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveWord();
            });
        }

        // CSV Import/Export events
        const importBtn = document.getElementById('import-csv-btn');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCSVImportModal();
            });
        }

        const exportBtn = document.getElementById('export-csv-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportToCSV();
            });
        }

        // CSV Modal events
        const csvModalClose = document.getElementById('csv-modal-close');
        if (csvModalClose) {
            csvModalClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideCSVImportModal();
            });
        }

        const csvCancelBtn = document.getElementById('csv-cancel-btn');
        if (csvCancelBtn) {
            csvCancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideCSVImportModal();
            });
        }

        const csvFileInput = document.getElementById('csv-file-input');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                this.handleCSVFileSelection(file);
            });
        }

        const csvImportBtn = document.getElementById('csv-import-btn');
        if (csvImportBtn) {
            csvImportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.processCSVImport();
            });
        }

        // Search and filter
        const wordSearch = document.getElementById('word-search');
        if (wordSearch) {
            wordSearch.addEventListener('input', () => {
                this.filterWords();
            });
        }

        const tagFilter = document.getElementById('tag-filter');
        if (tagFilter) {
            tagFilter.addEventListener('change', () => {
                this.filterWords();
            });
        }

        const masteryFilter = document.getElementById('mastery-filter');
        if (masteryFilter) {
            masteryFilter.addEventListener('change', () => {
                this.filterWords();
            });
        }

        // Flashcard events
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.addEventListener('click', () => {
                this.flipFlashcard();
            });
        }

        const prevCard = document.getElementById('prev-card');
        if (prevCard) {
            prevCard.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousFlashcard();
            });
        }

        const nextCard = document.getElementById('next-card');
        if (nextCard) {
            nextCard.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextFlashcard();
            });
        }

        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shuffleFlashcards();
            });
        }

        const flashcardFilter = document.getElementById('flashcard-filter');
        if (flashcardFilter) {
            flashcardFilter.addEventListener('change', () => {
                this.filterFlashcards();
            });
        }

        // Mastery level buttons
        document.querySelectorAll('.mastery-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const mastery = e.target.dataset.mastery;
                if (this.flashcardWords[this.currentFlashcardIndex]) {
                    this.updateWordMastery(this.flashcardWords[this.currentFlashcardIndex].id, mastery);
                }
            });
        });

        // Quiz events
        const startQuizBtn = document.getElementById('start-quiz');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.startQuiz();
            });
        }

        const nextQuestionBtn = document.getElementById('next-question');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextQuestion();
            });
        }

        const newQuizBtn = document.getElementById('new-quiz');
        if (newQuizBtn) {
            newQuizBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetQuiz();
            });
        }

        const reviewIncorrectBtn = document.getElementById('review-incorrect');
        if (reviewIncorrectBtn) {
            reviewIncorrectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.reviewIncorrectAnswers();
            });
        }
    }

    // Toast notification system
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);

        // Manual close
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            });
        }
    }

    // CSV Import functionality
    showCSVImportModal() {
        const modal = document.getElementById('csv-import-modal');
        if (modal) {
            this.resetCSVImportModal();
            modal.classList.remove('hidden');
        }
    }

    hideCSVImportModal() {
        const modal = document.getElementById('csv-import-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    resetCSVImportModal() {
        const fileInput = document.getElementById('csv-file-input');
        const importBtn = document.getElementById('csv-import-btn');
        const progressDiv = document.getElementById('import-progress');
        const resultsDiv = document.getElementById('import-results');
        
        if (fileInput) fileInput.value = '';
        if (importBtn) importBtn.disabled = true;
        if (progressDiv) progressDiv.classList.add('hidden');
        if (resultsDiv) resultsDiv.classList.add('hidden');
        
        this.selectedCSVFile = null;
        this.parsedCSVData = null;
    }

    handleCSVFileSelection(file) {
        if (!file) return;

        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            this.showToast('Please select a valid CSV file', 'error');
            return;
        }

        this.selectedCSVFile = file;
        this.parseCSVFile(file);
    }

    parseCSVFile(file) {
        const progressDiv = document.getElementById('import-progress');
        const statusElement = document.getElementById('import-status');
        const progressFill = document.getElementById('import-progress-fill');

        if (progressDiv) progressDiv.classList.remove('hidden');
        if (statusElement) statusElement.textContent = 'Parsing CSV file...';
        if (progressFill) progressFill.style.width = '10%';

        if (typeof Papa === 'undefined') {
            this.showToast('CSV parser not loaded. Please refresh the page.', 'error');
            return;
        }

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => {
                // Normalize headers
                return header.trim().toLowerCase().replace(/[^\w]/g, '');
            },
            complete: (results) => {
                this.handleCSVParseComplete(results);
            },
            error: (error) => {
                this.handleCSVParseError(error);
            }
        });
    }

    handleCSVParseComplete(results) {
        const progressFill = document.getElementById('import-progress-fill');
        const statusElement = document.getElementById('import-status');
        
        if (progressFill) progressFill.style.width = '50%';
        if (statusElement) statusElement.textContent = 'Processing data...';

        try {
            const validWords = [];
            const errors = [];
            let skipped = 0;

            results.data.forEach((row, index) => {
                const rowNum = index + 1;
                
                // Normalize column names
                const word = this.getValueFromRow(row, ['word', 'term', 'vocabulary']);
                const definition = this.getValueFromRow(row, ['definition', 'meaning', 'def']);
                const example = this.getValueFromRow(row, ['example', 'sentence', 'usage']) || '';
                const tagsStr = this.getValueFromRow(row, ['tags', 'categories', 'tag']) || '';

                // Validate required fields
                if (!word || !definition) {
                    if (word || definition) { // Only log if partially filled
                        errors.push(`Row ${rowNum}: Missing ${!word ? 'word' : 'definition'}`);
                    }
                    skipped++;
                    return;
                }

                // Check for duplicates (case-insensitive)
                const existingWord = this.words.find(w => 
                    w.word.toLowerCase() === word.toLowerCase()
                );
                
                if (existingWord) {
                    errors.push(`Row ${rowNum}: "${word}" already exists`);
                    skipped++;
                    return;
                }

                // Parse tags
                const tags = tagsStr ? 
                    tagsStr.split(/[,;]/).map(tag => tag.trim()).filter(tag => tag) : 
                    [];

                // Create word object
                validWords.push({
                    word: word.trim(),
                    definition: definition.trim(),
                    example: example.trim(),
                    tags: tags,
                    difficulty: 'intermediate', // Default
                    mastery_level: 'learning'   // Default
                });
            });

            if (progressFill) progressFill.style.width = '100%';
            if (statusElement) statusElement.textContent = 'Processing complete!';

            // Check word limit
            const totalAfterImport = this.words.length + validWords.length;
            if (totalAfterImport > this.maxWords) {
                const canImport = this.maxWords - this.words.length;
                validWords.splice(canImport);
                errors.push(`Word limit reached. Only importing first ${canImport} words.`);
            }

            this.parsedCSVData = { validWords, errors, skipped };
            this.showImportResults();

            if (validWords.length > 0) {
                const importBtn = document.getElementById('csv-import-btn');
                if (importBtn) importBtn.disabled = false;
            }

        } catch (error) {
            this.handleCSVParseError(error);
        }
    }

    getValueFromRow(row, possibleKeys) {
        for (const key of possibleKeys) {
            if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
                return row[key];
            }
        }
        return '';
    }

    handleCSVParseError(error) {
        const progressDiv = document.getElementById('import-progress');
        if (progressDiv) progressDiv.classList.add('hidden');
        this.showToast(`Error parsing CSV: ${error.message}`, 'error');
    }

    showImportResults() {
        const resultsDiv = document.getElementById('import-results');
        const summaryDiv = document.getElementById('import-summary');
        
        if (!resultsDiv || !summaryDiv || !this.parsedCSVData) return;
        
        const { validWords, errors, skipped } = this.parsedCSVData;

        let summaryHTML = `
            <h4>Import Preview</h4>
            <ul>
                <li><strong>${validWords.length}</strong> words ready to import</li>
                <li><strong>${skipped}</strong> rows skipped</li>
                <li><strong>${errors.length}</strong> errors found</li>
            </ul>
        `;

        if (errors.length > 0) {
            summaryHTML += `
                <h4>Errors:</h4>
                <ul>
                    ${errors.slice(0, 5).map(error => `<li>${error}</li>`).join('')}
                    ${errors.length > 5 ? `<li>... and ${errors.length - 5} more</li>` : ''}
                </ul>
            `;
        }

        summaryDiv.innerHTML = summaryHTML;
        summaryDiv.className = errors.length > 0 ? 'import-summary error' : 'import-summary';
        resultsDiv.classList.remove('hidden');
    }

    processCSVImport() {
        if (!this.parsedCSVData || this.parsedCSVData.validWords.length === 0) {
            this.showToast('No valid words to import', 'error');
            return;
        }

        const { validWords } = this.parsedCSVData;
        const nextId = Math.max(...this.words.map(w => w.id), 0) + 1;

        // Add words with unique IDs and timestamps
        validWords.forEach((word, index) => {
            this.words.push({
                id: nextId + index,
                ...word,
                created_at: new Date().toISOString().split('T')[0],
                last_reviewed: null
            });
        });

        this.saveWords();
        this.renderWords();
        this.updateProgress();
        this.hideCSVImportModal();

        this.showToast(
            `Successfully imported ${validWords.length} words!`, 
            'success'
        );
    }

    // CSV Export functionality
    exportToCSV() {
        if (this.words.length === 0) {
            this.showToast('No words to export', 'warning');
            return;
        }

        try {
            // Prepare data for CSV
            const csvData = this.words.map(word => ({
                Word: word.word,
                Definition: word.definition,
                Example: word.example || '',
                Tags: word.tags ? word.tags.join(';') : '',
                Difficulty: word.difficulty,
                'Mastery Level': word.mastery_level,
                'Created At': word.created_at || '',
                'Last Reviewed': word.last_reviewed || ''
            }));

            // Generate CSV
            if (typeof Papa === 'undefined') {
                this.showToast('CSV parser not loaded. Please refresh the page.', 'error');
                return;
            }
            
            const csv = Papa.unparse(csvData);
            
            // Create and trigger download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `vocabmaster-export-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showToast(`Exported ${this.words.length} words to CSV`, 'success');

        } catch (error) {
            this.showToast('Error exporting CSV: ' + error.message, 'error');
        }
    }

    showTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });

        // Update specific content when switching tabs
        if (tabName === 'flashcards') {
            this.setupFlashcards();
        } else if (tabName === 'progress') {
            this.updateProgress();
        }
    }

    // Word Management
    renderWords() {
        const wordsGrid = document.getElementById('words-grid');
        if (!wordsGrid) return;
        
        const filteredWords = this.getFilteredWords();
        
        if (filteredWords.length === 0) {
            wordsGrid.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p>No words found. Add your first word or import from CSV to get started!</p>
                </div>
            `;
            return;
        }

        wordsGrid.innerHTML = filteredWords.map(word => `
            <div class="word-card" data-id="${word.id}">
                <div class="word-card-header">
                    <h3 class="word-title">${word.word}</h3>
                    <div class="word-actions">
                        <button class="word-action-btn edit-btn" data-id="${word.id}">✏️</button>
                        <button class="word-action-btn delete-btn" data-id="${word.id}">🗑️</button>
                    </div>
                </div>
                <div class="word-definition">${word.definition}</div>
                ${word.example ? `<div class="word-example">"${word.example}"</div>` : ''}
                <div class="word-tags">
                    ${word.tags ? word.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
                <div class="mastery-level ${word.mastery_level}">${this.capitalizeMastery(word.mastery_level)}</div>
            </div>
        `).join('');

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editWord(parseInt(e.target.dataset.id));
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteWord(parseInt(e.target.dataset.id));
            });
        });

        this.updateTagFilter();
        this.updateHeaderStats();
    }

    getFilteredWords() {
        const searchInput = document.getElementById('word-search');
        const tagFilterSelect = document.getElementById('tag-filter');
        const masteryFilterSelect = document.getElementById('mastery-filter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const tagFilter = tagFilterSelect ? tagFilterSelect.value : '';
        const masteryFilter = masteryFilterSelect ? masteryFilterSelect.value : '';

        return this.words.filter(word => {
            const matchesSearch = word.word.toLowerCase().includes(searchTerm) || 
                                word.definition.toLowerCase().includes(searchTerm);
            const matchesTag = !tagFilter || (word.tags && word.tags.includes(tagFilter));
            const matchesMastery = !masteryFilter || word.mastery_level === masteryFilter;
            
            return matchesSearch && matchesTag && matchesMastery;
        });
    }

    filterWords() {
        this.renderWords();
    }

    updateTagFilter() {
        const tagFilter = document.getElementById('tag-filter');
        if (!tagFilter) return;
        
        const allTags = [...new Set(this.words.flatMap(word => word.tags || []))];
        
        const currentValue = tagFilter.value;
        tagFilter.innerHTML = '<option value="">All Tags</option>' +
            allTags.map(tag => `<option value="${tag}">${tag}</option>`).join('');
        tagFilter.value = currentValue;
    }

    updateHeaderStats() {
        const headerStats = document.getElementById('total-words-header');
        if (headerStats) {
            const total = this.words.length;
            headerStats.textContent = `${total} / ${this.maxWords} words`;
        }
    }

    showWordModal(word = null) {
        const modal = document.getElementById('word-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('word-form');
        
        if (!modal || !title || !form) return;
        
        if (word) {
            title.textContent = 'Edit Word';
            const wordInput = document.getElementById('word-input');
            const defInput = document.getElementById('definition-input');
            const exampleInput = document.getElementById('example-input');
            const tagsInput = document.getElementById('tags-input');
            const difficultyInput = document.getElementById('difficulty-input');
            const masteryInput = document.getElementById('mastery-input');
            
            if (wordInput) wordInput.value = word.word;
            if (defInput) defInput.value = word.definition;
            if (exampleInput) exampleInput.value = word.example || '';
            if (tagsInput) tagsInput.value = word.tags ? word.tags.join(', ') : '';
            if (difficultyInput) difficultyInput.value = word.difficulty;
            if (masteryInput) masteryInput.value = word.mastery_level;
            
            form.dataset.editId = word.id;
        } else {
            title.textContent = 'Add New Word';
            form.reset();
            delete form.dataset.editId;
        }
        
        modal.classList.remove('hidden');
    }

    hideWordModal() {
        const modal = document.getElementById('word-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    saveWord() {
        const form = document.getElementById('word-form');
        const wordInput = document.getElementById('word-input');
        const defInput = document.getElementById('definition-input');
        const exampleInput = document.getElementById('example-input');
        const tagsInput = document.getElementById('tags-input');
        const difficultyInput = document.getElementById('difficulty-input');
        const masteryInput = document.getElementById('mastery-input');
        
        if (!form || !wordInput || !defInput) return;
        
        const word = wordInput.value.trim();
        const definition = defInput.value.trim();
        const example = exampleInput ? exampleInput.value.trim() : '';
        const tags = tagsInput ? tagsInput.value.trim() : '';
        const difficulty = difficultyInput ? difficultyInput.value : 'intermediate';
        const masteryLevel = masteryInput ? masteryInput.value : 'learning';

        if (!word || !definition) {
            this.showToast('Word and definition are required!', 'error');
            return;
        }

        // Check for duplicates when adding new word
        if (!form.dataset.editId) {
            const duplicate = this.words.find(w => 
                w.word.toLowerCase() === word.toLowerCase()
            );
            if (duplicate) {
                this.showToast('This word already exists!', 'error');
                return;
            }

            // Check word limit
            if (this.words.length >= this.maxWords) {
                this.showToast(`Maximum ${this.maxWords} words allowed!`, 'error');
                return;
            }
        }

        const wordData = {
            word,
            definition,
            example: example || null,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            difficulty,
            mastery_level: masteryLevel
        };

        if (form.dataset.editId) {
            // Edit existing word
            const id = parseInt(form.dataset.editId);
            const index = this.words.findIndex(w => w.id === id);
            this.words[index] = { ...this.words[index], ...wordData };
            this.showToast('Word updated successfully!', 'success');
        } else {
            // Add new word
            const newId = Math.max(...this.words.map(w => w.id), 0) + 1;
            this.words.push({ 
                id: newId, 
                ...wordData,
                created_at: new Date().toISOString().split('T')[0],
                last_reviewed: null
            });
            this.showToast('Word added successfully!', 'success');
        }

        this.saveWords();
        this.renderWords();
        this.updateProgress();
        this.hideWordModal();
    }

    editWord(id) {
        const word = this.words.find(w => w.id === id);
        if (word) {
            this.showWordModal(word);
        }
    }

    deleteWord(id) {
        if (confirm('Are you sure you want to delete this word?')) {
            this.words = this.words.filter(w => w.id !== id);
            this.saveWords();
            this.renderWords();
            this.updateProgress();
            this.showToast('Word deleted successfully!', 'success');
        }
    }

    // Flashcard functionality
    setupFlashcards() {
        this.filterFlashcards();
    }

    filterFlashcards() {
        const filterSelect = document.getElementById('flashcard-filter');
        const filter = filterSelect ? filterSelect.value : '';
        
        this.flashcardWords = filter ? 
            this.words.filter(word => word.mastery_level === filter) : 
            [...this.words];
        
        this.currentFlashcardIndex = 0;
        this.isFlashcardFlipped = false;
        this.updateFlashcard();
    }

    updateFlashcard() {
        const cardWord = document.getElementById('card-word');
        const cardDef = document.getElementById('card-definition');
        const cardExample = document.getElementById('card-example');
        const cardTags = document.getElementById('card-tags');
        const cardPosition = document.getElementById('card-position');
        const progressFill = document.getElementById('progress-fill');
        
        if (this.flashcardWords.length === 0) {
            if (cardWord) cardWord.textContent = 'No words available';
            if (cardDef) cardDef.textContent = 'Add some words first!';
            if (cardExample) cardExample.textContent = '';
            if (cardTags) cardTags.innerHTML = '';
            if (cardPosition) cardPosition.textContent = '0 / 0';
            if (progressFill) progressFill.style.width = '0%';
            return;
        }

        const word = this.flashcardWords[this.currentFlashcardIndex];
        if (cardWord) cardWord.textContent = word.word;
        if (cardDef) cardDef.textContent = word.definition;
        if (cardExample) cardExample.textContent = word.example || '';
        if (cardTags) {
            cardTags.innerHTML = word.tags ? 
                word.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
        }
        
        if (cardPosition) {
            cardPosition.textContent = 
                `${this.currentFlashcardIndex + 1} / ${this.flashcardWords.length}`;
        }
        
        if (progressFill) {
            const progress = ((this.currentFlashcardIndex + 1) / this.flashcardWords.length) * 100;
            progressFill.style.width = `${progress}%`;
        }

        // Reset flip state
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.classList.remove('flipped');
        }
        this.isFlashcardFlipped = false;
    }

    flipFlashcard() {
        const flashcard = document.getElementById('flashcard');
        if (flashcard) {
            flashcard.classList.toggle('flipped');
            this.isFlashcardFlipped = !this.isFlashcardFlipped;
        }
    }

    nextFlashcard() {
        if (this.flashcardWords.length === 0) return;
        this.currentFlashcardIndex = (this.currentFlashcardIndex + 1) % this.flashcardWords.length;
        this.updateFlashcard();
    }

    previousFlashcard() {
        if (this.flashcardWords.length === 0) return;
        this.currentFlashcardIndex = this.currentFlashcardIndex === 0 ? 
            this.flashcardWords.length - 1 : this.currentFlashcardIndex - 1;
        this.updateFlashcard();
    }

    shuffleFlashcards() {
        this.flashcardWords = this.shuffleArray([...this.flashcardWords]);
        this.currentFlashcardIndex = 0;
        this.updateFlashcard();
        this.showToast('Flashcards shuffled!', 'info');
    }

    updateWordMastery(wordId, masteryLevel) {
        const word = this.words.find(w => w.id === wordId);
        if (word) {
            word.mastery_level = masteryLevel;
            word.last_reviewed = new Date().toISOString().split('T')[0];
            this.saveWords();
            this.updateProgress();
            this.renderWords();
            this.showToast(`Word marked as ${masteryLevel}!`, 'success');
        }
    }

    // Quiz functionality
    startQuiz() {
        const countSelect = document.getElementById('quiz-count');
        const typeSelect = document.getElementById('quiz-type');
        const masteryFilterSelect = document.getElementById('quiz-mastery-filter');
        
        const count = countSelect ? parseInt(countSelect.value) : 10;
        const type = typeSelect ? typeSelect.value : 'word-to-def';
        const masteryFilter = masteryFilterSelect ? masteryFilterSelect.value : '';

        let availableWords = masteryFilter ? 
            this.words.filter(word => word.mastery_level === masteryFilter) : 
            [...this.words];

        if (availableWords.length < 4) {
            this.showToast('Need at least 4 words to generate a quiz. Add more words!', 'error');
            return;
        }

        if (availableWords.length < count) {
            this.showToast(`Only ${availableWords.length} words available. Adjusting quiz length.`, 'warning');
        }

        const quizWords = this.shuffleArray(availableWords).slice(0, Math.min(count, availableWords.length));
        
        this.quizData = {
            questions: this.generateQuizQuestions(quizWords, type),
            type,
            userAnswers: [],
            startTime: Date.now()
        };

        this.currentQuestionIndex = 0;
        this.quizScore = 0;

        const quizSetup = document.getElementById('quiz-setup');
        const quizActive = document.getElementById('quiz-active');
        
        if (quizSetup) quizSetup.classList.add('hidden');
        if (quizActive) quizActive.classList.remove('hidden');
        
        this.showQuestion();
    }

    generateQuizQuestions(words, type) {
        return words.map(word => {
            const correctAnswer = type === 'word-to-def' ? word.definition : word.word;
            const questionText = type === 'word-to-def' ? 
                `What does "${word.word}" mean?` : 
                `Which word means: "${word.definition}"?`;

            // Generate distractors
            const otherWords = this.words.filter(w => w.id !== word.id);
            const distractors = this.shuffleArray(otherWords)
                .slice(0, 3)
                .map(w => type === 'word-to-def' ? w.definition : w.word);

            const options = this.shuffleArray([correctAnswer, ...distractors]);

            return {
                word,
                question: questionText,
                options,
                correctAnswer,
                correctIndex: options.indexOf(correctAnswer)
            };
        });
    }

    showQuestion() {
        if (!this.quizData || !this.quizData.questions) return;
        
        const question = this.quizData.questions[this.currentQuestionIndex];
        
        const questionNumber = document.getElementById('quiz-question-number');
        if (questionNumber) {
            questionNumber.textContent = 
                `Question ${this.currentQuestionIndex + 1} of ${this.quizData.questions.length}`;
        }
        
        const progressFill = document.getElementById('quiz-progress-fill');
        if (progressFill) {
            const progress = ((this.currentQuestionIndex + 1) / this.quizData.questions.length) * 100;
            progressFill.style.width = `${progress}%`;
        }
        
        const questionText = document.getElementById('question-text');
        if (questionText) {
            questionText.textContent = question.question;
        }
        
        const optionsContainer = document.getElementById('quiz-options');
        if (optionsContainer) {
            optionsContainer.innerHTML = question.options.map((option, index) => `
                <div class="quiz-option" data-index="${index}">
                    ${option}
                </div>
            `).join('');

            // Add click handlers to options
            document.querySelectorAll('.quiz-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    this.selectAnswer(parseInt(e.target.dataset.index));
                });
            });
        }

        // Hide feedback
        const feedback = document.getElementById('quiz-feedback');
        if (feedback) {
            feedback.classList.add('hidden');
        }
    }

    selectAnswer(selectedIndex) {
        if (!this.quizData || !this.quizData.questions) return;
        
        const question = this.quizData.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctIndex;
        
        if (isCorrect) {
            this.quizScore++;
        }

        this.quizData.userAnswers.push({
            questionIndex: this.currentQuestionIndex,
            selectedIndex,
            isCorrect,
            word: question.word
        });

        // Show feedback
        this.showQuestionFeedback(isCorrect, question);
    }

    showQuestionFeedback(isCorrect, question) {
        // Update option styles
        document.querySelectorAll('.quiz-option').forEach((option, index) => {
            if (index === question.correctIndex) {
                option.classList.add('correct');
            } else if (option.classList.contains('selected')) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
        });

        // Show feedback
        const feedback = document.getElementById('quiz-feedback');
        const result = document.getElementById('feedback-result');
        const explanation = document.getElementById('feedback-explanation');

        if (result) {
            result.textContent = isCorrect ? 'Correct!' : 'Incorrect';
            result.className = `feedback-result ${isCorrect ? 'correct' : 'incorrect'}`;
        }
        
        if (explanation) {
            explanation.innerHTML = `
                <strong>${question.word.word}</strong><br>
                ${question.word.definition}<br>
                ${question.word.example ? `<em>"${question.word.example}"</em>` : ''}
            `;
        }

        if (feedback) {
            feedback.classList.remove('hidden');
        }
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.quizData.questions.length) {
            this.showQuizResults();
        } else {
            this.showQuestion();
        }
    }

    showQuizResults() {
        const totalQuestions = this.quizData.questions.length;
        const percentage = Math.round((this.quizScore / totalQuestions) * 100);

        // Save quiz to history
        this.quizHistory.unshift({
            date: new Date().toLocaleDateString(),
            score: this.quizScore,
            total: totalQuestions,
            percentage,
            type: this.quizData.type
        });

        if (this.quizHistory.length > 10) {
            this.quizHistory = this.quizHistory.slice(0, 10);
        }
        
        this.saveQuizHistory();

        // Show results
        const quizActive = document.getElementById('quiz-active');
        const quizResults = document.getElementById('quiz-results');
        
        if (quizActive) quizActive.classList.add('hidden');
        if (quizResults) quizResults.classList.remove('hidden');

        const finalScore = document.getElementById('final-score');
        const scorePercentage = document.getElementById('score-percentage');
        const correctCount = document.getElementById('correct-count');
        const incorrectCount = document.getElementById('incorrect-count');
        const accuracyRate = document.getElementById('accuracy-rate');
        
        if (finalScore) finalScore.textContent = `${this.quizScore}/${totalQuestions}`;
        if (scorePercentage) scorePercentage.textContent = `${percentage}%`;
        if (correctCount) correctCount.textContent = this.quizScore;
        if (incorrectCount) incorrectCount.textContent = totalQuestions - this.quizScore;
        if (accuracyRate) accuracyRate.textContent = `${percentage}%`;

        // Show completion toast
        const grade = percentage >= 90 ? 'Excellent!' : 
                     percentage >= 70 ? 'Good job!' : 
                     percentage >= 50 ? 'Keep practicing!' : 'More practice needed!';
        
        this.showToast(`Quiz completed! ${grade} (${percentage}%)`, 'success', 5000);
    }

    resetQuiz() {
        const quizResults = document.getElementById('quiz-results');
        const quizSetup = document.getElementById('quiz-setup');
        
        if (quizResults) quizResults.classList.add('hidden');
        if (quizSetup) quizSetup.classList.remove('hidden');
        
        this.quizData = null;
    }

    reviewIncorrectAnswers() {
        if (!this.quizData || !this.quizData.userAnswers) return;
        
        const incorrectAnswers = this.quizData.userAnswers.filter(answer => !answer.isCorrect);
        if (incorrectAnswers.length === 0) {
            this.showToast('No incorrect answers to review!', 'info');
            return;
        }

        this.showToast(`You got ${incorrectAnswers.length} questions wrong. Review these words in the flashcards!`, 'info', 5000);
        this.showTab('flashcards');
    }

    // Progress tracking
    updateProgress() {
        const stats = this.calculateStats();
        
        // Update stat cards
        const totalStat = document.getElementById('total-words-stat');
        const masteredStat = document.getElementById('mastered-words-stat');
        const learningStat = document.getElementById('learning-words-stat');
        const difficultStat = document.getElementById('difficult-words-stat');
        
        if (totalStat) totalStat.textContent = stats.total;
        if (masteredStat) masteredStat.textContent = stats.mastered;
        if (learningStat) learningStat.textContent = stats.learning;
        if (difficultStat) difficultStat.textContent = stats.difficult;

        // Update mastery chart
        if (stats.total > 0) {
            const masteredPercent = (stats.mastered / stats.total) * 100;
            const learningPercent = (stats.learning / stats.total) * 100;
            const difficultPercent = (stats.difficult / stats.total) * 100;

            const masteredBar = document.getElementById('mastered-bar');
            const learningBar = document.getElementById('learning-bar');
            const difficultBar = document.getElementById('difficult-bar');
            
            if (masteredBar) {
                masteredBar.style.width = `${masteredPercent}%`;
                const span = masteredBar.querySelector('span');
                if (span) span.textContent = `Mastered (${Math.round(masteredPercent)}%)`;
            }

            if (learningBar) {
                learningBar.style.width = `${learningPercent}%`;
                const span = learningBar.querySelector('span');
                if (span) span.textContent = `Learning (${Math.round(learningPercent)}%)`;
            }

            if (difficultBar) {
                difficultBar.style.width = `${difficultPercent}%`;
                const span = difficultBar.querySelector('span');
                if (span) span.textContent = `Difficult (${Math.round(difficultPercent)}%)`;
            }
        }

        // Update quiz history
        this.updateQuizHistory();
    }

    calculateStats() {
        const total = this.words.length;
        const mastered = this.words.filter(w => w.mastery_level === 'mastered').length;
        const learning = this.words.filter(w => w.mastery_level === 'learning').length;
        const difficult = this.words.filter(w => w.mastery_level === 'difficult').length;

        return { total, mastered, learning, difficult };
    }

    updateQuizHistory() {
        const historyContainer = document.getElementById('quiz-history');
        if (!historyContainer) return;
        
        if (this.quizHistory.length === 0) {
            historyContainer.innerHTML = '<div class="no-quizzes">No quizzes taken yet. Start your first quiz!</div>';
            return;
        }

        historyContainer.innerHTML = this.quizHistory.map(quiz => `
            <div class="quiz-history-item">
                <div>
                    <strong>${quiz.percentage}%</strong> (${quiz.score}/${quiz.total})
                    <br>
                    <small>${quiz.date} • ${quiz.type === 'word-to-def' ? 'Word→Def' : 'Def→Word'}</small>
                </div>
            </div>
        `).join('');
    }

    // Utility functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    capitalizeMastery(mastery) {
        return mastery.charAt(0).toUpperCase() + mastery.slice(1);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VocabularyApp();
});