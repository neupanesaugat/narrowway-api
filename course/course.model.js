import mongoose from "mongoose";

// set schema

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    //in days
    type: Number,
    required: true,
    min: 1,
  },
  addedBy: {
    type: mongoose.ObjectId,
    ref: "Admin",
    required: true,
  },
});

// create collection/model/table
const Course = mongoose.model("Course", courseSchema);

export default Course;
