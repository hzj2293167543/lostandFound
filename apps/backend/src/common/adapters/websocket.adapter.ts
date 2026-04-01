import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';
import { Server, ServerOptions } from 'socket.io';

export class WebSocketAdapter extends IoAdapter {
  private readonly logger = new Logger('WebSocketAdapter');

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });
    return server;
  }
}
