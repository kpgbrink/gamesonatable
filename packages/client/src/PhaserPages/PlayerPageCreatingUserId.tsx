import { LinearProgress } from "@mui/material";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import { persistentData } from "./objects/PersistantData";

export default function PlayerPageCreatingUserId() {
  const { socket } = useContext(AppContext);
  const { roomId, userId } = useParams();
  const navigate = useNavigate();

  // add listener to get the user id
  useEffect(() => {
    console.log("start listening to the user id");
    const listener = (newUserId: string) => {
      persistentData.myUserId = newUserId;
      console.log("new user id on player page creating user id", newUserId);
      navigate(`/room/${roomId}/player/${newUserId}`);
    };
    socket.on("new user id", listener);
    socket.emit("join room", roomId, null);
    return () => {
      socket.off("new user id", listener);
    };
  }, [navigate, socket, roomId]);

  console.log("userId", userId, "myPersistentuserId", persistentData.myUserId);
  return <LinearProgress />;
}
