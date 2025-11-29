import { cellKey, MinHeap, getNeighbors } from './helpers.js';

export function dijkstra(start, goals, walls, rows, cols) {
  const visited = new Set();
  const dist = new Map();
  const prev = new Map();
  
  const startKey = cellKey(start.x, start.y);
  dist.set(startKey, 0);
  
  const heap = new MinHeap((a, b) => a.cost - b.cost);
  heap.push({ x: start.x, y: start.y, key: startKey, cost: 0 });

  while (!heap.isEmpty()) {
    const current = heap.pop();
    const curKey = current.key;

    if (visited.has(curKey)) continue;
    visited.add(curKey);

    if (goals.has(curKey)) {
      // Reconstruct path
      const path = [];
      let nodeKey = curKey;
      while (nodeKey && nodeKey !== startKey) {
        const [x, y] = nodeKey.split(',').map(Number);
        path.unshift({ x, y });
        nodeKey = prev.get(nodeKey);
      }
      return path;
    }

    for (const neighbor of getNeighbors(current.x, current.y, rows, cols, walls)) {
      const nKey = cellKey(neighbor.x, neighbor.y);
      
      if (visited.has(nKey)) continue;
      
      const alt = dist.get(curKey) + 1;
      if (alt < (dist.get(nKey) || Infinity)) {
        dist.set(nKey, alt);
        prev.set(nKey, curKey);
        heap.push({ x: neighbor.x, y: neighbor.y, key: nKey, cost: alt });
      }
    }
  }

  return null; // No path
}
