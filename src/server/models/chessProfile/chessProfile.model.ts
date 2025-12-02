import { Schema, model } from "mongoose";
import { EloRatingsSchema } from "./../../models/chessProfile/eloRating.model.js";
import mongoose from "mongoose";
import { type IChessProfile } from "./../../utils/types.js";

const ChessProfileSchema = new Schema<IChessProfile>(
  {
    games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
    elo: {
      type: EloRatingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ChessProfile =
  mongoose.models?.ChessProfile ||
  model<IChessProfile>("ChessProfile", ChessProfileSchema);
