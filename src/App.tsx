import React, {useEffect, useState} from 'react';
import FlashMessage from 'react-native-flash-message';
import {SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';
import GameContextProvider from './context/game-provider/game-provider';
import {Presence} from './components/presence';
import {Messages} from './components/messages';

function App(): JSX.Element {
  return (
    <GameContextProvider>
      <FlashMessage position="top" />
      <SafeAreaView>
        <StatusBar />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <Presence />
            <Messages />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GameContextProvider>
  );
}

export default App;
