import express, {
  // NextFunction,
  Request,
  Response,
} from "express";
import { PORT } from "./config";
import { AppDataSouce } from "./data-source";
import mainRouter from "./routes/mainRouter";
import { NextFunction } from "connect";

AppDataSouce.initialize()
  .then(() => {
    console.log("Database connected");

    const app = express();
    app.use(express.json());
    app.use(mainRouter);

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err) res.status(500).send(err);
      else next();
    });
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
