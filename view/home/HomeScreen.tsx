import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, } from 'react';
import { StyleSheet, View, Text, StatusBar, NativeModules, NativeEventEmitter, Button, Platform, PermissionsAndroid, FlatList, TouchableHighlight } from 'react-native';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import { gray } from '../../utils';
import { IBLEScan } from '../../model';

interface Props {

}

export const HomeScreen: React.FC<Props> = (props: Props) => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const scanInterval = 10000; //miliseconds
  const scanTime = 10; //seconds

  const [isScanning, setIsScanning] = useState(false);
  const [list, setList] = useState<Array<IBLEScan>>([]);

  useEffect(() => {
    BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

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

    //intervalo entre os scans
    const interval = setInterval(() => {
      handleStartScan();
    }, scanInterval);
    return () => clearInterval(interval);

  }, [])

  const handleStartScan = () => {
    console.log(`Scanning for ${scanTime} seconds`)

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
    if (peripheral.name === "EMBeacon12709") {
      let newlist = [peripheral]
      setList(newlist);
    }
  }

  const renderItem = (item: IBLEScan) => {
    return (
      <View style={{ backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 12, textAlign: 'center', color: '#333333', padding: 10 }}>{item.name}</Text>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#333333', padding: 2 }}>RSSI: {item.rssi}</Text>
        <Text style={{ fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20 }}>{item.id}</Text>
      </View>
    );
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

          {(list.length == 0) &&
            <View style={{ flex: 1, margin: 20 }}>
              <Text style={{ textAlign: 'center' }}>No peripherals</Text>
            </View>
          }
        </View>
      </View>

      <FlatList
        data={list}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={item => item.id}
      />
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

