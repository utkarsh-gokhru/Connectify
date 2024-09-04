import express from 'express';
import multer from 'multer';
import storage from '../utils/file_upload.js';
import { post, profile } from '../controllers/save.js';

const app = express();
const upload = multer({ storage: storage });

app.post('/profile', upload.single('image'), profile);

app.post('/post', upload.single('image'), post);

export { app as Saver };
