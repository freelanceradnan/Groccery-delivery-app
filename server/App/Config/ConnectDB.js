import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const ConnectDB = async () => {
  const ConnectUrl = process.env.MONGODB_URL;

  if (!ConnectUrl) {
    throw new Error("MongoDB Connection URL Missing in Environment Variables!");
  }

  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(ConnectUrl, opts).then((mongooseInstance) => {
      console.log("MongoDB connection success!");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    console.error("MongoDB connection failed!", error.message);
    throw error;
  }

  return cached.conn;
};