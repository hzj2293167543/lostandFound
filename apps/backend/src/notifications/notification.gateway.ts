import { NotificationTypeValue } from '@lostfound/shared';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

interface NotificationPayload {
  userId: number;
  type: NotificationTypeValue;
  message: string;
  targetId?: number;
  targetType?: string;
  relatedUserId?: number;
  relatedUserName?: string;
}

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private userSockets: Map<number, string[]> = new Map();

  constructor(
    private jwtService: JwtService,
    private notificationService: NotificationService
  ) {}

  handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub;

      client.data.userId = userId;

      const existingSockets = this.userSockets.get(userId) || [];
      this.userSockets.set(userId, [...existingSockets, client.id]);
      client.join(`user:${userId}`);
      this.logger.log(`Client ${client.id} connected as user ${userId}`);
    } catch (error) {
      this.logger.warn(`Client ${client.id} connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      const sockets = this.userSockets.get(userId) || [];
      this.userSockets.set(
        userId,
        sockets.filter((id) => id !== client.id)
      );
      if (this.userSockets.get(userId)?.length === 0) {
        this.userSockets.delete(userId);
      }
      this.logger.log(`Client ${client.id} disconnected from user ${userId}`);
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: number }) {
    client.join(`user:${data.userId}`);
    this.logger.log(`Client ${client.id} subscribed to user:${data.userId}`);
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: number }) {
    client.leave(`user:${data.userId}`);
    this.logger.log(`Client ${client.id} unsubscribed from user:${data.userId}`);
  }

  async sendNotificationToUser(payload: NotificationPayload) {
    const notification = await this.notificationService.create({
      userId: payload.userId,
      type: payload.type,
      message: payload.message,
      targetId: payload.targetId,
      targetType: payload.targetType,
      relatedUserId: payload.relatedUserId,
      relatedUserName: payload.relatedUserName,
    });

    this.server.to(`user:${payload.userId}`).emit('notification', notification);
    this.logger.log(`Notification sent to user ${payload.userId}: ${payload.type}`);
    return notification;
  }

  broadcastToAdmins(event: string, data: unknown) {
    this.server.to('admins').emit(event, data);
  }

  @SubscribeMessage('joinAdminRoom')
  handleJoinAdminRoom(@ConnectedSocket() client: Socket) {
    client.join('admins');
    this.logger.log(`Client ${client.id} joined admin room`);
  }
}
