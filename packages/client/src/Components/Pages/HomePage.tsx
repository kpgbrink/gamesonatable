import { useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import socket from "../../SocketConnection";
import Footer from "../Footer";
import Navbar from "../Navbar";
import "./HomePage.css";
import GameLink from "./HomePage/GameLink";
import PlayerJoin from "./HomePage/PlayerJoin";

export default function HomePage() {
  const { roomCreated } = useContext(AppContext);

  useEffect(() => {
    socket.emit("select game", "PlayerStartingScene");
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page">
        <PlayerJoin />
        {roomCreated && (
          <ul className="games">
            <li>
              <GameLink
                url={`/host/${roomCreated}/Omaha`}
                text="Omaha"
                image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
              />
            </li>
            <li>
              <GameLink
                url={`/host/${roomCreated}/Texas`}
                text="Texas"
                image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
              />
            </li>
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}
