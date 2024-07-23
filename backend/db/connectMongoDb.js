import mongoose from "mongoose";

const connectMongodb = async (req, rest) => {

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.warn("Connected to MongoDB " + conn.connection.host + ":" + conn.connection.port);
        
    } catch (error) {
        console.error('Error connecting to MongoDB ' + error.message);
        process.exit(1);
    }

}

export default connectMongodb;