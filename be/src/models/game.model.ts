import { Card } from "./card.model";

type GameState =
    | "WAITING_FOR_CUT"
    | "WAITING_FOR_BET"
    | "WAITING_FOR_DECISION"
    | "DEALER_TURN"
    | "ROUND_END";

export interface GameSession {
    id: string;
    user_balance: number;
    current_bet: number;
    state: GameState;
    player_hand: Card[];
    dealer_hand: Card[];
    player_score: number;
    deck: Card[];
    winner: Winner | null;
}

type Winner = "player" | "dealer" | "draw";

export type UserAction = "cut" | "bet" | "stay" | "draw" | "next_round"

export interface GameResponse {
    game_id: string;
    state: GameState;
    balance: number;
    current_bet: number;

    player_hand: Card[];
    dealer_hand_visible: Card[];

    player_score: number;
    dealer_score: number | null;

    winner: Winner | null;
}