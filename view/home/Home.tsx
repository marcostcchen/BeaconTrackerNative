import React, { useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, SafeAreaView, StatusBar, Text } from 'react-native';
import BleManager from 'react-native-ble-manager';

interface Props {

}

export const HomeScreen: React.FC<Props> = (props: Props) => {
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    BleManager.start({ showAlert: false });
    getPermission();
    startScan();
  },[])

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3, true).then((results) => {
        console.log('Scanning...');
        setIsScanning(true);
      }).catch(err => {
        console.error(err);
      });
    }
  }

  const getPermission = () => {
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
    <>
      <StatusBar  translucent backgroundColor="transparent" />
      <SafeAreaView>
        <Text>Aqui</Text>
      </SafeAreaView>
    </>
  );
}