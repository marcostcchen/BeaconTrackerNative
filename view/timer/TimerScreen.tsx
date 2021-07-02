import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {

}

export const TimerScreen: React.FC<Props> = () => {
  const [time, setTime] = useState(0);

  return (
    <View style={styles.timerContainer}>
      <View style={styles.regionTitleContainer}>
        <Text>Região X - perigo Alto</Text>
      </View>
      <View style={{ height: 20 }} />
      <View style={styles.timeLeftContainer}>
        <Text>
          {time}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  regionTitleContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  timeLeftContainer: {
    height: 400,
    width: 400,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
    borderWidth: 1,
    borderRadius: 50
  }
})
