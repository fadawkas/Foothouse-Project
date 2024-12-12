const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests. Try again later.',
});
app.use(limiter);

// CORS
app.use(cors({ origin: 'http://103.147.92.133:5173', credentials: true }));

// Middleware to validate JWT for protected routes
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("[Gateway] Missing token");
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("[Gateway] Invalid token:", err.message);
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
    req.user = user;
    console.log("[Gateway] Token verified, user:", user);
    next();
  });
};


// Routes to Microservices
// Proxy requests to the Auth service
app.use(
  '/auth',
  createProxyMiddleware({
    target: 'http://103.147.92.133:5001', // Auth Service
    changeOrigin: true,
  })
);


app.use('/inventory', authenticateJWT, createProxyMiddleware({
  target: 'http://103.147.92.133:5002', // Inventory Service
  changeOrigin: true,
}));

// Fallback route for undefined paths
app.use('*', (req, res) => res.status(404).json({ message: 'API Gateway: Route not found' }));

// Start the Gateway
const PORT = process.env.GATEWAY_PORT || 5000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
