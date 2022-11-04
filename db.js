import mongoose from "mongoose";

const url = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@cluster0.0jtxb.mongodb.net/budgetManagement?retryWrites=true&w=majority`;

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectDB = async () => {
  try {
    await mongoose.connect(url, connectionParams);

    console.log("Connected to database ");
  } catch (err) {
    console.error(`Error connecting to the database. \n${err}`);
  }
};

export default connectDB;
