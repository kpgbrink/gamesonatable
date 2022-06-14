import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { NewRoomId, RoomData } from "api";
import QRCode from "qrcode.react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../AppContext";
import { persistentData } from "../../../PhaserPages/objects/PersistantData";

export default function PlayerJoin() {
  const { roomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList, socket } =
    useContext(AppContext);

  // Get new room id
  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      if (roomId || roomCreated) return;
      console.log("how many times fetchData is called?");
      const response = await fetch("/getNewRoomId", {
        signal: abortController.signal,
      });
      const data: NewRoomId = await response.json();
      const newRoomId = data.roomId;
      // Change the URL to the new room id
      console.log("roomId", roomId, "roomCreated", roomCreated);
      window.history.pushState("", "", `/room/${newRoomId}`);
      setRoomCreated(newRoomId);
      console.log("room id that was just set", newRoomId, roomId, roomCreated);
    };
    fetchData().catch(console.error);
    return () => {
      abortController.abort();
    };
  }, [roomId, roomCreated, setRoomCreated]);

  // Start hosting room
  useEffect(() => {
    if (!roomId && !roomCreated) return;
    const hostRoomId = roomId || roomCreated;
    socket.emit("host room", hostRoomId);
    setRoomCreated(hostRoomId);
  }, [setRoomCreated, roomCreated, roomId, socket]);

  // Get room data
  useEffect(() => {
    //The socket is a module that exports the actual socket.io socket
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

  useEffect(() => {
    socket.emit("set player current scene", "PlayerStartingScene");
  }, [roomId, socket]);

  const joinURL = `${window.location.origin}/player/${roomCreated}`;

  return (
    <div className="playerJoin">
      <div>
        {!roomCreated && <LinearProgress />}
        {roomCreated && (
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
        )}
      </div>
    </div>
  );
}
