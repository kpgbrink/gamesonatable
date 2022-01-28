import React, { useContext, useEffect, useState } from "react";
import QRCode from "qrcode.react";
import LinearProgress from "@mui/material/LinearProgress";
import { User, RoomData, NewRoomId } from "api";
import socket from "../../../SocketConnection";
import { AppContext } from "../../../AppContext";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useParams } from "react-router-dom";

export default function PlayerJoin() {
  const { fixedRoomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList } =
    useContext(AppContext);

  const updateRoomData = (roomData: RoomData) => {
    console.log("adding message");
    setUserList(roomData.users);
  };

  useEffect(() => {
    console.log(roomCreated, fixedRoomId);
    if (roomCreated !== null && !fixedRoomId && fixedRoomId !== roomCreated)
      return;
    const fetchData = async () => {
      const response = await fetch("/getNewRoomId");
      const data: NewRoomId = await response.json();
      const roomId = fixedRoomId || data.roomId;
      console.log("make room", roomId);
      socket.emit("host room", roomId, async () => {});
      setRoomCreated(roomId);
    };
    fetchData().catch(console.error);
  }, [setRoomCreated, roomCreated, fixedRoomId]);

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
                          <ListItemText>{user.name}</ListItemText>
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
