import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import socket from "../../SocketConnection";

export default function ShowUserReplaceOptions() {
  const [open, setOpen] = useState(false);
  const [usersToReplace, setUsersToReplace] = useState<string[]>([]);
  const { roomId } = useParams();

  useEffect(() => {
    const listener = (usersToReplaceData: string[]) => {
      console.log("users to replace", usersToReplace);
      setOpen(true);
      setUsersToReplace(usersToReplaceData);
    };
    socket.on("users to replace", listener);
    return () => {
      socket.off("room does not exist", listener);
    };
  }, [open, usersToReplace]);

  // auto choose on the server of the userId thing based on the local data of the user.

  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>Open dialog</Button> */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select User to Replace</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Multiple users left the game in progress. Please choose who you
            were.
          </DialogContentText>
          <List>
            {usersToReplace.map((userId) => (
              <ListItem>
                <NavLink
                  to={`/room/${roomId}/player/${userId}`}
                  onClick={() => {
                    setOpen(false);
                    window.location.reload();
                  }}
                >
                  {userId}
                </NavLink>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
}
