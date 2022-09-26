import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Game, RoomData } from "api";
import { useContext, useEffect } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../AppContext";
import { persistentData } from "../../../PhaserPages/objects/PersistantData";

export default function PlayerJoin() {
  const { roomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList, socket } =
    useContext(AppContext);

  // Get room data
  useEffect(() => {
    // The socket is a module that exports the actual socket.io socket
    const roomDataListener = (roomData: RoomData) => {
      if (!roomData?.users) return;
      persistentData.roomData = roomData;
      setUserList(roomData.users);
    };
    socket.on("room data", roomDataListener);
    // close socket on unmount
    return () => {
      socket.off("room data", roomDataListener);
    };
  }, [setUserList, roomId, socket]);

  // Start hosting room
  useEffect(() => {
    if (!roomId && !roomCreated) return;
    const hostRoomId = roomId || roomCreated;
    socket.emit("host room", hostRoomId);
    setRoomCreated(hostRoomId);
  }, [setRoomCreated, roomCreated, roomId, socket]);

  useEffect(() => {
    const updateGame: Game = {
      currentPlayerScene: "PlayerStartingScene",
      selectedGame: null,
      joinable: null,
      leavable: null,
    };
    socket.emit("update game", updateGame);
  }, [roomId, socket]);

  const joinURL = `${window.location.origin}/room/${roomCreated}/player`;

  return (
    <div id="playerJoin">
      <a href={joinURL} target="_blank" rel="noreferrer">
        {joinURL}
      </a>
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "2%",
          height: "65%",
        }}
      >
        <QRCode
          // size={256}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "grey",
          }}
          value={joinURL}
          viewBox={`0 0 256 256`}
        />
      </div>
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
  );
}
