import {
  MainMenuGameData,
  PlayerMainMenuData,
} from "api/src/data/datas/MainMenuData";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { palletColors } from "../../Palettes";
import { HostDataHandler } from "../../PhaserPages/HostScenes/hostObjects/HostDataHandler";
import PlayerChooseGame from "./HomePage/PlayerChooseGame";
import PlayerJoin from "./HomePage/PlayerJoin";

export default function HomePage() {
  document.documentElement.style.cursor = "auto";
  const { userList, roomCreated } = useContext(AppContext);
  const navigate = useNavigate();

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
    if (mainMenuData.mainMenuPosition === 1 && userList.length === 0) {
      console.log("set back to 0!!");
      setMainMenuData({ ...mainMenuData, mainMenuPosition: 0 });
    }
  }, [mainMenuData, userList]);

  // if Main menu game chosen go to the game
  useEffect(() => {
    if (mainMenuData.gameChosen) {
      console.log("game chosen");
      // setMainMenuData({ ...mainMenuData, gameChosen: false });
      // if game is chosen then go to the game
      const navigateTo = `/host/${roomCreated}/${mainMenuData.gameChosen}`;
      navigate(navigateTo);
    }
  }, [mainMenuData, navigate, roomCreated]);

  return (
    <div id="homePageContainer">
      <div
        id="homePage"
        style={{
          backgroundColor: palletColors.color5,
        }}
      >
        {mainMenuData.mainMenuPosition === 0 && <PlayerJoin />}
        {mainMenuData.mainMenuPosition === 1 && (
          <PlayerChooseGame mainMenuData={mainMenuData} />
        )}
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
    // console.log("player data received", playerData);
  }

  override getGameDataToSend(): Partial<MainMenuGameData> | undefined {
    // console.log("sending game data", this.mainMenuGameData);
    return this.mainMenuGameData;
  }

  override onGameDataReceived(
    userId: string,
    gameData: Partial<MainMenuGameData>,
    playerData: Partial<PlayerMainMenuData> | null,
    updateGameData: boolean
  ): void {
    // console.log("game data received", gameData);
    this.mainMenuGameData = { ...this.mainMenuGameData, ...gameData };
    // console.log("new main menu game data", this.mainMenuGameData);
    this.setMainMenuGameData(this.mainMenuGameData);

    this.sendGameData();
  }
}
