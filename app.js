import { aStar } from "./utils/astar.js";
import { bfs } from './utils/bfs.js';
import { dijkstra } from './utils/dijkstra.js';
import { dfs } from './utils/dfs.js';



let fires = new Set();
let pathTiles = new Map(); // Store path traces for analysis

const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

const rows = 20;
const cols = 20;
const cellSize = canvas.width / cols;

let person = { x: 0, y: 0 };
let walls = new Set();
let exits = new Set();

// Drag functionality
let isDragging = false;
let dragMode = 'wall'; // 'wall', 'exit', 'fire'
let animationSpeed = 100; // Default animation speed in ms
let simulationRunning = false;
let fireSpreadInterval = null;
let escapedAgents = [];
let deadAgentsList = [];
let agentNumbers = [];
let fireSpreadSpeed = 1500; // Default fire spread speed in ms
let agentPlacementMode = 'random'; // 'random' or 'manual'
let isDraggingAgent = false;
let draggedAgentIndex = -1;
let dragOffset = { x: 0, y: 0 };

function cellKey(x, y) {
  return `${x},${y}`;
}

function hasAgentAt(x, y) {
  return agents.some(agent => agent.x === x && agent.y === y && !agent.escaped);
}

function getAgentAt(x, y) {
  return agents.findIndex(agent => agent.x === x && agent.y === y && !agent.escaped && !agent.dead);
}

function isValidAgentPosition(x, y, excludeAgentIndex = -1) {
  if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
  const key = cellKey(x, y);
  if (walls.has(key) || fires.has(key)) return false;
  
  // Check if another agent is already there (excluding the one being moved)
  for (let i = 0; i < agents.length; i++) {
    if (i !== excludeAgentIndex && agents[i].x === x && agents[i].y === y && !agents[i].escaped && !agents[i].dead) {
      return false;
    }
  }
  return true;
}


let agents = [];

function generateAgents(count) {
  const currentAgentCount = agents.length;
  
  // Only clear agents if switching to random mode or count is less than current
  if (agentPlacementMode === 'random' || count < currentAgentCount) {
    agents = [];
    agentNumbers = [];
  }
  
  escapedAgents = [];
  deadAgentsList = [];
  
  if (agentPlacementMode === 'random') {
    // Random placement
    while (agents.length < count) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      const key = cellKey(x, y);
      if (!walls.has(key) && !exits.has(key) && !fires.has(key)) {
        agents.push({ x, y, id: agents.length + 1, escaped: false, dead: false });
        agentNumbers.push(agents.length);
      }
    }
  } else {
    // Manual placement - add new agents to center if needed
    while (agents.length < count) {
      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 2);
      let x = centerX;
      let y = centerY;
      
      // Find available spot near center
      let attempts = 0;
      while (attempts < 100) {
        const key = cellKey(x, y);
        if (!walls.has(key) && !exits.has(key) && !fires.has(key) && !hasAgentAt(x, y)) {
          break;
        }
        // Spiral outward from center
        const offset = Math.floor(attempts / 8) + 1;
        const angle = (attempts % 8) * Math.PI / 4;
        x = centerX + Math.round(offset * Math.cos(angle));
        y = centerY + Math.round(offset * Math.sin(angle));
        x = Math.max(0, Math.min(cols - 1, x));
        y = Math.max(0, Math.min(rows - 1, y));
        attempts++;
      }
      
      agents.push({ x, y, id: agents.length + 1, escaped: false, dead: false });
      agentNumbers.push(agents.length);
    }
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let key = cellKey(col, row);

      // Draw path traces first (background layer)
      if (pathTiles.has(key)) {
        const pathInfo = pathTiles.get(key);
        ctx.fillStyle = pathInfo.color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.globalAlpha = 1.0;
      }

      if (walls.has(key)) {
        ctx.fillStyle = "black";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      } else if (exits.has(key)) {
        ctx.fillStyle = "green";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      } else if (fires.has(key)) {
        ctx.fillStyle = "#f2461b";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }

      ctx.strokeStyle = "#ccc";
      ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }

  drawAgents();
}

function drawAgents() {
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    const key = cellKey(agent.x, agent.y);
    
    // Skip drawing escaped agents
    if (agent.escaped) continue;
    
    if (fires.has(key) || agent.dead) {
      // Draw skull for dead agents
      ctx.font = `${cellSize * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(
        '💀',
        agent.x * cellSize + cellSize / 2,
        agent.y * cellSize + cellSize / 2
      );
    } else {
      // Draw normal agent with number
      ctx.fillStyle = "purple";
      ctx.beginPath();
      ctx.arc(
        agent.x * cellSize + cellSize / 2,
        agent.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Draw agent number
      ctx.fillStyle = "white";
      ctx.font = `bold ${cellSize * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        agent.id.toString(),
        agent.x * cellSize + cellSize / 2,
        agent.y * cellSize + cellSize / 2
      );
    }
  }
}
function animateAll(allAlgoPaths, algorithmNames = []) {
  let i = 0;
  
  // Handle single algorithm vs multiple algorithms
  const pathsArray = (algorithmNames.length > 1) ? allAlgoPaths : [allAlgoPaths];
  const algoNames = algorithmNames.length > 0 ? algorithmNames : [window.selectedAlgorithm || 'astar'];
  
  const maxLen = Math.max(...pathsArray.flat().map(p => p.length));
  const alive = new Array(agents.length).fill(true);
  const deadPositions = new Array(agents.length).fill(null);
  
  const algorithmColors = {
    'astar': '#FFD700',    // Gold
    'bfs': '#00CED1',     // Dark Turquoise
    'dijkstra': '#32CD32', // Lime Green
    'dfs': '#FF6347'      // Tomato
  };

  // Pre-populate all path tiles for visualization
  for (let algoIndex = 0; algoIndex < pathsArray.length; algoIndex++) {
    const paths = pathsArray[algoIndex];
    const algoName = algoNames[algoIndex];
    const pathColor = algorithmColors[algoName] || '#FFD700';
    
    for (let j = 0; j < paths.length; j++) {
      if (paths[j]) {
        for (const step of paths[j]) {
          const key = cellKey(step.x, step.y);
          if (!pathTiles.has(key)) {
            pathTiles.set(key, { color: pathColor, algorithm: algoName });
          }
        }
      }
    }
  }

  const interval = setInterval(() => {
    drawGrid();

    // Use the first algorithm's paths for agent movement
    const paths = pathsArray[0];
    
    for (let j = 0; j < agents.length; j++) {
      if (!alive[j] || !paths[j]) continue;

      if (i < paths[j].length) {
        const next = paths[j][i];
        const key = cellKey(next.x, next.y);

        // Check if agent reached exit
        if (exits.has(key)) {
          agents[j].escaped = true;
          agents[j].x = next.x;
          agents[j].y = next.y;
          
          // Add to escaped list if not already there
          if (!escapedAgents.find(a => a.id === agents[j].id)) {
            escapedAgents.push({
              id: agents[j].id,
              exitX: next.x,
              exitY: next.y
            });
            updateEscapedAgentsList();
          }
          continue;
        }
        
        if (fires.has(key)) {
          agents[j].dead = true;
          agents[j].x = next.x;
          agents[j].y = next.y;
          alive[j] = false;
          deadPositions[j] = { ...next };
          
          // Add to dead list if not already there
          if (!deadAgentsList.find(a => a.id === agents[j].id)) {
            deadAgentsList.push({
              id: agents[j].id,
              x: next.x,
              y: next.y
            });
            updateDeadAgentsList();
          }
          continue;
        }

        // Update agent position
        agents[j].x = next.x;
        agents[j].y = next.y;
      }
    }

    

    // Dead agents are now shown as skull emojis in drawAgents() function

    i++;
    if (i >= maxLen) {
      clearInterval(interval);
      currentAnimationInterval = null;
      simulationRunning = false;
      stopFireSpread();
      
      // Re-enable start button, disable stop button
      document.getElementById("startSimulation").disabled = false;
      document.getElementById("stopSimulation").disabled = true;

      let survivors = escapedAgents.length;
      let dead = deadAgentsList.length;
      
      // Count any remaining agents not yet escaped or dead
      for (let j = 0; j < agents.length; j++) {
        const agent = agents[j];
        if (!agent.escaped && !agent.dead) {
          const key = cellKey(agent.x, agent.y);
          if (exits.has(key)) {
            survivors++;
          } else if (fires.has(key)) {
            dead++;
          }
        }
      }

      setTimeout(() => {
        const algoText = algorithmNames.length > 1 ? 'COMPARISON' : (window.selectedAlgorithm || 'UNKNOWN').toUpperCase();
        
        // Update Stats Panel
        document.getElementById("statAlgorithm").textContent = algoText;
        document.getElementById("statTotal").textContent = agents.length;
        document.getElementById("statSurvivors").textContent = survivors;
        document.getElementById("statDead").textContent = dead;
        document.getElementById("statSteps").textContent = maxLen;
        
        // Show final summary in console for debugging
        console.log(`Floor is LAVA! Final Report:`);
        console.log(`🎉 Escaped: ${survivors} agents`);
        console.log(`💀 Lost: ${dead} agents`);
        console.log(`👥 Total: ${agents.length} agents`);
      }, 100);
    }
  }, animationSpeed);
  
  currentAnimationInterval = interval;
}

// Stop Simulation button
document.getElementById("stopSimulation").addEventListener("click", () => {
  if (currentAnimationInterval) {
    clearInterval(currentAnimationInterval);
    currentAnimationInterval = null;
  }
  simulationRunning = false;
  stopFireSpread();
  
  // Re-enable start button, disable stop button
  document.getElementById("startSimulation").disabled = false;
  document.getElementById("stopSimulation").disabled = true;
  
  drawGrid();
});



function spreadFire() {
  if (!simulationRunning) return;
  
  const newFires = new Set(fires);
  for (const key of fires) {
    const [x, y] = key.split(',').map(Number);
    const neighbors = [
      [x + 1, y], [x - 1, y],
      [x, y + 1], [x, y - 1],
    ];

    for (const [nx, ny] of neighbors) {
      const nKey = cellKey(nx, ny);
      if (
        nx >= 0 && nx < cols && ny >= 0 && ny < rows &&
        !walls.has(nKey) && !exits.has(nKey) && !fires.has(nKey)
      ) {
        newFires.add(nKey);
      }
    }
  }
  fires = newFires;
  drawGrid();
}

function startFireSpread() {
  if (fireSpreadInterval) {
    clearInterval(fireSpreadInterval);
  }
  fireSpreadInterval = setInterval(spreadFire, fireSpreadSpeed);
}

function stopFireSpread() {
  if (fireSpreadInterval) {
    clearInterval(fireSpreadInterval);
    fireSpreadInterval = null;
  }
}

function updateEscapedAgentsList() {
  const escapedDiv = document.getElementById('escapedAgents');
  const escapedListDiv = document.getElementById('escapedList');
  
  if (escapedAgents.length > 0) {
    escapedDiv.style.display = 'block';
    escapedListDiv.innerHTML = escapedAgents.map(agent => 
      `<span class="agent-tag escaped-tag">
        Agent ${agent.id} → Exit (${agent.exitX}, ${agent.exitY})
      </span>`
    ).join('');
  } else {
    escapedDiv.style.display = 'none';
  }
}

function updateDeadAgentsList() {
  const deadDiv = document.getElementById('deadAgents');
  const deadListDiv = document.getElementById('deadList');
  
  if (deadAgentsList.length > 0) {
    deadDiv.style.display = 'block';
    deadListDiv.innerHTML = deadAgentsList.map(agent => 
      `<span class="agent-tag dead-tag">
        Agent ${agent.id} 💀 at (${agent.x}, ${agent.y})
      </span>`
    ).join('');
  } else {
    deadDiv.style.display = 'none';
  }
}


document.addEventListener("keydown", (e) => {
  let newX = person.x;
  let newY = person.y;

  if (e.key === "ArrowUp" && person.y > 0) newY--;
  if (e.key === "ArrowDown" && person.y < rows - 1) newY++;
  if (e.key === "ArrowLeft" && person.x > 0) newX--;
  if (e.key === "ArrowRight" && person.x < cols - 1) newX++;

  if (!walls.has(cellKey(newX, newY))) {
    person.x = newX;
    person.y = newY;
  }

  drawGrid();
});

canvas.addEventListener("contextmenu", (e) => e.preventDefault());

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  const key = cellKey(x, y);

  // Check if clicking on agent in manual mode
  if (agentPlacementMode === 'manual' && !simulationRunning) {
    const agentIndex = getAgentAt(x, y);
    if (agentIndex !== -1) {
      isDraggingAgent = true;
      draggedAgentIndex = agentIndex;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      dragOffset.x = mouseX - (agents[agentIndex].x * cellSize + cellSize / 2);
      dragOffset.y = mouseY - (agents[agentIndex].y * cellSize + cellSize / 2);
      canvas.style.cursor = 'grabbing';
      return;
    }
  }

  isDragging = true;

  // Don't allow drawing on agent positions in random mode or during simulation
  if (hasAgentAt(x, y) && (agentPlacementMode === 'random' || simulationRunning)) {
    isDragging = false;
    return;
  }

  if (e.shiftKey && e.button === 0) {
    // 🔥 Shift + Left click → toggle fire
    dragMode = 'fire';
    if (fires.has(key)) {
      fires.delete(key); // Remove fire if it exists
    } else if (!walls.has(key) && !exits.has(key)) {
      fires.add(key); // Add fire if cell is empty
    }
  } else if (e.button === 0) {
    // Left click → toggle wall
    dragMode = 'wall';
    if (walls.has(key)) {
      walls.delete(key);
    } else {
      walls.add(key);
    }
  } else if (e.button === 2) {
    // Right click → toggle exit
    dragMode = 'exit';
    if (exits.has(key)) {
      exits.delete(key);
    } else {
      exits.add(key);
    }
  }

  drawGrid();
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  
  // Handle agent dragging
  if (isDraggingAgent && draggedAgentIndex !== -1) {
    if (isValidAgentPosition(x, y, draggedAgentIndex)) {
      agents[draggedAgentIndex].x = x;
      agents[draggedAgentIndex].y = y;
      drawGrid();
    }
    return;
  }
  
  // Handle regular drawing
  if (!isDragging) {
    // Show hover cursor for agents in manual mode
    if (agentPlacementMode === 'manual' && !simulationRunning && getAgentAt(x, y) !== -1) {
      canvas.style.cursor = 'grab';
    } else {
      canvas.style.cursor = 'default';
    }
    return;
  }
  
  const key = cellKey(x, y);
  
  if (x < 0 || x >= cols || y < 0 || y >= rows) return;
  if (hasAgentAt(x, y)) return; // Prevent drawing on agents
  
  if (dragMode === 'wall') {
    if (!exits.has(key) && !fires.has(key)) {
      walls.add(key);
    }
  } else if (dragMode === 'exit') {
    if (!walls.has(key) && !fires.has(key)) {
      exits.add(key);
    }
  } else if (dragMode === 'fire') {
    if (!walls.has(key) && !exits.has(key) && !fires.has(key)) {
      fires.add(key); // Only add fire, don't remove during drag
    }
  }
  
  drawGrid();
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  if (isDraggingAgent) {
    isDraggingAgent = false;
    draggedAgentIndex = -1;
    canvas.style.cursor = 'default';
  }
});

canvas.addEventListener("mouseleave", () => {
  isDragging = false;
  if (isDraggingAgent) {
    isDraggingAgent = false;
    draggedAgentIndex = -1;
    canvas.style.cursor = 'default';
  }
});

generateAgents(10);
drawGrid();
document.getElementById("resetBtn").addEventListener("click", () => {
  const fixWalls = document.getElementById("fixWalls").checked;
  const agentInput = document.getElementById("agentCount");
  const agentCount = parseInt(agentInput.value) || 10;

  // Stop simulation
  if (currentAnimationInterval) {
    clearInterval(currentAnimationInterval);
    currentAnimationInterval = null;
  }
  simulationRunning = false;
  stopFireSpread();
  
  // Reset button states
  document.getElementById("startSimulation").disabled = false;
  document.getElementById("stopSimulation").disabled = true;

  if (!fixWalls) {
    walls.clear();
  }

  exits.clear();
  fires.clear();
  pathTiles.clear(); // Clear path traces
  escapedAgents = [];
  deadAgentsList = [];
  
  // Clear display panels
  document.getElementById('escapedAgents').style.display = 'none';
  document.getElementById('deadAgents').style.display = 'none';
  document.getElementById('escapedList').innerHTML = '';
  document.getElementById('deadList').innerHTML = '';

  generateAgents(agentCount);
  drawGrid();
});



// Fire spread is now controlled by simulation start

function animatePath(path) {
  if (!path || path.length === 0) return;

  let i = 0;
  const interval = setInterval(() => {
    person = path[i];
    drawGrid();
    i++;
    if (i >= path.length) clearInterval(interval);
  }, 100);
}

// Speed control slider
document.getElementById("speedControl").addEventListener("input", (e) => {
  animationSpeed = parseInt(e.target.value);
  document.getElementById("speedValue").textContent = `${animationSpeed}ms`;
});

// Agent count auto-update
document.getElementById("agentCount").addEventListener("input", (e) => {
  if (!simulationRunning) {
    const newCount = parseInt(e.target.value) || 10;
    if (newCount !== agents.length) {
      generateAgents(newCount);
      drawGrid();
    }
  }
});

// Agent placement mode toggle
document.getElementById("agentMode").addEventListener("change", (e) => {
  if (!simulationRunning) {
    agentPlacementMode = e.target.value;
    const agentCount = parseInt(document.getElementById("agentCount").value) || 10;
    generateAgents(agentCount);
    drawGrid();
    
    // Update instruction text
    const instruction = document.getElementById("agentInstruction");
    if (agentPlacementMode === 'manual') {
      instruction.innerHTML = "🎯 Drag agents to reposition them";
    } else {
      instruction.innerHTML = "🎲 Agents spawn randomly";
    }
  }
});

// Fire spread speed control (will be added to HTML)
if (document.getElementById("fireSpeedControl")) {
  document.getElementById("fireSpeedControl").addEventListener("input", (e) => {
    fireSpreadSpeed = parseInt(e.target.value);
    document.getElementById("fireSpeedValue").textContent = `${fireSpreadSpeed}ms`;
    
    // Restart fire spread with new speed if currently running
    if (simulationRunning && fireSpreadInterval) {
      clearInterval(fireSpreadInterval);
      fireSpreadInterval = setInterval(spreadFire, fireSpreadSpeed);
    }
  });
}

// Simulation control variables
let currentAnimationInterval = null;

// Start Simulation button
document.getElementById("startSimulation").addEventListener("click", () => {
  if (simulationRunning) {
    alert("Simulation is already running! Use Stop button to stop it.");
    return;
  }
  
  if (exits.size === 0) {
    alert("Please add at least one exit (right-click to place exits)!");
    return;
  }
  
  simulationRunning = true;
  document.getElementById("startSimulation").disabled = true;
  document.getElementById("stopSimulation").disabled = false;
  
  const compareMode = document.getElementById("compareMode").checked;
  pathTiles.clear(); // Clear previous path traces
  
  // Start fire spreading
  startFireSpread();
  
  if (compareMode) {
    // Run all algorithms
    const algorithms = ['astar', 'bfs', 'dijkstra', 'dfs'];
    const allAlgorithmPaths = [];
    
    for (const algo of algorithms) {
      const algorithmPaths = agents.map(agent => {
        if (algo === "astar") return aStar(agent, exits, walls, rows, cols) || [];
        if (algo === "bfs") return bfs(agent, exits, walls, rows, cols) || [];
        if (algo === "dijkstra") return dijkstra(agent, exits, walls, rows, cols) || [];
        if (algo === "dfs") return dfs(agent, exits, walls, rows, cols) || [];
        return [];
      });
      allAlgorithmPaths.push(algorithmPaths);
    }
    
    const hasAtLeastOnePath = allAlgorithmPaths.some(algoPaths => 
      algoPaths.some(p => p.length > 0)
    );
    
    if (!hasAtLeastOnePath) {
      alert("No path found for any agent with any algorithm!");
      simulationRunning = false;
      stopFireSpread();
      return;
    }
    
    animateAll(allAlgorithmPaths, algorithms);
    window.selectedAlgorithm = 'comparison';
  } else {
    // Run single algorithm
    const algo = document.getElementById("algorithm").value;
    window.selectedAlgorithm = algo;

    const allPaths = agents.map(agent => {
      if (algo === "astar") return aStar(agent, exits, walls, rows, cols) || [];
      if (algo === "bfs") return bfs(agent, exits, walls, rows, cols) || [];
      if (algo === "dijkstra") return dijkstra(agent, exits, walls, rows, cols) || [];
      if (algo === "dfs") return dfs(agent, exits, walls, rows, cols) || [];
      return [];
    });

    const hasAtLeastOnePath = allPaths.some(p => p.length > 0);
    if (!hasAtLeastOnePath) {
      alert("No path found for any agent!");
      simulationRunning = false;
      stopFireSpread();
      return;
    }

    animateAll(allPaths, [algo]);
  }
});

// Prevent spacebar from scrolling the page
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    // Optionally, you can still trigger simulation with spacebar if desired
    // document.getElementById("startSimulation").click();
  }
});



