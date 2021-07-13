import { IListarRegionsMapResponse } from "../../model";
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