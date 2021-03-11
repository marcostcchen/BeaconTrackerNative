import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { gray } from '../../utils';
import SignInScreen from './SignIn/SignInScreen';
import { SplashScreen } from './Splash/SplashScreen';
import { HomeScreen } from '../home/HomeScreen';

const LoginStack = createStackNavigator();

interface Props {
  navigation: any
}

export const LoginStackScreen: React.FC<Props> = (props: Props) => (
  <LoginStack.Navigator initialRouteName="SplashScreen" screenOptions={screenOptions}>
    <LoginStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false, }} />
    <LoginStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false, }} />
    <LoginStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: "Beacon Tracker" }} />
  </LoginStack.Navigator>
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