import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const email = 'poojyanthm@gmail.com';
    const password = 'Poojum123';

    console.log(`Checking user: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.log('User NOT found.');

        // Setup options to create if needed
        console.log('Creating user now...');
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName: 'Poojyanth',
                lastName: 'M',
                role: 'ADMIN', // Ensure Admin access
                avatar: 'https://i.pravatar.cc/150?u=poojyanthm'
            }
        });
        console.log('User created successfully:', newUser.id);
    } else {
        console.log('User found:', user.id, user.role);

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log('Password MATCHES.');
        } else {
            console.log('Password does NOT match. Resetting password...');
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
            });
            console.log('Password reset successfully.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
