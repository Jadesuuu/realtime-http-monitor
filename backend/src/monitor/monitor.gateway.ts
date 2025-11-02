import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Response as HttpResponse } from './entities/response.entity';

/**
 * Monitor Gateway
 *
 * WebSocket gateway for real-time client updates.
 * @gateway WebSocketGateway
 */
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'], // ✅ Add both
    credentials: true,
  },
  namespace: '/', // ✅ Use default namespace
  transports: ['websocket', 'polling'], // ✅ Add both transports
})
export class MonitorGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MonitorGateway.name);

  /**
   * Handle client connection
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Handle client disconnection
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Broadcast New Response
   *
   * Emits new HTTP response data to all connected WebSocket clients.
   */
  broadcastNewResponse(response: HttpResponse): void {
    this.server.emit('newResponse', response);
    this.logger.log(`Broadcasted response #${response.id} to all clients`);
  }
}
