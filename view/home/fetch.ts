import { IBeacon } from "../../model";
import { urlAPI } from "../../utils";

export const sendBeaconsRSSI: (beaconsList: Array<IBeacon>, idUser: string | null) => Promise<boolean> = (beaconsList, idUser) => {
  return new Promise(async (resolve) => {
    const entrypoint = "sendBeaconsRSSI";

    const json = {
      beaconsList,
      idUser
    }

    fetch(`${urlAPI}/${entrypoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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