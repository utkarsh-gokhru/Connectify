import express from 'express';
import multer from 'multer';
import { post, profile } from '../controllers/save.js';

const app = express();
const upload = multer();

app.post('/profile', upload.single('image'), profile);

app.post('/post', upload.single('media'), post);

export { app as Saver };
