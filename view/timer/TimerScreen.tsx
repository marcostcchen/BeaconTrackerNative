import BleManager from 'react-native-ble-manager';
import React, { useState, useEffect, useRef } from 'react'
import { Image, NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, StatusBar, StyleSheet, Text, Vibration, View } from 'react-native'
import { ActivityIndicator, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { IBeacon, IBLEScan, IRegionMap, IUser } from '../../model';
import { Status, WorkingStatus } from '../../types';
import { getData, key_user, ToastDanger, ToastSuccess } from '../../utils';
import * as fetch from './fetch';
import Sound from 'react-native-sound';

interface Props {

}

export const TimerScreen: React.FC<Props> = () => {
  const BleManagerModule = NativeModules.BleManager;
  const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
  const [isScanning, setIsScanning] = useState(false);
  const [workingStatus, setWorkingStatus] = useState(WorkingStatus.Finished);
  const [startTime, setStartTime] = useState(new Date());

  const scanInterval = 11000; //miliseconds
  const scanTime = 8; //seconds

  const [time, setTime] = useState(-1);
  const [isTiming, setIsTiming] = useState(false);
  const [enableFinish, setEnableFinish] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listMapRegions, setListMapRegions] = useState<Array<IRegionMap>>([])
  const [stopInterval, setStopInterval] = useState(false);

  const [beaconsList, setBeaconsList] = useState<Array<IBeacon>>([{ "id": "60e85abd0c3488eeec4f05df", "idBeacon": 1, "name": "EMBeacon12709", "rssi": -1 }, { "id": "60e85adb0c3488eeec4f05e1", "idBeacon": 2, "name": "EMBeacon13922", "rssi": -1 }, { "id": "60e85ae90c3488eeec4f05e3", "idBeacon": 3, "name": "EMBeacon12677", "rssi": -1 }])
  const [myRegion, setMyRegion] = useState<IRegionMap | null>(null)

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const beaconListRef = useRef(beaconsList);
  beaconListRef.current = beaconsList;

  const mapRegionRef = useRef(listMapRegions);
  mapRegionRef.current = listMapRegions;

  const myRegionRef = useRef(myRegion);
  myRegionRef.current = myRegion;

  const isTimingRef = useRef(isTiming);
  isTimingRef.current = isTiming;

  const workingStatusRef = useRef(workingStatus);
  workingStatusRef.current = workingStatus;

  const startTimeRef = useRef(startTime);
  startTimeRef.current = startTime;

  const myTimeRef = useRef(time);
  myTimeRef.current = time;

  const stopIntervalRef = useRef(stopInterval);
  stopIntervalRef.current = stopInterval;

  useEffect(() => {
    if (time == 20) setShowWarning(true);
    if (time == 1) {
      Vibration.vibrate(5000)
      var sound = new Sound('alert.mp3', Sound.MAIN_BUNDLE, (error) => {
        sound.play();
      });
    }
  }, [time])

  useEffect(() => {
    Sound.setCategory('Playback');

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
    setInitialLoading(false);

    return () => { bleManagerEmitter.removeAllListeners('BleManagerDiscoverPeripheral') }
  }, [])

  const scanMyLocation = () => {
    setInterval(() => {
      handleStartScan();
    }, scanInterval);
  }

  const handleStartScan = async () => {
    setIsScanning(true);
    BleManager.scan([], scanTime, true).then(async () => {

      if (beaconListRef.current.find(b => b.rssi === -1)) return
      if (myRegionRef.current === null) return;
      if (myRegionRef.current.id === null) return;

      const userString: string | null = await getData(key_user);
      if (userString == null) return;

      var user: IUser = JSON.parse(userString);
      const res = await fetch.createWorkSession(beaconListRef.current, myRegionRef.current.name, user.id, workingStatusRef.current, startTimeRef.current);
      console.log(res)

      setIsScanning(false);
    });
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

  const startTimer = async () => {
    if (myRegionRef?.current == null) return;

    setWorkingStatus(WorkingStatus.Working);
    setStartTime(new Date());

    setStopInterval(false)
    setIsTiming(true);
    setTime(myRegionRef.current.maxStayTimeMinutes);

    let timerInterval = setInterval(
      () => {
        setTime(myTimeRef.current - 1)
        if (myTimeRef.current == 0) clearInterval(timerInterval)
        if (stopIntervalRef.current) clearInterval(timerInterval)
      }, 1000
    );
  }

  const stopTimer = async () => {
    setShowWarning(false);
    if (!!!myRegion) return;

    setStartTime(new Date());
    setWorkingStatus(WorkingStatus.Resting);
    setTime(-1);
    setStopInterval(true)
    setIsTiming(false);
    setEnableFinish(true);

    Toast.show(ToastSuccess("Descanso iniciado!", `Você possui ${myRegion.minRestMinutes} segundos de descanso!`));
  }

  const finishWorking = async () => {
    setStartTime(new Date());
    setWorkingStatus(WorkingStatus.Finished);
    setTime(-1);
    setStopInterval(true)
    setIsTiming(false);
    setEnableFinish(false);

    Toast.show(ToastSuccess("Trabalho finalizado!", "Até mais"));
  }

  const FreezerIcon = require("../../img/freezerIcon.png");
  const SalaDeCorteIcon = require("../../img/cutMeatIcon.png");
  const ArmazemDeCaixaIcon = require("../../img/multipleBoxIcon.png");

  const getRegionIcon = (myRegion: IRegionMap | null) => {
    if (myRegion === null) return FreezerIcon

    switch (myRegion.name) {
      case "Sala de Corte":
        return SalaDeCorteIcon;
      case "Armazem de caixas":
        return ArmazemDeCaixaIcon;
      default:
        return FreezerIcon
    }
  }

  const imageIcon = getRegionIcon(myRegion);

  return (
    <View style={styles.timerContainer}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {isScanning && (
        <ActivityIndicator size="small" style={{ position: 'absolute', top: 10, right: 10 }} />
      )}

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
            <>
              <View style={{ position: 'absolute', top: 10, left: 10 }}>
                <Text style={styles.detailText}>Regiao: {myRegion.name}</Text>
                <Text style={styles.detailText}>Danger Level: {myRegion.dangerLevel}</Text>
                {beaconsList.map((beacon) => (
                  <View key={beacon.id}>
                    <Text style={styles.detailText}>{beacon.name} RSSI: {beacon.rssi}</Text>
                  </View>
                ))}
              </View>

              <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 200 }} resizeMode="contain" source={imageIcon} />
                {!isTiming && (
                  <>
                    <Button onPress={startTimer} mode="contained">
                      <Text>
                        {enableFinish ? "Voltar" : "Começar"} a Trabalhar
                      </Text>
                    </Button>

                    <View style={{ height: 30 }} />

                    {enableFinish && (
                      <Button onPress={finishWorking} mode="contained" style={{ backgroundColor: 'red' }}>
                        <Text>
                          Encerrar trabalho
                        </Text>
                      </Button>
                    )}
                  </>
                )}

                {isTiming && (
                  <>
                    <View style={{ backgroundColor: showWarning ? "red" : "", alignItems: 'center', borderRadius: 20, padding: 20, marginBottom: 20, paddingTop: 10 }}>
                      <Text style={styles.timeLeftText}>Tempo Restante</Text>
                      <Text style={{ fontSize: 60 }}>{time}</Text>
                      <Text>segundos</Text>
                    </View>
                    <Button onPress={stopTimer} mode="contained">
                      <Text>Descansar</Text>
                    </Button>

                  </>
                )}

                {showWarning && (
                  <Text style={{ padding: 15 }}>Seu tempo está perto do limite! Recomendamos que faça o seu descanso!</Text>
                )}
              </View>
            </>
          )}
        </>
      )}
    </View >
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
  },
  detailText: {
    fontSize: 10
  },
  timeLeftText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})
