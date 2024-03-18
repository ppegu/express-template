import { IUser } from "src/models/User";

interface CustomResponse {
  error: (error: string | Error | undefined) => void;
  success: (data?: any, message?: string) => void;
  deleted: () => void;
  unauth: (message?: string) => void;
  notFound: () => void;
  noRecord: () => void;
  badRequest: (message?: string) => void;
}

declare module "express-serve-static-core" {
  interface Response extends CustomResponse {}
  interface Request {
    user: IUser;
  }
}
