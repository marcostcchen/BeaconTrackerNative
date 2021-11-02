import { IBaseRes, IBeacon, ICreateWorkSessionReq, IEnviarUserBeaconRSSIRes, IListarRegionsMapResponse } from "../../model";
import { WorkingStatus } from "../../types";
import { getData, key_token, urlAPI } from "../../utils";

export const listarRegionMap: () => Promise<IListarRegionsMapResponse | null> = () => {
  return new Promise(async (resolve) => {
    const entrypoint = "listar-regions-map";
    const token = await getData(key_token);

    fetch(`${urlAPI}/${entrypoint}`, {
      method: 'GET',
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


export const createWorkSession: (beaconsList: Array<IBeacon>, regionName: string, idUser: string, workingStatus: WorkingStatus, startTime: Date) => Promise<IEnviarUserBeaconRSSIRes | null> = (beaconsList, regionName, idUser, workingStatus, startTime) => {
  return new Promise(async (resolve) => {
    const entrypoint = "create-work-session";
    const token = await getData(key_token);

    const json: ICreateWorkSessionReq = {
      userId: idUser,
      workSession: {
        regionName,
        startTime, 
        measureTime: new Date(),
        status: workingStatus,
        beaconsRssi: {
          RSSIBeaconId1: beaconsList.find(b => b.idBeacon == 1)?.rssi,
          RSSIBeaconId2: beaconsList.find(b => b.idBeacon == 2)?.rssi,
          RSSIBeaconId3: beaconsList.find(b => b.idBeacon == 3)?.rssi,
        }
      }
    }

    console.log(json)

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