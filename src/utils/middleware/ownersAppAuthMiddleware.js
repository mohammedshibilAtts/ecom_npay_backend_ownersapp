import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError.js';
import asyncHandler from '../errors/asyncHandler.js';

class OwnersAppAuthMiddleware {
  protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      throw new AppError('Missing or invalid authorization token from ownersapp', 401);
    }

    try {
      const ownersKey = process.env['OWNERS-KEY'] || 'default_npay_key';
      const decoded = jwt.verify(token, ownersKey);
      req.ownersAppClient = decoded;

      next();
    } catch (error) {
      console.error('OwnersApp Token Verification Error:', error.message);
      return res.status(401).json({ success: false, message: "Invalid or expired token from ownersapp" });
    }
  });
}

export default new OwnersAppAuthMiddleware();
