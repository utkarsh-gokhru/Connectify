import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const db_url = process.env.DATABASE_URL;
        await mongoose.connect(db_url);
        console.log('DB connected!');
    } catch (err) {
        console.log(`DB connection failed: ${err}`);
        process.exit(1);
    }
};

export default connectDB;
