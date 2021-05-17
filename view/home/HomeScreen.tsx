import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, } from 'react';
import { StyleSheet, View, Text, StatusBar, NativeModules, NativeEventEmitter, Button, Platform, PermissionsAndroid, FlatList, TouchableHighlight } from 'react-native';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import { getData, gray, key_user } from '../../utils';
import { IBeacon, IBLEScan } from '../../model';
import * as fetch from './fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {

}

export const HomeScreen: React.FC<Props> = (props: Props) => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const scanInterval = 60000; //miliseconds
  const scanTime = 5; //seconds

  const [isScanning, setIsScanning] = useState(false);
  const [beaconsList, setBeaconsList] = useState<Array<IBeacon>>([{ idBeacon: 1, name: "EMBeacon12709", rssi: 0 }, { idBeacon: 2, name: "EMBeacon13922", rssi: 0 }])

  useEffect(() => {
    BleManager.start({ showAlert: false });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    checkPermissions();

    //intervalo entre os scans
    const interval = setInterval(async () => {
      const idUser = await getData(key_user);
      await fetch.sendBeaconsRSSI(beaconsList, idUser);
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

  const handleStartScan = () => {
    if (!isScanning) {
      setIsScanning(true);

      BleManager.scan([], scanTime, true).then((results: any) => {
        setIsScanning(false);
      }).catch((err: any) => {
        console.error(err);
      });
    }
  }

  const handleDiscoverPeripheral = (peripheral: IBLEScan) => {
    let beacon = beaconsList.find(beacon => beacon.name == peripheral.name)
    if (beacon) {
      let newBeaconList = beaconsList;
      beacon.rssi = peripheral.rssi;
      setBeaconsList(newBeaconList);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.scrollView}>
        <View style={styles.body}>
          <View style={{ margin: 10 }}>
            <Button title={'Scan 5 Segundos'}
              onPress={handleStartScan}
            />
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

