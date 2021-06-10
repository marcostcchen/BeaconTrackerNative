import React, { useState } from 'react';
import { Toast } from 'native-base';
import { View, Text, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from 'react-native-paper';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'

import { ToastDanger, gray, AuthContext } from '../../../utils';
import { IUser } from '../../../model';

import { styles } from './styles';

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
    // const user: IUser | null = await fetch.makeLogin(login, password);
    const user: IUser = {
      idUser: 1,
      login: "marcos",
      name: "marcos",
      role: 1
    }

    if (!user) {
      Toast.show(ToastDanger("Erro durante login, tente novamente!"));
      setLoading(false);
      return;
    }

    signIn(user);
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
          onChangeText={(text: string) => setLogin(text.trim().toLowerCase())}
          onSubmitEditing={() => { secondTextInputRef.focus() }}
        />

        <Input
          labelStyle={{ color: colors.text, fontSize: 14 }}
          autoCapitalize="none"
          ref={(ref: any) => secondTextInputRef = ref}
          label="Senha"
          leftIcon={<Icon name="lock" size={20} color={gray} />}
          placeholder="*****"
          onChangeText={(text: string) => setPassword(text.trim().toLowerCase())}
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