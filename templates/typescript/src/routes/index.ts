import { Router } from "express";

const NODE_ENV = process.env.NODE_ENV || "development";

console.log("NODE_ENV", NODE_ENV);

const router =
  NODE_ENV === "production"
    ? require(`./index.production`).default
    : require(`./index.development`).default;

const routes = Router();

routes.use("/api", router);

routes.use("/*", (req, res) => {
  res.notFound();
});

export default routes;
