import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {logger} from "firebase-functions";
import {Review} from "../ts/interfaces";

export const updateAverageReview = functions.firestore
    .document("/reviews/{id}")
    .onUpdate(async (change, context) => {
      const id = context.params.id.trim();
      logger.info("Updating average review for " + id);

      const data: Map<string, Review> = change.after.data()["reviews"];
      const numReviews = Object.keys(data).length;
      const reviewSum = (Object.values(data)).reduce(
          (prev: number, curr: Review) => prev + curr["rating"], 0);
      const db = admin.firestore();
      const recipeRef = db.collection("recipes").doc(id);
      logger.info("Updating with sum " + reviewSum + " and " + numReviews);

      await recipeRef.update({
        "average": numReviews === 0 ? 0 : reviewSum/numReviews,
        "reviewCount": numReviews,
      });
    });

