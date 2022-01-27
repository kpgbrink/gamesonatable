import socket from "../../SocketConnection";

export const onChangeGames = (scene: Phaser.Scenes.ScenePlugin) => {
    socket.off();
    socket.on("select game", (game: string) => {
        console.log("game selected", game);
        scene.start(game);
    });
}