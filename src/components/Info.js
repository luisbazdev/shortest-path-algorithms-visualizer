import {
  Button,
  FormControl,
  FormControlLabel,
  Slider,
  Switch,
} from "@mui/material";
export default function Info({
  running,
  source,
  destination,
  speed,
  dijkstra,
  astar,
  directed,
  changeDirection,
  changeSpeed,
  changeType,
  type,
  mode,
  nodes,
  edges,
  totalCost,
  startX,
  startY,
  finishX,
  finishY,
  isDesktop,
  changeMode,
  showDialog
}) {
  let modeText;
  switch (mode) {
    case 0:
      modeText = "Insert and delete";
      break;
    case 1:
      modeText = "Select source node for new edge";
      break;
    case 2:
      modeText = "Select destination node for new edge";
      break;
    case 3:
      modeText = "Select source node to remove existing edge";
      break;
    case 4:
      modeText = "Select destination node to remove existing edge";
      break;
    case 5:
      modeText = "Select new start node";
      break;
    case 6:
      modeText = "Select new finish node";
      break;
    default:
      return
  }
  return (
    <div id="visualizer_info" className="visualizer_info">
      <div className="visualizer_info_buttons">
        <Button onClick={changeType} disabled={running}>{type === 0 ? "Switch to A*" : "Switch to Dijkstra's"}</Button>
        {isDesktop && <Slider
          style={{ maxWidth: "300px", marginLeft: "10px" }}
          aria-label="Small steps"
          step={50}
          value={speed}
          min={type === 0 ? 450 : 950}
          max={type === 0 ? 1000: 1050}
          onChange={changeSpeed}
          disabled={running}
        />}
        { type !== 1 && isDesktop && <FormControl>
          <FormControlLabel
            style={{ maxWidth: "200px" }}
            checked={true}
            control={<Switch color="primary" />}
            label="Random Weight"
            labelPlacement="start"
            disabled={true}
          />
        </FormControl>}
        { type !== 1 && <FormControl>
          <FormControlLabel
            style={{ maxWidth: "200px" }}
            checked={directed}
            onChange={changeDirection}
            control={<Switch color="primary" />}
            label="Directed"
            labelPlacement="start"
            disabled={running}
          />
        </FormControl>}
        <Button variant="text" disabled={running} 
        onClick={() => showDialog(true)}
        >Help</Button>
        <Button
          variant="outlined"
          size="small"
          onClick={type === 0 ? dijkstra : astar}
          disabled={
            type === 0
              ? running ||
                source === "-1" ||
                destination === "-1" ||
                source === destination
              : running ||
                startX === -1 ||
                startY === -1 ||
                finishX === -1 ||
                finishY === -1
          }
        >
          RUN
        </Button>
      </div>
      { !isDesktop && <div className="visualizer_info_buttons_mobile">
        <div className="visualizer_info_buttons_box"> 
        <Button className="button_insert" variant="text" disabled={running} size="small" onClick={() => changeMode(0)}>normal mode</Button>
        <Button className="button_start" variant="text" disabled={running} size="small" onClick={() => changeMode(5)}>set start node</Button>
        <Button className="button_finish" variant="text" disabled={running} size="small" onClick={() => changeMode(6)}>set finish node</Button>
        </div>
        {type === 0 && <div className="visualizer_info_buttons_box">
        <Button className="button_new_edge" variant="text" disabled={running} size="small" onClick={() => changeMode(1)}>add new edge</Button>
        <Button className="button_remove_edge" variant="text" disabled={running} size="small" onClick={() => changeMode(3)}>remove edge</Button>
        </div>}
        <p className="visualizer_info_current">
          Mode {mode}: {modeText}
        </p>
       
      </div>}
      { isDesktop && <div className="visualizer_info_details">
        {type === 0 && (
          <p className="visualizer_info_current">Number of nodes: {nodes}</p>
        )}
        {type === 0 && (
          <p className="visualizer_info_current">Number of edges: {edges}</p>
        )}
        <p className="visualizer_info_current">
          Mode {mode}: {modeText}
        </p>
        <p className="visualizer_info_current">
          Total shortest path cost: {running ? "Waiting" : totalCost}
        </p>
      </div>}
    </div>
  );
}