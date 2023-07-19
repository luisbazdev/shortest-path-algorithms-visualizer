import "./Visualizer.css";
import React, { useState, useEffect, useRef } from "react";
import About from "./About";
import Info from "./Info";
import Astar from "./Astar";
import Dijkstra from "./Dijkstra";
import { shortestPath } from "../dijkstra";
import { astar_search } from "../astar";
export default function Visualizer() {
  const [running, setRunning] = useState(false);

  const [rows, setRows] = useState(0);
  const [cols, setCols] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(null);

  const [graph, setGraph] = useState([]);
  const [grid, setGrid] = useState([]);

  const [nodes, setNodes] = useState(0);
  const [edges, setEdges] = useState(0);

  const [type, setType] = useState(0);
  const [mode, setMode] = useState(0);

  // Source and Destination IDs from start and finish nodes in the graph
  const [source, setSource] = useState("-1");
  const [destination, setDestination] = useState("-1");

  // X and Y coordinates from start and finish cells in the grid
  const [startX, setStartX] = useState(-1);
  const [startY, setStartY] = useState(-1);
  const [finishX, setFinishX] = useState(-1);
  const [finishY, setFinishY] = useState(-1);

  const [directed, setDirected] = useState(true);
  const [totalCost, setTotalCost] = useState(-1);
  const [speed, setSpeed] = useState(250);

  const [removedNodes, setRemovedNodes] = useState([]);
  // Last source node selected to create/remove an edge
  const [sourceEdge, setSourceEdge] = useState(null);

  const [showDialog, setShowDialog] = useState(true);

  const [dragging, setDragging] = useState(true);
  const [isLeftClick, setIsLeftClick] = useState(false);

  const containerRef = useRef(null);
  function resetGraph() {
    let _graph = [...graph];
    _graph.forEach((node) => {
      node.visited = false;
      node.neighbours.forEach((neighbor) => {
        neighbor.visited = neighbor.final = false;
      });
    });
    setGraph(_graph);
  }
  function resetGrid() {
    let _grid = [...grid];
    _grid.forEach((row) => {
      row.forEach((column) => {
        column.isVisited = column.isVisiting = column.isPath = false;
      });
    });
    setGrid([..._grid]);
  }
  function animateDijkstraPath(path) {
    let _graph = [...graph];
    for (let i = 0; i < path.length - 1; i++) {
      _graph
        .find((node) => node.node === path[i])
        .neighbours.find(
          (neighbor) => neighbor.node === path[i + 1]
        ).final = true;
      if (!directed)
        _graph
          .find((node) => node.node === path[i + 1])
          .neighbours.find(
            (neighbor) => neighbor.node === path[i]
          ).final = true;
    }
    setGraph([..._graph]);
  }
  function animateDijkstra() {
    // Reset the shortest path and visited edges
    resetGraph();

    // Run Dijkstra's algorithm to find the shortest path
    let { distance, path, order, previous } = shortestPath(
      graph,
      source,
      destination
    );
    // If a shortest path was found
    if (distance !== Infinity) {
      // Set the running flag to true
      setRunning(true);
      setMode(0);

      // Create a copy of the graph
      let _graph = [...graph];
      _graph.find((node) => node.node === order[0]).visited = true;
      setGraph([..._graph]);
      // Initialize the indices for the current node and edge
      let i = 0;
      let j = 0;
      // Set up an interval to simulate the animation
      let interval = setInterval(
        () => {
          let currentNode = _graph.find((node) => node.node === order[i]);
          let nextNode = _graph.find((node) => node.node === order[i + 1]);
          let neighbours = currentNode.neighbours;

          if (i > 0)
            neighbours = neighbours.filter(
              (neighbor) => neighbor.node !== previous[currentNode.node]
            );

          let forwardEdge = neighbours[j];
          let backwardsEdge = _graph
            .find((node) => node.node === forwardEdge?.node)
            ?.neighbours?.find((node) => node.node === currentNode.node);

          if (forwardEdge) forwardEdge.visiting = true;
          if (backwardsEdge) backwardsEdge.visiting = true;

          j++;

          // If we've visited all the edges of the current node, move to the next node
          let done = j >= Object.keys(neighbours).length;
          if (done) {
            j = 0;
            i++;
          }

          // If we've visited all the nodes in the shortest path, stop the animation
          if (i >= order.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setRunning(false);
              setTotalCost(distance);
              animateDijkstraPath(path);
            }, 1100 - speed);
          }

          // Update the graph with the new visited edge
          setGraph([..._graph]);

          // Set a timeout to simulate the edge becoming unvisited again after 1 second
          setTimeout(
            (i) => {
              if (forwardEdge) forwardEdge.visiting = false;
              if (backwardsEdge) backwardsEdge.visiting = false;
              if (done) {
                if (directed) {
                  _graph
                    .find((node) => node.node === previous[order[i]])
                    .neighbours.find(
                      (node) => node.node === order[i]
                    ).visited = true;
                  _graph.find((node) => node.node === order[i]).visited = true;
                } else {
                  nextNode.visited = true;
                  let a = nextNode.neighbours?.find(
                    (node) => node.node === previous[nextNode.node]
                  );
                  let b = _graph
                    .find((node) => node.node === previous[nextNode.node])
                    ?.neighbours?.find((node) => node.node === nextNode.node);
                  if (a) a.visited = true;
                  if (b) b.visited = true;
                }
              }
              setGraph([..._graph]);
            },
            1100 - speed,
            i
          );
        },
        1100 - speed,
        i
      );
    }
  }
  function AStarSearch() {
    resetGrid();
    let astar_result = astar_search(
      grid,
      { row: startY, col: startX },
      { row: finishY, col: finishX }
    );
    if (!astar_result) return;
    setMode(0);
    let { path, order, distance } = astar_result;
    animateAStarSearch(path, order, distance);
  }
  function animateAStarSearch(path, order, distance) {
    setRunning(true);
    let _grid = [...grid];
    let i = 0;
    const rows = grid.length;
    const cols = grid[0].length;
    let interval = setInterval(
      () => {
        let { row, col } = order[i];
        _grid[col][row].isVisited = true;
        let neighbours = [
          { row: row + 1, col },
          { row: row - 1, col },
          { row, col: col + 1 },
          { row, col: col - 1 },
        ];

        for (let i in neighbours) {
          let { row, col } = neighbours[i];

          if (col < 0 || col >= rows || row < 0 || row >= cols) continue;
          if (!_grid[col][row].isWall) _grid[col][row].isVisiting = true;
        }
        i++;
        setGrid([..._grid]);
        if (i >= order.length) {
          clearInterval(interval);
          animateAStarPath(path, distance);
        }
      },
      1100 - speed,
      i
    );
  }
  function animateAStarPath(path, distance) {
    let _grid = [...grid];
    let i = 0;
    let interval = setInterval(
      () => {
        let { row, col } = path[i];
        _grid[col][row].isPath = true;
        i++;
        setGrid([..._grid]);
        if (i >= path.length) {
          clearInterval(interval);
          setTotalCost(distance);
          setRunning(false);
        }
      },
      1100 - speed,
      i
    );
  }
  // Removes from every node in the graph all edges that go to 'id'
  function clearNeighbours(id) {
    let _graph = [...graph];
    let neighbours = _graph.find((node) => node.node === id).neighbours.length;
    let count = 0;
    _graph.forEach((node) => {
      node.neighbours = node.neighbours.filter((neighbor) => {
        if (neighbor.node === id) count++;
        return neighbor.node !== id;
      });
    });
    if (directed) setEdges(edges - (count + neighbours));
    else setEdges(edges - neighbours);
    setGraph([..._graph]);
  }
  function createNode(x, y) {
    let _graph = [...graph];
    let next = _graph.length.toString();
    if (removedNodes.length > 0) {
      next = removedNodes[0].node;
      setRemovedNodes((prev) => prev.slice(1));
    }
    _graph.push({
      node: next,
      x,
      y,
      visited: false,
      neighbours: [],
    });
    setGraph([..._graph]);
    setNodes(nodes + 1);
  }
  function removeNode(e, id) {
    if (running || mode !== 0) return;
    if (id === source) setSource("-1");
    if (id === destination) setDestination("-1");
    e.preventDefault();
    if (mode === 0) {
      let nodeToRemove = graph.find((node) => node.node === id);
      clearNeighbours(id);
      setNodes(nodes - 1);
      setGraph(graph.filter((node) => node !== nodeToRemove));
      setRemovedNodes((prev) =>
        [...prev, nodeToRemove].sort((a, b) => a.node - b.node)
      );
    }
  }
  function createEdge(a, b) {
    let _graph = [...graph];
    let edgeAlreadyExists = _graph
      .find((node) => node.node === a)
      .neighbours.find((node) => node.node === b);
    if (edgeAlreadyExists || a === b) return false;
    // Set a random weight
    let weight = Math.floor(Math.random() * 15) + 1;
    _graph.forEach((node) => {
      if (node.node === a || (node.node === b && !directed)) {
        node.neighbours.push({
          node: node.node === a ? b.toString() : a.toString(),
          weight,
          visited: false,
          visiting: false,
          final: false,
        });
      }
    });
    setGraph([..._graph]);
    setEdges(edges + 1);
    return true;
  }
  function removeEdge(a, b) {
    let _graph = [...graph];
    _graph.forEach((node) => {
      if (node.node === a || (node.node === b && !directed)) {
        // Edge from 'a' to 'b' or viceversa
        let edge = node.node === a ? b.toString() : a.toString();
        node.neighbours = node.neighbours.filter(
          (neighbor) => neighbor.node !== edge
        );
      }
    });
    setGraph([..._graph]);
    setEdges(edges - 1);
  }
  function onKeyPress(event) {
    if(running) return
    if (type === 0) {
      switch (event.key) {
        case "Escape": {
          setMode(0);
          break;
        }
        case "e":
        case "E": {
          setMode(1);
          break;
        }
        case "r":
        case "R": {
          setMode(3);
          break;
        }
        case "s":
        case "S": {
          setMode(5);
          break;
        }
        case "f":
        case "F": {
          setMode(6);
          break;
        }
        default:
          return;
      }
    } else {
      switch (event.key) {
        case "Escape": {
          setMode(0);
          break;
        }
        case "s":
        case "S": {
          setMode(5);
          break;
        }
        case "f":
        case "F": {
          setMode(6);
          break;
        }
        default:
          return;
      }
    }
  }
  function onGridClick(event, row, col) {
    if (
      mode !== 0 ||
      event.target.className === "visualizer_node" ||
      event.target.children.length ||
      running
    )
      return;
    createNode(row, col);
  }
  function onNodeClick(event, id) {
    if(running) return
    resetGraph();
    switch (mode) {
      case 1: {
        setSourceEdge(id);
        setMode(2);
        break;
      }
      case 2: {
        let newEdgeCreated = createEdge(sourceEdge, id);
        if (newEdgeCreated) setMode(1);
        break;
      }
      case 3: {
        setSourceEdge(id);
        setMode(4);
        break;
      }
      case 4: {
        removeEdge(sourceEdge, id);
        setMode(3);
        break;
      }
      case 5: {
        if (id === destination) {
          setDestination(source);
          setSource(id.toString());
        } else setSource(id.toString());
        break;
      }
      case 6: {
        if (id === source) {
          setSource(destination);
          setDestination(source);
        } else setDestination(id.toString());
        break;
      }
      default:
        return;
    }
  }
  function onSquareClick(e, square) {
    let isWall = square.isWall;
    if (running) return;
    resetGrid();
    switch (mode) {
      case 5: {
        if (isWall) return;
        setStart(square);
        setMode(0);
        break;
      }
      case 6: {
        if (isWall) return;
        setFinish(square);
        setMode(0);
        break;
      }
      default:
        return;
    }
  }
  function createSquare(row, col) {
    return {
      row,
      col,
      isWall: false,
      isVisited: false,
      isVisiting: false,
      isPath: false,
    };
  }
  function getInitialGrid() {
    let grid = [];
    for (let row = 0; row < cols; row++) {
      let currentRow = [];
      for (let col = 0; col < rows; col++) {
        currentRow.push(createSquare(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  }
  function setStart(square) {
    let { row, col } = square;
    if (finishX === row && finishY === col) {
      setFinishX(startX);
      setFinishY(startY);
    }
    setStartX(row);
    setStartY(col);
  }
  function setFinish(square) {
    let { row, col } = square;
    if (startX === row && startY === col) {
      setStartX(finishX);
      setStartY(finishY);
    }
    setFinishX(row);
    setFinishY(col);
  }
  function createWall(square) {
    let { row, col } = square;
    let _grid = [...grid];
    _grid[row][col].isWall = true;
    setGrid([..._grid]);
  }
  function removeWall(e, square) {
    if (e) e.preventDefault();
    if (running || mode !== 0) return;
    let { row, col } = square;
    let _grid = [...grid];
    _grid[row][col].isWall = false;
    setGrid([..._grid]);
  }
  function changeType() {
    type === 0 ? setType(1) : setType(0);
  }
  function changeDirection() {
    setDirected(!directed);
    setGraph([]);
  }
  function changeSpeed(e) {
    setSpeed(e.target.value);
  }
  function changeMode(mode) {
    setMode(mode);
  }
  function handleMouseUp() {
    setDragging(false);
  }
  function handleMouseDown(event, square) {
    if (mode !== 0 || running) return;
    let { row, col } = square;
    if (row === startX && col === startY) return;
    if (row === finishX && col === finishY) return;
    resetGrid();
    if (event.button === 0) {
      createWall(square);
      setIsLeftClick(true);
    } else {
      removeWall(null, square);
      setIsLeftClick(false);
    }
    setDragging(true);
  }
  function handleMouseEnter(square) {
    if (mode !== 0 || running) return;
    let { row, col } = square;
    if (row === startX && col === startY) return;
    if (row === finishX && col === finishY) return;
    if (dragging) {
      if (isLeftClick) {
        createWall(square);
      } else {
        removeWall(null, square);
      }
    }
  }
  useEffect(() => {
    containerRef.current.focus();
  }, [running]);
  useEffect(() => {
    setGrid([...getInitialGrid()]);
    setSpeed(type === 0 ? 450 : 950);
  }, [type]);
  useEffect(() => {
    setGraph([]);
    setSource("-1");
    setDestination("-1");
    setNodes(0);
    setEdges(0);
    setMode(0);
    setTotalCost(0);
    setRemovedNodes([]);
    setStartX(-1);
    setStartY(-1);
    setFinishX(-1);
    setFinishY(-1);
  }, [type, directed]);
  useEffect(() => {
    if (rows !== 0 && cols !== 0) {
      setGrid([...getInitialGrid()]);
    }
  }, [rows, cols]);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 800);
    };
    // Add event listener for resize events
    window.addEventListener("resize", handleResize);

    // Call the resize function once on mount
    handleResize();

    // Remove event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (isLargeScreen != null) {
      const container = document.getElementById("visualizer_container");
      setTimeout(() => {
        container.classList.add("visible");
      }, 50);
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const maxCols = Math.floor(containerWidth / (isLargeScreen ? 55 : 40));
      const maxRows = Math.floor(containerHeight / (isLargeScreen ? 55 : 40));
      setRows(maxRows);
      setCols(maxCols);
    }
  }, [isLargeScreen]);
  return (
    <div
      tabIndex={0}
      id="visualizer_container"
      className="visualizer_container"
      onKeyDown={onKeyPress}
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
    >
      <About showDialog={showDialog} setShowDialog={setShowDialog} />
      <Info
        running={running}
        source={source}
        destination={destination}
        speed={speed}
        dijkstra={animateDijkstra}
        astar={AStarSearch}
        directed={directed}
        changeDirection={changeDirection}
        changeSpeed={changeSpeed}
        changeType={changeType}
        type={type}
        mode={mode}
        nodes={nodes}
        edges={edges}
        totalCost={totalCost}
        startX={startX}
        startY={startY}
        finishX={finishX}
        finishY={finishY}
        isDesktop={isLargeScreen}
        changeMode={changeMode}
        showDialog={setShowDialog}
      />
      <div className="visualizer_editor">
        {type === 1 ? (
          <Astar
            grid={grid}
            onSquareClick={onSquareClick}
            removeWall={removeWall}
            startX={startX}
            startY={startY}
            finishX={finishX}
            finishY={finishY}
            isLargeScreen={isLargeScreen}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseEnter}
            setDragging={setDragging}
          />
        ) : (
          <Dijkstra
            grid={grid}
            graph={graph}
            onGridClick={onGridClick}
            onNodeClick={onNodeClick}
            removeNode={removeNode}
            directed={directed}
            source={source}
            destination={destination}
            isLargeScreen={isLargeScreen}
          />
        )}
      </div>
    </div>
  );
}
