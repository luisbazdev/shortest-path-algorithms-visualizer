import Xarrow from "react-xarrows";
export default function Dijkstra({
  grid,
  graph,
  onGridClick,
  onNodeClick,
  removeNode,
  directed,
  source,
  destination,
  isLargeScreen,
}) {
  return (
    <div className="grid_container">
      {grid?.map((row, rowIdx) => {
        return (
          <div key={"row" + rowIdx}>
            {row.map((col, colIdx) => {
              const node = Object.values(graph).find(
                (node) => node.x === rowIdx && node.y === colIdx
              );
              const isStart = node?.node === source;
              const isFinish = node?.node === destination;
              return (
                <div
                  key={"row" + rowIdx + "col" + colIdx}
                  className="grid_square"
                  style={{
                    width: isLargeScreen ? "55px" : "40px",
                    height: isLargeScreen ? "55px" : "40px",
                  }}
                  onClick={(e) => {
                    onGridClick(e, rowIdx, colIdx);
                  }}
                >
                  {node && (
                    <div
                      className="visualizer_node"
                      onClick={(e) => {
                        onNodeClick(e, node.node);
                      }}
                      onContextMenu={(e) => {
                        removeNode(e, node.node);
                      }}
                      style={{
                        width: isLargeScreen ? "40px" : "35px",
                        height: isLargeScreen ? "40px" : "35px",
                        cursor: "pointer",
                        color:
                          node.visited && !isStart && !isFinish
                            ? "#FFFFFF"
                            : "#000000",
                        border: node.visited
                          ? "0px"
                          : "1px solid rgb(230, 230, 230)",
                        backgroundColor: isStart
                          ? "rgb(255, 253, 147)"
                          : isFinish
                          ? "rgb(150, 255, 147)"
                          : node.visited
                          ? "#000000"
                          : "#FFFFFF",
                      }}
                      key={"node" + node.node}
                      id={node.node}
                    >
                      {node.node}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}

      {graph?.map((elem) => {
        // Only render edges for nodes with higher IDs
        const neighbours = directed
          ? elem.neighbours
          : elem.neighbours.filter((n) => n.node > elem.node);

        return (
          <div key={"arrow" + elem.node}>
            {neighbours?.map((neighbour) => {
              return (
                <Xarrow
                  key={"arrow" + elem.node + neighbour.node}
                  style={{ backgroundColor: "red" }}
                  start={elem.node}
                  end={neighbour.node}
                  showHead={directed}
                  lineColor={
                    neighbour.final
                      ? "#52B0CD"
                      : neighbour.visited
                      ? "#99E54C"
                      : neighbour.visiting
                      ? "#E54C4C"
                      : "gray"
                  }
                  headColor={
                    neighbour.final
                      ? "#52B0CD"
                      : neighbour.visited
                      ? "#99E54C"
                      : neighbour.visiting
                      ? "#E54C4C"
                      : "gray"
                  }
                  labels=<div style={{ fontWeight: "bold", fontSize: "25px" }}>
                    {neighbour.weight.toString()}
                  </div>
                  curveness={0}
                  headSize={4}
                  strokeWidth={4}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
