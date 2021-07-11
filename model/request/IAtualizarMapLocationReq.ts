export interface IAtualizarMapLocationReq {
  idRegion: string,
  beaconRssi: {
    RSSIBeaconId1?: number,
    RSSIBeaconId2?: number,
    RSSIBeaconId3?: number,
  }
}