import mongoose from "mongoose";

const Schema = mongoose.Schema;
const User = new Schema({
  userId: String,
  rate: Number,
  slaryList: Array,
});

export default mongoose.model("User", User);
