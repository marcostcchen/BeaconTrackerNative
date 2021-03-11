import React, { useState } from 'react';
import { View, Text, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import { gray, grayLight } from '../../../utils/color';
import { styles } from './styles';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  navigation: any
}

export const SignInScreen: React.FC<Props> = (props: Props) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={gray} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Bem vindo!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={[styles.footer, { backgroundColor: colors.background }]}>
        <Input
          labelStyle={{ color: colors.text, fontSize: 14 }}
          autoCapitalize="none"
          label="E-mail"
          placeholder="email@endereco.com"
          leftIcon={<Icon name="envelope" size={20} color={gray} />}
        // onChangeText={text => this.setState({ email: text.trim().toLowerCase() })}
        // onSubmitEditing={() => { this.secondTextInputRef.focus() }}
        />

        <Input
          labelStyle={{ color: colors.text, fontSize: 14 }}
          autoCapitalize="none"
          // ref={(ref) => this.secondTextInputRef = ref}
          label="Senha"
          leftIcon={<Icon name="lock" size={20} color={gray} />}
          placeholder="*****"
          // onChangeText={(text) => this.setState({ senha: text.trim() })}
          textContentType="oneTimeCode"
          secureTextEntry
        // onSubmitEditing={this.postForms}
        />
        <Button
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          title="Entrar"
          onPress={() => setLoading(true)} loading={loading}
          />
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;
