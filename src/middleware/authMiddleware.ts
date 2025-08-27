import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// FIX: Use a type intersection for better type safety with Express Request object.
// FIX: Use express.Request to avoid type conflicts with other libraries.
type AuthRequest = Request & {
    user?: string | jwt.JwtPayload;
};

const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { protect };