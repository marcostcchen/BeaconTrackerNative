import { WorkingStatus } from "../types";

export interface IWorkSession {
  startTime: Date,
  status: WorkingStatus,
  beaconsRssi: {
    RSSIBeaconId1?: number,
    RSSIBeaconId2?: number,
    RSSIBeaconId3?: number,
  }
  regionName: string,
  measureTime: Date
}