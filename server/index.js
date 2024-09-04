import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userAuth } from './routes/auth.js';
import { Saver } from './routes/save.js';
import { getInfo } from './routes/get.js';
import connectDB from './config/db.js';
import http from 'http';
import setupSocketIO from './socket.js';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
dotenv.config();

connectDB();

app.use("/auth",userAuth);
app.use('/save', Saver);
app.use('/get',getInfo);

setupSocketIO(server);

const port = process.env.PORT;
server.listen(port,() => console.log('Server started'));
