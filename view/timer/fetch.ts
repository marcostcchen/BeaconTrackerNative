import { IBaseRes, IBeacon, IEnviarUserBeaconRSSIReq, IEnviarUserBeaconRSSIRes, IListarRegionsMapResponse } from "../../model";
import { getData, key_token, urlAPI } from "../../utils";

export const listarRegionMap: () => Promise<IListarRegionsMapResponse | null> = () => {
  return new Promise(async (resolve) => {
    const entrypoint = "listar-regions-map";
    const token = await getData(key_token);

    fetch(`${urlAPI}/${entrypoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token == null ? '' : token,
      },
    })
      .then(res => res.json())
      .then((response: IListarRegionsMapResponse) => {
        resolve(response)
      })
      .catch(err => {
        resolve(null)
      });

  })
}


export const sendBeaconsRSSI: (beaconsList: Array<IBeacon>, regionName: string, idUser: string) => Promise<IEnviarUserBeaconRSSIRes | null> = (beaconsList, regionName, idUser) => {
  return new Promise(async (resolve) => {
    const entrypoint = "enviar-user-beacon-RSSI";
    const token = await getData(key_token);

    const json: IEnviarUserBeaconRSSIReq = {
      idUser,
      RSSIBeaconId1: beaconsList.find(b => b.idBeacon == 1)?.rssi,
      RSSIBeaconId2: beaconsList.find(b => b.idBeacon == 2)?.rssi,
      RSSIBeaconId3: beaconsList.find(b => b.idBeacon == 3)?.rssi,
      regionName
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
      .then((response: IEnviarUserBeaconRSSIRes) => {
        resolve(response)
      })
      .catch(err => {
        resolve(null);
      });

  })
}



export const startWorking: (userId: string, maxStayMinutes: number) => Promise<IBaseRes | null> = (userId, maxStayMinutes) => {
  return new Promise(async (resolve) => {
    const entrypoint = "start-working";
    const token = await getData(key_token);

    const json = {
      maxStayMinutes,
      userId
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
      .then((response: IBaseRes) => {
        resolve(response)
      })
      .catch(err => {
        resolve(null);
      });

  })
}
