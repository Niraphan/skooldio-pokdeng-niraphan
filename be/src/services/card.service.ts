import { Card, Rank, Suit } from "../models/card.model";

export const createDeck = () => {
    const deck: Card[] = [];

    for (const suit of ["Spades", "Hearts", "Diamonds", "Clubs"] as Suit[]) {
        for (const rank of ["a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "j", "q", "k"] as Rank[]) {
            deck.push({ suit, rank });
        }
    }

    return deck;
}

export const shuffleDeck = (deck: Card[]) => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export const cutDeck = (
    deck: Card[],
    amount: number
) => {
    
    if (amount <= 0 || amount >= deck.length) {
        throw new Error("Invalid cut amount");
    }

    const top = deck.slice(0, amount);
    const bottom = deck.slice(amount);

    return [
        ...bottom,
        ...top
    ];
}

export const calculateScore = (cards: Card[]) => {
    let score = 0;
    for (const card of cards) {
        if (card.rank === "a") {
            score += 1;
        } else if (card.rank === "j" || card.rank === "q" || card.rank === "k") {
            score += 0;
        } else {
            score += parseInt(card.rank);
        }
    }
    return score % 10;
}

export const drawCard = (deck: Card[]) => {
    return deck.pop();
}

export const isPok = (cards: Card[]) => {
    return calculateScore(cards) >= 8 && cards[0].rank === cards[1].rank;
}