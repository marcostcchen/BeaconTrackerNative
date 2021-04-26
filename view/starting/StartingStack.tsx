import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { gray } from '../../utils';
import { HomeStackScreen } from '../index';
import { SignInScreen } from './SignIn/SignInScreen';
import { SplashScreen } from './Splash/SplashScreen';
import { ActivateBluetoothScreen } from './ActivateBluetooth/ActivateBluetoothScreen';

const StartingStack = createStackNavigator();

interface Props {
  navigation: any
}

export const StartingStackScreen: React.FC<Props> = (props: Props) => (
  <StartingStack.Navigator initialRouteName="SplashScreen" screenOptions={screenOptions}>
    <StartingStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false, }} />
    <StartingStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false, }} />
    <StartingStack.Screen name="ActivateBluetoothScreen" component={ActivateBluetoothScreen} options={{ headerShown: false, }} />
    <StartingStack.Screen name="HomeScreen" component={HomeStackScreen} options={{ title: "Beacon Tracker" }} />
  </StartingStack.Navigator>
);

const screenOptions = {
  headerStyle: {
    backgroundColor: gray,
  },
  cardStyleInterpolator: ({ current: { progress } }: any) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
  cardStyle: { backgroundColor: 'transparent' },
  headerTintColor: '#fff',
  headerTitleStyle: {

  },
}