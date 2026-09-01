import rateLimit from "express-rate-limit";


//global limit for all sever
export const globalLimiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max:100,
 message:{
    error: "Too many requests from this IP, please try again after 15 minutes.",
 },
   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});


// 2. Auth Routes ke liye Strict Limiter (Login, Forgot Password ke liye);
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5, // Sirf 5 baar login ya forgot password try karne do 15 min me
  message: {
    error: "Too many auth attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
