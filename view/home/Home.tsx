import * as React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.centeredView}>
      <Text>Home Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
