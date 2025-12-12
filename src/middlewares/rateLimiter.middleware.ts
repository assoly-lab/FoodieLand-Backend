import { NextFunction, Request, Response } from "express";

export const rateLimiter = (
  windowMs: number = 15 * 60 * 1000,
  max: number = 100
) => {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "";
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    requests.forEach((timestamps, key) => {
      const validTimestamps = timestamps.filter(
        (timestamp) => timestamp > windowStart
      );
      if (validTimestamps.length === 0) {
        requests.delete(key);
      } else {
        requests.set(key, validTimestamps);
      }
    });

    // Get or initialize request timestamps for this IP
    const requestTimestamps = requests.get(ip) || [];

    // Count requests in window (no need to filter since we cleaned old ones)
    if (requestTimestamps.length >= max) {
      return res.status(429).json({
        success: false,
        error: "Too many requests, please try again later",
        retryAfter: Math.ceil((windowStart + windowMs - now) / 1000),
      });
    }

    // Add new request timestamp
    requestTimestamps.push(now);
    requests.set(ip, requestTimestamps);

    // Add rate limit info to response headers
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", max - requestTimestamps.length);
    res.setHeader(
      "X-RateLimit-Reset",
      Math.ceil((windowStart + windowMs) / 1000)
    );

    next();
  };
};