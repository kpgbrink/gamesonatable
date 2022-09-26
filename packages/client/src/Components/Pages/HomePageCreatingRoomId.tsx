import { LinearProgress } from "@mui/material";
import { NewRoomId } from "api";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";

export default function HomePageCreatingRoomId() {
  const navigate = useNavigate();
  const { setRoomCreated } = useContext(AppContext);

  console.log("render this home page creating room id");
  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      const response = await fetch("/getNewRoomId", {
        signal: abortController.signal,
      });
      const data: NewRoomId = await response.json();
      const newRoomId = data.roomId;
      const newUrl = `/room/${newRoomId}`;
      setRoomCreated(newRoomId);
      console.log("navigate to", newUrl);
      navigate(newUrl);
    };
    fetchData().catch(console.error);
    return () => {
      abortController.abort();
    };
  }, [navigate, setRoomCreated]);

  return (
    <div>
      <div>
        <LinearProgress />
      </div>
      <div>
        <h1 id="creatingRoom">Creating Room...</h1>
      </div>
    </div>
  );
}
