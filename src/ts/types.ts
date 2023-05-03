export type Unit = "ea" | "ml" | "L" | "oz" | "pt" | "qt" | "gals" |
 "lbs" | "mg" | "gram" | "kg" | "tsp" | "tbsp" | "c";

export enum HistoryAction {
    UNITS = 1,
    AMOUNT,
    DELETE,
    NEW
}

