import React, { useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import socket from "../../SocketConnection";
import Navbar from "../Navbar";
import Footer from "./Footer";
import "./HomePage.css";
import GameLink from "./HomePage/GameLink";
import QRCode from "qrcode.react";
import LinearProgress from "@mui/material/LinearProgress";
import { User, RoomData } from "api";

export default function HomePage() {
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
    <div>
      <Navbar />
      <div className="page">
        <div className="playerJoin">
          <div>
            {!roomCreated && <LinearProgress />}
            {roomCreated && (
              <div>
                {joinURL}
                <div>
                  <QRCode value={joinURL} />
                  <div className="playerList">
                    {userList
                      .filter((user) => !user.isHost)
                      .map((user, index) => {
                        return <div key={index}>{user.id}</div>;
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ul className="games">
          <li>
            <GameLink
              url="games/omaha"
              text="Omaha"
              image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/texas"
              text="Texas"
              image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/omaha"
              text="Omaha"
              image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/texas"
              text="Texas"
              image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/omaha"
              text="Omaha"
              image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/texas"
              text="Texas"
              image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/omaha"
              text="Omaha"
              image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/texas"
              text="Texas"
              image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/omaha"
              text="Omaha"
              image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
            />
          </li>
          <li>
            <GameLink
              url="games/texas"
              text="Texas"
              image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
            />
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
