import createError from "http-errors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import chalk from "chalk";
import "dotenv/config";
import helmet from "helmet";
import connectDB from "./database/index.js";
import { frontendUrls, PORT } from "./config.js";
import { error } from "express-error-catcher";
import cors from "cors";
import "./helper/global.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// routers

import routes from "./routes.js";

const app = express();

app.use(cors({ origin: frontendUrls, credentials: true }));
// app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
// Long-lived cache for static assets in /public (immutable content-hashed
// files benefit most; plain files still revalidate cheaply).
app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=604800");
    },
  })
);

app.use("/api", routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// must this be called before anything
app.use(error({ log: "dev" }));

function starProcess() {
  app.listen(PORT, () => {
    console.log(chalk.greenBright(`---------------------------------------`));
    console.log(chalk.blueBright(`Server started on port ${PORT}`));
    console.log(chalk.cyanBright(`API URL: http://localhost:${PORT}/api`));
    console.log(chalk.greenBright(`---------------------------------------`));
  });
}

function startProject() {
  connectDB()
    .then(() => {
      starProcess();
    })
    .catch(() => {
      setTimeout(startProject, 3000);
    });
}

startProject();

export default app;
