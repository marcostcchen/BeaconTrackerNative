import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { getData, key_user, removeData, storeData } from './utils';
import { DrawerContent } from './component';
import { HomeScreen, LoginStackScreen } from './view';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from './component';

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
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          {loginState.user === null ?
            (<LoginStackScreen />)
            :
            (<Drawer.Navigator>
              <Drawer.Screen name="HomeScreen" component={HomeScreen} />
            </Drawer.Navigator>)}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
};
