class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(item, priority) {
    // Add the item to the end of the heap
    this.heap.push({ item, priority });

    // Heapify up to maintain the heap property
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) {
        break;
      }
      const temp = this.heap[parentIndex];
      this.heap[parentIndex] = this.heap[index];
      this.heap[index] = temp;
      index = parentIndex;
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const item = this.heap[0].item;
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      // Heapify down to maintain the heap property
      let index = 0;
      while (index * 2 + 1 < this.heap.length) {
        const leftChildIndex = index * 2 + 1;
        const rightChildIndex = index * 2 + 2;
        const smallerChildIndex =
          rightChildIndex < this.heap.length &&
          this.heap[rightChildIndex].priority <
            this.heap[leftChildIndex].priority
            ? rightChildIndex
            : leftChildIndex;
        if (
          this.heap[index].priority <= this.heap[smallerChildIndex].priority
        ) {
          break;
        }
        const temp = this.heap[index];
        this.heap[index] = this.heap[smallerChildIndex];
        this.heap[smallerChildIndex] = temp;
        index = smallerChildIndex;
      }
    }
    return item;
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}
function manhattanDistance(node, goal) {
  const dx = Math.abs(node.col - goal.col);
  const dy = Math.abs(node.row - goal.row);
  return dx + dy;
}

function reconstruct_path(came_from, current, ordered) {
  const total_path = [current];
  while (came_from.has(current)) {
    current = came_from.get(current);
    total_path.unshift(current);
  }
  return { path: total_path, order: ordered };
}

export function astar_search(grid, start, goal) {
  const rows = grid.length;
  const cols = grid[0].length;
  const closed_set = [];
  const open_set = new PriorityQueue();
  const ordered = [];
  open_set.enqueue(start, 0);

  const came_from = new Map();
  const g_score = new Map();
  const f_score = new Map();
  g_score.set(start, 0);
  f_score.set(start, manhattanDistance(start, goal));
  let distance = -1;
  while (!open_set.isEmpty()) {
    const current = open_set.dequeue();
    if (current.row === goal.row && current.col === goal.col) {
      const { path, order } = reconstruct_path(came_from, current, ordered);
      return { path, order, distance };
    }
    closed_set.push(current);
    ordered.push(current);
    let neighbours = [
      { row: current.row, col: current.col + 1 },
      { row: current.row, col: current.col - 1 },
      { row: current.row + 1, col: current.col },
      { row: current.row - 1, col: current.col },
    ];
    for (const neighbor of neighbours) {
      if (
        neighbor.col < 0 ||
        neighbor.col >= rows ||
        neighbor.row < 0 ||
        neighbor.row >= cols
      )
        continue;
      if (
        closed_set.some(
          (item) => item.col === neighbor.col && item.row === neighbor.row
        ) ||
        grid[neighbor.col][neighbor.row].isWall
      )
        continue;

      const new_g_score = g_score.get(current) + 1;

      if (
        !open_set.heap.some(
          (item) =>
            item.item.col === neighbor.col && item.item.row === neighbor.row
        ) ||
        new_g_score < g_score.get(neighbor)
      ) {
        came_from.set(neighbor, current);
        g_score.set(neighbor, new_g_score);
        f_score.set(
          neighbor,
          g_score.get(neighbor) + manhattanDistance(neighbor, goal)
        );
        if (neighbor.row === goal.row && neighbor.col === goal.col)
          distance = f_score.get(neighbor);
        if (
          !open_set.heap.some(
            (item) =>
              item.item.col === neighbor.col && item.item.row === neighbor.row
          )
        ) {
          open_set.enqueue(neighbor, f_score.get(neighbor));
        }
      }
    }
  }
  return null;
}
