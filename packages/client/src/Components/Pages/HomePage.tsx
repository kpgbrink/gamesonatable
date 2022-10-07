import {
  MainMenuGameData,
  PlayerMainMenuData,
} from "api/src/data/datas/MainMenuData";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import { HostDataHandler } from "../../PhaserPages/HostScenes/hostObjects/HostDataHandler";
import PlayerChooseGame from "./HomePage/PlayerChooseGame";
import PlayerJoin from "./HomePage/PlayerJoin";

export default function HomePage() {
  // const { roomCreated } = useContext(AppContext);
  document.documentElement.style.cursor = "auto";
  const { userList, roomCreated } = useContext(AppContext);

  // add game data to state
  const [mainMenuData, setMainMenuData] = useState<MainMenuGameData>(
    new MainMenuGameData()
  );

  const hostMainMenuDataHandler = new HostMainMenuDataHandler(
    mainMenuData,
    setMainMenuData
  );

  // use menu data handler to handle the data
  useEffect(() => {
    hostMainMenuDataHandler.create();
    return () => {
      hostMainMenuDataHandler.destroy();
    };
  });

  // If Main menu position is 1 and there are no players, then switch back to 0
  useEffect(() => {
    const userListNoHosts = userList.filter((user) => !user.isHost);
    if (mainMenuData.mainMenuPosition === 1 && userListNoHosts.length === 0) {
      console.log("set back to 0!!");
      setMainMenuData({ ...mainMenuData, mainMenuPosition: 0 });
    }
  }, [mainMenuData, userList]);

  console.log("main menu position", mainMenuData.mainMenuPosition);
  return (
    <div id="homePageContainer">
      <div id="homePage">
        {mainMenuData.mainMenuPosition === 0 && <PlayerJoin />}
        {mainMenuData.mainMenuPosition === 1 && (
          <PlayerChooseGame mainMenuData={mainMenuData} />
        )}
        {/* <li>
          <GameLink
            url={`/host/${roomCreated}/ThirtyOne`}
            text="31"
            image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
          />
        </li> */}
        {/* <li>
          <GameLink
            url={`/host/${roomCreated}/Omaha`}
            text="Omaha"
            image="https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400"
          />
        </li>
        <li>
          <GameLink
            url={`/host/${roomCreated}/Texas`}
            text="Texas"
            image="https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400"
          />
        </li>
      */}
      </div>
    </div>
  );
}

export class HostMainMenuDataHandler extends HostDataHandler<
  PlayerMainMenuData,
  MainMenuGameData
> {
  mainMenuGameData: MainMenuGameData;
  setMainMenuGameData: (gameData: MainMenuGameData) => void;
  interval: NodeJS.Timer | undefined;

  constructor(
    mainMenuGameData: MainMenuGameData,
    setGameData: (gameData: MainMenuGameData) => void
  ) {
    super();
    this.mainMenuGameData = mainMenuGameData;
    this.setMainMenuGameData = setGameData;
  }

  create() {
    super.create();
    this.sendGameData();
  }

  destroy() {
    super.destroy();
  }

  override getPlayerDataToSend(
    userId: string
  ): Partial<PlayerMainMenuData> | undefined {
    return undefined;
  }

  override onPlayerDataReceived(
    userId: string,
    playerData: Partial<PlayerMainMenuData>,
    gameData: Partial<MainMenuGameData> | null
  ): void {
    console.log("player data received", playerData);
  }

  override getGameDataToSend(): Partial<MainMenuGameData> | undefined {
    console.log("sending game data", this.mainMenuGameData);
    return this.mainMenuGameData;
  }

  override onGameDataReceived(
    userId: string,
    gameData: Partial<MainMenuGameData>,
    playerData: Partial<PlayerMainMenuData> | null,
    updateGameData: boolean
  ): void {
    console.log("game data received", gameData);
    this.mainMenuGameData = { ...this.mainMenuGameData, ...gameData };
    this.setMainMenuGameData(this.mainMenuGameData);
    this.sendGameData();
  }
}
