// Import required modules
const express = require('express');
const cors = require('cors');
const logger = require('morgan')
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// Import routers
const authRouter = require("./routes/authRouter")
const bookRouter = require("./routes/bookRouter")
const authorRouter = require("./routes/authorRouter")
const borrowalRouter = require("./routes/borrowalRouter")
const genreRouter = require("./routes/genreRouter") 
const userRouter = require("./routes/userRouter") 
const reviewRouter = require("./routes/reviewRouter")

// Configure dotenv for environment variables in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Setup express
const app = express();
const PORT = process.env.PORT || 8080

// Use morgan for logging
app.use(logger("dev"))
app.use("/public", express.static("public"));




// Set middleware to process form data
app.use(express.urlencoded({extended: false}));

// Connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://rishisai766:rishi123@cluster0.9nr5daj.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to DB on MongoDB Atlas')
  })
  .catch((err) => console.log('DB connection error', err));

// Use CORS for Cross Origin Resource Sharing
app.use(cors({
  origin: "*",
  credentials: true
}))

// Set middleware to manage sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Parse cookies used for session management
app.use(cookieParser({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}));


// Parse JSON objects in request bodies
app.use(express.json())

// Use passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Initialise passport as authentication middleware
const initializePassport = require("./passport-config");
initializePassport(passport);

// Implement routes for REST API
app.use("/api/auth", authRouter)
app.use("/api/book", bookRouter);
app.use("/api/author", authorRouter);
app.use("/api/borrowal", borrowalRouter);
app.use("/api/genre", genreRouter);
app.use("/api/user", userRouter); 
app.use("/api/review", reviewRouter);

app.get('/', (req, res) => res.send('Welcome to Library Management System'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
