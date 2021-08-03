import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { NotificationsScreen } from './NotificationsScreen';

interface Props {
  navigation: any,
}

export const NotificationsStackScreen: React.FC<Props> = (props: Props) => {
  const NotificationsStack = createStackNavigator();

  const screenOptionsStyle = {
    headerStyle: {
      backgroundColor: "#009387",
    },
    headerTitleStyle: {
      color: 'white'
    }
  }

  const options = {
    title: "Notificações",
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
    <NotificationsStack.Navigator screenOptions={screenOptionsStyle}>
      <NotificationsStack.Screen name="NotificationsScreen" component={NotificationsScreen} options={options} />
    </NotificationsStack.Navigator>
  )
}

const styles = StyleSheet.create({})
