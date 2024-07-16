import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://saugatneupane50:${encodeURIComponent(
        "saugatneupane50"
      )}@cluster0.oppoqsr.mongodb.net/Narrowway?retryWrites=true&w=majority&appName=Cluster0`
    );
    console.log("DB connection established...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
    process.exit();
  }
};

export default connectDB;
