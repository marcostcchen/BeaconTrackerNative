import { Status } from "../../types";
import { IBeacon } from "../IBeacon";

export interface IListarBeaconsResponse {
  listaBeacons: Array<IBeacon>,
  status: Status,
  message: string
}