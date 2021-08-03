import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { ListItem } from 'react-native-elements';
import { INotification } from '../../model';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect } from 'react';

interface Props {

}

export const NotificationsScreen: React.FC<Props> = (props: Props) => {
  const [notificationsList, setNotificationsList] = useState<Array<INotification>>([]);

  useEffect(() => {
    getNotificationsList();
  }, [])

  const getNotificationsList = async () => {
    
  }

  return (
    <ScrollView>
      {notificationsList.map((notif, index) => (
        <ListItem key={index} bottomDivider>
          <Icon name="bell-outline" size={30} />
          <ListItem.Content>
            <Text style={{ color: 'gray', fontSize: 12 }}>{notif.horaEnvio}</Text>
            <ListItem.Title>{notif.titulo}</ListItem.Title>
            <ListItem.Subtitle>{notif.descricao}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({})
