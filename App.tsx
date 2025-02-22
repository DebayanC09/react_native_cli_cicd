import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Config from 'react-native-config';

const App = () => {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.view}>
        <Text>{`App ${Config.APP_ENV}`}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
