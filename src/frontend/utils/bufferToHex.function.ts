import mongoose from "mongoose";

export function bufferToObjectId(bufferLike: Buffer) {
  const vals = bufferLike.buffer ? Object.values(bufferLike.buffer) : null;
  const bufferToHex = vals
    ?.map((b) => (b >>> 0).toString(16).padStart(2, "0"))
    .join("");
  const ObjectId = new mongoose.Types.ObjectId(bufferToHex);

  return ObjectId;
}
