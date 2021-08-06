import { IListarNotificacoesUsuarioRes, IUser } from "../../model";
import { getData, key_token, key_user, urlAPI } from "../../utils";

export const getUsersNotifications: () => Promise<IListarNotificacoesUsuarioRes | null> = () => {
  return new Promise(async (resolve) => {
    const entrypoint = "listar-notificacoes-usuario";
    const token = await getData(key_token);
    const userString: string | null = await getData(key_user);
    if(!userString) return;

    const user: IUser = JSON.parse(userString);

    fetch(`${urlAPI}/${entrypoint}?name=${user.name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token == null ? '' : token,
      },
    })
      .then(res => res.json())
      .then((response: IListarNotificacoesUsuarioRes) => {
        resolve(response)
      })
      .catch(err => {
        resolve(null)
      });

  })
}