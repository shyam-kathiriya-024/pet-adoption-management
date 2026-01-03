import compression from "compression";
import cors from "cors";

import "dotenv/config";

import type { Express, Request, Response } from "express";
import express, { json, urlencoded } from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import passport from "passport";

import Config from "@/config";

import "@/db";

import apiV1 from "./api/v1";
import middleware from "./middleware";
import { jwtStrategy } from "./middleware/passport";

// Create an Express application
const app: Express = express();

// Specify the port number for the server
const PORT = Number(Config.env.port);
const ENV: string = Config.env.environment;

// set security HTTP headers and enable CORS
app.use(helmet());
app.use(cors());

// parse JSON request body
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ extended: true }));

// parse URL-encoded request body and mongo sanitize
app.use(mongoSanitize());
app.use(compression());

// Initialize Passport
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// custom middlewares
app.use(middleware.requestIdMiddleware);
app.use(middleware.requestLogger);

// routes
app.use("/api/v1", apiV1());

app.get("/", (req: Request, res: Response) => {
  // Send a response to the client
  res.status(200).send({ status: 200, message: "Online!" });
});

app.use(middleware.notFoundHandler);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${PORT} in ${ENV} environment.`);
});
