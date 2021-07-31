import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { MappingScreen } from './MappingScreen';

interface Props {
  navigation: any,
}

export const MappingStackScreen: React.FC<Props> = (props: Props) => {
  const MappingStack = createStackNavigator();

  const screenOptions = {
    headerStyle: {
      backgroundColor: "#009387",
    },
    headerTitleStyle: {
      color: 'white'
    }
  }

  const mappingScreenOptions = {
    title: "Mapeamento de Regiões",
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
    <MappingStack.Navigator screenOptions={screenOptions}>
      <MappingStack.Screen name="Mapping" component={MappingScreen} options={mappingScreenOptions} />
    </MappingStack.Navigator>
  )
}

const styles = StyleSheet.create({})
