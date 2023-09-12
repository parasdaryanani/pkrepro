import React, {useState} from 'react';
import {createContext, useContext, useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';

import usePartySocket from '../use-party-socket';
// import usePartySocket from 'partysocket/react'; // RN not happy with this

interface Player {
  username: string;
}

interface PlayersMap {
  [id: string]: Player;
}

interface GameContextType {
  players: PlayersMap;
  messages: string[];
}

interface Message {
  type: string;
}

interface SyncMessage extends Message {
  type: 'sync';
  players: PlayersMap;
}

interface JoinOrLeaveMessage extends Message {
  type: 'join' | 'leave';
  player: Player;
  message: string;
}

interface PingMessage extends Message {
  type: 'ping';
  message: string;
}

export const GameContext = createContext<GameContextType>({
  players: {},
  messages: [],
});

export function useGame() {
  return useContext(GameContext);
}

export default function GameContextProvider(props: {
  children: React.ReactNode;
}) {
  const [players, setPlayers] = useState<PlayersMap>({});
  const [messages, setMessages] = useState<string[]>([]);

  const socket = usePartySocket({
    host: __DEV__ ? 'localhost:1999' : 'pkrepro.parasdaryanani.partykit.dev',
    room: 'queue',
    id: 'react-native',
    debug: true,
  });

  useEffect(() => {
    if (socket) {
      const onOpen = () => {
        setMessages(['Connected!', 'Sending a ping every 2 seconds...']);
        setInterval(() => {
          socket.send(
            JSON.stringify({type: 'ping', message: 'ping from react native'}),
          );
        }, 2000);
      };
      const onMessage = (event: any) => {
        console.log(event.data);
        const message: Message = JSON.parse(event.data as string);
        switch (message.type) {
          case 'sync':
            const syncMessage = message as SyncMessage;
            const allPlayers = {...syncMessage.players};
            setPlayers(allPlayers);
            break;
          case 'join':
            const joinMessage = message as JoinOrLeaveMessage;
            const joiningPlayer = joinMessage.player;
            setPlayers(() => {
              const morePlayers = {...players};
              morePlayers[joiningPlayer.username] = joiningPlayer;
              return morePlayers;
            });
            setMessages(prevMessages => {
              const newMessages = [...prevMessages];
              newMessages.push(joinMessage.message);
              return newMessages;
            });
            break;
          case 'leave':
            const leaveMessage = message as JoinOrLeaveMessage;
            const leavingPlayer = leaveMessage.player;
            setPlayers(() => {
              const lessPlayers = {...players};
              delete lessPlayers[leavingPlayer.username];
              return lessPlayers;
            });
            setMessages(prevMessages => {
              const newMessages = [...prevMessages];
              newMessages.push(leaveMessage.message);
              return newMessages;
            });
            break;
          case 'ping':
          default:
            const pingMessage = message as PingMessage;
            setMessages(prevMessages => {
              const newMessages = [...prevMessages];
              newMessages.push(pingMessage.message);
              return newMessages;
            });
            break;
        }
      };

      socket.addEventListener('open', onOpen);
      socket.addEventListener('message', onMessage);

      return () => {
        // @ts-ignore
        socket.removeEventListener('open', onOpen);
        socket.removeEventListener('message', onMessage);
      };
    }
  }, [messages, players, socket]);

  return (
    <GameContext.Provider value={{players: players, messages: messages}}>
      {props.children}
    </GameContext.Provider>
  );
}
