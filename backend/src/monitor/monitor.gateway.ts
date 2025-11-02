import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Response as HttpResponse } from './entities/response.entity';

/**
 * Monitor Gateway
 *
 * WebSocket gateway for real-time client updates.
 *
 * Functionality:
 * - Establishes WebSocket connection on same port as HTTP server
 * - Broadcasts new HTTP response data to all connected clients
 * - Enables real-time dashboard updates without polling
 *
 * Technical Details:
 * - Uses Socket.io for WebSocket communication
 * - CORS configured to allow frontend connections
 * - Single broadcast channel: 'newResponse'
 *
 * @gateway WebSocket
 */
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: false,
  },
})
export class MonitorGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Broadcast New Response
   *
   * Emits new HTTP response data to all connected WebSocket clients.
   * Called after each successful HTTP ping.
   *
   * @param {HttpResponse} response - Response object to broadcast
   */
  broadcastNewResponse(response: HttpResponse): void {
    this.server.emit('newResponse', response);
  }
}
