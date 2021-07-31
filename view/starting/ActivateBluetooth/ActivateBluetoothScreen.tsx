import React from 'react'
import { StatusBar, View, Text } from 'react-native'
import { gray } from '../../../utils';
import * as Animatable from 'react-native-animatable';
import { styles } from './styles';
import { useTheme } from '@react-navigation/native';
import { Button } from 'react-native-elements';

interface Props {
  navigation: any
}

export const ActivateBluetoothScreen: React.FC<Props> = (props: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={gray} barStyle="light-content" />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn" source={require('../../../img/bluetooth.png')}
          style={styles.logo}
          duration={1500}
          resizeMode="contain"
        />
      </View>
      <Animatable.View style={[styles.footer, { backgroundColor: colors.background }]} animation="fadeInUpBig">
        <View style={styles.allowBluetoothDescription}>
          <Text style={styles.text}>Você permite a utilização do bluetooth e localização pelo app?</Text>
        </View>
        
        <Button
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          title="Permitir"
          onPress={() => props.navigation.navigate("SignInScreen")}
        />
      </Animatable.View>
    </View>
  )
}
