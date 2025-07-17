var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { rateLimit } = require("express-rate-limit");
const errorMiddleware = require("./middleware/error");
var cors = require("cors");
const useragent = require('express-useragent');
const { generateBcryptHash, compareBcryptHashes } = require("./utils/bycrypt");

var app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://takeanoteapp.web.app"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

const apiRoutes = ["./routes/users.js", "./routes/notes.js", "./routes/twofaroutes.js"];

// Enable trust proxy
app.set("trust proxy", 1);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 1000,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    message: "Too many requests from this IP, please try again after a minute",
    status: 429,
  },
});

if(process.env.NODE_ENV === "PRODUCTION"){
  app.use(limiter);
}

app.use(useragent.express());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

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
