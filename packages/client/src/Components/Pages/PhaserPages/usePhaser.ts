import { useEffect, useRef } from "react";

export const usePhaser = (config: Phaser.Types.Core.GameConfig) => {
    const game = useRef<Phaser.Game>();
    useEffect(() => {
        console.log('usePhaser');
        game.current = new Phaser.Game(config);
    }, []);
    console.log('new phaser')
    return game;
};