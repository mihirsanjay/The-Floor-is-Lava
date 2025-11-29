import { cellKey, MinHeap, getNearestExitHeuristic, getNeighbors } from './helpers.js';

export function aStar(start, exits, walls, rows, cols) {
  const openSet = new MinHeap((a, b) => a.f - b.f);
  const openSetKeys = new Set();
  const closedSet = new Set();
  const cameFrom = new Map();
  
  const gScore = new Map();
  const fScore = new Map();
  
  const startKey = cellKey(start.x, start.y);
  gScore.set(startKey, 0);
  fScore.set(startKey, getNearestExitHeuristic(start, exits));
  
  openSet.push({
    key: startKey,
    x: start.x,
    y: start.y,
    f: fScore.get(startKey),
    g: 0
  });
  openSetKeys.add(startKey);

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    const currentKey = current.key;
    
    openSetKeys.delete(currentKey);
    closedSet.add(currentKey);

    if (exits.has(currentKey)) {
      // Reconstruct path
      const path = [];
      let k = currentKey;
      while (k !== startKey) {
        const [px, py] = k.split(',').map(Number);
        path.unshift({ x: px, y: py });
        k = cameFrom.get(k);
      }
      return path;
    }

    for (const neighbor of getNeighbors(current.x, current.y, rows, cols, walls)) {
      const neighborKey = cellKey(neighbor.x, neighbor.y);
      
      if (closedSet.has(neighborKey)) continue;
      
      const tentativeG = gScore.get(currentKey) + 1;
      const currentNeighborG = gScore.get(neighborKey) || Infinity;
      
      if (tentativeG < currentNeighborG) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        const h = getNearestExitHeuristic(neighbor, exits);
        const f = tentativeG + h;
        fScore.set(neighborKey, f);
        
        if (!openSetKeys.has(neighborKey)) {
          openSet.push({
            key: neighborKey,
            x: neighbor.x,
            y: neighbor.y,
            f: f,
            g: tentativeG
          });
          openSetKeys.add(neighborKey);
        }
      }
    }
  }

  return null;
}
