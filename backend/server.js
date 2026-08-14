const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const seedAdminUser = require('./utils/seeder');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

// Connect to MongoDB Atlas
connectDB().then(() => {
  seedAdminUser();
});

const app = express();

// Trust reverse proxy for deployment platforms (Render, Vercel, Heroku, etc.)
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Rate Limiting (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', limiter);

// Allowed Origins for CORS (Support env for Production deployment)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://raji-dev.nl',
  'https://www.raji-dev.nl',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS Policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data Sanitization against NoSQL Injection Attacks
app.use(mongoSanitize());

app.use(cookieParser());

// System Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'Healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio Hub API is running smoothly...',
  });
});

// Custom Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});