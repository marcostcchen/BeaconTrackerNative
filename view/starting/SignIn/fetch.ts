import { Toast } from "native-base";
import { IMakeLoginReq, IMakeLoginRes } from "../../../model";
import { IUser } from "../../../model";
import { ToastDanger, urlAPI } from "../../../utils";

export const makeLogin: (login: string, password: string) => Promise<IUser | null> = (login, password) => {
  return new Promise(async (resolve) => {
    const method = "login";
    const json: IMakeLoginReq = { login, password }

    await fetch(`${urlAPI}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(json)
    })
      .then(res => res.json())
      .then((response: IMakeLoginRes) => {
        resolve(response.user);
      })
      .catch(err => {
        setTimeout(() => {
          if (err.message === 'Network request failed') {
            Toast.show(ToastDanger("Sem Conexão com internet, tente novamente!"));
          }
        }, 100)
        resolve(null)
      });
  })
}