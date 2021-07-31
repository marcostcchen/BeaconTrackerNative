import { Status } from "../../types";
import { IUser } from "../IUser";

export interface IEfetuarLoginResponse {
  token: string,
  user: IUser,
  status: Status,
  message: string
}