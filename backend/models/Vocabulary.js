import mongoose from "mongoose";

const vocabularySchema = new mongoose.Schema({
  word: String,
  meaning: String,
  example: String,
  level: String
});

const Vocabulary = mongoose.model("Vocabulary", vocabularySchema);

export default Vocabulary;