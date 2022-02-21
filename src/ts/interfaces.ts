import Unit from "./types";

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

//export default { Ingredients, Steps, Recipe }