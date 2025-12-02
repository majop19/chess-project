import { Schema, model } from "mongoose";
import { EloRatingsSchema } from "#back/models/chessProfile/eloRating.model";
import mongoose from "mongoose";
import { type IChessProfile } from "#back/utils/types";

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
