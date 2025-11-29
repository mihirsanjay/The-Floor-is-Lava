import { cellKey, getNeighbors } from './helpers.js';

export function bfs(start, goals, walls, rows, cols) {
  const queue = [[start]];
  const visited = new Set([cellKey(start.x, start.y)]);

  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    const key = cellKey(current.x, current.y);

    if (goals.has(key)) return path;

    for (const neighbor of getNeighbors(current.x, current.y, rows, cols, walls)) {
      const nKey = cellKey(neighbor.x, neighbor.y);
      if (!visited.has(nKey)) {
        visited.add(nKey);
        queue.push([...path, neighbor]);
      }
    }
  }

  return null;
}
