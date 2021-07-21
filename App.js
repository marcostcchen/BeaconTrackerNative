import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { getData, key_user, removeData, storeData, AuthContext } from './utils';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, DevSettings, StatusBar, View } from 'react-native';
import { HomeStackScreen, MappingStackScreen, StartingStackScreen, TimerStackScreen } from './view';
import { DrawerContent } from './component';
import Toast from 'react-native-toast-message';

export const App = () => {
  const Drawer = createDrawerNavigator();

  const initialLoginState = {
    isLoading: true,
    user: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          user: action.user,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          user: action.user,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          user: null,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async (user) => {
      await storeData(key_user, JSON.stringify(user));
      dispatch({ type: 'LOGIN', user });
    },
    signOut: async () => {
      await removeData(key_user);
      dispatch({ type: 'LOGOUT' });
      setTimeout(() => {
        DevSettings.reload();
      }, 1000)
    },
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      const user = await getData(key_user);
      dispatch({ type: 'RETRIEVE_TOKEN', user });
    }, 1);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.user === null ?
            (<StartingStackScreen />)
            :
            (<Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="TimerStackScreen" component={TimerStackScreen} />
              <Drawer.Screen name="HomeStackScreen" component={HomeStackScreen} />
              <Drawer.Screen name="MappingStackScreen" component={MappingStackScreen} />
            </Drawer.Navigator>)}
        </NavigationContainer>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
};
