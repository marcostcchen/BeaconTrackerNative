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
        <Stack.Navigator initialRouteName="SplashScreen" screenOptions={screenOptions}>
          <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false, }} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false, }} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} options={{title: "Beacon Tracker"}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: color.gray,
  },
  cardStyleInterpolator: ({ current: { progress } }) => ({
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