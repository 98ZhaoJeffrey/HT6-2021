import Unit from "./types";
import firebase from "firebase";
export interface Ingredients{
    name: string,
    amount: number,
    unit: Unit
}

export interface Steps{
    step: string
}

export interface Recipe{
    name: string,
    description: string,
    image: string,
    steps: Steps[],
    ingredients: Ingredients[]
}


export interface PrivateRouteProps{
    authenticationPath: string,
    outlet: JSX.Element,
  };

//export default { Ingredients, Steps, Recipe }