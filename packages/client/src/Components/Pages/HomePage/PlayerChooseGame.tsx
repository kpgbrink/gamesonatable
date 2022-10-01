import { List, ListItem } from "@mui/material";
import { Game, RoomData, UserAvatar } from "api";
import { useContext, useEffect } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { Textfit } from "react-textfit";
import { AppContext } from "../../../AppContext";
import { avatarImages } from "../../../PhaserPages/objects/avatarImages.generated";
import { persistentData } from "../../../PhaserPages/objects/PersistantData";

// add setMainMenuData to props
export default function PlayerChooseGame() {
  const { roomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList, socket } =
    useContext(AppContext);

  // Get room data
  useEffect(() => {
    // The socket is a module that exports the actual socket.io socket
    const roomDataListener = (roomData: RoomData) => {
      if (!roomData?.users) return;
      persistentData.roomData = roomData;
      setUserList(roomData.users);
    };
    socket.on("room data", roomDataListener);
    // close socket on unmount
    return () => {
      socket.off("room data", roomDataListener);
    };
  }, [setUserList, roomId, socket]);

  // Start hosting room
  useEffect(() => {
    if (!roomId && !roomCreated) return;
    const hostRoomId = roomId || roomCreated;
    socket.emit("host room", hostRoomId);
    setRoomCreated(hostRoomId);
  }, [setRoomCreated, roomCreated, roomId, socket]);

  useEffect(() => {
    const updateGame: Game = {
      currentPlayerScene: "PlayerStartingScene",
      selectedGame: null,
      joinable: null,
      leavable: null,
    };
    socket.emit("update game", updateGame);
  }, [roomId, socket]);

  // set the game
  useEffect(() => {});

  const joinURL = `${window.location.origin}/room/${roomCreated}/player`;

  const userListNoHosts = userList.filter((user) => !user.isHost);
  console.log("player choose game user list", userListNoHosts);
  // add dummy users for testing
  for (let i = 0; i < 0; i++) {
    userListNoHosts.push({
      id: "dummy" + i,
      socketId: "dummy" + i,
      userColor: "red",
      name: `Player ${i}`,
      isHost: false,
      room: "dummy",
      userAvatar: null,
      rotation: 0,
      inGame: false,
      hasSetName: false,
    });
  }

  return (
    <div id="playerJoin">
      {/* <a href={joinURL} target="_blank" rel="noreferrer">
        {joinURL}
      </a> */}
      <Textfit
        style={{
          position: "absolute",
          top: "4%",
          width: "100%",
          height: "15%",
          textAlign: "center",
        }}
      >
        Phone Party
      </Textfit>

      <a href={joinURL} target="_blank" rel="noreferrer">
        <div
          style={{
            position: "absolute",
            top: "2%",
            left: "1%",
            height: "20%",
          }}
        >
          <QRCode
            // size={256}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "grey",
            }}
            value={joinURL}
            viewBox={`0 0 256 256`}
          />
        </div>
      </a>
      <div
        id="playerList"
        style={{
          position: "absolute",
          top: "82%",
          left: "5%",
          height: "10%",
          width: "90%",
          maxWidth: "90%",
          padding: ".2%",
          borderRadius: "10px",
        }}
      >
        {userListNoHosts.length > 0 && (
          <List
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {userListNoHosts.map((user, index) => {
              return (
                <ListItem
                  key={index}
                  style={{
                    // tranparent background
                    // backgroundColor: "rgba(0,0,0,0)",
                    borderRadius: "5px",
                    width: "10%",
                    minWidth: 0,
                  }}
                >
                  {/* Add user avatar image here */}

                  <Textfit
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                    mode="single"
                  >
                    {user.name}
                  </Textfit>
                  {user.userAvatar && (
                    <UserAvatarImages userAvatar={user.userAvatar} />
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
      </div>
    </div>
  );
}

// Avatar Images
// -----------------------------------

function UserAvatarImages({ userAvatar }: { userAvatar: UserAvatar }) {
  return (
    <>
      <UserAvatarImage userAvatar={userAvatar} type="cloak" />
      <UserAvatarImage userAvatar={userAvatar} type="base" />
      <UserAvatarImage userAvatar={userAvatar} type="body" />
      <UserAvatarImage userAvatar={userAvatar} type="beard" />
      <UserAvatarImage userAvatar={userAvatar} type="gloves" />
      <UserAvatarImage userAvatar={userAvatar} type="boots" />
      <UserAvatarImage userAvatar={userAvatar} type="hair" />
      <UserAvatarImage userAvatar={userAvatar} type="head" />
      <UserAvatarImage userAvatar={userAvatar} type="legs" />
    </>
  );
}

function UserAvatarImage({
  userAvatar,
  type,
}: {
  userAvatar: UserAvatar;
  type: string;
}) {
  type AvatarImageKey = keyof typeof userAvatar;
  const objectKey = type as AvatarImageKey;
  const avatarImage = userAvatar[objectKey];
  if (avatarImage === -1) return null;

  type AvatarImagesKey = keyof typeof avatarImages;
  const avatarImagesKey = type as AvatarImagesKey;
  const avatarImagesObject = avatarImages[avatarImagesKey];
  const avatarImageName = avatarImagesObject[avatarImage];

  return (
    <img
      src={`${process.env.PUBLIC_URL}/assets/player/${type}/${avatarImageName}`}
      alt={`user avatar ${type}`}
      style={{
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%",
        top: "90%",
        position: "absolute",
      }}
    />
  );
}
