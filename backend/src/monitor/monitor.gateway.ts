import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MonitorGateway {
  @WebSocketServer()
  server: Server;

  broadcastNewResponse(response: any) {
    this.server.emit('newResponse', response);
  }
}
