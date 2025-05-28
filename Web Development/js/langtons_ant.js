// Langton's Ant Simulation Logic

class LangtonsAnt {
  constructor() {
    // grid is a 2D array (50x50) of booleans (false (white) or true (black))
    this.grid = Array(50).fill().map(() => Array(50).fill(false));
    // ant is an object with { x, y, direction } (direction: 0 (North), 1 (East), 2 (South), 3 (West))
    this.ant = { x: 25, y: 25, direction: 0 };
    this.generation = 0;
    this.running = false;
    this.speed = 5; // fps (frames per second)
    this.timer = null;
    // Wait until the DOM is fully loaded (so that the grid container and buttons are available) before initializing.
    if (document.readyState === "complete") {
      this.initialize();
    } else {
      window.addEventListener("load", () => this.initialize());
    }
  }

  initialize() {
    this.setupGrid();
    this.setupControls();
  }

  setupGrid() {
    const gridContainer = document.getElementById("gameGrid");
    if (!gridContainer) {
         console.error("Grid container not found.");
         return;
    }
    gridContainer.innerHTML = "";
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
         const cell = document.createElement("div");
         cell.className = "game-cell";
         cell.dataset.x = x;
         cell.dataset.y = y;
         cell.addEventListener("click", (e) => this.toggleCell(e));
         gridContainer.appendChild(cell);
      }
    }
  }

  setupControls() {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const clearBtn = document.getElementById("clearBtn");
    const randomBtn = document.getElementById("randomBtn");
    const speedRange = document.getElementById("speedRange");
    const speedValue = document.getElementById("speedValue");

    if (startBtn) startBtn.addEventListener("click", () => this.startSimulation());
    if (stopBtn) stopBtn.addEventListener("click", () => this.stopSimulation());
    if (clearBtn) clearBtn.addEventListener("click", () => this.clearGrid());
    if (randomBtn) randomBtn.addEventListener("click", () => this.randomGrid());
    if (speedRange) {
      speedRange.addEventListener("input", (e) => {
         this.updateSpeed(parseInt(e.target.value, 10));
         if (speedValue) speedValue.textContent = e.target.value;
      });
    }
  }

  toggleCell(e) {
    if (this.running) return;
    const cell = e.target;
    const x = parseInt(cell.dataset.x, 10);
    const y = parseInt(cell.dataset.y, 10);
    if (x >= 0 && x < 50 && y >= 0 && y < 50) {
         this.grid[y][x] = !this.grid[y][x];
         cell.classList.toggle("alive", this.grid[y][x]);
    }
  }

  startSimulation() {
    if (this.running) return;
    this.running = true;
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const randomBtn = document.getElementById("randomBtn");
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (randomBtn) randomBtn.disabled = true;
    const delay = 1000 / this.speed;
    this.timer = setInterval(() => this.step(), delay);
  }

  stopSimulation() {
    if (!this.running) return;
    clearInterval(this.timer);
    this.running = false;
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const randomBtn = document.getElementById("randomBtn");
    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;
    if (randomBtn) randomBtn.disabled = false;
  }

  clearGrid() {
    this.grid = Array(50).fill().map(() => Array(50).fill(false));
    this.ant = { x: 25, y: 25, direction: 0 };
    this.generation = 0;
    this.updateDisplay();
  }

  randomGrid() {
    if (this.running) return;
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
         this.grid[y][x] = (Math.random() < 0.5);
      }
    }
    this.updateDisplay();
  }

  updateSpeed(newSpeed) {
    this.speed = newSpeed;
    if (this.running) {
         this.stopSimulation();
         this.startSimulation();
    }
  }

  step() {
    // (x,y) is the ant's current position.
    const { x, y, direction } = this.ant;
    // (cellState is true (black) or false (white).)
    const cellState = this.grid[y][x];
    // (If cell is white (false), turn right (increment direction modulo 4) and flip (set cell to true); if black (true), turn left (decrement (or add 3) modulo 4) and flip (set cell to false).)
    if (cellState) {
         // (black cell: turn left (direction – 1 (or + 3) modulo 4) and flip (set cell to false).)
         this.ant.direction = (direction + 3) % 4;
         this.grid[y][x] = false;
    } else {
         // (white cell: turn right (direction + 1 modulo 4) and flip (set cell to true).)
         this.ant.direction = (direction + 1) % 4;
         this.grid[y][x] = true;
    }
    // (Move the ant (for example, if direction is 0 (North), decrement y; if 1 (East), increment x; if 2 (South), increment y; if 3 (West), decrement x) (and wrap (using modulo) if off the grid).)
    switch (this.ant.direction) {
         case 0: // North
            this.ant.y = (y - 1 + 50) % 50;
            break;
         case 1: // East
            this.ant.x = (x + 1) % 50;
            break;
         case 2: // South
            this.ant.y = (y + 1) % 50;
            break;
         case 3: // West
            this.ant.x = (x - 1 + 50) % 50;
            break;
    }
    this.generation++;
    this.updateDisplay();
  }

  updateDisplay() {
    const cells = document.querySelectorAll(".game-cell");
    let aliveCount = 0;
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
         const cell = cells[y * 50 + x];
         const alive = this.grid[y][x];
         cell.classList.toggle("alive", alive);
         if (alive) aliveCount++;
      }
    }
    const genCountEl = document.getElementById("generationCount");
    const aliveCountEl = document.getElementById("aliveCount");
    if (genCountEl) genCountEl.textContent = this.generation;
    if (aliveCountEl) aliveCountEl.textContent = aliveCount;
  }
}

// Instantiate the simulation (when the DOM is ready).
new LangtonsAnt(); 