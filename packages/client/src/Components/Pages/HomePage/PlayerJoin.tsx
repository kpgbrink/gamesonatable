import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { NewRoomId, RoomData } from "api";
import QRCode from "qrcode.react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../AppContext";

export default function PlayerJoin() {
  const { roomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList, socket } =
    useContext(AppContext);

  // Get new room id
  useEffect(() => {
    if (roomId || roomCreated) return;
    console.log("get new room id", roomId);
    const fetchData = async () => {
      const response = await fetch("/getNewRoomId");
      const data: NewRoomId = await response.json();
      const roomId = data.roomId;
      // Change the URL to the new room id
      window.history.pushState("", "", `/room/${roomId}`);
      setRoomCreated(roomId);
    };
    fetchData().catch(console.error);
  }, [setRoomCreated, roomCreated, roomId]);

  // Start hosting room
  useEffect(() => {
    if (!roomId && !roomCreated) return;
    const hostRoomId = roomId || roomCreated;
    console.log("start hosting the room");
    socket.emit("host room", hostRoomId);
    setRoomCreated(hostRoomId);
  }, [setRoomCreated, roomCreated, roomId, socket]);

  // Get room data
  useEffect(() => {
    //The socket is a module that exports the actual socket.io socket
    console.log("start getting room data");

    const roomDataListener = (roomData: RoomData) => {
      console.log("got room data", roomData);
      if (!roomData?.users) return;
      setUserList(roomData.users);
    };
    socket.on("room data", roomDataListener);
    // socket.emit("get room data", roomId);
    console.log("my socket idk", socket.id);

    // close socket on unmount
    return () => {
      console.log("stop listening to room data");
      socket.off("room data", roomDataListener);
    };
  }, [setUserList, roomId, socket]);

  useEffect(() => {
    console.log("set player current scene");
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
