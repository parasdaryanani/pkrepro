import type * as Party from 'partykit/server';

type Player = {
  username: string;
};

export default class Server implements Party.Server {
  private players: {[id: string]: Player};

  constructor(readonly party: Party.Party) {
    this.players = {};
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`,
    );

    // let's send a message to the connection
    conn.send(JSON.stringify({type: 'hello', message: 'hello from server'}));

    // when a new client connects, send them all players in the queue
    Array.from(this.party.getConnections()).forEach(element => {
      this.players[element.id] = {
        username: element.id,
      };
    });
    const syncMessage = {
      type: 'sync',
      players: this.players,
    };
    conn.send(JSON.stringify(syncMessage));

    // broadcast to all connections that a new player has joined
    const joinMessage = {
      type: 'join',
      player: {
        username: conn.id,
      },
      message: `${conn.id} has joined`
    };
    this.party.broadcast(JSON.stringify(joinMessage), [conn.id]);
  }

  onClose(conn: Party.Connection) {
    // broadcast to all connections that a player has left
    const leaveMessage = {
      type: 'leave',
      player: {
        username: conn.id,
      },
      message: `${conn.id} has left`
    };
    this.party.broadcast(JSON.stringify(leaveMessage), [conn.id]);

    // remove the player from the queue
    delete this.players[conn.id];
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.party.broadcast(
      message,
      // ...except for the connection it came from
      [sender.id],
    );
  }

  onError(connection: Party.Connection, error: Error): void | Promise<void> {
    console.error('connection', connection);
    console.error('error', error);
  }
}

Server satisfies Party.Worker;
