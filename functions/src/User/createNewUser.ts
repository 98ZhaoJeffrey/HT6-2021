import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {logger} from "firebase-functions";
import {UserRecord} from "firebase-functions/v1/auth";

// eslint-disable-next-line max-len
export const createNewUser = functions.auth.user().onCreate(async (user: UserRecord) => {
  const id = user.uid;

  logger.info(`Creating user row for: ${id}`);

  const db = admin.firestore();
  const userRef = db.collection("users").doc(id);

  try {
    await userRef.set({
      lists: {
        "My first list": [],
      },
      favorites: [],
      history: [],
    });
    logger.info(`Successfully created user document for: ${id}`);
  } catch (error) {
    logger.error(`Error creating user document for ${id}:`, error);
  }
});
