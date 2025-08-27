import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import connectDB from './config/db';
import nomineeRoutes from './routes/nomineeRoutes';
import authRoutes from './routes/authRoutes';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// FIX: Add explicit types to request and response to aid type inference for app.use overloads.
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.use('/api/nominees', nomineeRoutes);
app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));