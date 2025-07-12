var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { rateLimit } = require('express-rate-limit');
const errorMiddleware = require('./middleware/error');
var usersRouter = require('./routes/users');

var app = express();

const apiRoutes = [
  "./routes/users.js",
];

// Enable trust proxy
app.set('trust proxy', 1);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again after a minute",
    status: 429
  }
});

app.use(limiter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


///use Routes
apiRoutes.forEach((route) => {
  const routeModule = require(route);
  app.use("/api", routeModule);
});

app.get("/", (req, res) => {
  res.json({
    msg: "TakeANote APP Backend",
    serverDateTime: new Date().toString(),
    apiVersion: "1.0.0",
    environment: process.env.NODE_ENV,
    status: "Server is up and running",
    serverUptime: process.uptime() + " seconds",
  });
});



// Middleware for Errors
app.use(errorMiddleware);

module.exports = app;
