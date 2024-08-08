import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { userAuth } from './routes/auth.js';
import { Saver } from './routes/save.js';
import { getInfo } from './routes/get.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
dotenv.config();

const db_url = process.env.DATABASE_URL;
mongoose.connect(db_url)
.then(() => {
    console.log('DB connected!');
})
.catch((err) => {
    console.log(`DB conection failed: ${err}`);
})

app.use("/auth",userAuth);
app.use('/save', Saver);
app.use('/get',getInfo)

const port = process.env.PORT;
app.listen(port,() => console.log('Server started'));