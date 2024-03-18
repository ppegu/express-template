import { connection } from "@ppegu/mongoose-extras";
import cors from "cors";
import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import http from "http";
import routes from "./routes";
import resMiddleware from "./utils/resp.util";

dotenv.config();

connection.connect();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ success: false, message: "Invalid Payload" });
    return;
  }
  next();
});

app.use("/api-docs", express.static("docs"));

app.use(resMiddleware);

app.use(cors({ origin: "*" }));

app.use(routes);

const PORT = process.env.PORT || 8000;
const HOST = "http://localhost";

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
});
