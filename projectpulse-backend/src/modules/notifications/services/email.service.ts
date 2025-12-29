import nodemailer from 'nodemailer';
import config from '../../../config';
import logger from '../../../config/logger';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port,
            secure: config.smtp.port === 465, // true for 465, false for other ports
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass,
            },
        });
    }

    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(to: string, token: string): Promise<void> {
        const resetLink = `${config.cors.origin}/reset-password?token=${token}`;

        // In development with missing credentials, simulate email sending by logging the link
        if (config.nodeEnv === 'development' && (config.smtp.pass.includes('password') || !config.smtp.pass || !config.smtp.user)) {
            logger.info('====================================================');
            logger.info('EMAIL SIMULATION (No valid SMTP credentials found)');
            logger.info(`To: ${to}`);
            logger.info(`Subject: Password Reset Request`);
            logger.info(`Reset Link: ${resetLink}`);
            logger.info('====================================================');
            return;
        }

        try {
            const mailOptions = {
                from: config.smtp.from,
                to,
                subject: 'Password Reset Request - Project Pulse',
                html: `
                    <h2>Password Reset Request</h2>
                    <p>You requested a password reset. Please click the link below to reset your password:</p>
                    <p><a href="${resetLink}">Reset Password</a></p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you did not request this, please ignore this email.</p>
                `,
            };

            await this.transporter.sendMail(mailOptions);
            logger.info(`Password reset email sent to ${to}`);
        } catch (error: any) {
            // Fallback for dev: if it fails, log it
            if (config.nodeEnv === 'development') {
                logger.error('Failed to send real email, logging content instead:');
                logger.info(`Reset Link: ${resetLink}`);
                return;
            }
            logger.error('Error sending password reset email:', error);
            throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
        }
    }
}

export const emailService = new EmailService();
