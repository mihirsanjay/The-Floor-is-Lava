import { cellKey, getNeighbors } from './helpers.js';

export function dfs(start, goals, walls, rows, cols) {
  const stack = [[start]];
  const visited = new Set([cellKey(start.x, start.y)]);

  while (stack.length > 0) {
    const path = stack.pop();
    const current = path[path.length - 1];
    const key = cellKey(current.x, current.y);

    if (goals.has(key)) return path;

    for (const neighbor of getNeighbors(current.x, current.y, rows, cols, walls)) {
      const nKey = cellKey(neighbor.x, neighbor.y);
      if (!visited.has(nKey)) {
        visited.add(nKey);
        stack.push([...path, neighbor]);
      }
    }
  }

  return null;
}
