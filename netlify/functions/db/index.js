import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://barebonebox_db_user:uK01jEZAZ80d4YjN@healthsaas.owtwlhi.mongodb.net/${DB_NAME}`,
      {
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      }
    );
    console.log("MongoDB connected:", connectionInstance.connection.host);
    return connectionInstance;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
