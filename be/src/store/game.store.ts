import type { GameSession } from "../models/game.model";

export const games: { [gameId: string]: GameSession } = {};

export const getGame = (gameId: string) => {
    return games[gameId];
}
