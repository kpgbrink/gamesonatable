import { List, ListItem } from "@mui/material";
import { MainMenuGameData } from "api/src/data/datas/MainMenuData";
import { useEffect, useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Textfit } from "react-textfit";
import { palletColors } from "../../Palettes";
import socket from "../../SocketConnection";
import { gamesList } from "../objects/gamesList";

export default function PlayerGamesListMenu() {
  const { roomId, userId } = useParams();

  // visible state bool
  const [visible, setVisible] = useState(false);

  const [timeOutVisible, setTimeOutVisible] = useState(false);

  // selected game state that is nullable string
  const [selectedGameNameName, setSelectedGame] = useState<string | null>(null);

  // set visible to true after 1 second
  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeOutVisible(true);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // add event listener to detect if the window should be visible
  useEffect(() => {
    const showGamesListMenu = (e: any) => {
      setVisible(e.detail.show);
    };
    window.addEventListener("showGamesListMenu", showGamesListMenu);
    return () => {
      window.removeEventListener("showGamesListMenu", showGamesListMenu);
    };
  }, []);

  useLayoutEffect(() => {
    // emit resizeSpecialEvent
    console.log("emit resize special");
    window.dispatchEvent(new Event("resizeSpecial"));
  }, [visible]);

  if (!visible || !timeOutVisible) {
    return null;
  }

  const selectedGame = gamesList.find(
    (game) => game.name === selectedGameNameName
  );
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
        backgroundColor: palletColors.color5,
        borderRadius: "20px",
        zIndex: 100,
      }}
    >
      {/* Show the current game being selected */}
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "20%",
        }}
      >
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
          style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "23%",
            height: "20%",
            backgroundColor: palletColors.color3,
            color: palletColors.color1,
            borderRadius: "20px",
            fontWeight: "bold",
            // show pointer when hovering
            cursor: "pointer",
          }}
        >
          <Textfit>Back</Textfit>
        </button>
        {selectedGame ? (
          <div>
            <h1
              style={{
                position: "absolute",
                top: "0px",
                left: "24%",
                width: "70%",
                height: "20%",
                color: palletColors.color1,
              }}
            >
              {selectedGame.displayName}
            </h1>
            <p
              style={{
                position: "absolute",
                top: "20%",
                left: "24%",
                width: "70%",
                height: "80%",
                color: palletColors.color1,
              }}
            >
              {selectedGame.description}
            </p>
            <button
              onClick={() => {
                const gameData: Partial<MainMenuGameData> = {};
                gameData.gameChosen = selectedGameNameName;
                socket.emit("gameDataToHost", gameData);
              }}
              style={{
                position: "absolute",
                top: "80%",
                left: "50%",
                width: "48%",
                height: "20%",
                backgroundColor: palletColors.color2,
                padding: ".1%",
                borderRadius: "10px",
                color: palletColors.color4,
                fontWeight: "bold",
                // show pointer when hovering
                cursor: "pointer",
              }}
            >
              <Textfit>Play</Textfit>
            </button>
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "30%",
              width: "80%",
              height: "50%",
              color: palletColors.color1,
            }}
          >
            <Textfit>Choose a game</Textfit>
          </div>
        )}
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
          backgroundColor: palletColors.color4,
          borderRadius: "10px",
        }}
      >
        {gamesList.map((game) => {
          if (game.name === selectedGameNameName) {
            return (
              <ListItem
                onClick={(e: any) => {
                  e.preventDefault();
                  setSelectedGame(game.name);
                  const gameData: Partial<MainMenuGameData> = {};
                  gameData.gameSelectingName = game.name;
                  socket.emit("gameDataToHost", gameData);
                }}
                key={game.name}
                style={{
                  width: "23%",
                  height: "50",
                  maxHeight: "50%",
                  borderRadius: "10px",
                  margin: "1%",
                  // show clickable
                  cursor: "pointer",
                  backgroundColor: palletColors.color3,
                }}
              >
                <Textfit
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    // make text not selectable
                    userSelect: "none",
                    backgroundColor: palletColors.color3,
                  }}
                >
                  {game.displayName}
                </Textfit>
              </ListItem>
            );
          }
          return (
            <ListItem
              onClick={(e: any) => {
                e.preventDefault();
                setSelectedGame(game.name);
                const gameData: Partial<MainMenuGameData> = {};
                gameData.gameSelectingName = game.name;
                socket.emit("gameDataToHost", gameData);
              }}
              key={game.name}
              style={{
                width: "23%",
                height: "50",
                maxHeight: "50%",
                backgroundColor: palletColors.color1,
                borderRadius: "10px",
                margin: "1%",
                // show clickable
                cursor: "pointer",
              }}
            >
              <Textfit
                style={{
                  width: "100%",
                  height: "100%",
                  textAlign: "center",
                  backgroundColor: palletColors.color1,
                  // make text not selectable
                  userSelect: "none",
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
