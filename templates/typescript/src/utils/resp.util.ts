import type { NextFunction, Request, RequestHandler, Response } from "express";
import moment from "moment";

export function asyncRes(fun: RequestHandler) {
  return function (req: Request, res: Response, next: NextFunction) {
    return Promise.resolve(fun(req, res, next)).catch((error) => {
      console.error(error);
      return res.error(error.message);
    });
  };
}

function resMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on("finish", () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    console.log(
      req.method,
      req.originalUrl,
      res.statusCode,
      "-",
      responseTime,
      " ms"
    );
  });

  res.error = (error = "woops something went wrong!") => {
    const message = typeof error === "object" ? error?.message : error;
    res.status(400).json({
      success: false,
      message,
      code: 1000,
      timestamp: moment().unix(),
    });
  };

  res.success = (data, message) => {
    if (typeof data !== "object")
      return res
        .status(200)
        .json({ success: true, message, data, timestamp: moment().unix() });

    res.status(200).json({
      success: true,
      message,
      ...data,
      timestamp: moment().unix(),
    });
  };

  res.deleted = () => {
    res.status(200).json({
      success: true,
      message: "Record deleted",
      timestamp: moment().unix(),
    });
  };

  res.unauth = (message) => {
    res.status(401).json({
      success: false,
      message: message || "Unauthorized",
      code: 1401,
      timestamp: moment().unix(),
    });
  };

  res.notFound = () => {
    res.status(404).json({
      success: false,
      message: "not found.",
      code: 1404,
      timestamp: moment().unix(),
    });
  };

  res.noRecord = () => {
    res.status(400).json({
      success: false,
      message: "not record found.",
      code: 14005,
      timestamp: moment().unix(),
    });
  };

  res.badRequest = (message?: string) => {
    res.status(400).json({
      success: false,
      message: message || "validation failed.",
      code: 1400,
      timestamp: moment().unix(),
    });
  };

  next();
}

export default resMiddleware;
