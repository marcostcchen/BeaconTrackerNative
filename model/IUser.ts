import { Roles } from "../types";

export interface IUser {
  idUser: number,
  name: string,
  login: string,
  role: Roles
}