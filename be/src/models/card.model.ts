export type Suit = "Spades" | "Hearts" | "Diamonds" | "Clubs";

export type Rank = "a" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "j" | "q" | "k";

export interface Card {
    suit: Suit;
    rank: Rank;
}
