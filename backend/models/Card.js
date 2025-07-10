import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  name: String,
  image1: String,
  image2: String,
  price: Number,
});

export default mongoose.model('Card', cardSchema);
