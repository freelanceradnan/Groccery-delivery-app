import mongoose from "mongoose";

export const ConnectDB = async () => {
    const ConnectUrl = process.env.MONGODB_URL;

    try {
        if (!ConnectUrl) {
            console.log('MongoDB Connection URL Missing');
            return;
        }
        
        await mongoose.connect(ConnectUrl, { autoIndex: true });
        console.log('MongoDB connection success!');
        
    } catch (error) {
        console.log('MongoDB connection failed!', error.message);
    }
};
