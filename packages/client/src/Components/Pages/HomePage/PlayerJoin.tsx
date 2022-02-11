import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { NewRoomId, RoomData } from "api";
import QRCode from "qrcode.react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../AppContext";
import socket from "../../../SocketConnection";

export default function PlayerJoin() {
  const { fixedRoomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList } =
    useContext(AppContext);

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
    socket.on("room data", (roomData: RoomData) => {
      setUserList(roomData.users);
    });
    return () => {
      // turning of socket listner on unmount
      socket.off("room data");
    };
  }, [setUserList]);

  useEffect(() => {
    console.log("set curren tplayer scene");
    socket.emit("set player current scene", "PlayerStartingScene");
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
