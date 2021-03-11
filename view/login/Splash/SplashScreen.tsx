import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { styles } from './styles';
import { gray, grayLight } from '../../../utils/color';

interface Props {
  navigation: any
}

export const SplashScreen: React.FC<Props> = (props: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={gray} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Beacon Tracker</Text>
        <Animatable.Image
          animation="bounceIn" source={require('../../../assets/logo.png')}
          style={styles.logo}
          duration={1500}
          resizeMode="contain"
        />
      </View>
      <Animatable.View style={[styles.footer, { backgroundColor: colors.background }]} animation="fadeInUpBig">
        <Text style={[styles.title, { color: colors.text }]}>Monitore seu tempo no frigorífico!</Text>
        <Text style={styles.text}>Faça seu login</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignInScreen')}>
            <LinearGradient colors={[grayLight, gray]} style={styles.signIn}>
              <Text style={styles.textSign}>{"Iniciar >"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};
