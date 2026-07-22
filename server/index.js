
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import fileUpload from "express-fileupload";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoose from "mongoose";
import cors from 'cors';
import helmet from "helmet";
import { MAX_JSON_SIZE, MAX_REQUEST, MAX_REQUEST_TIME } from "./App/Config/Config.js";
import { ConnectDB } from "./App/Config/ConnectDB.js";
import router from "./Router/Api.js";
import { StripeWebHook } from "./App/Controllers/Webhooks.js";

const PORT = process.env.PORT || 5000; 

// initiate express app
const app = express();
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), StripeWebHook);
// middleware
app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: MAX_JSON_SIZE }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

const ratelimiter = rateLimit({
    windowMs: MAX_REQUEST_TIME,
    max: MAX_REQUEST,
    message: "MAX REQUEST FROM THIS IP!"
});
app.use(ratelimiter);
app.set('etag', false);

// connect db
ConnectDB();

// connection route
app.use('/api/test-env', (req, res) => {
  res.json({
    adminEmails: process.env.ADMIN_EMAILS || "Not Found",
    nodeEnv: process.env.NODE_ENV || "Not Found",
    hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
  });
});
//main router
app.use('/api', router);

app.listen(PORT, () => {
    console.log(`app is running on ${PORT}`);
});