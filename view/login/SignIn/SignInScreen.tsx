import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet, StatusBar, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from 'react-native-paper';
import { styles } from './styles';

interface Props {
  navigation: any
}

export const SignInScreen: React.FC<Props> = (props: Props) => {
  const { colors } = useTheme();


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#FF6347' barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={[styles.footer, { backgroundColor: colors.background }]}>
        <Text style={[styles.text_footer, { color: colors.text }]}>Username</Text>
        <View style={styles.action}>
          <TextInput placeholder="Your Username" placeholderTextColor="#666666" style={[styles.textInput, { color: colors.text }]} autoCapitalize="none" />
        </View>

        <Text style={[styles.text_footer, { color: colors.text, marginTop: 35 }]}>Password</Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            style={[styles.textInput, { color: colors.text }]}
            autoCapitalize="none" />
        </View>
        <TouchableOpacity>
          <Text style={{ color: '#FF6347', marginTop: 15 }}>Forgot password?</Text>
        </TouchableOpacity>
        <View style={styles.button}>
          <TouchableOpacity style={styles.signIn}>
            <LinearGradient colors={['#FFA07A', '#FF6347']} style={styles.signIn}>
              <Text style={[styles.textSign, { color: '#fff' }]}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signIn, { borderColor: '#FF6347', borderWidth: 1, marginTop: 15 }]}>
            <Text style={[styles.textSign, { color: '#FF6347' }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;
