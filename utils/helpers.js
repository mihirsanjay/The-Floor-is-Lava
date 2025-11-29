// utils/helpers.js

// Exported function to create a grid key like "x,y"
export function cellKey(x, y) {
  return `${x},${y}`;
}

// Exported Manhattan heuristic (used by A*)
export function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Min-heap implementation for pathfinding algorithms
export class MinHeap {
  constructor(compareFn) {
    this.items = [];
    this.compare = compareFn || ((a, b) => a - b);
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  push(item) {
    this.items.push(item);
    this.heapifyUp(this.items.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    
    const min = this.items[0];
    const last = this.items.pop();
    
    if (!this.isEmpty()) {
      this.items[0] = last;
      this.heapifyDown(0);
    }
    
    return min;
  }

  peek() {
    return this.isEmpty() ? null : this.items[0];
  }

  heapifyUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.items[index], this.items[parentIndex]) >= 0) break;
      
      [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
      index = parentIndex;
    }
  }

  heapifyDown(index) {
    while (true) {
      let minIndex = index;
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      
      if (leftChild < this.items.length && 
          this.compare(this.items[leftChild], this.items[minIndex]) < 0) {
        minIndex = leftChild;
      }
      
      if (rightChild < this.items.length && 
          this.compare(this.items[rightChild], this.items[minIndex]) < 0) {
        minIndex = rightChild;
      }
      
      if (minIndex === index) break;
      
      [this.items[index], this.items[minIndex]] = [this.items[minIndex], this.items[index]];
      index = minIndex;
    }
  }
}

// Get nearest exit heuristic for pathfinding
export function getNearestExitHeuristic(pos, exits) {
  let minDist = Infinity;
  for (const e of exits) {
    const [ex, ey] = e.split(',').map(Number);
    const d = Math.abs(pos.x - ex) + Math.abs(pos.y - ey);
    minDist = Math.min(minDist, d);
  }
  return minDist;
}

// Get valid neighbors for pathfinding
export function getNeighbors(x, y, rows, cols, walls) {
  const moves = [
    [0, -1], [0, 1], [-1, 0], [1, 0]
  ];
  return moves
    .map(([dx, dy]) => ({ x: x + dx, y: y + dy }))
    .filter(n => (
      n.x >= 0 && n.x < cols &&
      n.y >= 0 && n.y < rows &&
      !walls.has(cellKey(n.x, n.y))
    ));
}
