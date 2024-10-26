/* eslint-disable brace-style */
/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as functions from "firebase-functions";
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";
import {Ingredients, Recipe, RecipeWithSimilarity} from "../ts/interfaces";
const cors = require("cors")({origin: true});

// Calculates the number of ingredients that are contained in both lists over all the recipes
const calculateSimilarity = (ingredientList: Ingredients[], recipe: Recipe) => {
  const ingredients: Ingredients[] = recipe["ingredients"];
  let matching = 0;
  ingredients.forEach((ingredient) => {
    const found = ingredientList.find((curr) => curr["name"].toLocaleLowerCase() ===
    ingredient["name"].toLocaleLowerCase());
    if (found && found["amount"] >= ingredient["amount"]) {
      matching++;
    }
  });
  if (ingredients.length === 0) {
    return 0;
  }
  return matching / ingredients.length;
};

export const findRecipes = functions.https.onRequest(
    async (req, res) => {
      return cors(req, res, async () => {
        // page number (default to 0 if cannot parse int)
        let pageNumber = 0;
        if (typeof req.query.page === "string") {
          const num = parseInt(req.query.page, 10);
          pageNumber = isNaN(num) ? 0 : Math.max(0, num - 1);
        }

        // Parse the limit (default to 10 if invalid or not provided)
        let limit = 10;
        if (typeof req.query.limit === "string") {
          const num = parseInt(req.query.limit, 10);
          limit = isNaN(num) || num <= 0 ? 10 : num;
        }

        logger.info(`Doing recipe search with limit ${limit} and page number ${pageNumber}`);

        const order = req.body.order;
        const ingredientList: Ingredients[] = req.body.ingredients;
        const db = admin.firestore();
        const ref = db.collection("recipes");

        try {
          const snapshot = await ref.get();

          let recipes = snapshot.docs.map((doc) => ({
            id: doc.id,
            recipe: doc.data() as RecipeWithSimilarity,
          }));

          const searchQuery = (req.query.search || "").toString().trim().toLowerCase();
          if (searchQuery !== "") {
            recipes = recipes.filter((item) => (item["recipe"]["name"].toLowerCase()).includes(searchQuery));
          }
          // calculate the similarity of the recipes
          recipes.forEach((curr) => curr["recipe"].similarity = calculateSimilarity(ingredientList, curr["recipe"]));

          switch (order) {
            case "Top Rated":
              recipes.sort((a, b) => {
                const aRating = a["recipe"]["average"];
                const bRating = b["recipe"]["average"];
                if (aRating === bRating) {
                  return b["recipe"]["reviewCount"] - a["recipe"]["reviewCount"];
                }
                return bRating - aRating;
              });
              break;
            case "Matching Ingredients":
              recipes.sort((a, b) => {return b["recipe"]["similarity"] - a["recipe"]["similarity"];});
              break;
            case "Cooking Time":
              recipes.sort((a, b) => {return a["recipe"]["time"] - b["recipe"]["time"];});
              break;
            default:
              recipes.sort((a, b) => {return a["recipe"]["name"].localeCompare(b["recipe"]["name"]);});
          }

          const startIndex = Math.max(0, 10 * pageNumber);
          const pagedRecipes = recipes.slice(startIndex, startIndex + limit);

          const result = {
            "data": pagedRecipes,
            "numberResults": recipes.length,
          };
          res.json({response: result});
        } catch (error) {
          logger.error(error);
          res.status(500).json({response: "There was an error"});
        }
      });
    });
