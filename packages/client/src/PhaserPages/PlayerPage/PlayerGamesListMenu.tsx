import { List, ListItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { Textfit } from "react-textfit";
import { gamesList } from "../objects/gamesList";

export default function PlayerGamesListMenu() {
  const { roomId, userId } = useParams();

  return (
    <div
      style={{
        // position: "absolute",
        top: "150%",
        left: "50%",
        transform: "translate(0%, 0%)",
        aspectRatio: 9 / (16 * 0.8),
        maxWidth: "100vw",
        maxHeight: "80vh",
        margin: "auto",
        backgroundColor: "white",
        borderRadius: "10px",
        zIndex: 100,
      }}
    >
      {/* Show the current game being selected */}
      <div>
        <h1>{}</h1>
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
