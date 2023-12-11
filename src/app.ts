import express, { Request, Response } from "express";
import { PORT } from "./config";
import { AppDataSouce } from "./data-source";
import mainRouter from "./routes/mainRouter";
import { NextFunction } from "connect";
import session from "express-session";
import passport from "passport";
import authRouter from "./routes/authRouter";

AppDataSouce.initialize()
  .then(() => {
    console.log("Database connected");

    const app = express();
    app.use(
      session({
        secret: "youre_private_key",
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.json());
    app.use("/profiles", mainRouter);
    app.use("/", authRouter);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err) res.status(500).send(err);
      else next();
    });
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
