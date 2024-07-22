import express from 'express';
import dotenv from "dotenv";
const app = express();
import authRoutes from './routes/auth.routes.js'
import connectMongodb from './db/connectMongoDb.js';

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

console.log(process.env.MONGO_URI);

app.use("/api/auth", authRoutes);


app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
    connectMongodb();
}
);