import { Button } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import socket from "../../SocketConnection";

export default function ShowRoomNotExist() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = () => {
      console.log("THE ROOM DOES NOT EXIST");
      setOpen(true);
    };
    socket.on("room does not exist", listener);
    return () => {
      socket.off("room does not exist", listener);
    };
  }, []);

  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>Open dialog</Button> */}
      <Dialog open={open}>
        <DialogTitle>Room does not exist</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The room you are trying to join does not exist. Maybe try again with
            a different link from the host.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
