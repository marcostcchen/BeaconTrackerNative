import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, } from 'react';
import { StyleSheet, View, Text, StatusBar, NativeModules, NativeEventEmitter, Platform, PermissionsAndroid, FlatList, TouchableHighlight } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import { getData, gray, key_user, ToastDanger } from '../../utils';
import { IBeacon, IBLEScan, IUser } from '../../model';
import * as fetch from './fetch';
import { Toast } from 'native-base';
import { Status } from '../../types';
import { ActivityIndicator } from 'react-native';

interface Props {

}

export const HomeScreen: React.FC<Props> = (props: Props) => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const scanInterval = 20000; //miliseconds
  const scanTime = 10; //seconds

  const [initialLoading, setInitialLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [beaconsList, setBeaconsList] = useState<Array<IBeacon>>([{ "id": "60e85abd0c3488eeec4f05df", "idBeacon": 1, "name": "EMBeacon12709", "rssi": -1 }, { "id": "60e85adb0c3488eeec4f05e1", "idBeacon": 2, "name": "EMBeacon13922", "rssi": -1 }, { "id": "60e85ae90c3488eeec4f05e3", "idBeacon": 3, "name": "EMBeacon12677", "rssi": -1 }])

  useEffect(() => {
    BleManager.start({ showAlert: false });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    checkPermissions();
    getBeacons();

    const interval = setInterval(async () => {
      handleStartScan();
    }, scanInterval);
    return () => clearInterval(interval);
  }, [])


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

  const getBeacons = async () => {
    const listarBeaconsResponse = await fetch.listarBeacons();

    if (!listarBeaconsResponse) {
      Toast.show(ToastDanger("Não foi possível listar os beacons, tente novamente!"));
      return;
    }

    if (listarBeaconsResponse.status === Status.Error) {
      Toast.show(ToastDanger(listarBeaconsResponse.message));
      return;
    }

    const { listaBeacons } = listarBeaconsResponse;
    listaBeacons.map(b => b.rssi = -1)

    setBeaconsList(listaBeacons)
    setInitialLoading(false);
  }

  const handleStartScan = () => {
    if (!isScanning) {
      setIsScanning(true);
      BleManager.scan([], scanTime, true);
      setTimeout(async () => {
        if (beaconsList.find(b => b.rssi === -1)) {
          setIsScanning(false);
          return;
        }

        const userString: string | null = await getData(key_user);
        if (userString == null) return;

        var user: IUser = JSON.parse(userString);
        await fetch.sendBeaconsRSSI(beaconsList, user.id);
        setIsScanning(false)
      }, (scanTime + 3) * 1000)
    }
  }

  const handleDiscoverPeripheral = (peripheral: IBLEScan) => {
    let beacon = beaconsList.find(beacon => beacon.name == peripheral.name)
    if (beacon) {
      beacon.rssi = peripheral.rssi;
      setBeaconsList(beaconsList);
    }
  }

  if (initialLoading) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.scrollView}>
        <View style={styles.body}>
          <View style={{ margin: 10 }}>
            <Button
              onPress={handleStartScan}
              loading={isScanning}
              disabled
            >
              <Text>Scan 10 Segundos</Text>
            </Button>
          </View>

          {(beaconsList.length == 0) &&
            <View style={{ flex: 1, margin: 20 }}>
              <Text style={{ textAlign: 'center' }}>No peripherals</Text>
            </View>
          }
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {beaconsList.map((beacon, index) => (
          <View key={index} style={{ backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{beacon.name}</Text>
            <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {beacon.rssi}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

