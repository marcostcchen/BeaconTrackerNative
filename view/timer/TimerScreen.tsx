import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, useRef } from 'react'
import { NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, StatusBar, StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { IBeacon, IBLEScan, IRegionMap, IUser } from '../../model';
import { Status } from '../../types';
import { getData, key_user, ToastDanger } from '../../utils';
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
  const [myRegion, setMyRegion] = useState<IRegionMap | null>(null)

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const beaconListRef = useRef(beaconsList);
  beaconListRef.current = beaconsList;

  const mapRegionRef = useRef(listMapRegions);
  mapRegionRef.current = listMapRegions;

  useEffect(() => {
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

      BleManager.start({ showAlert: false });
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

      scanMyLocation();
    }

    getRegioesMap();
    checkPermissions();
  }, [])

  const scanMyLocation = () => {
    setInterval(() => {
      setIsScanning(true);
      handleStartScan();
    }, scanInterval);
  }

  const handleStartScan = () => {
    if (!isScanning) {
      setIsScanning(true);
      BleManager.scan([], scanTime, true).then(async () => {
        updateMyLocation();

        const userString: string | null = await getData(key_user);
        if (userString == null) return;

        var user: IUser = JSON.parse(userString);
        await fetch.sendBeaconsRSSI(beaconListRef.current, user.id);

        setIsScanning(false);
      });
    }
  }

  const handleDiscoverPeripheral = (peripheral: IBLEScan) => {
    let beacon = beaconsList.find(beacon => beacon.name == peripheral.name)
    if (beacon) {
      beacon.rssi = peripheral.rssi;
      setBeaconsList(beaconsList);
      updateMyLocation();
      forceUpdate();
    }
  }

  const updateMyLocation = async () => {
    if (beaconListRef.current.find(b => b.rssi === -1)) return

    let beaconList: Array<IBeacon> = beaconListRef.current
    beaconList.sort((a: IBeacon, b: IBeacon) => {
      return b.rssi - a.rssi;
    })

    let maiorBeacon = beaconList[0];
    let myActualRegion = mapRegionRef.current.find((region) => region.idBeaconMinRSSI === maiorBeacon.idBeacon)

    if (myActualRegion) setMyRegion(myActualRegion);
    forceUpdate();
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
          {!myRegion && (
            <ActivityIndicator size="large" />
          )}
          {myRegion && (
            <View>
              <Text>Regiao: {myRegion.name}</Text>
              <Text>Danger Level: {myRegion.dangerLevel}</Text>
              {beaconsList.map((beacon) => (
                <View key={beacon.id}>
                  <Text>{beacon.name} RSSI: {beacon.rssi}</Text>
                </View>
              ))}
              {isScanning && (
                <ActivityIndicator size="large" />
              )}
            </View>
          )}
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
