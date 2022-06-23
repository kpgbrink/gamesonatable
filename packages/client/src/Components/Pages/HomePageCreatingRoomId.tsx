import { LinearProgress } from "@mui/material";
import { NewRoomId } from "api";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import Footer from "../Footer";
import Navbar from "../Navbar";
import "./HomePage.css";

export default function HomePageCreatingRoomId(props: any) {
  const navigate = useNavigate();
  const { setRoomCreated } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/getNewRoomId");
      const data: NewRoomId = await response.json();
      const newRoomId = data.roomId;
      const newUrl = `/room/${newRoomId}`;
      setRoomCreated(newRoomId);
      navigate(newUrl);
    };
    fetchData().catch(console.error);
  });

  return (
    <div>
      <Navbar />
      <div className="page">
        <LinearProgress />
      </div>
      <Footer />
    </div>
  );
}
