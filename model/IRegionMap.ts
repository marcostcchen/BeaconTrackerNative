export interface IRegionMap {
  id: string,
  name: string,
  description: string,
  dangerLevel: number,
  maxStayTimeMinutes: number,
  avgTemperature: number,
  rssiBeaconId1Avg: number,
  rssiBeaconId2Avg: number,
  rssiBeaconId3Avg: number
}