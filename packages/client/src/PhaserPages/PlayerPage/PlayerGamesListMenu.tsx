import { List, ListItem } from "@mui/material";
import { MainMenuGameData } from "api/src/data/datas/MainMenuData";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Textfit } from "react-textfit";
import socket from "../../SocketConnection";
import { gamesList } from "../objects/gamesList";

export default function PlayerGamesListMenu() {
  const { roomId, userId } = useParams();

  // visible state bool
  const [visible, setVisible] = useState(false);

  // add event listener to detect if the window should be visible
  useEffect(() => {
    const showGamesListMenu = (e: any) => {
      console.log("this is what e is", e);
      setVisible(e.detail.show);
    };
    window.addEventListener("showGamesListMenu", showGamesListMenu);
    return () => {
      window.removeEventListener("showGamesListMenu", showGamesListMenu);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(0%, 0%)",
        aspectRatio: 9 / 16,
        maxWidth: "100vw",
        maxHeight: "100vh",
        margin: "auto",
        backgroundColor: "white",
        borderRadius: "20px",
        zIndex: 100,
      }}
    >
      {/* Show the current game being selected */}
      <div>
        {/* Add back button */}
        <button
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("showGamesListMenu", { detail: { show: false } })
            );
            const gameData: Partial<MainMenuGameData> = {};
            gameData.mainMenuPosition = 0;
            socket.emit("gameDataToHost", gameData);
          }}
        >
          Back
        </button>
        <h1>Currently Selected Game</h1>
        <p>Text explaining the currently selected game.</p>
      </div>

      {/* Show the games that can be selected */}

      <List
        style={{
          position: "absolute",
          top: "20%",
          width: "100%",
          height: "80%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          overflow: "auto",
          justifyContent: "around",
          backgroundColor: "grey",
          borderRadius: "10px",
        }}
      >
        {gamesList.map((game) => {
          return (
            <ListItem
              key={game.name}
              style={{
                width: "23%",
                height: "50",
                maxHeight: "50%",
                backgroundColor: "white",
                borderRadius: "10px",
                margin: "1%",
              }}
              onClick={() => {
                // set the game to the one that is clicked
              }}
            >
              <Textfit
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  backgroundColor: "white",
                }}
              >
                {game.displayName}
              </Textfit>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
