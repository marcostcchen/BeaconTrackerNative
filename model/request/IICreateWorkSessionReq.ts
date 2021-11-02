import { IWorkSession } from "..";

export interface ICreateWorkSessionReq {
  userId: string,
  workSession: IWorkSession
}