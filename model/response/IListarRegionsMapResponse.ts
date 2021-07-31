import { Status } from "../../types";
import { IRegionMap } from "../IRegionMap";

export interface IListarRegionsMapResponse {
  status: Status,
  listaRegionsMap: Array<IRegionMap>,
  message: string,
}