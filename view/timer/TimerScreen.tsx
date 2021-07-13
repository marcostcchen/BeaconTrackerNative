import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, useRef } from 'react'
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { IBeacon, IBLEScan, IRegionMap } from '../../model';
import { Status } from '../../types';
import { ToastDanger } from '../../utils';
import * as fetch from './fetch';

interface Props {

}

export const TimerScreen: React.FC<Props> = () => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [isScanning, setIsScanning] = useState(false);

  const scanInterval = 11000; //miliseconds
  const scanTime = 8; //seconds

  const [time, setTime] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listMapRegions, setListMapRegions] = useState<Array<IRegionMap>>([])

  const [beaconsList, setBeaconsList] = useState<Array<IBeacon>>([{ "id": "60e85abd0c3488eeec4f05df", "idBeacon": 1, "name": "EMBeacon12709", "rssi": -1 }, { "id": "60e85adb0c3488eeec4f05e1", "idBeacon": 2, "name": "EMBeacon13922", "rssi": -1 }, { "id": "60e85ae90c3488eeec4f05e3", "idBeacon": 3, "name": "EMBeacon12677", "rssi": -1 }])
  const [selectedRegion, setSelectedRegion] = useState("");

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const beaconListRef = useRef(beaconsList);
  beaconListRef.current = beaconsList;

  useEffect(() => {
    BleManager.start({ showAlert: false });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    const getRegioesMap = async () => {
      const listarRegionMapRes = await fetch.listarRegionMap();

      if (!listarRegionMapRes) {
        Toast.show(ToastDanger("Erro!", "Não foi possível listar regioes, tente novamente!"));
        return;
      }

      if (listarRegionMapRes.status === Status.Error) {
        Toast.show(ToastDanger("Erro!", listarRegionMapRes.message));
        return;
      }

      setListMapRegions(listarRegionMapRes.listaRegionsMap);
      setInitialLoading(false);
      scanMyLocation();
    }

    getRegioesMap();
    checkPermissions();
  }, [])

  const scanMyLocation = () => {
    if (selectedRegion == "") {
      Toast.show(ToastDanger("Erro!", "Região não selecionado!"));
      return;
    }

    setIsScanning(true);

    let interval = setInterval(async () => {
      setIsScanning(true);
      handleStartScan();
    }, scanInterval);

    setTimeout(() => {
      setIsScanning(false);
      clearInterval(interval)
    }, 120000) //dps de 120 segundos
  }

  const handleStartScan = () => {
    if (!isScanning) {
      setIsScanning(true);
      BleManager.scan([], scanTime, true).then(async () => {
        if (beaconListRef.current.find(b => b.rssi === -1)) return
        if (!!!selectedRegion) return;

        let beaconList: Array<IBeacon> = beaconListRef.current

        let myRSSIBeaconId1 = beaconList.find(b => b.idBeacon = 1);
        let myRSSIBeaconId2 = beaconList.find(b => b.idBeacon = 2);
        let myRSSIBeaconId3 = beaconList.find(b => b.idBeacon = 3);

        let myRegion: IRegionMap | null = null;
        let minValor: number = 1000;

        listMapRegions.map((mapRegion) => {
          if(myRegion === null) {
            myRegion = mapRegion;
            return;
          }

          
        })
      });
    }
  }

  const handleDiscoverPeripheral = (peripheral: IBLEScan) => {
    let beacon = beaconsList.find(beacon => beacon.name == peripheral.name)
    if (beacon) {
      beacon.rssi = peripheral.rssi;
      setBeaconsList(beaconsList);
      forceUpdate();
    }
  }

  const checkPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }
  }

  return (
    <View style={styles.timerContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {initialLoading && (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {!initialLoading && (
        <>
          <View style={styles.regionTitleContainer}>
            <Text>Região X - perigo Alto</Text>
          </View>
          <View style={{ height: 20 }} />
          <View style={styles.timeLeftContainer}>
            <Text>
              {time}
            </Text>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  regionTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  timeLeftContainer: {
    height: 400,
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    borderWidth: 1,
    borderRadius: 50
  }
})
