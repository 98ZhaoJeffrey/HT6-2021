export type Unit = "ea" | "ml" | "L" | "oz" | "pt" | "qt" | "gals" |
 "lbs" | "mg" | "gram" | "kg" | "tsp" | "tbsp" | "c";

export enum HistoryAction {
    UNITS = 1,
    AMOUNT,
    DELETE,
    NEW
}

export enum SearchType {
    MATCHING = "Matching Ingredients",
    ALPHA="Alphabetical Order",
    RATING="Top Rated",
    TIME="Cooking Time"
}

export type Liked = "Liked" | "Disliked" | "Neither"

