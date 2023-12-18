import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

//export const nameCategory =  mongoose.model('categoryname', categorySchema.category);
export default mongoose.model("Category", categorySchema);
