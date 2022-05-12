import { persistentData } from "../../objects/PersistantData";
import { HostGameState } from "./hostGame/states/HostGameState";

export class HostGame {
    scene: Phaser.Scene;
    currentState: HostGameState | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    preload() {
    }

    create() {
    }

    update(time: number, delta: number) {
        var newState = this.currentState?.update(time, delta) || null;
        this.changeState(newState);
    }

    // the only way I should change the states is by calling this method
    changeState(newState: HostGameState | null) {
        if (!newState) return;
        this.currentState?.exit();
        this.currentState = newState;
        this.currentState.enter();
    }

    // maybe this https://stackoverflow.com/a/68835401/2948122

    setUrlToHomeScreen() {
        // set the url to the home screen
        // change the url using react router
        const { CustomEvent } = window;
        const event = new CustomEvent('changeroute', { detail: `/room/${persistentData.roomData?.room}` });
        window.dispatchEvent(event);
    }
}