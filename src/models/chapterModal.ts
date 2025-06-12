import { Schema, model, Types } from "mongoose";

const chapterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    nation: {
      type: Types.ObjectId,
      ref: "Nation", // Related Nation document
      required: true,
    },
    region: {
      type: Types.ObjectId,
      ref: "Region", // Related Region document
      required: true,
    },
    local: {
      type: Types.ObjectId,
      ref: "Local", // Optional further subdivision
      required: true,
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User", // Users who are part of this chapter
      },
    ],
    coreTeam:[{type:Types.ObjectId,ref:'User'}],
    createdBy: {
      type: Types.ObjectId,
      ref: "User", // Admin or creator reference
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Chapter = model("Chapter", chapterSchema);
