import { type IProblem } from "./../utils/types.js";
import mongoose, { Schema } from "mongoose";

const problemSchema = new Schema<IProblem>({
  FEN: {
    type: String,
    required: true,
  },
  Moves: {
    type: String,
    required: true,
  },
  Rating: {
    type: Number,
    required: true,
  },
  RatingDeviation: {
    type: Number,
    required: true,
  },
  Popularity: {
    type: Number,
    required: true,
  },
  Themes: {
    type: String,
    required: true,
  },
});

export const Problem =
  mongoose.models?.Problem || mongoose.model("Problem", problemSchema);
