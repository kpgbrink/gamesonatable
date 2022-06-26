import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Game, RoomData } from "api";
import QRCode from "qrcode.react";
import { useContext, useEffect } from "react";
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
    <div className="playerJoin">
      <div>
        <div>
          <a href={joinURL} target="_blank" rel="noreferrer">
            {joinURL}
          </a>
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
      </div>
    </div>
  );
}
