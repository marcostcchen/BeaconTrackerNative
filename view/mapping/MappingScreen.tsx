import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, useRef, } from 'react';
import { StyleSheet, View, Text, StatusBar, NativeModules, NativeEventEmitter, Platform, PermissionsAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors, } from 'react-native/Libraries/NewAppScreen';
import { gray, ToastDanger } from '../../utils';
import { IBeacon, IBLEScan } from '../../model';
import * as fetch from './fetch';
import { Status } from '../../types';
import { ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

interface Props {

}

export const MappingScreen: React.FC<Props> = (props: Props) => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

  const scanInterval = 11000; //miliseconds
  const scanTime = 8; //seconds

  const [initialLoading, setInitialLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [beaconsList, setBeaconsList] = useState<Array<IBeacon>>([{ "id": "60e85abd0c3488eeec4f05df", "idBeacon": 1, "name": "EMBeacon12709", "rssi": -1 }, { "id": "60e85adb0c3488eeec4f05e1", "idBeacon": 2, "name": "EMBeacon13922", "rssi": -1 }, { "id": "60e85ae90c3488eeec4f05e3", "idBeacon": 3, "name": "EMBeacon12677", "rssi": -1 }])
  const [selectedRegion, setSelectedRegion] = useState("");

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const beaconListRef = useRef(beaconsList);
  beaconListRef.current = beaconsList;

  useEffect(() => {
    BleManager.start({ showAlert: false });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    checkPermissions();
    getBeacons();
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
      Toast.show(ToastDanger("Erro!", "Não foi possível listar os beacons, tente novamente!"));
      return;
    }

    if (listarBeaconsResponse.status === Status.Error) {
      Toast.show(ToastDanger("Erro!", listarBeaconsResponse.message));
      return;
    }

    const { listaBeacons } = listarBeaconsResponse;
    listaBeacons.map(b => b.rssi = -1)

    setBeaconsList(listaBeacons)
    setInitialLoading(false);
  }

  const handleStartMapping = () => {
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
        if (!!!selectedRegion) return

        await fetch.atualizarMapLocation(beaconListRef.current, selectedRegion);
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
              onPress={handleStartMapping}
              loading={isScanning}
              disabled={isScanning}
            >
              <Text>Mapear Regiao</Text>
            </Button>
          </View>

          <View style={styles.divider} />

          <Picker
            selectedValue={selectedRegion}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedRegion(itemValue)
            }>
            <Picker.Item label="Selecione a região" value="" />
            <Picker.Item label="Sala de Corte" value="60e85cb80c3488eeec4f0657" />
            <Picker.Item label="Freezer" value="60e85cb80c3488eeec4f0658" />
            <Picker.Item label="Armazem de caixas" value="60e85cb80c3488eeec4f0659" />
          </Picker>

        </View>
      </View>

      <View style={{ flex: 1 }}>
        {(beaconsList.length == 0) &&
          <View style={{ flex: 1, margin: 20 }}>
            <Text style={{ textAlign: 'center' }}>No peripherals</Text>
          </View>
        }

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
  divider: {
    height: 1,
    borderTopColor: 'gray',
    borderTopWidth: 0.5
  }
});

