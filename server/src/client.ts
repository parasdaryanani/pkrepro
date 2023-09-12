import './styles.css';

import PartySocket from 'partysocket';

declare const PARTYKIT_HOST: string;

// Let's append all the messages we get into this DOM element
const output = document.getElementById('app') as HTMLDivElement;

// Helper function to add a new line to the DOM
function add(text: string) {
  output.appendChild(document.createTextNode(text));
  output.appendChild(document.createElement('br'));
}

// A PartySocket is like a WebSocket, except it's a bit more magical.
// It handles reconnection logic, buffering messages while it's offline, and more.
const conn = new PartySocket({
  host: PARTYKIT_HOST,
  room: 'queue',
  id: 'web-client',
});

// You can even start sending messages before the connection is open!
conn.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'hello':
    case 'join':
    case 'leave':
    case 'ping':
      add(`${message.message}`);
      break;
    case 'sync':
      add(`Players in the queue: ${Object.keys(message.players).join(', ')}`);
      break;
    default:
      add(`Received message: ${event.data}`);
      break;
  }
});

// Let's listen for when the connection opens
// And send a ping every 2 seconds right after
conn.addEventListener('open', () => {
  add('Connected!');
  add('Sending a ping every 2 seconds...');
  // TODO: make this more interesting / nice
  setInterval(() => {
    conn.send(JSON.stringify({type: 'ping', message: 'ping from web client'}));
  }, 2000);
});
