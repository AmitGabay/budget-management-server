import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  data: [{ sum: Number, card: String, category: String }],
  token: String,
});

export default model("User", userSchema);
