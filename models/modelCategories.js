import mongoose from 'mongoose';

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true },
);

let Dataset = mongoose.models.categories || mongoose.model('categories', categoriesSchema);

export default Dataset;
