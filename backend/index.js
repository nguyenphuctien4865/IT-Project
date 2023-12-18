import express, { response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import productsRoute from "./routes/products.js";
import checkoutRoute from "./routes/checkout.js";
import categoriesRoute from "./routes/categories.js";
import searchRoute from "./routes/search.js";
import reviewRoute from "./routes/reviews.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import authGG from "./routes/authGG.js";
import setUpGG from "./passport.js";
import passport from "passport";
import { urlencoded, json } from "express";
// import mongoosePatchUpdate from "mongoose-patch-update";
import cors from "cors";
setUpGG();
const app = express();
dotenv.config();

const connect = async () => {
  try {
    // node > 17 => 127.0.0.1 else localhost
    // await mongoose.connect("mongodb://127.0.0.1:27017/CNTT"); //process.env.MONGO //mongodb://localhost:27017/web-ec
    mongoose.connect(process.env.MONGO); //process.env.MONGO //mongodb://localhost:27017/web-ec
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected!");
});

// middlewares
app.use(bodyParser.json({ limit: "50000mb" }));
app.use(bodyParser.urlencoded({ limit: "50000mb", extended: true }));
app.use(
  express.urlencoded({
    extended: true,
  })
);
//app.use(cors({ credentials: true, origin: true }));
app.options("*", cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
// =============== Authen
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
// ====================================================

app.use("/auth", authGG);
app.use("/backend/auth", authRoute);
app.use("/backend/users", usersRoute);
app.use("/backend/products", productsRoute);
app.use("/backend/checkouts", checkoutRoute);
app.use("/backend/reviews", reviewRoute);
app.use("/backend/categories", categoriesRoute);
app.use("/backend/search", searchRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(500).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend");
});
