import { List, ListItem } from "@mui/material";
import { Game, RoomData, UserAvatar } from "api";
import { MainMenuGameData } from "api/src/data/datas/MainMenuData";
import { useContext, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { Textfit } from "react-textfit";
import { AppContext } from "../../../AppContext";
import { avatarImages } from "../../../PhaserPages/objects/avatarImages.generated";
import { gamesList } from "../../../PhaserPages/objects/gamesList";
import { persistentData } from "../../../PhaserPages/objects/PersistantData";

type Props = {
  mainMenuData: MainMenuGameData;
};

// add setMainMenuData to props
export default function PlayerChooseGame({ mainMenuData }: Props) {
  const { roomId } = useParams();
  const { setRoomCreated, roomCreated, userList, setUserList, socket } =
    useContext(AppContext);

  const scrollToRef = useRef<null | HTMLLIElement>(null);

  const executeToScroll = () => {
    if (scrollToRef.current === null) return;
    scrollToRef?.current?.scrollIntoView();
  };

  executeToScroll();

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
          top: "2%",
          width: "100%",
          height: "10%",
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
            height: "24%",
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
      {(() => {
        const gameSelecting = gamesList[mainMenuData.gameSelectingIndex];
        return (
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "15%",
              height: "60%",
              width: "30%",
              backgroundColor: "#33ccff",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <div>{gameSelecting.displayName}</div>
            <div>{gameSelecting.description}</div>
          </div>
        );
      })()}
      <List
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          width: "50%",
          height: "60%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          overflow: "auto",
          justifyContent: "around",
          backgroundColor: "grey",
          borderRadius: "10px",
        }}
      >
        {gamesList.map((game, i) => {
          // if index is the same as the game index, then it is selected
          if (i === mainMenuData.gameSelectingIndex) {
            return (
              <ListItem
                ref={scrollToRef}
                key={game.name}
                style={{
                  width: "23%",
                  height: "50",
                  maxHeight: "50%",
                  backgroundColor: "green",
                  borderRadius: "10px",
                  margin: "1%",
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
          }
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
        <Textfit
          style={{
            position: "absolute",
            top: "-7%",
            width: "100%",
            height: "25%",
            textAlign: "center",
          }}
        >
          Player Count: {userListNoHosts.length}
        </Textfit>

        {userListNoHosts.length > 0 && userListNoHosts.length < 21 && (
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
                    borderRadius: "5px",
                    width: "10%",
                    height: "5%",
                    maxHeight: "5%",
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
                  >
                    {
                      // remove whitespace from name
                      user.name.replace(/\s/g, "")
                    }
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