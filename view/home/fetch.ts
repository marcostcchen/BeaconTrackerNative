import { IBeacon, IListarBeaconsResponse } from "../../model";
import { getData, key_token, urlAPI } from "../../utils";

export const sendBeaconsRSSI: (beaconsList: Array<IBeacon>, idUser: string | null) => Promise<boolean> = (beaconsList, idUser) => {
  return new Promise(async (resolve) => {
    const entrypoint = "enviar-user-beacon-RSSI";
    const token = await getData(key_token);

    const json = {
      beaconsList,
      idUser
    }

    fetch(`${urlAPI}/${entrypoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token == null ? '' : token,
      },
      body: JSON.stringify(json)
    })
      .then(res => res.json())
      .then((response) => {
        if (response.status === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      })

  })
}


export const listarBeacons: () => Promise<IListarBeaconsResponse | null> = () => {
  return new Promise(async (resolve) => {
    const entrypoint = "listar-beacons";
    const token = await getData(key_token);

    fetch(`${urlAPI}/${entrypoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token == null ? '' : token,
      },
    })
      .then(res => res.json())
      .then((response: IListarBeaconsResponse) => {
        resolve(response)
      })
      .catch(err => {
        resolve(null)
      });

  })
}