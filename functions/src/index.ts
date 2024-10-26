import * as admin from "firebase-admin";
export {createNewUser} from "./User/createNewUser";
export {findRecipes} from "./Recipe/findRecipes";
export {profanityCheck} from "./Review/profanity";
export {updateAverageReview} from "./Review/updateAverageReview";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require("./serviceAccountKey.json");

// The Firebase Admin SDK to access Firestore.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodaddtech-default-rtdb.firebaseio.com/",
});
