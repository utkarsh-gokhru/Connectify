import express from 'express';
import { checkExisting, login, sendOtp, signup } from '../controllers/auth.js';

const app = express.Router();

app.post('/sendOtp', sendOtp);

app.post('/checkExisting', checkExisting);

app.post('/signup', signup);

app.post('/login', login);

export { app as userAuth };
