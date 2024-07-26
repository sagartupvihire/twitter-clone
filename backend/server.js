import express from 'express';
import dotenv from "dotenv";
const app = express();
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.Routes.js'
import postRoutes from './routes/post.Routes.js';
import notificationRoutes from './routes/notification.routes.js';
import connectMongodb from './db/connectMongoDb.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary'
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

console.log(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
    connectMongodb();
}
);