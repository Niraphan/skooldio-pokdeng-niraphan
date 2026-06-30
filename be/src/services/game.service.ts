import { randomUUID } from "crypto";
import { GameSession, UserAction } from "../models/game.model";
import { games } from "../store/game.store";
import { createDeck, shuffleDeck, cutDeck, calculateScore, isPok, drawCard } from "./card.service";
import { buildGameResponse } from "../helper/game.helper";


export const createGame = (initialBalance: number) => {
    const gameId = randomUUID();
    const deck = createDeck();

    const session: GameSession = {
        id: gameId,
        user_balance: initialBalance,
        state: "WAITING_FOR_CUT",
        player_hand: [],
        dealer_hand: [],
        player_score: 0,
        deck: deck,
        winner: null,
    }

    games[gameId] = session;

    return buildGameResponse(session)
}

export const actionInGame = (gameId: string, action: UserAction, amount: number) => {
    const game = games[gameId];
    if (!game) {
        throw new Error("Game not found");
    }

    if (action === "bet" && amount > games[gameId].user_balance) {
        throw new Error("Not enough balance");
    }

    switch (game.state) {
        case "WAITING_FOR_CUT":
            if (action === "cut") {
                handleCut(game, amount)
            }
            break
        case "WAITING_FOR_BET":
            if (action === "bet") {
                handleBet(game, amount)
            }
            break;
        case "WAITING_FOR_DECISION":
            if (action === "draw") {
                handleUserDraw(game);
                handleDealerTurn(game);
                handleEndRound(game, amount);
            } else if (action === "stay") {
                handleDealerTurn(game);
                handleEndRound(game, amount);
            } else {
                throw new Error("Invalid action");
            }
            break;
        case "ROUND_END":
            handleEndRound(game, amount)

            if (action === "next_round") {
                game.state = "WAITING_FOR_CUT"
                game.deck = shuffleDeck(game.deck)
                game.player_hand = []
                game.dealer_hand = []
                game.winner = null
            }
            break

        default:
            throw new Error("Invalid action");
    }

    return buildGameResponse(game)
}

const handleCut = (game: GameSession, amount: number) => {
    game.deck = shuffleDeck(game.deck)
    game.deck = cutDeck(game.deck, amount)
    game.state = "WAITING_FOR_BET"
}

const handleBet = (game: GameSession, amount: number) => {
    game.user_balance -= amount
    for (let i = 0; i < 2; i++) {
        game.player_hand.push(game.deck.pop()!)
        game.dealer_hand.push(game.deck.pop()!)
    }

    if (isPok(game.player_hand)) {
        game.winner = "player"
        game.user_balance += amount * 2
        game.state = "ROUND_END"
    } else if (isPok(game.dealer_hand)) {
        game.winner = "dealer"
        game.state = "ROUND_END"
    } else {
        game.state = "WAITING_FOR_DECISION"
    }

}


const handleUserDraw = (game: GameSession) => {
    const card = drawCard(game.deck)
    if (card) {
        game.player_hand.push(card)
    }
}

const handleDealerTurn = (game: GameSession) => {
    if (!isPok(game.dealer_hand)) {
        if (calculateScore(game.dealer_hand) < 4 && game.dealer_hand.length < 3) {
            const card = drawCard(game.deck)
            if (card) {
                game.dealer_hand.push(card)
            }
        }
    }
    game.state = "ROUND_END"
}

const handleEndRound = (game: GameSession, amount: number) => {
    const playerScore = calculateScore(game.player_hand)
    const dealerScore = calculateScore(game.dealer_hand)

    if (playerScore > dealerScore) {
        game.winner = "player"
        game.user_balance += amount * 2
    } else if (playerScore < dealerScore) {
        game.winner = "dealer"
    } else {
        game.winner = "draw"
        game.user_balance += amount
    }
}