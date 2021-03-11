import { Status } from "../types";
import { IUser } from "./IUser";

export interface IMakeLoginRes {
  status: Status,
  message: string,
  user: IUser,
}