import Phaser from "phaser";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import { persistentData } from "./objects/PersistantData";
import PhaserWrapper from "./PhaserWrapper";
import Omaha from "./PlayerScenes/Omaha";
import PlayerBeforeGameStart from "./PlayerScenes/PlayerBeforeGameStart";
import PlayerStartingScene from "./PlayerScenes/PlayerStartingScene";
import Texas from "./PlayerScenes/Texas";
import ThirtyOne from "./PlayerScenes/ThirtyOne";

export default function PlayerPage() {
  const { socket } = useContext(AppContext);
  const { roomId, userId } = useParams();

  useEffect(() => {
    if (userId) {
      persistentData.myUserId = userId;
    }
    socket.emit("join room", roomId, userId);
    return () => {
      socket.off();
    };
  }, [roomId, socket, userId]);

  // add listener to get the user id
  useEffect(() => {
    const listener = (newUserId: string) => {
      console.log("user id", newUserId);
      persistentData.myUserId = newUserId;
      window.history.pushState("", "", `/player/${roomId}/${newUserId}`);
    };
    socket.on("user id", listener);
    return () => {
      socket.off("user id", listener);
    };
  }, [socket, roomId]);

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
