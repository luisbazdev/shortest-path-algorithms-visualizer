export default function Astar({
  grid,
  onSquareClick,
  removeWall,
  startX,
  startY,
  finishX,
  finishY,
  isLargeScreen,
  onMouseUp,
  onMouseDown,
  onMouseEnter,
  setDragging,
}) {
  return (
    <div
      className="grid_container"
      onMouseDown={() => {
        setDragging(true);
      }}
      onMouseUp={onMouseUp}
    >
      {grid?.map((row, rowIdx) => {
        return (
          <div key={"row" + rowIdx}>
            {row.map((col, colIdx) => {
              return (
                <div
                  key={"row" + rowIdx + "col" + colIdx}
                  onMouseEnter={() => onMouseEnter(col)}
                  onMouseDown={(e) => onMouseDown(e, col)}
                  onClick={(e) => onSquareClick(e, col)}
                  onContextMenu={(e) => {
                    removeWall(e, col);
                  }}
                  className="grid_square"
                  style={{
                    width: isLargeScreen ? "55px" : "40px",
                    height: isLargeScreen ? "55px" : "40px",
                    backgroundColor:
                      rowIdx === startX && colIdx === startY
                        ? "rgb(236, 236, 72)"
                        : rowIdx === finishX && colIdx === finishY
                        ? "rgb(138, 236, 72)"
                        : col.isWall
                        ? "rgb(90, 90, 90)"
                        : col.isPath
                        ? "rgb(72, 203, 236)"
                        : col.isVisited
                        ? "rgb(175, 175, 175)"
                        : col.isVisiting
                        ? "rgb(225, 225, 225)"
                        : "transparent",
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
