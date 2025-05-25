import express from 'express';
import { posts, profile, user, userPosts, request } from '../controllers/get.js';

const app = express();

app.post('/profile', profile);

app.get('/posts', posts);

app.get('/user', user);

app.get('/requests', request);

app.get('/user/posts', userPosts);

export { app as getInfo };
