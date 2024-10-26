import { Ingredients, Recipe } from "../ts/interfaces";
import * as API_ENDPOINTS from "../constants/api_endpoints";
import { parseNumber, parseString } from "./parseValues";
import { Unit } from "../ts/types"

export const findRecipes = async (order: string, ingredients: Ingredients[], searchParams: URLSearchParams) => {
    const body = JSON.stringify({
        "order": order,
        "ingredients": ingredients
    });

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
    };
    const response = await fetch(`${API_ENDPOINTS.FINDRECIPES_ENDPOINT}?page=${parseNumber(searchParams.get("page"))}
    &search=${parseString(searchParams.get("search"))}`, options);
    const result = (await response.json())["response"];

    try {

        const recipes: Recipe[] = result["data"].map((data: { [x: string]: any; }) =>{
            const recipe = data["recipe"]
            return {
                "id": data["id"],
                "name": recipe["name"],
                "description": recipe["description"],
                "image": recipe["image"],
                "steps": recipe["steps"],
                "time": recipe["time"],
                "ingredients": recipe["ingredients"].map((ingredient: { [x: string]: string; }) =>{
                    return{
                        "name": ingredient["name"],
                        "amount": ingredient["amount"],
                        "unit": ingredient["unit"] as Unit
                    }
                }),
                "similarity": Math.round(100 * recipe["similarity"]),
                "average": recipe["average"],
                "reviewCount": recipe["reviewCount"]
            }
        })
        return {
            "recipes": recipes,
            "numberResults": result["numberResults"] as number
        };

    } catch (error) {
        return {
            "recipes": [],
            "numberResults": 0
        }
    }
}