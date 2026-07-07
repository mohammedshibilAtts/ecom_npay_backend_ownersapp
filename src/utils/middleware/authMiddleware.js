import AppError from '../errors/AppError.js';
import asyncHandler from '../errors/asyncHandler.js';

class AuthMiddleware {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  protect = asyncHandler(async (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.cookie) {
      token = req.cookies.cookie;
    } else if (req.cookies && req.cookies.__Host_sid) {
      token = req.cookies.__Host_sid;
    }
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Invalid token, Please login again" });
    }

    try {
      const decoded = await this.tokenService.verifyToken(token);
      req.user = decoded;

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid token, Please login again" });
    }
  });

  bypassProtect = asyncHandler(async (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.cookie) {
      token = req.cookies.cookie;
    } else if (req.cookies && req.cookies.__Host_sid) {
      token = req.cookies.__Host_sid;
    }

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