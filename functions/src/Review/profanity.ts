/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as functions from "firebase-functions";
import {logger} from "firebase-functions";
const cors = require("cors")({origin: true});
const Filter = require("bad-words");

export const profanityCheck = functions.https.onRequest(
    async (req, res) => {
      const filter = new Filter();
      return cors(req, res, () => {
        const message = req.body.message;
        logger.info("Checking profanity on " + message);

        const hasProfanity = filter.isProfane(message);
        res.json({hasProfanity});
      });
    });
