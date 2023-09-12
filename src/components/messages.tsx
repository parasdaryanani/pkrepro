import React, { useEffect } from 'react';
import {Text} from 'react-native';
import {useGame} from '../context/game-provider/game-provider';

// a list of messages to display using flatlist
export function Messages() {
  const {messages} = useGame();

  return (
    <>
      {messages.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
    </>
  );
}
