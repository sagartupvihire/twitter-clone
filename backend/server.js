import express from 'express';
import dotenv from "dotenv";
const app = express();
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.Routes.js'
import connectMongodb from './db/connectMongoDb.js';
import cookieParser from 'cookie-parser';

dotenv.config();

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


app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
    connectMongodb();
}
);