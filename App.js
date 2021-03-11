import 'react-native-gesture-handler';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen, SplashScreen, SignInScreen } from './view';
import * as color from './utils/color';

export const App = () => {
  const Stack = createStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode='none' initialRouteName="SplashScreen" screenOptions={screenOptions}>
          <Stack.Screen name="SignInScreen" component={SignInScreen} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: color.blue,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
}