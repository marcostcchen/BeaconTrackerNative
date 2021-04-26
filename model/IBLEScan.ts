export interface IBLEScan {
  advertising: IAdvertising,
  id: string //"11:77:61:C0:8D:66",
  name: string //"NO NAME",
  rssi: number //-83
}

export interface IAdvertising {
  isConnectable: false,
  manufacturerData: {
    CDVType: string //"ArrayBuffer",
    data: string //"Hv8GAAEJIAIiqWBFoIdOHovtSNaZuiHuRHPpGMrTLwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
  },
  txPowerLevel: number //-2147483648
}