import React from 'react';

import {useGame} from '../context/game-provider/game-provider';
import {Text} from 'react-native';

export function Presence() {
  const {players} = useGame();
  const users = Object.values(players);

  // create a comma separated list from everyone's username
  const textFormatted = users
    .map(user => user.username)
    .join(', ')
    .replace(/, ([^,]*)$/, ' and $1');

  return (
    <>
      <Text>
        Users: ({users.length}) {textFormatted}
        {textFormatted.length !== 0 ? ', ' : ''}
      </Text>
    </>
  );
}
