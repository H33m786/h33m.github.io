// Game of Life logic will go here 

class GameOfLife {
  constructor(size = 50) {
    this.size = size;
    this.grid = Array(size).fill().map(() => Array(size).fill(false));
    this.generation = 0;
    this.isRunning = false;
    this.speed = 5;
    this.interval = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      this.initialize();
      this.showContent();
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        this.initialize();
        this.showContent();
      });
    }
  }

  showContent() {
    // Show the fade-in content immediately
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('show');
    });
  }

  initialize() {
    try {
      this.setupGrid();
      this.setupControls();
      // Add a small initial pattern
      this.grid[25][25] = true;
      this.grid[25][26] = true;
      this.grid[25][27] = true;
      this.updateDisplay();
    } catch (error) {
      this.showError('Error initializing game: ' + error.message);
    }
  }

  showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.style.display = 'block';
      errorMessage.textContent = message;
    }
  }

  setupGrid() {
    const grid = document.getElementById('gameGrid');
    if (!grid) {
      throw new Error('Game grid element not found!');
    }

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    
    for (let i = 0; i < this.size * this.size; i++) {
      const cell = document.createElement('div');
      cell.className = 'game-cell';
      cell.dataset.index = i;
      cell.addEventListener('click', () => this.toggleCell(i));
      grid.appendChild(cell);
    }
  }

  setupControls() {
    // Speed control
    const speedRange = document.getElementById('speedRange');
    const speedValue = document.getElementById('speedValue');
    if (speedRange && speedValue) {
      speedRange.addEventListener('input', (e) => {
        this.speed = parseInt(e.target.value);
        speedValue.textContent = this.speed;
        if (this.isRunning) {
          this.stop();
          this.start();
        }
      });
    }

    // Buttons
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const randomBtn = document.getElementById('randomBtn');

    if (startBtn) startBtn.addEventListener('click', () => this.start());
    if (stopBtn) stopBtn.addEventListener('click', () => this.stop());
    if (clearBtn) clearBtn.addEventListener('click', () => this.clear());
    if (randomBtn) randomBtn.addEventListener('click', () => this.random());

    // Presets
    document.querySelectorAll('.preset-button').forEach(button => {
      button.addEventListener('click', () => this.loadPreset(button.dataset.preset));
    });
  }

  toggleCell(index) {
    if (this.isRunning) return;
    const row = Math.floor(index / this.size);
    const col = index % this.size;
    this.grid[row][col] = !this.grid[row][col];
    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    this.interval = setInterval(() => this.step(), 1000 / this.speed);
  }

  stop() {
    this.isRunning = false;
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    clearInterval(this.interval);
  }

  clear() {
    this.stop();
    this.grid = Array(this.size).fill().map(() => Array(this.size).fill(false));
    this.generation = 0;
    this.updateDisplay();
  }

  random() {
    this.stop();
    this.grid = Array(this.size).fill().map(() => 
      Array(this.size).fill().map(() => Math.random() > 0.7)
    );
    this.generation = 0;
    this.updateDisplay();
  }

  step() {
    const newGrid = Array(this.size).fill().map(() => Array(this.size).fill(false));
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const neighbors = this.countNeighbors(i, j);
        const isAlive = this.grid[i][j];
        
        if (isAlive && (neighbors === 2 || neighbors === 3)) {
          newGrid[i][j] = true;
        } else if (!isAlive && neighbors === 3) {
          newGrid[i][j] = true;
        }
      }
    }

    this.grid = newGrid;
    this.generation++;
    this.updateDisplay();
  }

  countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = (row + i + this.size) % this.size;
        const newCol = (col + j + this.size) % this.size;
        if (this.grid[newRow][newCol]) count++;
      }
    }
    return count;
  }

  updateDisplay() {
    const cells = document.querySelectorAll('.game-cell');
    const generationCount = document.getElementById('generationCount');
    const aliveCount = document.getElementById('aliveCount');
    let aliveCells = 0;

    cells.forEach((cell, index) => {
      const row = Math.floor(index / this.size);
      const col = index % this.size;
      const isAlive = this.grid[row][col];
      cell.classList.toggle('alive', isAlive);
      if (isAlive) aliveCells++;
    });

    if (generationCount) generationCount.textContent = this.generation;
    if (aliveCount) aliveCount.textContent = aliveCells;
  }

  loadPreset(preset) {
    this.stop();
    this.clear();
    
    const center = Math.floor(this.size / 2);
    switch(preset) {
      case 'glider':
        this.grid[center-1][center] = true;
        this.grid[center][center+1] = true;
        this.grid[center+1][center-1] = true;
        this.grid[center+1][center] = true;
        this.grid[center+1][center+1] = true;
        break;
      case 'blinker':
        this.grid[center][center-1] = true;
        this.grid[center][center] = true;
        this.grid[center][center+1] = true;
        break;
      case 'block':
        this.grid[center][center] = true;
        this.grid[center][center+1] = true;
        this.grid[center+1][center] = true;
        this.grid[center+1][center+1] = true;
        break;
      case 'beehive':
        this.grid[center-1][center] = true;
        this.grid[center-1][center+1] = true;
        this.grid[center][center-1] = true;
        this.grid[center][center+2] = true;
        this.grid[center+1][center] = true;
        this.grid[center+1][center+1] = true;
        break;
      case 'pulsar':
        const pulsar = [
          [0,2], [0,3], [0,4], [0,8], [0,9], [0,10],
          [2,0], [3,0], [4,0], [8,0], [9,0], [10,0],
          [2,5], [3,5], [4,5], [8,5], [9,5], [10,5],
          [2,7], [3,7], [4,7], [8,7], [9,7], [10,7],
          [5,2], [5,3], [5,4], [5,8], [5,9], [5,10],
          [7,2], [7,3], [7,4], [7,8], [7,9], [7,10]
        ];
        pulsar.forEach(([x, y]) => {
          this.grid[center-6+x][center-6+y] = true;
        });
        break;
    }
    this.updateDisplay();
  }
}

// Initialize the game
const game = new GameOfLife(50); 