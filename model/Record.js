import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Record = new Schema({
  year: String,
  month: String,
  startWeek: String,
  salary: Number,
  totalHour: String,
  userId: Number,
});

export default mongoose.model("Record", Record);
