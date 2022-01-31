import { User } from 'api';
import { allRaces, nameByRace } from 'fantasy-name-generator';

const users: User[] = [];

export const upsertUser = ({ id, name, room, isHost }: User) => {
    name = name.trim();
    if (name === '') {
        const allRacesList = [...allRaces.racesWithGender, ...allRaces.otherRaces];
        const gender: "male" | "female" = (() => {
            const randomNumber = Math.random();
            if (randomNumber <= .5) {
                return "male";
            }
            return "female";
        })();
        const newName = nameByRace(allRacesList[Math.floor(Math.random() * allRacesList.length)], { gender: gender, allowMultipleNames: false });
        if (typeof newName === 'string') {
            name = newName;
        }
    };
    room = room;

    const existingUser = users.find((user) => {
        user.room === room && user.name === name
    });

    const user: User = { id, name, room, isHost };
    removeUser(user.id);
    users.push(user);
    return user;
}

export const removeUser = (id: string) => {
    const index = users.findIndex((user) => {
        return user.id === id
    });

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

export const getUser = (id: string) => users
    .find((user) => user.id === id);

export const getUsersInRoom = (room: string) => users
    .filter((user) => user.room === room);

export const getUserCount = () => users.length;