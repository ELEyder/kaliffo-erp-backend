import { DecodedToken } from "./interface/decodeToken";

declare global {
  namespace Express {
    interface Request {
      decodeToken?: DecodedToken;
      file?:Express.Multer.File;
    }
  }
}
