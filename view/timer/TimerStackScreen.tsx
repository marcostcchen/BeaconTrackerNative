import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TimerScreen } from './TimerScreen';

interface Props {
  navigation: any,
}

export const TimerStackScreen: React.FC<Props> = (props: Props) => {
  const TimerStack = createStackNavigator();

  const screenOptions = {
    headerStyle: {
      backgroundColor: "#009387",
    },
    headerTitleStyle: {
      color: 'white'
    }
  }

  const timerScreenOptions = {
    title: "Timer",
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
    <TimerStack.Navigator screenOptions={screenOptions}>
      <TimerStack.Screen name="TimerScreen" component={TimerScreen} options={timerScreenOptions} />
    </TimerStack.Navigator>
  )
}

const styles = StyleSheet.create({})
