import React, { useState } from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { ListItem } from 'react-native-elements';
import { INotification } from '../../model';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';
import * as fetch from './fetch';
import Toast from 'react-native-toast-message';
import { formatDateHour, ToastDanger } from '../../utils';
import { Status } from '../../types';
import { ActivityIndicator } from 'react-native-paper';

interface Props {

}

export const NotificationsScreen: React.FC<Props> = (props: Props) => {
  const [notificationsList, setNotificationsList] = useState<Array<INotification>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getNotificationsList();
  }, [])

  const getNotificationsList = async () => {
    const notificationsListRes = await fetch.getUsersNotifications();

    if (!notificationsListRes) {
      Toast.show(ToastDanger("Erro!", "Não foi possível listar os beacons, tente novamente!"));
      return;
    }

    if (notificationsListRes.status === Status.Error) {
      Toast.show(ToastDanger("Erro!", notificationsListRes.message));
      return;
    }

    setIsLoading(false);
    setNotificationsList(notificationsListRes.listaNotificacoes)
  }

  if (isLoading) {
    return (
      <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView>
      {notificationsList.map((notif, index) => {
        return (
          <ListItem key={index} bottomDivider>
            <Icon name="bell-outline" size={30} />
            <ListItem.Content>
              <Text style={{ color: 'gray', fontSize: 12 }}>{formatDateHour(notif.horaEnvio)}</Text>
              <ListItem.Title>{notif.titulo}</ListItem.Title>
              <ListItem.Subtitle>{notif.descricao}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({})
