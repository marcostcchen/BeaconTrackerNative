import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { HomeScreen } from './HomeScreen';

interface Props {
  navigation: any,
}

export const HomeStackScreen: React.FC<Props> = (props: Props) => {
  const HomeStack = createStackNavigator();

  const screenOptions = {
    headerStyle: {
      backgroundColor: "#009387",
    },
  }

  const homeScreenOptions = {
    title: "Home",
    headerLeft: () => (
      <View style={{ marginLeft: 10 }}>
        <Icon.Button
          name="bars"
          size={25}
          backgroundColor="#009387"
          onPress={() => props.navigation.openDrawer()}
        />
      </View>
    ),
  }

  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={homeScreenOptions} />
    </HomeStack.Navigator>
  )
}

const styles = StyleSheet.create({})
