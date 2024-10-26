import {Unit} from "./types";
import * as firebase from "firebase-admin";

export interface Ingredients {
    name: string,
    amount: number,
    unit: Unit,
}

export interface Recipe {
    id: string,
    name: string,
    description: string,
    image: string,
    steps: string[],
    time: number,
    ingredients: Ingredients[]
    reviewCount: number,
    average: number
}

export interface Review {
    user: string,
    userId: string,
    comment: string,
    rating: number,
    date: firebase.firestore.Timestamp,
    likes: string[],
    dislikes: string[]
}

export type RecipeWithSimilarity = Recipe & {
    similarity: number;
};
