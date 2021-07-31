import React, { useState } from 'react'
import { View } from 'react-native';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { styles } from './DrawerContent.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext, getData, key_user } from '../../utils';
import { useEffect } from 'react';
import { IUser } from '../../model';

export const DrawerContent = (props: DrawerContentComponentProps) => {
  const [userName, setUserName] = useState("");
  const { signOut } = React.useContext(AuthContext);
  const navigateTo = (page: string) => {
    props.navigation.navigate(page);
  }

  useEffect(() => {
    getUser();
  }, [])

  const getUser = async () => {
    const userString = await getData(key_user);
    if (userString) {
      const user: IUser = JSON.parse(userString);
      setUserName(user.name);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar.Image source={require('../../img/avatar.png')} size={60} />
            <View style={styles.userDescriptionContent}>
              <Title style={styles.title}>{userName}</Title>
              <Caption style={styles.caption}>Funcionario</Caption>
            </View>
          </View>

          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({ color, size }) => <Icon name="home-outline" color={color} size={size} />}
              label="Home"
              onPress={() => navigateTo("HomeStackScreen")} />

            <DrawerItem
              icon={({ color, size }) => <Icon name="timer-outline" color={color} size={size} />}
              label="Timer"
              onPress={() => navigateTo("TimerStackScreen")} />

            <DrawerItem
              icon={({ color, size }) => <Icon name="bell-outline" color={color} size={size} />}
              label="Notificações"
              onPress={() => navigateTo("NotificationScreen")} />

            <DrawerItem
              icon={({ color, size }) => <Icon name="home-map-marker" color={color} size={size} />}
              label="Mapeamento"
              onPress={() => navigateTo("MappingStackScreen")} />

          </Drawer.Section>

        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => <Icon name="exit-to-app" color={color} size={size} />}
          label="Sign Out"
          onPress={signOut}
        />
      </Drawer.Section>
    </View>
  )
}

