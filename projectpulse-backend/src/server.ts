import app from './app';
import config from './config';
import logger from './config/logger';
import prisma from './config/database';
import { socketService } from './socket/socket';

const startServer = async () => {
    try {
        // Test database connection
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // Start Express server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Server is running on port ${config.port}`);
            logger.info(`📝 Environment: ${config.nodeEnv}`);
            logger.info(`🌐 Health check: http://localhost:${config.port}/health`);
        });

        // Initialize Socket.io
        socketService.init(server);

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`\n${signal} received. Starting graceful shutdown...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    await prisma.$disconnect();
                    logger.info('Database connection closed');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught errors
        process.on('unhandledRejection', (reason: any) => {
            logger.error('Unhandled Rejection:', reason);
            gracefulShutdown('UNHANDLED_REJECTION');
        });

        process.on('uncaughtException', (error: Error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
