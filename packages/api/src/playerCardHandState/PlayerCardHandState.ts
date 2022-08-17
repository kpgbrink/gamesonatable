// This is what is sent to the client/ server when a player is dealt a card


export class PlayerCardHandState {
    userId: string;
    cardIds: number[] = [];

    constructor(userId: string) {
        this.userId = userId;
    }

}