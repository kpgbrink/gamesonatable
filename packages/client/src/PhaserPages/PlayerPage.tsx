import Phaser from "phaser";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import { persistentData } from "./objects/PersistantData";
import PhaserWrapper from "./PhaserWrapper";
import Omaha from "./PlayerScenes/Omaha";
import PlayerBeforeGameStart from "./PlayerScenes/PlayerBeforeGameStart";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import Texas from "./PlayerScenes/Texas";
import ThirtyOne from "./PlayerScenes/ThirtyOne";
import { getStoredIds, storeIds } from "./StoredBrowserIds";

export default function PlayerPage(props: any) {
  const { socket } = useContext(AppContext);
  const { roomId, userId } = useParams();
  const navigate = useNavigate();

  console.log("props", props.match);

  useEffect(() => {
    if (!userId) {
      throw new Error("userId is not defined");
    }
    const newUserIdListenener = (newUserId: string) => {
      if (newUserId !== userId) {
        persistentData.myUserId = newUserId;
        storeIds(socket.id, newUserId);
        console.log("new user id user id", newUserId);
        navigate(`/room/${roomId}/player/${newUserId}`);
        socket.emit("get room data");
      }
    };
    socket.on("new user id", newUserIdListenener);
    const existingUserIdListener = (existingUserId: string) => {
      if (existingUserId !== userId) {
        persistentData.myUserId = existingUserId;
        storeIds(socket.id, existingUserId);
        console.log("existing user id", existingUserId);
        navigate(`/room/${roomId}/player/${existingUserId}`);
        socket.emit("get room data");
      }
    };
    socket.on("existing user id", existingUserIdListener);
    persistentData.myUserId = userId;
    socket.emit("join room", roomId, userId, getStoredIds());
    return () => {
      socket.off("new user id", newUserIdListenener);
      socket.off("existing user id", existingUserIdListener);
    };
  }, [roomId, socket, userId, navigate]);

  console.log("userId", userId, "myPersistentuserId", persistentData.myUserId);
  return (
    <PhaserWrapper
      config={{
        loader: {
          baseURL: "/",
        },
        dom: {
          createContainer: true,
        },
        type: Phaser.AUTO,
        scene: [
          PlayerStartingScene,
          PlayerBeforeGameStart,
          Omaha,
          Texas,
          ThirtyOne,
        ],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 300 },
            debug: true,
          },
        },
        pixelArt: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: 1920,
          height: 1080,
          fullscreenTarget: "game",
        },
      }}
      gameName="Client"
    />
  );
}
