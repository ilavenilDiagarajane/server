import mongoose from "mongoose";
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    },
    rating: {
        type: Number,
    },
    cast: {
        type:Array,
    },
    genre: String,

    releaseDate: Date,
    
})
export const moivedetails = mongoose.model("moives_collection", movieSchema);