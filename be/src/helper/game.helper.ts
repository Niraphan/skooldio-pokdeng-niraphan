import { GameResponse, GameSession } from "../models/game.model";
import { calculateScore } from "../services/card.service";

export const buildGameResponse = (game: GameSession): GameResponse => {
    const roundEnded = game.state === "ROUND_END";

    return {
        game_id: game.id,
        state: game.state,
        balance: game.user_balance,

        player_hand: game.player_hand,

        dealer_hand_visible: roundEnded ? game.dealer_hand : [],

        player_score: calculateScore(game.player_hand),

        dealer_score: roundEnded
            ? calculateScore(game.dealer_hand)
            : null,

        winner: roundEnded ? game.winner : null,
    };
};