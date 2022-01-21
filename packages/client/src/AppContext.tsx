import React from "react";

interface AppContextInterface {
  roomJoined: string | null;
  setRoomJoined: React.Dispatch<React.SetStateAction<string | null>>;
  roomCreated: string | null;
  setRoomCreated: React.Dispatch<React.SetStateAction<string | null>>;
}
// type UpdateType = React.Dispatch<React.SetStateAction<typeof defaultValue>>;
export const AppContext = React.createContext<AppContextInterface>({
  roomJoined: null,
  setRoomJoined: () => {},
  roomCreated: null,
  setRoomCreated: () => {},
});

// Provider in your app
export const AppContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [roomJoined, setRoomJoined] = React.useState<string | null>(null);
  const [roomCreated, setRoomCreated] = React.useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{ roomJoined, setRoomJoined, roomCreated, setRoomCreated }}
      {...props}
    />
  );
};
