import React, { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import LinearProgress from "@mui/material/LinearProgress";
import { User, RoomData } from "api";
import socket from "../../../SocketConnection";
import { AppContext } from "../../../AppContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

export default function PlayerJoin() {
  const { setRoomCreated, roomCreated } = React.useContext(AppContext);
  const [userList, setUserList] = useState<User[]>([]);

  const updateRoomData = (roomData: RoomData) => {
    console.log("adding message");
    setUserList(roomData.users);
  };

  useEffect(() => {
    if (roomCreated !== null) return;
    const fetchData = async () => {
      const response = await fetch("/getNewRoomId");
      const data = await response.json();
      console.log("make room", data.roomId);
      socket.emit("host room", data.roomId, async () => {});
      setRoomCreated(data.roomId);
    };
    fetchData().catch(console.error);
  }, [setRoomCreated, roomCreated]);

  useEffect(() => {
    //The socket is a module that exports the actual socket.io socket
    socket.on("room data", updateRoomData);
    return () => {
      // turning of socket listner on unmount
      socket.off("room data", updateRoomData);
    };
  }, []);

  const joinURL = `${window.location.origin}/room/${roomCreated}`;

  return (
    <div className="playerJoin">
      <div>
        {!roomCreated && <LinearProgress />}
        {roomCreated && (
          <div>
            {joinURL}
            <div>
              <QRCode value={joinURL} />
              <div className="playerList">
                <List>
                  {userList
                    .filter((user) => !user.isHost)
                    .map((user, index) => {
                      return (
                        <ListItem key={index}>
                          <ListItemText>{user.id}</ListItemText>
                        </ListItem>
                      );
                    })}
                </List>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
