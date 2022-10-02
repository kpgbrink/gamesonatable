
// Make a list of the games
export interface IGame {
    name: string;
    displayName: string;
    description: string;
    image: string;
    minPlayers: number | null;
    maxPlayers: number | null;
    suggestedMinPlayers: number | null;
    suggestedMaxPlayers: number | null;
}

export const gamesList: IGame[] = [
    {
        name: 'Random',
        displayName: 'Random',
        description: 'Random game',
        image: 'Random',
        minPlayers: null,
        maxPlayers: null,
        suggestedMinPlayers: null,
        suggestedMaxPlayers: null,
    },
    {
        name: 'ThirtyOne',
        displayName: 'Thirty One',
        description: 'A card game where you try to get the most points',
        image: 'https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400',
        minPlayers: 2,
        maxPlayers: 8,
        suggestedMinPlayers: 3,
        suggestedMaxPlayers: 5,
    },
    {
        name: 'Texas',
        displayName: 'Texas Holdem',
        description: 'A card game where you win money',
        image: 'https://lh3.googleusercontent.com/Gv5VoOo9teJl7b66BC5r67pdaHJmOufAhZUofR4SqCihvV72IKGatTwpf1GyyYzYHjEyoEFId60eGxLztcdo1PesdwQoRN-lu73U7nEr9noBxbIEEC0sgFu5OXHyhb7_42Kj_auZMgs=w2400',
        minPlayers: 2,
        maxPlayers: 8,
        suggestedMinPlayers: 3,
        suggestedMaxPlayers: 5,
    },
    {
        name: 'Omaha',
        displayName: 'Omaha Poker',
        description: 'A card game where you win money lots but with 4 cards this time.',
        image: "https://lh3.googleusercontent.com/ej5rMzqw1W_s5Zz5SrAGR_4iBB62hHwxWsNl9IbcLSBcbUp-bQz2MTwXinSkoqYw_hI8aBAZOXIdAUYL_0rM2raz5Z-gtI2BK1j6wMHCHZegZdCruJ4X_fc2M1oe8CXV2q9wGxbCfkg=w2400",
        minPlayers: 2,
        maxPlayers: 8,
        suggestedMinPlayers: 3,
        suggestedMaxPlayers: 5,
    },
];