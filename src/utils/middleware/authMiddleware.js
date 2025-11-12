import AppError from '../errors/AppError.js';
import asyncHandler from '../errors/asyncHandler.js';

class AuthMiddleware {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  protect = asyncHandler(async (req, res, next) => {
     const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
       ? req.headers.authorization.split(' ')[1] 
      : null;
        
    if (!token) {
       throw new AppError('You are not logged in! Please log in to get access.', 401);
     }

    try {
      const decoded = await this.tokenService.verifyToken(token);
      req.user = decoded;
      
      next();
    } catch (error) {
      console.error(error);
      return res.status(400).json({message:"Invalid token, Please login again"})
    }
  });
bypassProtect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = await this.tokenService.verifyToken(token);
    req.user = decoded;
  } catch (error) {
    console.warn('Invalid token in bypassProtect:', error.message);
    req.user = null;
  }

  next();
});

  restrictTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new AppError('You do not have permission to perform this action', 403);
      }
      next();
    };
  }
}

export default AuthMiddleware;
