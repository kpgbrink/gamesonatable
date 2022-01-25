import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Footer from "./Footer";
import socket from "../../SocketConnection";
import { useParams } from "react-router-dom";
import { AppContext } from "../../AppContext";

export default function TestChat() {
  const { roomJoined, setRoomJoined, roomCreated } =
    React.useContext(AppContext);
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setChat] = useState<any[]>([]);

  const sendChat = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    socket.emit("chat", message);
    setMessage("");
  };

  const addMessage = (msg: string) => {
    console.log("adding message");
    setChat((messages) => [...messages, msg]);
  };

  useEffect(() => {
    console.log("joining room", roomId);
    socket.emit("join room", roomId);
  }, [roomId]);

  useEffect(() => {
    setRoomJoined(roomId || "");
  }, [roomId, setRoomJoined]);

  useEffect(() => {
    //The socket is a module that exports the actual socket.io socket
    socket.on("chat", addMessage);
    return () => {
      // turning of socket listner on unmount
      socket.off("chat", addMessage);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page">
        <p>
          Room created: {roomCreated} RoomIn : {roomJoined}
        </p>
        <h1>Instructions</h1>
        <p>This is the test chat.</p>
        {messages.map((payload, index) => {
          return (
            <div key={index}>
              <p>{payload}</p>
            </div>
          );
        })}
        <form onSubmit={sendChat}>
          <input
            type="text"
            name="chat"
            placeholder="send text"
            value={message}
            autoComplete="off"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
