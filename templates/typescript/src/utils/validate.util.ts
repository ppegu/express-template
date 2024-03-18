import type { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "yup";

export function validate(schema: ObjectSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    schema
      .validate(req.body)
      .then(() => {
        next();
      })
      .catch((error) => {
        res.badRequest(error.message);
      });
  };
}
