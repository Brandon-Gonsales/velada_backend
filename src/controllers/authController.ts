import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
    });
};

// FIX: Use express.Request and express.Response to ensure correct types are used.
export const loginAdmin = (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        res.json({
            token: generateToken('admin_user'),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};