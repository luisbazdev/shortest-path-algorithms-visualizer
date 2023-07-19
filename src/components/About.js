import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
export default function About({ showDialog, setShowDialog }) {
  return (
    <Dialog open={showDialog}>
      <DialogTitle>{"Shortest Path Visualizer"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>Welcome to my demo <strong>A* and Dijkstra's algorithms visualizer</strong>, you can
          change the current mode according to what you want to do on the grid,
          for example: adding/removing nodes or edges, etc.
          <br />
          <br />
          These are the available modes on the demo respectively:
          <br />
          <br />
          <strong>Mode 0 (ESC): Insert/delete</strong> (Insert nodes/walls with 'left click' and
          delete them with 'right click')
          <br />
          <strong>Mode 1 (E): Add new edge (source)</strong> (Select source where the new edge
          will start from with 'left click')
          <br />
          <strong>Mode 2: Add new edge (destination)</strong> (Select destination node where the
          new edge will end with 'left click')
          <br />
          <strong> Mode 3 (R): Remove edge (source)</strong> (Select source to delete one of its
          edges with 'left click')
          <br />
          <strong>Mode 4: Remove edge (destination)</strong> (Select destination to delete the
          edge from source to destination with 'left click')
          <br />
          <strong>Mode 5 (S): Set start</strong> (Set the new start node/cell with 'left click')
          <br />
          <strong>Mode 6 (F): Set finish</strong> (Set the new finish node/cell with 'left
          click')
          <br />
          <br />
          You can find the source code here
          <IconButton>
            <a href="https://github.com/luisbazdev/dijkstra-shortest-path-visualizer">
              <GitHubIcon color="primary"/>
            </a>
          </IconButton>
          </p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowDialog(false);
          }}
          autoFocus
        >
          Understood
        </Button>
      </DialogActions>
    </Dialog>
  );
}
