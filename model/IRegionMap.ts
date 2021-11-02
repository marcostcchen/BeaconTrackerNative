export interface IRegionMap {
  id: number,
  name: string,
  description: string,
  dangerLevel: number,
  maxStayTimeMinutes: number,
  minRestMinutes: number,
  avgTemperature: number,
  rssiBeaconId1Avg: number,
  rssiBeaconId2Avg: number,
  rssiBeaconId3Avg: number,
  idBeaconMinRSSI: number,
}