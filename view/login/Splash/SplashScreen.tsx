import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { styles } from './styles';

interface Props {
  navigation: any
}

export const SplashScreen: React.FC<Props> = (props: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#FF6347' barStyle="light-content" />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn" source={require('../../assets/logo.png')}
          style={styles.logo}
          duration={1500}
          resizeMode="stretch"
        />
      </View>
      <Animatable.View style={[styles.footer, { backgroundColor: colors.background }]} animation="fadeInUpBig">
        <Text style={[styles.title, { color: colors.text }]}>Find best food in your locality!</Text>
        <Text style={styles.text}>Sign in with account</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => props.navigation.navigate('SignInScreen')}>
            <LinearGradient colors={['#FFA07A', '#FF6347']} style={styles.signIn}>
              <Text style={styles.textSign}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};
