import Toast from "react-native-toast-message";
import { IEfetuarLoginRequest, IEfetuarLoginResponse, IUser } from "../../../model";
import { ToastDanger, urlAPI } from "../../../utils";

export const makeLogin: (login: string, password: string) => Promise<IEfetuarLoginResponse | null> = (login, password) => {
  return new Promise(async (resolve) => {
    const method = "efetuar-login";
    const json: IEfetuarLoginRequest = { login, password }

    await fetch(`${urlAPI}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(json)
    })
      .then(res => res.json())
      .then((response: IEfetuarLoginResponse) => {
        resolve(response);
      })
      .catch(err => {
        setTimeout(() => {
          if (err.message === 'Network request failed') {
            Toast.show(ToastDanger("Erro!", "Sem Conexão com internet, tente novamente!"));
          }
        }, 100)
        resolve(null)
      });
  })
}