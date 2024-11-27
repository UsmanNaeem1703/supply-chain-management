const path = require("path");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require("cors");

const userRouter = require("./Routers/userRouter");
const nodeRouter = require("./Routers/nodeRouter");
const productRouter = require("./Routers/productRouter");
const transactionRouter = require("./Routers/transactionRouter");
const requestsRouter = require("./Routers/requestsRouter");

// Start express app
const app = express();

console.log(path.join(__dirname, "public"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If you need to expose cookies or other credentials
};

// Implement CORS
app.use(cors(corsOptions));

app.options("*", cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use("/api/v1/users", userRouter); // For handling user related requests like login/signup
app.use("/api/v1/nodes", nodeRouter); // For add, get and update nodes
app.use("/api/v1/products", productRouter); // For add, update and get medicines
app.use("/api/v1/transactions", transactionRouter); // For getting transactions
app.use("/api/v1/requests", requestsRouter); // For adding, getting and deleting requests

// app.use("/api/v1/image", imageRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  })
});

module.exports = app;
