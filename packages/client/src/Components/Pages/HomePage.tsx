import React, { useEffect } from "react";
import { AppContext } from "../../AppContext";
import socket from "../../SocketConnection";
import Navbar from "../Navbar";
import Footer from "./Footer";
import "./HomePage.css";
import GameLink from "./HomePage/GameLink";

export default function HomePage() {
  const { setRoomCreated } = React.useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/makeRoomId");
      const data = await response.json();
      console.log("make room", data.roomId);
      socket.emit("make new room", data.roomId);
      setRoomCreated(data.roomId);
    };
    fetchData().catch(console.error);
  }, [setRoomCreated]);

  return (
    <div>
      <Navbar />
      <div className="page">
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
