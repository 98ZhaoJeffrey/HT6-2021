import { Unit } from "./types";
import firebase from 'firebase/app';

export interface Ingredients {
    name: string,
    amount: number,
    unit: Unit
}

export interface Recipe {
    id: string,
    name: string,
    description: string,
    image: string,
    steps: string[],
    time: number,
    ingredients: Ingredients[]
}

export interface PrivateRouteProps {
    authenticationPath: string,
    outlet: JSX.Element,
  };

export interface Review {
    user: string,
    userId: string,
    comment: string,
    rating: number,
    date: firebase.firestore.Timestamp,
    likes: string[],
    dislikes: string[]
}

export interface Page {
    id: string,
    name: string
}