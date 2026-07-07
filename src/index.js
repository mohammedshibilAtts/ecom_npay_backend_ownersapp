import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import config from './config/chit/env.js';
import logger from './utils/logger.js';
import connectDB from './config/chit/database.js';
import authRoutes from './interfaces/routes/chit/admin/authRoutes.js';
import adminRoutes from './interfaces/routes/chit/admin/adminRoutes.js';
import clientRoutes from './interfaces/routes/chit/client/indexRoute.js';
import otpRoutes from './interfaces/routes/chit/client/otpRoutes.js'
// import ausaleRoutes from './interfaces/routes/chit/admin/ausleRoutes.js'
import AppError from './utils/errors/AppError.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import './config/chit/cronSetup.js'
import './cron/digigoldAutoCron.js'
import './cron/overdueAutoCron.js'
import exportRoutes from "./interfaces/controllers/chit/admin/client/exportController.js"
import shopRoutes from './interfaces/routes/ecom/ecomIndexRoutes.js'
import chitRedeemRoutes from './interfaces/routes/chitRedeem/chitRedeemRoutes.js';
import './cron/promotionCronSetup.js'
import { setupSwagger } from './config/swaggerConfig.js';
import "./config/chit/cronSetup.js"
import rateLimit from "express-rate-limit";

(function setupGlobalErrorLogger() {
  if (typeof process !== 'undefined' && process.on) {
    process.on('uncaughtException', function (err) {
      logger.error('[Uncaught Exception]', { message: err.message, stack: err.stack });
    });

    process.on('unhandledRejection', function (reason, promise) {
      logger.error('[Unhandled Promise Rejection]', { reason, stack: reason && reason.stack });
    });
  }
})();


const app = express();

app.set("trust proxy", 1);

(async () => {
  await connectDB();
})();


// Middleware setup
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cookieParser());
const morganFormat = config.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
if (config.NODE_ENV === "production") {
  app.use(
    cors({
      origin: [config.FRONT_URL, config.ECOM_WEB_FRONT_URL],
      credentials: true,
    })
  );
  console.log("CORS enabled (production mode)");
} else {
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  console.log("CORS disabled (development mode)");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const globalRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 800,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    status: "error",
    message: "Too many OTP requests. Try again later.",
  },
});

app.use(globalRateLimiter);

// Routes
app.get('/e-product/:id', (req, res) => {
  return res.sendFile(__dirname + '/utils/deepLinkPage.html'); // Or use res.render() if using a template engine
})
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/otp', otpRoutes)
app.use('/api/erp/chit-redeem', chitRedeemRoutes);

// Setup Swagger Documentation at /api-docs
setupSwagger(app);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: config.NODE_ENV,
  });
});

import ecomAppProducts from './interfaces/routes/ecom/app/appProdcutRoutes.js';
import ecomAppWishlist from './interfaces/routes/ecom/app/appWishlistRoutes.js';
import chatbotRoutes from './interfaces/routes/ecom/chatbotRoutes.js';
import webAuthRoutes from './interfaces/routes/ecom/webAuthRoutes.js';

//aupay ecom routes
app.use('/api/shop', shopRoutes);
app.use('/api/ecom/app/product', ecomAppProducts);
app.use('/api/ecom/app/products', ecomAppProducts);
app.use('/api/ecom/app/wishlist', ecomAppWishlist);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ecom/web/auth', webAuthRoutes);

app.use(express.static(path.join(__dirname, 'public')));
app.use("/exports", express.static(path.join(process.cwd(), "public", "exports")));

// Handle undefined routes
app.all('*', (req, res, next) => {
  if (req.originalUrl === '/') {
    return res.status(200).json({ message: 'Server is running' });
  }
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  logger.error(`[Error Handler] ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    ip: req.ip
  });


  if (req.accepts('html') && !req.originalUrl.startsWith('/api')) {
    if (err.statusCode === 404) {
      return res.status(404).sendFile(path.join(process.cwd(), 'public', '404.html'));
    }
    return res.status(err.statusCode).sendFile(path.join(process.cwd(), 'public', '500.html'));
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Start the server
const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

export default app;