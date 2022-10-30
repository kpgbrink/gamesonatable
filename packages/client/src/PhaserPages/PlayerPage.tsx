import { LinearProgress } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import { persistentData } from "./objects/PersistantData";
import PhaserWrapper from "./PhaserWrapper";
import PlayerGamesListMenu from "./PlayerPage/PlayerGamesListMenu";
import ShowRoomIssue from "./PlayerPage/ShowRoomIssue";
import ShowUserReplaceOptions from "./PlayerPage/ShowUserReplaceOptions";
import { getStoredIds, storeIds } from "./PlayerPage/StoredBrowserIds";
import PlayerBeforeGameStart from "./PlayerScenes/PlayerBeforeTableGameStart";
import PlayerOmahaScene from "./PlayerScenes/PlayerOmahaScene";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import PlayerTexasScene from "./PlayerScenes/PlayerTexasScene";
import PlayerThirtyOneScene from "./PlayerScenes/PlayerThirtyOneScene";

export default function PlayerPage() {
  const { socket } = useContext(AppContext);
  const { roomId, userId } = useParams();
  const navigate = useNavigate();

  // add state to keep track if the room exists
  const [roomExists, setRoomExists] = useState(false);

  useEffect(() => {
    if (!userId) {
      throw new Error("userId is not defined");
    }
    const userIdListener = (existingUserId: string) => {
      setRoomExists(true);
      if (existingUserId !== userId) {
        persistentData.myUserId = existingUserId;
        storeIds(socket.id, existingUserId);
        navigate(`/room/${roomId}/player/${existingUserId}`);
        // reload page
        window.location.reload();
      }
    };
    socket.on("user id", userIdListener);
    persistentData.myUserId = userId;
    socket.emit("join room", roomId, userId, getStoredIds());
    return () => {
      socket.off("user id", userIdListener);
    };
  }, [roomId, socket, userId, navigate]);

  // on window error post error to server
  useEffect(() => {
    const windowErrorListener = (event: ErrorEvent) => {
      socket.emit("window error", event.message);
    };
    window.addEventListener("error", windowErrorListener);
    socket.emit("window error", "window error test");
    return () => {
      window.removeEventListener("error", windowErrorListener);
    };
  }, [socket]);

  return (
    <div id="fullScreen">
      {!roomExists && <LinearProgress />}
      <PlayerGamesListMenu />
      {roomExists && (
        <PhaserWrapper
          config={{
            scene: [
              PlayerStartingScene,
              PlayerBeforeGameStart,
              PlayerOmahaScene,
              PlayerTexasScene,
              PlayerThirtyOneScene,
            ],
            scale: {
              width: 1080,
              height: 1920,
            },
          }}
        />
      )}
      {!roomExists && <ShowRoomIssue />}
      <ShowUserReplaceOptions />
    </div>
  );
}
