import * as React from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';

interface Props {
  
}

export const App: React.FC<Props> = () => {
  return (
    <>
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Text></Text>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

});
