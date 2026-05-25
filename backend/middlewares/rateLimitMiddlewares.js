import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from "../config/redis.js";

const createLimiter = ({ windowMs, max, message }) => {
  return rateLimit({
    windowMs,
    max,

    standardHeaders: true,
    legacyHeaders: false,

    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),

    message: {
      success: false,
      message,
    },

    handler: (req, res, next, options) => {
      return res.status(429).json(options.message);
    },
  });
};

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,

  message: "Too many authentication attempts. Please try again later.",
});



export const bookingLimiter = createLimiter({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 5,

  message: "Too many booking attempts. Please slow down.",
});



export const paymentLimiter = createLimiter({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 3,

  message: "Too many payment attempts. Please try again later.",
});