import React from 'react'
import { View } from 'react-native';
import { Avatar, Title, Caption, Drawer } from 'react-native-paper';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { styles } from './DrawerContent.styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../utils';

export const DrawerContent = (props: DrawerContentComponentProps) => {

  const { signOut } = React.useContext(AuthContext);
  const navigateTo = (page: string) => {
    props.navigation.navigate(page);
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <Avatar.Image source={require('../../img/avatar.png')} size={60} />
            <View style={styles.userDescriptionContent}>
              <Title style={styles.title}>Fulano Tal</Title>
              <Caption style={styles.caption}>Operario</Caption>
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
              onPress={() => navigateTo("TimerScreen")} />

            <DrawerItem
              icon={({ color, size }) => <Icon name="bell-outline" color={color} size={size} />}
              label="Notificações"
              onPress={() => navigateTo("NotificationScreen")} />
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

