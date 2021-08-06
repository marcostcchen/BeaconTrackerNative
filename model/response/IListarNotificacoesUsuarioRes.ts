import { INotification } from "../INotification";
import { IBaseRes } from "./IBaseRes";

export interface IListarNotificacoesUsuarioRes extends IBaseRes {
  listaNotificacoes: Array<INotification>,
}