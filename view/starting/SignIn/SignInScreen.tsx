import React, { useState } from 'react';
import { Toast } from 'native-base';
import { View, Text, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'
import * as fetch from './fetch';

import { ToastDanger, gray, AuthContext, storeData, key_token } from '../../../utils';
import { IEfetuarLoginResponse } from '../../../model';

import { styles } from './styles';
import { Status } from '../../../types';

interface Props {
  navigation: any
}

export const SignInScreen: React.FC<Props> = (props: Props) => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = React.useContext(AuthContext);

  let secondTextInputRef: any = React.createRef();

  const makeLogin = async () => {
    setLoading(true);
    const efetuarLoginResponse: IEfetuarLoginResponse | null = await fetch.makeLogin(login, password);
    setLoading(false);
    
    if (!efetuarLoginResponse) {
      Toast.show(ToastDanger("Erro durante login, tente novamente!"));
      return;
    }
    
    if(efetuarLoginResponse.status === Status.Error) {
      Toast.show(ToastDanger(efetuarLoginResponse.message));
      return;
    }

    const token = `bearer ${efetuarLoginResponse.token}`
    await storeData(key_token, token);
    signIn(efetuarLoginResponse.user);
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={gray} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Bem vindo!</Text>
        <Text style={styles.text_header_description}>Efetue o login para continuar</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={[styles.footer, { backgroundColor: colors.background }]}>
        <Input
          labelStyle={{ color: colors.text, fontSize: 14 }}
          autoCapitalize="none"
          label="E-mail"
          placeholder="email@endereco.com"
          leftIcon={<Icon name="envelope" size={20} color={gray} />}
          onChangeText={(text: string) => setLogin(text.trim())}
          onSubmitEditing={() => { secondTextInputRef.focus() }}
        />

        <Input
          labelStyle={{ color: colors.text, fontSize: 14 }}
          autoCapitalize="none"
          ref={(ref: any) => secondTextInputRef = ref}
          label="Senha"
          leftIcon={<Icon name="lock" size={20} color={gray} />}
          placeholder="*****"
          onChangeText={(text: string) => setPassword(text.trim())}
          textContentType="oneTimeCode"
          secureTextEntry
          onSubmitEditing={makeLogin}
        />
        <Button
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          title="Entrar"
          onPress={makeLogin}
          loading={loading}
        />
      </Animatable.View>
    </View>
  );
};
