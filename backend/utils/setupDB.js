import mongoose from "mongoose";
import { database } from "../config/keys.js";

export default async () => {
  try {
    await mongoose.connect(database.uri);
    console.log("Successfully connected to the database.");
  } catch (error) {
    console.error(error);
  }
};
