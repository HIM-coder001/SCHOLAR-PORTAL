const rateLimitStore = new Map();

/**
 * Custom sliding window rate limiter middleware (Dependency-Free)
 * @param {number} limit - Maximum number of requests allowed within the window
 * @param {number} windowMs - Window duration in milliseconds (default 15 minutes)
 */
module.exports = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, []);
    }

    // Filter out timestamps that are outside the current window
    const requests = rateLimitStore.get(ip).filter(timestamp => now - timestamp < windowMs);
    
    // Add current request timestamp
    requests.push(now);
    rateLimitStore.set(ip, requests);

    // If limits exceeded, return 429 Too Many Requests
    if (requests.length > limit) {
      return res.status(429).json({
        message: "Too many requests from this client IP. Please wait and try again later."
      });
    }

    next();
  };
};
