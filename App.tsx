import React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, StatusBar, } from 'react-native';

export const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

});
