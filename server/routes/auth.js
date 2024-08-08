import express from 'express';
import bcrypt from 'bcrypt';
import mail_sender from '../utils/mail.js';
import generateOTP from '../utils/gen_otp.js';
import { userModel } from '../models/user.js';

const app = express.Router();

app.post('/sendOtp', async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        await mail_sender(email, otp);
        return res.status(201).json({ message: "Mail Sent!", otp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/checkExisting', async (req, res) => {
    const { user } = req.body;
    const username = user;

    try {
        const userExists = await userModel.findOne({ username });

        if (userExists) {
            return res.status(409).json({ message: 'Username is already taken' });
        }
        return res.status(200).json({ message: 'Username is available' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { user, email, password } = req.body;
        const username = user;

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hashedPass });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await userModel.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    });

    const username = user.username;

    if (!user) {
      return res.status(401).json({ message: 'Invalid email/username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email/username or password' });
    }

    res.status(200).json({ message: 'Login successful', username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export { app as userAuth };
