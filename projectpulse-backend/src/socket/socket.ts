import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import logger from '../config/logger';
import config from '../config';

class SocketService {
    private io: Server | null = null;

    public init(httpServer: HttpServer) {
        this.io = new Server(httpServer, {
            cors: {
                origin: config.cors.origin,
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket: Socket) => {
            logger.info(`🔌 Socket connected: ${socket.id}`);

            // Join user room for private notifications
            socket.on('join', (userId: string) => {
                socket.join(`user:${userId}`);
                logger.debug(`Socket ${socket.id} joined user:${userId}`);
            });

            socket.on('disconnect', () => {
                logger.info(`🔌 Socket disconnected: ${socket.id}`);
            });
        });

        logger.info('✅ Socket.io initialized');
    }

    public getIO(): Server {
        if (!this.io) {
            throw new Error('Socket.io not initialized!');
        }
        return this.io;
    }

    /**
     * Send event to specific user
     */
    public emitToUser(userId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(`user:${userId}`).emit(event, data);
        }
    }

    /**
     * Send event to project room (structure only for now)
     */
    public emitToProject(projectId: string, event: string, data: any) {
        if (this.io) {
            this.io.to(`project:${projectId}`).emit(event, data);
        }
    }
}

export const socketService = new SocketService();
